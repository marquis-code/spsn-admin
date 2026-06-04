<template>
  <main class="min-h-screen bg-slate-50/50 p-6">
    <div class="max-w-5xl mx-auto space-y-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/newsletters" class="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </NuxtLink>
          <div>
            <h1 class="text-2xl font-bold text-slate-800">Newsletter Campaigns</h1>
            <p class="text-base text-slate-500">Draft and publish newsletters to subscribers.</p>
          </div>
        </div>
        <button @click="openCreateModal" class="btn-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          New Campaign
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-base text-left">
          <thead class="text-sm text-slate-500  bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-medium">Subject</th>
              <th class="px-6 py-4 font-medium">Category</th>
              <th class="px-6 py-4 font-medium">Status</th>
              <th class="px-6 py-4 font-medium">Date Created</th>
              <th class="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-if="loading && campaigns.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">Loading campaigns...</td>
            </tr>
            <tr v-else-if="campaigns.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">No campaigns found. Create one above.</td>
            </tr>
            <tr v-for="camp in campaigns" :key="camp._id" class="hover:bg-slate-50">
              <td class="px-6 py-4 font-semibold text-slate-800">{{ camp.subject }}</td>
              <td class="px-6 py-4 text-slate-600">
                <span class="inline-block px-2 py-1 bg-blue-50 text-[#1d4e89] text-sm rounded-md">
                  {{ camp.category?.title || 'Unknown' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-2.5 py-1 rounded-full text-sm font-medium  tracking-wider', camp.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700']">
                  {{ camp.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-500">{{ new Date(camp.createdAt).toLocaleDateString() }}</td>
              <td class="px-6 py-4 text-right">
                <NuxtLink :to="`/newsletters/campaigns/${camp._id}`" class="text-blue-600 hover:underline text-sm font-medium mr-3">
                  {{ camp.status === 'PUBLISHED' ? 'View' : 'Edit' }}
                </NuxtLink>
                <button v-if="camp.status !== 'PUBLISHED'" @click="handleDelete(camp._id)" class="text-red-600 hover:underline text-sm font-medium">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 class="font-bold text-slate-800">New Campaign</h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <form @submit.prevent="handleCreate" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-bold text-slate-600  tracking-wider mb-2">Subject</label>
              <input v-model="form.subject" type="text" required class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-600  tracking-wider mb-2">Target Category</label>
              <select v-model="form.category" required class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                <option value="" disabled>Select a category</option>
                <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.title }}</option>
              </select>
            </div>
            <div>
              <CoreImageUpload v-model="form.bannerUrl" label="Campaign Banner" />
              <p class="text-[10px] text-slate-400 mt-1">Upload a header image for this campaign.</p>
            </div>
            
            <div class="pt-6 flex justify-end gap-3">
              <button type="button" @click="closeModal" class="px-5 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button type="submit" :disabled="loading || !form.category" class="px-5 py-2.5 text-base font-medium text-white bg-blue-600 hover:bg-[#1d4e89] rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
                <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Create Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNewsletters } from '@/composables/useNewsletters'



const router = useRouter()
const { loading, campaigns, categories, fetchCampaigns, fetchCategories, createCampaign, deleteCampaign } = useNewsletters()

const isModalOpen = ref(false)
const form = ref({ subject: '', category: '', bannerUrl: '', htmlContent: '<p>Start typing your newsletter here...</p>', status: 'DRAFT' })

onMounted(() => {
  fetchCampaigns()
  fetchCategories()
})

const openCreateModal = () => {
  form.value = { subject: '', category: '', bannerUrl: '', htmlContent: '<p>Start typing your newsletter here...</p>', status: 'DRAFT' }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleCreate = async () => {
  const newCamp = await createCampaign(form.value)
  if (newCamp && newCamp._id) {
    closeModal()
    router.push(`/newsletters/campaigns/${newCamp._id}`)
  }
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this draft?')) {
    await deleteCampaign(id)
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-[#1d4e89] transition-colors shadow-sm;
}
</style>
