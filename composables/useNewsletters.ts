import { ref } from 'vue'
import { useCustomToast } from './core/useCustomToast'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

export const useNewsletters = () => {
  const loading = ref(false)
  const { showToast } = useCustomToast()
  
  // State
  const categories = ref([])
  const campaigns = ref([])
  const subscriptions = ref([])

  // Categories API
  const fetchCategories = async () => {
    loading.value = true
    try {
      const res = await GATEWAY_ENDPOINT.get('/newsletters/categories')
      categories.value = res.data
    } catch (err: any) {
      showToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to fetch categories', toastType: 'error' })
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (data: any) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.post('/newsletters/categories', data)
      showToast({ title: 'Success', message: 'Category created successfully', toastType: 'success' })
      await fetchCategories()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to create category', toastType: 'error' })
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: string, data: any) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.put(`/newsletters/categories/${id}`, data)
      showToast({ title: 'Success', message: 'Category updated successfully', toastType: 'success' })
      await fetchCategories()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to update category', toastType: 'error' })
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: string) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.delete(`/newsletters/categories/${id}`)
      showToast({ title: 'Success', message: 'Category deleted successfully', toastType: 'success' })
      await fetchCategories()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to delete category', toastType: 'error' })
    } finally {
      loading.value = false
    }
  }

  // Campaigns API
  const fetchCampaigns = async () => {
    loading.value = true
    try {
      const res = await GATEWAY_ENDPOINT.get('/newsletters/campaigns')
      campaigns.value = res.data
    } catch (err: any) {
      showToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to fetch campaigns', toastType: 'error' })
    } finally {
      loading.value = false
    }
  }

  const getCampaign = async (id: string) => {
    loading.value = true
    try {
      const res = await GATEWAY_ENDPOINT.get(`/newsletters/campaigns/${id}`)
      return res.data
    } catch (err: any) {
      showToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to fetch campaign', toastType: 'error' })
    } finally {
      loading.value = false
    }
  }

  const createCampaign = async (data: any) => {
    loading.value = true
    try {
      const res = await GATEWAY_ENDPOINT.post('/newsletters/campaigns', data)
      showToast({ title: 'Success', message: 'Campaign created successfully', toastType: 'success' })
      await fetchCampaigns()
      return res.data
    } catch (err: any) {
      showToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to create campaign', toastType: 'error' })
    } finally {
      loading.value = false
    }
  }

  const updateCampaign = async (id: string, data: any) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.put(`/newsletters/campaigns/${id}`, data)
      showToast({ title: 'Success', message: 'Campaign updated successfully', toastType: 'success' })
      await fetchCampaigns()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to update campaign', toastType: 'error' })
    } finally {
      loading.value = false
    }
  }

  const deleteCampaign = async (id: string) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.delete(`/newsletters/campaigns/${id}`)
      showToast({ title: 'Success', message: 'Campaign deleted successfully', toastType: 'success' })
      await fetchCampaigns()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to delete campaign', toastType: 'error' })
    } finally {
      loading.value = false
    }
  }

  const publishCampaign = async (id: string) => {
    loading.value = true
    try {
      await GATEWAY_ENDPOINT.post(`/newsletters/campaigns/${id}/publish`)
      showToast({ title: 'Success', message: 'Campaign published and emails sent successfully!', toastType: 'success' })
      await fetchCampaigns()
    } catch (err: any) {
      showToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to publish campaign', toastType: 'error' })
    } finally {
      loading.value = false
    }
  }

  // Subscriptions API
  const fetchSubscriptions = async () => {
    loading.value = true
    try {
      const res = await GATEWAY_ENDPOINT.get('/newsletters/subscriptions')
      subscriptions.value = res.data
    } catch (err: any) {
      showToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to fetch subscriptions', toastType: 'error' })
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    categories,
    campaigns,
    subscriptions,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCampaigns,
    getCampaign,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    publishCampaign,
    fetchSubscriptions
  }
}
