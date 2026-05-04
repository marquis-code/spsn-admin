<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-1">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Scientific Abstracts</h2>
        <p class="text-sm text-slate-500 font-medium">Review and manage research submissions for upcoming congresses.</p>
      </div>
      <div class="flex gap-2 sm:gap-3 flex-wrap">
        <button @click="triggerExport" class="btn-outline-admin px-4 sm:px-5">
          <LucideDownload :size="14" class="mr-2" />
          Export
        </button>
        <button @click="triggerDownloadTemplate" class="text-slate-600 hover:text-[#003366] hover:bg-slate-50 border border-slate-200 rounded-xl px-4 sm:px-5 flex items-center gap-1.5 transition-all text-[11px] font-bold">
          <LucideFileSpreadsheet :size="14" />
          Template
        </button>
        <button @click="triggerFileInput" class="btn-premium px-4 sm:px-5" :disabled="importing">
          <LucideLoader2 v-if="importing" class="w-4 h-4 animate-spin mr-2" />
          <LucideUpload v-else :size="14" class="mr-2" />
          Import
        </button>
        <button class="bg-white border border-slate-200 text-slate-700 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 hover:bg-slate-50 transition-all">
          <LucideFilter :size="14" />
          Filter
        </button>
      </div>
      <input type="file" ref="fileInput" accept=".xlsx, .xls, .csv" class="hidden" @change="handleFileUpload" />
    </div>

    <!-- Summary Statistics -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
      <div v-for="s in summary" :key="s.label" class="admin-card group hover:border-slate-300 transition-all duration-300 border-l-4" :style="{ borderLeftColor: s.color }">
        <p class="text-[10px] sm:text-[11px] font-bold text-slate-400 mb-1 sm:mb-2">{{ s.label }}</p>
        <div class="flex items-baseline gap-1.5 sm:gap-2">
          <p class="text-2xl sm:text-3xl font-bold text-slate-800">{{ s.count }}</p>
          <span class="text-[9px] sm:text-[10px] text-slate-400 font-medium hidden sm:block">Records</span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-24">
      <div class="animate-spin rounded-xl h-10 w-10 border-t-2 border-[#003366]"></div>
    </div>

    <!-- Abstracts Table -->
    <div v-else class="admin-table-container overflow-x-auto">
      <table class="admin-table min-w-[750px]">
        <thead>
          <tr>
            <th>Research title & primary author</th>
            <th class="hidden md:table-cell">Associated conference</th>
            <th>Type</th>
            <th>Review status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="abstract in abstracts" :key="abstract._id" class="group hover:bg-slate-50 transition-colors">
            <td class="py-5">
              <div class="max-w-xs sm:max-w-md space-y-1">
                <p class="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-[#003366] transition-colors">{{ abstract.title }}</p>
                <p class="text-[11px] text-slate-400 font-bold truncate">{{ abstract.primaryAuthor }} <span class="mx-1.5 opacity-30">|</span> {{ abstract.email }}</p>
              </div>
            </td>
            <td class="hidden md:table-cell">
              <span class="text-slate-600 font-bold text-xs">{{ abstract.conference || 'General congress' }}</span>
            </td>
            <td>
              <span class="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold border border-slate-200">{{ abstract.presentationType || 'Oral' }}</span>
            </td>
            <td>
              <span :class="['badge-premium text-[8px]', getStatusClass(abstract.status)]">
                {{ abstract.status || 'Under review' }}
              </span>
            </td>
            <td>
              <div class="flex items-center gap-2 sm:gap-3">
                <button class="text-[#003366] font-bold hover:underline text-xs">Review</button>
                <div class="w-[1px] h-3 bg-slate-200"></div>
                <button class="text-slate-400 font-bold hover:text-slate-600 text-xs hidden sm:block">Download</button>
              </div>
            </td>
          </tr>
          <tr v-if="abstracts.length === 0">
            <td colspan="5" class="py-20 text-center text-slate-400 font-medium italic text-sm">No research abstracts have been submitted yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { LucideFilter, LucideDownload, LucideUpload, LucideLoader2, LucideFileSpreadsheet } from 'lucide-vue-next'

import { useGetAbstracts } from '@/composables/modules/abstracts/useGetAbstracts'
import { onMounted, computed, ref } from 'vue'

const { loading, abstracts, getAbstracts } = useGetAbstracts()
const api = useApi()
const importing = ref(false)
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const triggerExport = () => {
  api.abstracts.export()
}

const triggerDownloadTemplate = () => {
  api.abstracts.downloadTemplate()
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  importing.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const { data, error } = await api.abstracts.import(formData)
    if (error) throw new Error(error.message || 'Import failed')

    alert(`Success: Abstracts imported successfully.`)
    getAbstracts()
  } catch (err) {
    alert(err.message || 'An error occurred during import')
  } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const summary = computed(() => {
  const total = abstracts.value.length
  const pending = abstracts.value.filter(a => a.status === 'pending').length
  const accepted = abstracts.value.filter(a => a.status === 'accepted').length
  const rejected = abstracts.value.filter(a => a.status === 'rejected').length
  return [
    { label: 'Total received', count: total, color: '#003366' },
    { label: 'Pending review', count: pending, color: '#F59E0B' },
    { label: 'Accepted works', count: accepted, color: '#10B981' },
    { label: 'Declined works', count: rejected, color: '#EF4444' },
  ]
})

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100'
    case 'reviewing': return 'bg-[#003366]/5 text-[#003366] border-[#003366]/10'
    case 'accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100'
    default: return 'bg-amber-50 text-amber-600 border-amber-100'
  }
}

onMounted(() => {
  getAbstracts()
})
</script>
