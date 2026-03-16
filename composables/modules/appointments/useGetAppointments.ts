import { ref } from 'vue'
import { appointments_api } from '../../../api_factory/modules/appointments'
import { useCustomToast } from '../../core/useCustomToast'

export const useGetAppointments = () => {
  const loading = ref(false)
  const appointments = ref([])
  const { showToast } = useCustomToast()

  const getAppointments = async () => {
    loading.value = true
    try {
      const res = await appointments_api.getAll()
      appointments.value = res.data
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to fetch appointments',
        toastType: 'error'
      })
    } finally {
      loading.value = false
    }
  }

  return { loading, appointments, getAppointments }
}
