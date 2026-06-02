<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-1">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Scientific Abstracts</h2>
        <p class="text-base text-slate-500 font-medium">Review and manage research submissions for upcoming congresses.</p>
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
        <button class="bg-white border border-slate-200 text-slate-700 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-1.5 hover:bg-slate-50 transition-all">
          <LucideFilter :size="14" />
          Filter
        </button>
      </div>
      <input type="file" ref="fileInput" accept=".xlsx, .xls, .csv" class="hidden" @change="handleFileUpload" />
    </div>

    <!-- Summary Statistics -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
      <div v-for="s in summary" :key="s.label" class="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-center">
        <div class="flex items-center justify-between mb-3">
          <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">{{ s.label }}</p>
          <div class="w-2 h-2 rounded-full" :class="s.dotClass"></div>
        </div>
        <div class="flex items-baseline gap-2">
          <p class="text-3xl sm:text-4xl font-black text-slate-800">{{ s.count }}</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <Loader v-if="loading" message="Loading abstracts..." />

    <!-- Abstracts Table -->
    <div v-else class="admin-table-container overflow-x-auto">
      <table class="admin-table min-w-[750px]">
        <thead>
          <tr>
            <th>Research Title & Author</th>
            <th class="hidden md:table-cell">Affiliation</th>
            <th class="hidden lg:table-cell">Keywords</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="abstract in paginatedAbstracts" :key="abstract._id" class="group hover:bg-slate-50 transition-colors">
            <td class="py-5">
              <div class="max-w-xs sm:max-w-md space-y-1">
                <p class="font-bold text-slate-800 text-base line-clamp-1 group-hover:text-[#003366] transition-colors">{{ abstract.title }}</p>
                <p class="text-[11px] text-slate-400 font-bold truncate">{{ abstract.primaryAuthor }} <span class="mx-1.5 opacity-30">|</span> {{ abstract.email }}</p>
              </div>
            </td>
            <td class="hidden md:table-cell">
              <span class="text-slate-600 font-bold text-[10px]">{{ abstract.affiliation || 'N/A' }}</span>
            </td>
            <td class="hidden lg:table-cell">
              <div class="flex flex-wrap gap-1">
                <span v-for="kw in (abstract.keywords || []).slice(0, 2)" :key="kw" class="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold  border border-slate-200">
                  {{ kw }}
                </span>
                <span v-if="abstract.keywords && abstract.keywords.length > 2" class="text-[9px] text-slate-400 font-bold">
                  +{{ abstract.keywords.length - 2 }}
                </span>
              </div>
            </td>
            <td>
              <span :class="['badge-premium text-[8px]', getStatusClass(abstract.status)]">
                {{ abstract.status || 'Under review' }}
              </span>
            </td>
            <td>
              <div class="flex items-center gap-2 sm:gap-3">
                <button @click="openAbstractDetails(abstract)" class="text-[#003366] font-bold hover:text-[#004080] transition-colors p-1" title="Review">
                  <LucideEye :size="16" />
                </button>
                <div class="w-[1px] h-3 bg-slate-200"></div>
                <button class="text-slate-400 font-bold hover:text-slate-600 transition-colors p-1 hidden sm:block" title="Download">
                  <LucideDownloadCloud :size="16" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="abstracts.length === 0">
            <td colspan="5" class="py-12">
              <EmptyState title="No abstracts" message="No research abstracts have been submitted yet." :icon="LucideFileText" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination v-if="abstracts.length > 0" v-model:currentPage="currentPage" :totalItems="abstracts.length" :pageSize="pageSize" />

    <!-- Abstract Details Modal -->
    <AbstractDetailsModal 
       v-model="showDetailsModal" 
       :abstract="selectedAbstract" 
    />
  </div>
</template>

<script setup>
import { 
  LucideFilter, 
  LucideDownload, 
  LucideUpload, 
  LucideLoader2, 
  LucideFileSpreadsheet, 
  LucideEye, 
  LucideDownloadCloud,
  LucideFileText
} from 'lucide-vue-next'

import { useGetAbstracts } from '@/composables/modules/abstracts/useGetAbstracts'
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import Loader from '@/components/core/Loader.vue'
import EmptyState from '@/components/core/EmptyState.vue'
import Pagination from '@/components/core/Pagination.vue'
import AbstractDetailsModal from '@/components/core/AbstractDetailsModal.vue'
import { io } from 'socket.io-client'
import { useRuntimeConfig } from '#app'

const { loading, abstracts, getAbstracts } = useGetAbstracts()
const { showToast } = useCustomToast()
const config = useRuntimeConfig()
const apiBase = config.public.apiBase || 'https://spsn-backend.onrender.com'

const importing = ref(false)
const fileInput = ref(null)

const currentPage = ref(1)
const pageSize = ref(10)

const socket = ref(null)

const showDetailsModal = ref(false)
const selectedAbstract = ref(null)

const paginatedAbstracts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return abstracts.value.slice(start, end)
})

const openAbstractDetails = (abs) => {
  selectedAbstract.value = abs
  showDetailsModal.value = true
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const triggerExport = () => {
  showToast({ title: 'Not Implemented', message: 'Export coming soon.', toastType: 'info' })
}

const triggerDownloadTemplate = () => {
  showToast({ title: 'Not Implemented', message: 'Template download coming soon.', toastType: 'info' })
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  importing.value = true
  try {
    // Mock import for now
    await new Promise(resolve => setTimeout(resolve, 1000))
    showToast({ title: 'Import Successful', message: 'Abstracts imported successfully.', toastType: 'success' })
    getAbstracts()
  } catch (err) {
    showToast({ title: 'Import Error', message: err.message || 'An error occurred during import', toastType: 'error' })
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
    { label: 'Total received', count: total, dotClass: 'bg-slate-300' },
    { label: 'Pending review', count: pending, dotClass: 'bg-amber-400' },
    { label: 'Accepted works', count: accepted, dotClass: 'bg-emerald-400' },
    { label: 'Declined works', count: rejected, dotClass: 'bg-rose-400' },
  ]
})

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100'
    case 'under_review': return 'bg-[#003366]/5 text-[#003366] border-[#003366]/10'
    case 'accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100'
    default: return 'bg-amber-50 text-amber-600 border-amber-100'
  }
}

onMounted(() => {
  getAbstracts()

  const baseUrl = apiBase.replace('/api', '')
  socket.value = io(`${baseUrl}/abstracts`, {
    transports: ['websocket', 'polling'],
  })

  socket.value.on('connect', () => {
    socket.value.emit('adminJoin')
  })

  socket.value.on('new-abstract', (abstract) => {
    // Check if we already have it
    if (!abstracts.value.find(a => a._id === abstract._id)) {
      abstracts.value.unshift(abstract)
      showToast({ 
        title: 'New Submission!', 
        message: `${abstract.primaryAuthor} submitted an abstract.`, 
        toastType: 'success' 
      })
    }
  })
})

onUnmounted(() => {
  socket.value?.disconnect()
})
</script>
