<template>
  <div class="h-full flex flex-col bg-slate-50 overflow-y-auto p-6 md:p-10">
    <div class="max-w-6xl mx-auto w-full space-y-10">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-3xl font-bold text-accent">Form Settings & Data</h2>
          <p class="text-gray-400 font-semibold">Real-time submission analytics and data management.</p>
        </div>
        <div class="flex gap-4">
           <button class="bg-white border text-accent px-6 py-2.5 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">Export CSV</button>
           <button class="btn-primary px-6 py-2.5 shadow-lg shadow-primary/20">Edit Form Structure</button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div v-for="s in summaryStats" :key="s.label" class="admin-card flex flex-col items-center py-8">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{{ s.label }}</span>
            <span class="text-3xl font-bold text-accent">{{ s.value }}</span>
         </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
      </div>

      <!-- Results Table -->
      <div v-else class="admin-card">
         <h3 class="font-bold text-lg text-accent mb-6">Recent Submissions</h3>
         <div class="overflow-x-auto">
            <table class="w-full text-left">
               <thead>
                  <tr class="text-[10px] text-gray-400 uppercase tracking-widest border-b font-bold">
                     <th class="pb-4">Respondent</th>
                     <th class="pb-4">Submission Date</th>
                     <th class="pb-4 text-right">Details</th>
                  </tr>
               </thead>
               <tbody class="divide-y">
                  <tr v-for="response in responses" :key="response._id" class="text-xs group hover:bg-slate-50 transition-colors">
                     <td class="py-5 font-bold text-accent">{{ response.userEmail || response.name || 'Anonymous' }}</td>
                     <td class="py-5 text-gray-400">{{ formatDate(response.createdAt) }}</td>
                     <td class="py-5 text-right">
                        <button class="text-primary font-bold hover:underline">View Response →</button>
                     </td>
                  </tr>
                  <tr v-if="responses.length === 0">
                    <td colspan="3" class="py-10 text-center text-gray-400">No submissions found for this form.</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGetFormResponses } from '@/composables/modules/forms/useGetFormResponses'
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const { loading, responses, getResponses } = useGetFormResponses()
const route = useRoute()

const summaryStats = computed(() => [
  { label: 'Total Submissions', value: responses.value.length },
  { label: 'Form ID', value: route.query.id || 'N/A' },
])

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  if (route.query.id) {
    getResponses(route.query.id)
  }
})
</script>
