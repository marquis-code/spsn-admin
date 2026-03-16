import { ref } from "vue"
import { abstracts_api } from "@/api_factory/modules/abstracts"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetAbstracts = () => {
    const loading = ref(false)
    const abstracts = ref([])
    const { showToast } = useCustomToast()

    const getAbstracts = async () => {
        loading.value = true
        try {
            const res = await abstracts_api.getAll() as any
            abstracts.value = res.data
        } catch (err: any) {
            showToast({ title: "Error", message: "Failed to fetch abstracts", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, abstracts, getAbstracts }
}
