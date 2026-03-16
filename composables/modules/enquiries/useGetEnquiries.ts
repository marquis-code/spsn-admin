import { ref } from "vue"
import { enquiries_api } from "@/api_factory/modules/enquiries"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetEnquiries = () => {
    const loading = ref(false)
    const enquiries = ref([])
    const { showToast } = useCustomToast()

    const getEnquiries = async () => {
        loading.value = true
        try {
            const res = await enquiries_api.getAll() as any
            enquiries.value = res.data
        } catch (err: any) {
            showToast({ title: "Error", message: "Failed to fetch enquiries", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, enquiries, getEnquiries }
}
