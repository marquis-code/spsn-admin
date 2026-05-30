import { ref } from 'vue'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useGallery = () => {
  const loading = ref(false)
  const items = ref([])
  const { showToast } = useCustomToast()

  const fetchGallery = async () => {
    loading.value = true
    try {
      const res = await GATEWAY_ENDPOINT.get('/gallery')
      items.value = res.data
    } catch (error) {
      console.error('Failed to fetch gallery', error)
      showToast({ title: "Error", message: "Failed to fetch gallery", toastType: "error" })
    } finally {
      loading.value = false
    }
  }

  const createGalleryItem = async (payload) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.post('/gallery', payload)
      await fetchGallery()
      showToast({ title: "Success", message: "Image added", toastType: "success" })
    } catch (error) {
      console.error('Failed to create gallery item', error)
      showToast({ title: "Error", message: "Failed to create image", toastType: "error" })
    } finally {
      loading.value = false
    }
  }

  const updateGalleryItem = async (id, payload) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.put(`/gallery/${id}`, payload)
      await fetchGallery()
      showToast({ title: "Success", message: "Image updated", toastType: "success" })
    } catch (error) {
      console.error('Failed to update gallery item', error)
      showToast({ title: "Error", message: "Failed to update image", toastType: "error" })
    } finally {
      loading.value = false
    }
  }

  const deleteGalleryItem = async (id) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.delete(`/gallery/${id}`)
      await fetchGallery()
      showToast({ title: "Success", message: "Image deleted", toastType: "success" })
    } catch (error) {
      console.error('Failed to delete gallery item', error)
      showToast({ title: "Error", message: "Failed to delete image", toastType: "error" })
    } finally {
      loading.value = false
    }
  }

  const createGalleryItemsBatch = async (payloads) => {
    loading.value = true
    try {
      await Promise.all(payloads.map(payload => GATEWAY_ENDPOINT.post('/gallery', payload)))
      await fetchGallery()
      showToast({ title: "Success", message: "Images uploaded successfully", toastType: "success" })
    } catch (error) {
      console.error('Failed to create gallery items in batch', error)
      showToast({ title: "Error", message: "Failed to upload images", toastType: "error" })
      throw error
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    items,
    fetchGallery,
    createGalleryItem,
    createGalleryItemsBatch,
    updateGalleryItem,
    deleteGalleryItem
  }
}
