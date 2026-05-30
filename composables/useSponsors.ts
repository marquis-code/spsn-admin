import { ref } from 'vue'
import { useCustomToast } from './core/useCustomToast'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

export const useSponsors = () => {
  const loading = ref(false)
  const sponsors = ref([])
  const { showToast } = useCustomToast()

  const fetchSponsors = async () => {
    loading.value = true
    try {
      const res = await GATEWAY_ENDPOINT.get('/sponsors')
      sponsors.value = res.data
    } catch (err: any) {
      showToast({ title: 'Error', message: err.message || 'Failed to fetch sponsors', type: 'error' })
    } finally {
      loading.value = false
    }
  }

  const createSponsor = async (data: any) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.post('/sponsors', data)
      showToast({ title: 'Success', message: 'Sponsor created successfully', type: 'success' })
      await fetchSponsors()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.message || 'Failed to create sponsor', type: 'error' })
    } finally {
      loading.value = false
    }
  }

  const updateSponsor = async (id: string, data: any) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.put(`/sponsors/${id}`, data)
      showToast({ title: 'Success', message: 'Sponsor updated successfully', type: 'success' })
      await fetchSponsors()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.message || 'Failed to update sponsor', type: 'error' })
    } finally {
      loading.value = false
    }
  }

  const deleteSponsor = async (id: string) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.delete(`/sponsors/${id}`)
      showToast({ title: 'Success', message: 'Sponsor deleted successfully', type: 'success' })
      await fetchSponsors()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.message || 'Failed to delete sponsor', type: 'error' })
    } finally {
      loading.value = false
    }
  }

  return { loading, sponsors, fetchSponsors, createSponsor, updateSponsor, deleteSponsor }
}
