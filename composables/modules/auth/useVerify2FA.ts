import { ref } from "vue"
import { auth_api } from "@/api_factory/modules/auth"
import { useCustomToast } from "@/composables/core/useCustomToast"
import { useAuth } from "@/composables/useAuth"

export const useVerify2FA = () => {
    const loading = ref(false)
    const { showToast } = useCustomToast()
    const { setUser } = useAuth()

    const verify = async (payload: any) => {
        loading.value = true
        try {
            const res = await auth_api.verify2FA(payload) as any
            const data = res.data
            setUser(data.user, data.token)
            showToast({ title: "Success", message: "OTP verified successfully", toastType: "success" })
            return data
        } catch (err: any) {
            showToast({ title: "Error", message: "Invalid or expired OTP", toastType: "error" })
            return null
        } finally {
            loading.value = false
        }
    }

    return { loading, verify }
}
