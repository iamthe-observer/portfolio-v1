const useAppStore = defineStore('app', () => {
  const app_loading = ref(true)

  return {
    app_loading,
  }
})

export default useAppStore
