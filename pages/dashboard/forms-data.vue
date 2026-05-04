<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center px-1">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Form Submission Analytics</h2>
        <p class="text-sm text-slate-500 font-medium">Real-time submission tracking and data management for selected forms.</p>
      </div>
      <div class="flex gap-3">
         <button @click="triggerExport" class="btn-outline-admin px-5">
           <LucideDownload :size="14" class="mr-2" />
           Export data
         </button>
         <button class="bg-[#003366] hover:bg-[#004080] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm">
           Update structure
         </button>
      </div>
    </div>

    <!-- Stats Summary Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
       <div v-for="s in summaryStats" :key="s.label" class="admin-card flex flex-col items-center py-10 group hover:border-[#003366] transition-all duration-300">
          <span class="text-[11px] font-bold text-slate-400 mb-3">{{ s.label }}</span>
          <span class="text-3xl font-bold text-slate-800 group-hover:text-[#003366] transition-colors">{{ s.value }}</span>
          <div class="w-8 h-[2px] bg-slate-100 mt-4 group-hover:w-12 group-hover:bg-[#003366] transition-all"></div>
       </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-24">
      <div class="animate-spin rounded-xl h-10 w-10 border-t-2 border-[#003366]"></div>
    </div>

    <!-- Submission Results Table -->
    <div v-else class="admin-table-container">
       <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-3xl">
          <h3 class="font-bold text-slate-800 text-base flex items-center gap-2">
            <LucideHistory :size="18" class="text-[#003366]" />
            Recent response history
          </h3>
          <span class="text-[11px] text-slate-400 font-bold">{{ responses.length }} Records Found</span>
       </div>
       <table class="admin-table">
          <thead>
             <tr>
                <th class="!pl-8">Respondent email / Identity</th>
                <th>Submission date</th>
                <th class="text-right !pr-8">Actions</th>
             </tr>
          </thead>
          <tbody>
             <tr v-for="response in responses" :key="response._id" class="group hover:bg-slate-50 transition-colors">
                <td class="py-5 !pl-8">
                   <span class="font-bold text-slate-800 text-sm group-hover:text-[#003366] transition-colors">{{ response.userEmail || response.name || 'Anonymous submission' }}</span>
                </td>
                <td class="text-slate-500 font-bold text-[11px]">{{ formatDate(response.createdAt) }}</td>
                <td class="text-right !pr-8">
                   <button class="text-[#003366] font-bold hover:underline text-xs flex items-center gap-1.5 ml-auto">
                     View complete response 
                     <LucideArrowRight :size="14" />
                   </button>
                </td>
             </tr>
             <tr v-if="responses.length === 0">
                <td colspan="3" class="py-20 text-center text-slate-400 font-medium italic text-sm">No submissions have been recorded for this form yet.</td>
             </tr>
          </tbody>
       </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  LucideDownload, 
  LucideHistory, 
  LucideArrowRight, 
  LucideLoader2 
} from 'lucide-vue-next'
import { useGetFormResponses } from '@/composables/modules/forms/useGetFormResponses'
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const { loading, responses, getResponses } = useGetFormResponses()
const route = useRoute()
const api = useApi()

const triggerExport = () => {
  if (route.query.id) {
    api.forms.exportResponses(route.query.id as string)
  }
}

const summaryStats = computed(() => [
  { label: 'Total submissions', value: responses.value?.length || 0 },
  { label: 'Form identifier', value: (route.query.id as string)?.substring(0, 8) || 'N/A' },
])

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  if (route.query.id) {
    getResponses(route.query.id as string)
  }
})
</script>
