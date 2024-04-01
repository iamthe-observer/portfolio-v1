<template>
	<!-- <Loading v-if="app_loading"></Loading> -->
	<NuxtPage></NuxtPage>
</template>

<script setup lang="ts">
import $app from '~/stores/app'

const { app_loading } = storeToRefs($app())

// onMounted(() => {
// 	setTimeout(() => {
// 		$app().$patch({
// 			app_loading: false
// 		})
// 	}, 3000)
// })
</script>