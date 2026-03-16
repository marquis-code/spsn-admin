import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast"
import { useUser } from "./user"

export const useLogin = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()
    const { setUser } = useUser()

    const login = async (payload: any) => {
        loading.value = true
        try {
            const res = await auth_api.login(payload) as any
            const data = res.data
            setUser(data.user, data.token)
            showToast({ title: "Success", message: "Admin login successful", toastType: "success" })
            return data
        } catch (err: any) {
            showToast({ title: "Error", message: "Login failed", toastType: "error" })
            return null
        } finally {
            loading.value = false
        }
    }

    return { loading, login }
}
