<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-accent">Scientific Abstracts</h2>
        <p class="text-sm text-gray-400">Review and manage research submissions for upcoming congresses.</p>
      </div>
      <div class="flex gap-3">
        <button class="bg-white border text-accent px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2">
          <LucideFilter :size="14" /> Filter by Conference
        </button>
        <button class="btn-primary px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-primary/20">
          Export Abstracts
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="s in summary" :key="s.label" class="admin-card border-b-4" :style="{ borderBottomColor: s.color }">
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{{ s.label }}</p>
        <p class="text-2xl font-bold text-accent">{{ s.count }}</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
    </div>

    <!-- Abstracts Table -->
    <div v-else class="admin-card">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-[10px] text-gray-400 uppercase tracking-widest border-b font-bold">
              <th class="pb-4">Title & Author</th>
              <th class="pb-4">Conference</th>
              <th class="pb-4">Presentation</th>
              <th class="pb-4">Status</th>
              <th class="pb-4">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y">
            <tr v-for="abstract in abstracts" :key="abstract._id" class="text-xs group hover:bg-slate-50 transition-colors">
              <td class="py-5">
                <div class="max-w-md">
                   <p class="font-bold text-accent line-clamp-1">{{ abstract.title }}</p>
                   <p class="text-[10px] text-gray-400 uppercase font-bold mt-1">{{ abstract.primaryAuthor }} • {{ abstract.email }}</p>
                </div>
              </td>
              <td class="py-5">
                <span class="text-accent-light font-semibold">{{ abstract.conference }}</span>
              </td>
              <td class="py-5">
                 <span class="px-2 py-0.5 bg-brand-blue/10 text-brand-blue rounded-full text-[9px] font-bold">{{ abstract.presentationType || 'Oral' }}</span>
              </td>
              <td class="py-5">
                 <span :class="['px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider', getStatusClass(abstract.status)]">
                    {{ abstract.status || 'Pending' }}
                 </span>
              </td>
              <td class="py-5">
                 <div class="flex gap-2">
                    <button class="text-primary font-bold hover:underline">Review</button>
                    <button class="text-gray-400 font-bold hover:underline">Download</button>
                 </div>
              </td>
            </tr>
            <tr v-if="abstracts.length === 0">
              <td colspan="5" class="py-10 text-center text-gray-400">No abstracts found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideFilter } from 'lucide-vue-next'
import { useGetAbstracts } from '@/composables/modules/abstracts/useGetAbstracts'
import { onMounted, computed } from 'vue'

const { loading, abstracts, getAbstracts } = useGetAbstracts()

const summary = computed(() => {
  const total = abstracts.value.length
  const pending = abstracts.value.filter(a => a.status === 'pending').length
  const accepted = abstracts.value.filter(a => a.status === 'accepted').length
  const rejected = abstracts.value.filter(a => a.status === 'rejected').length
  return [
    { label: 'Total Received', count: total, color: '#00F5FF' },
    { label: 'Under Review', count: pending, color: '#FFD700' },
    { label: 'Accepted', count: accepted, color: '#4ADE80' },
    { label: 'Rejected', count: rejected, color: '#F87171' },
  ]
})

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-orange-100 text-orange-600'
    case 'reviewing': return 'bg-blue-100 text-blue-600'
    case 'accepted': return 'bg-green-100 text-green-600'
    case 'rejected': return 'bg-red-100 text-red-600'
    default: return 'bg-orange-100 text-orange-600'
  }
}

onMounted(() => {
  getAbstracts()
})
</script>
