import { ref } from 'vue'
import { forms_api } from '../../../api_factory/modules/forms'
import { useCustomToast } from '../../core/useCustomToast'

export const useCreateForm = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const createForm = async (payload: any) => {
    loading.value = true
    try {
      await forms_api.create(payload)
      showToast({
        title: 'Success',
        message: 'Form created successfully',
        toastType: 'success'
      })
      return true
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create form',
        toastType: 'error'
      })
      return false
    } finally {
      loading.value = false
    }
  }

  return { loading, createForm }
}
