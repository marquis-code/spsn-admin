import { ref } from 'vue'
import { forms_api } from '../../../api_factory/modules/forms'
import { useCustomToast } from '../../core/useCustomToast'

export const useGetForms = () => {
  const loading = ref(false)
  const forms = ref([])
  const { showToast } = useCustomToast()

  const getForms = async () => {
    loading.value = true
    try {
      const res = await forms_api.getAll()
      forms.value = res.data
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to fetch forms',
        toastType: 'error'
      })
    } finally {
      loading.value = false
    }
  }

  return { loading, forms, getForms }
}
