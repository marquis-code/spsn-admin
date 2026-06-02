<template>
  <main class="min-h-screen bg-slate-50/50 p-6">
    <div class="max-w-5xl mx-auto space-y-8" v-if="campaign">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/newsletters/campaigns" class="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </NuxtLink>
          <div>
            <h1 class="text-2xl font-bold text-slate-800">{{ campaign.subject }}</h1>
            <p class="text-base text-slate-500 flex items-center gap-2">
              <span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-sm font-medium">{{ campaign.category?.title }}</span>
              •
              <span :class="['px-2 py-0.5 rounded text-sm font-medium', campaign.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700']">
                {{ campaign.status }}
              </span>
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <button v-if="campaign.status !== 'PUBLISHED'" @click="handleSave" :disabled="loading" class="btn-outline-primary">
            {{ loading ? 'Saving...' : 'Save Draft' }}
          </button>
          <button v-if="campaign.status !== 'PUBLISHED'" @click="handlePublish" :disabled="loading" class="btn-primary bg-emerald-600 hover:bg-emerald-700 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="m22 2-7 20-4-9-9-4Z"/></svg>
            Publish & Send
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Email Subject</label>
          <input v-model="campaign.subject" type="text" :disabled="campaign.status === 'PUBLISHED'" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-medium text-lg disabled:opacity-50" />
        </div>
        <div>
          <CoreImageUpload v-model="campaign.bannerUrl" label="Campaign Banner" />
          <p class="text-[10px] text-slate-400 mt-1">Update the header banner image for this campaign.</p>
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2 flex justify-between">
            <span>Email Content (HTML)</span>
            <span class="text-[10px] text-slate-400 font-normal normal-case">Use valid HTML. This will be sent directly to subscribers.</span>
          </label>
          <textarea v-model="campaign.htmlContent" :disabled="campaign.status === 'PUBLISHED'" rows="15" class="w-full font-mono text-base px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all disabled:opacity-50"></textarea>
        </div>
      </div>

      <div class="bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden mt-8">
        <div class="px-6 py-3 border-b border-slate-700 bg-slate-900 flex justify-between items-center">
          <span class="text-sm font-bold text-slate-400 uppercase tracking-wider">Preview (Raw Render)</span>
        </div>
        <div class="p-6 bg-white min-h-[400px]">
          <div v-html="campaign.htmlContent"></div>
        </div>
      </div>
    </div>
    
    <div v-else-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-xl h-10 w-10 border-t-2 border-blue-600"></div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useNewsletters } from '@/composables/useNewsletters'



const route = useRoute()
const { loading, getCampaign, updateCampaign, publishCampaign } = useNewsletters()

const campaign = ref(null)

onMounted(async () => {
  campaign.value = await getCampaign(route.params.id)
})

const handleSave = async () => {
  if (campaign.value) {
    await updateCampaign(campaign.value._id, {
      subject: campaign.value.subject,
      bannerUrl: campaign.value.bannerUrl,
      htmlContent: campaign.value.htmlContent
    })
  }
}

const handlePublish = async () => {
  if (confirm(`Are you sure you want to PUBLISH this newsletter? This will instantly send an email to all PAID subscribers of the "${campaign.value.category?.title}" category.`)) {
    await handleSave() // Save first
    await publishCampaign(campaign.value._id)
    campaign.value = await getCampaign(route.params.id) // Reload to get updated status
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50;
}
.btn-outline-primary {
  @apply px-4 py-2 bg-white text-blue-600 border border-blue-200 font-medium rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50;
}
</style>
