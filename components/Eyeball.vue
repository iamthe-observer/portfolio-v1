<template>
	<TresGroup ref="eye">
		<!-- sphere -->
		<TresMesh v-if="true">
			<TresSphereGeometry :args="[.8, 32, 32]" />
			<MeshGlassMaterial :wireframe="false" />
			<!-- <TresMeshBasicMaterial color="green" /> -->
			<!-- <MeshWobbleMaterial color="orange" :speed="1" :factor="2" /> -->
			<!-- <Sparkles /> -->
		</TresMesh>

		<TresMesh v-if="true">
			<TresSphereGeometry :rotate-z="-Math.PI / 2"
				:args="[1, 32, 32, rotation.spherePhiStart, rotation.spherePhiLength]" />
			<MeshGlassMaterial :wireframe="true" />
			<!-- <TresMeshPhongMaterial transparent :metal="true" :shininess="100" :side="THREE.DoubleSide"
				color="0xa020f0" /> -->
		</TresMesh>

		<primitive :object="tubeUp" />
		<primitive :object="tubeDown" />
	</TresGroup>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import type { Mesh, Vector3, Group } from 'three';
import { Sparkles, MouseParallax, Stars, MeshGlassMaterial, MeshWobbleMaterial, Sky } from '@tresjs/cientos'
import { useTresContext } from '@tresjs/core';

const { camera, scene } = useTresContext()
const eye = ref<Group>()

onMounted(() => {
	const mouse = new THREE.Vector2();
	window.addEventListener('mousemove', (event) => {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		// Calculate the rotation quaternion based on mouse position
		const target = new THREE.Vector3(-mouse.x, -mouse.y, 0);
		target.unproject(camera.value!);
		const quaternion = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().lookAt(camera.value!.position, target, camera.value!.up));

		// Apply rotation to the sphere
		eye.value!.setRotationFromQuaternion(quaternion);
	});
})

const angle = reactive({
	upper: Math.PI / 4,
	lower: Math.PI / 1.8
	// lower: Math.PI / lowerVal.value
})

const rotation = computed(() => {
	const angleBetweenTubes = Math.abs(angle.upper - angle.lower);
	const spherePhiStart = Math.PI / 2 - angleBetweenTubes / 2;
	const spherePhiLength = angleBetweenTubes;

	return { spherePhiStart, spherePhiLength }
})

const radius = ref(1);
const segments = ref(64);
const angleStep = ref(Math.PI / segments.value);
const points = ref<Vector3[]>([]);
const tubePosition = reactive({
	x: 0,
	y: 0,
	z: 0
})
const tubeColor = reactive({
	clr: 0x000,
	alpha: 1,
	specular: 0xa020f0
})
for (let i = 0; i <= segments.value; i++) {
	const x = radius.value * Math.cos(i * angleStep.value);
	const y = radius.value * Math.sin(i * angleStep.value);
	points.value.push(new THREE.Vector3(x, y, 0));
}
// Create a custom curve with the points
const path = ref(new THREE.CatmullRomCurve3(points.value));

const tubeRadius = 0.03;
// Top eyelid
const tubeGeometryUp = new THREE.TubeGeometry(path.value, 64, tubeRadius, 8, false); // Adjust the radius as needed
// Down eyelid
const tubeGeometryDown = new THREE.TubeGeometry(path.value, 64, tubeRadius, 8, false); // Adjust the radius as needed

// rotation
tubeGeometryUp.rotateX(rotation.value.spherePhiStart);
tubeGeometryDown.rotateX(rotation.value.spherePhiLength + rotation.value.spherePhiStart);


const tubeMaterial = new THREE.MeshPhongMaterial({ color: tubeColor.clr, transparent: true, opacity: tubeColor.alpha, specular: tubeColor.specular, side: THREE.DoubleSide });

const tubeUp = new THREE.Mesh(tubeGeometryUp, tubeMaterial);
const tubeDown = new THREE.Mesh(tubeGeometryDown, tubeMaterial);

tubeUp.position.z = tubePosition.z;
tubeDown.position.z = tubePosition.z;

// iris
const eyeballRadius = ref(1);
const planeRadius = 1;
const planeSegments = 64;
const planeGeometry = new THREE.CircleGeometry(planeRadius, planeSegments);
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);

// Position the plane on the surface of the sphere using spherical coordinates
const theta = Math.PI / 2; // Latitude angle
const phi = Math.PI / 4; // Longitude angle
plane.position.set(
	eyeballRadius.value * Math.sin(theta) * Math.cos(phi),
	eyeballRadius.value * Math.cos(theta),
	eyeballRadius.value * Math.sin(theta) * Math.sin(phi)
);

scene.value!.add(plane);
</script>

<style scoped></style>