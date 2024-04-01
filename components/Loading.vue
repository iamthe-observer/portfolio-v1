<template>
	<TresCanvas ref="canvasRef" shadows :window-size="true" :clear-color="0x00000012" :alpha="true">
		<TresPerspectiveCamera ref="camera" :position="[0, 0, 5]" />

		<TresSpotLight :position="[0, 0, 5]" :intensity="10" color="white" />
		<TresAmbientLight :intensity="0.4" color="#fff" />
		<!-- <Stars /> -->
		<!-- <Environment preset="city" :background="true" :blur="0" /> -->
		<Sky />

		<!-- objects -->
		<Eyeball />
		<!-- /objects -->

		<OrbitControls :enable-pan="true" :enable-zoom="true" />
		<!-- <TresAxesHelper :args="[2, 2, 2]" /> -->
		<!-- <MouseParallax :factor="5" :ease="3" /> -->
		<!-- <TresGridHelper :args="[4, 4]" /> -->

	</TresCanvas>
</template>

<script setup lang="ts">
</script>

<style scoped></style>