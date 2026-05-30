import { ref } from 'vue'
import { useCustomToast } from './core/useCustomToast'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

export const useAdverts = () => {
  const loading = ref(false)
  const adverts = ref([])
  const { showToast } = useCustomToast()

  const fetchAdverts = async () => {
    loading.value = true
    try {
      const res = await GATEWAY_ENDPOINT.get('/adverts')
      adverts.value = res.data
    } catch (err: any) {
      showToast({ title: 'Error', message: err.message || 'Failed to fetch adverts', type: 'error' })
    } finally {
      loading.value = false
    }
  }

  const createAdvert = async (data: any) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.post('/adverts', data)
      showToast({ title: 'Success', message: 'Advert created successfully', type: 'success' })
      await fetchAdverts()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.message || 'Failed to create advert', type: 'error' })
    } finally {
      loading.value = false
    }
  }

  const updateAdvert = async (id: string, data: any) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.put(`/adverts/${id}`, data)
      showToast({ title: 'Success', message: 'Advert updated successfully', type: 'success' })
      await fetchAdverts()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.message || 'Failed to update advert', type: 'error' })
    } finally {
      loading.value = false
    }
  }

  const deleteAdvert = async (id: string) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.delete(`/adverts/${id}`)
      showToast({ title: 'Success', message: 'Advert deleted successfully', type: 'success' })
      await fetchAdverts()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.message || 'Failed to delete advert', type: 'error' })
    } finally {
      loading.value = false
    }
  }

  return { loading, adverts, fetchAdverts, createAdvert, updateAdvert, deleteAdvert }
}
