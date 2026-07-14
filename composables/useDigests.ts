import { ref } from 'vue'
import { useCustomToast } from './core/useCustomToast'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

export const useDigests = () => {
  const loading = ref(false)
  const digests = ref([])
  const { showToast } = useCustomToast()

  const fetchDigests = async () => {
    loading.value = true
    try {
      const res = await GATEWAY_ENDPOINT.get('/digests')
      digests.value = res.data
    } catch (err: any) {
      showToast({ title: 'Error', message: err.message || 'Failed to fetch digests', type: 'error' })
    } finally {
      loading.value = false
    }
  }

  const createDigest = async (data: any) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.post('/digests', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      showToast({ title: 'Success', message: 'Digest created successfully', type: 'success' })
      await fetchDigests()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.message || 'Failed to create digest', type: 'error' })
    } finally {
      loading.value = false
    }
  }

  const updateDigest = async (id: string, data: any) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.patch(`/digests/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      showToast({ title: 'Success', message: 'Digest updated successfully', type: 'success' })
      await fetchDigests()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.message || 'Failed to update digest', type: 'error' })
    } finally {
      loading.value = false
    }
  }

  const deleteDigest = async (id: string) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.delete(`/digests/${id}`)
      showToast({ title: 'Success', message: 'Digest deleted successfully', type: 'success' })
      await fetchDigests()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.message || 'Failed to delete digest', type: 'error' })
    } finally {
      loading.value = false
    }
  }

  return { loading, digests, fetchDigests, createDigest, updateDigest, deleteDigest }
}
