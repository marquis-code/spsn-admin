import { ref } from "vue"
import { blogs_api } from "@/api_factory/modules/blogs"
import { useCustomToast } from "@/composables/core/useCustomToast"

export const useGetBlogs = () => {
    const loading = ref(false)
    const blogs = ref([])
    const { showToast } = useCustomToast()

    const getBlogs = async () => {
        loading.value = true
        try {
            const res = await blogs_api.getAll() as any
            blogs.value = res.data
        } catch (err: any) {
            showToast({ title: "Error", message: "Failed to fetch blogs", toastType: "error" })
        } finally {
            loading.value = false
        }
    }

    return { loading, blogs, getBlogs }
}
