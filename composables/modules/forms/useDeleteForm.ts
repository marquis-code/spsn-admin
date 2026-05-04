import { ref } from 'vue'
import { forms_api } from '../../../api_factory/modules/forms'
import { useCustomToast } from '../../core/useCustomToast'

export const useDeleteForm = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()

  const deleteForm = async (id: string) => {
    loading.value = true
    try {
      await forms_api.delete(id)
      showToast({
        title: 'Success',
        message: 'Form deleted successfully',
        toastType: 'success'
      })
      return true
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to delete form',
        toastType: 'error'
      })
      return false
    } finally {
      loading.value = false
    }
  }

  return { loading, deleteForm }
}
