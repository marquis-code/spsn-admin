import { ref } from "vue"
import { payments_api } from "@/api_factory/modules/payments"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetPayments = () => {
    const loading = ref(false)
    const payments = ref([])
    const { showToast } = useCustomToast()

    const getPayments = async () => {
        loading.value = true
        try {
            const res = await payments_api.getAll() as any
            payments.value = res.data
        } catch (err: any) {
            showToast({ title: "Error", message: "Failed to fetch payments", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, payments, getPayments }
}
