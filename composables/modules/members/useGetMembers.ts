import { ref } from "vue"
import { members_api } from "@/api_factory/modules/members"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetMembers = () => {
    const loading = ref(false)
    const members = ref([])
    const { showToast } = useCustomToast()

    const getMembers = async () => {
        loading.value = true
        try {
            const res = await members_api.getAll() as any
            members.value = res.data
        } catch (err: any) {
            showToast({ title: "Error", message: "Failed to fetch members", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, members, getMembers }
}
