import { ref } from "vue"
import { useApi } from "@/composables/useApi"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetExcos = () => {
    const loading = ref(false)
    const excos = ref([])
    const { showToast } = useCustomToast()
    const api = useApi()

    const getExcos = async () => {
        loading.value = true
        try {
            const res = await api.excos.getAll() as any
            excos.value = res.data || res
        } catch (err: any) {
            showToast({ title: "Error", message: "Failed to fetch excos", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, excos, getExcos }
}
