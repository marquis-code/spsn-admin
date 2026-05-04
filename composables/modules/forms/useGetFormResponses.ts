import { ref, onMounted } from 'vue'
import { forms_api } from '../../../api_factory/modules/forms'
import { useCustomToast } from '../../core/useCustomToast'

export const useGetFormResponses = () => {
  const loading = ref(false)
  const responses = ref<any[]>([])
  const { showToast } = useCustomToast()

  const getResponses = async (formId: string) => {
    if (!formId) return
    loading.value = true
    try {
      const res = await forms_api.getResponses(formId)
      responses.value = res.data
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to fetch responses',
        toastType: 'error'
      })
    } finally {
      loading.value = false
    }
  }

  return { loading, responses, getResponses }
}
