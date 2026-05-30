import { ref } from 'vue'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const useUpload = () => {
  const uploading = ref(false)
  const { showToast } = useCustomToast()

  const uploadImage = async (file: File) => {
    uploading.value = true
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await GATEWAY_ENDPOINT.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      showToast({ title: 'Upload Successful', message: 'Image uploaded successfully.', toastType: 'success' })
      return res.data.url
    } catch (err: any) {
      showToast({ title: 'Upload Error', message: err.response?.data?.message || err.message || 'Failed to upload image.', toastType: 'error' })
      return null
    } finally {
      uploading.value = false
    }
  }

  return { uploading, uploadImage }
}
