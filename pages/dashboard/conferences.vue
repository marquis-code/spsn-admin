<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center px-1">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Conference Management</h2>
        <p class="text-sm text-slate-500 font-medium">Schedule and manage association conferences and seminars.</p>
      </div>
      <div class="flex gap-3">
        <button @click="triggerExport" class="btn-outline-admin px-5">
          <LucideDownload :size="14" class="mr-2" />
          Export
        </button>
        <button @click="triggerDownloadTemplate" class="text-slate-600 hover:text-[#003366] hover:bg-slate-50 border border-slate-200 rounded-xl px-5 flex items-center gap-2 transition-all font-bold text-[11px]">
          <LucideFileSpreadsheet :size="14" />
          Template
        </button>
        <button @click="triggerFileInput" class="btn-premium px-5" :disabled="importing">
          <LucideLoader2 v-if="importing" class="w-4 h-4 animate-spin mr-2" />
          <LucideUpload v-else :size="14" class="mr-2" />
          Import
        </button>
        <button class="bg-[#003366] hover:bg-[#004080] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm">
          <LucidePlus :size="14" />
          New conference
        </button>
      </div>
      <!-- Hidden file input -->
      <input type="file" ref="fileInput" accept=".xlsx, .xls, .csv" class="hidden" @change="handleFileUpload" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-24">
      <div class="animate-spin rounded-xl h-10 w-10 border-t-2 border-[#003366]"></div>
    </div>

    <!-- Conferences Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="conf in conferences" :key="conf._id" class="admin-card !p-0 overflow-hidden group hover:border-[#003366] transition-all duration-300">
        <div class="h-48 overflow-hidden relative">
          <img :src="conf.image || 'https://scpsn.org.ng/wp-content/uploads/2021/10/banner.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div class="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-md text-[#003366] text-[10px] font-bold rounded-lg border border-white/20 shadow-sm">{{ conf.status || 'Active' }}</div>
        </div>
        
        <div class="p-6 space-y-4">
          <h4 class="font-bold text-slate-800 text-lg leading-tight group-hover:text-[#003366] transition-colors">{{ conf.title }}</h4>
          
          <div class="space-y-2.5">
             <div class="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                <LucideCalendar :size="14" class="text-[#003366]" />
                {{ conf.date || 'To be announced' }}
             </div>
             <div class="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                <LucideMapPin :size="14" class="text-[#003366]" />
                {{ conf.location || 'Location pending' }}
             </div>
             <div class="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
                <LucideUsers :size="14" class="text-[#003366]" />
                {{ conf.registeredCount || 0 }} registered participants
             </div>
          </div>
          
          <div class="pt-5 border-t border-slate-100 flex justify-between items-center">
             <div class="flex gap-4">
                <button class="text-xs font-bold text-[#003366] hover:underline">Edit</button>
                <div class="w-[1px] h-3 bg-slate-200"></div>
                <button class="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">Abstracts</button>
             </div>
             <button class="text-xs font-bold text-rose-500 hover:underline">Archive</button>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-if="conferences.length === 0" class="col-span-full py-20 bg-white border border-slate-200 border-dashed rounded-3xl text-center text-slate-400 font-medium italic text-sm">No scheduled conferences were found in the database.</div>
    </div>
  </div>
</template>

<script setup>
import { LucidePlus, LucideCalendar, LucideMapPin, LucideUsers, LucideDownload, LucideUpload, LucideLoader2, LucideFileSpreadsheet } from 'lucide-vue-next'

import { useGetConferences } from '@/composables/modules/conferences/useGetConferences'
import { onMounted, ref } from 'vue'

const { loading, conferences, getConferences } = useGetConferences()
const api = useApi()
const importing = ref(false)
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const triggerExport = () => {
  api.conferences.export()
}

const triggerDownloadTemplate = () => {
  api.conferences.downloadTemplate()
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  importing.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const { data, error } = await api.conferences.import(formData)
    if (error) throw new Error(error.message || 'Import failed')
    
    alert(`Success: Conferences imported successfully.`)
    getConferences() // Refresh list
  } catch (err) {
    alert(err.message || 'An error occurred during import')
  } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

onMounted(() => {
  getConferences()
})
</script>
