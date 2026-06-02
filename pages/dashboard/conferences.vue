<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center px-1">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Conference Management</h2>
        <p class="text-base text-slate-500 font-medium">Schedule and manage association conferences and seminars.</p>
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
        <button @click="openSlideOver()" class="bg-[#003366] hover:bg-[#004080] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm">
          <LucidePlus :size="14" />
          New conference
        </button>
      </div>
      <!-- Hidden file input -->
      <input type="file" ref="fileInput" accept=".xlsx, .xls, .csv" class="hidden" @change="handleFileUpload" />
    </div>

    <!-- Loading State -->
    <Loader v-if="loading" message="Loading conferences..." />

    <!-- Conferences Table -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-base text-left">
        <thead class="text-sm text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-6 py-4 font-medium">Image</th>
            <th class="px-6 py-4 font-medium">Title & Info</th>
            <th class="px-6 py-4 font-medium">Date & Location</th>
            <th class="px-6 py-4 font-medium">Status & Stats</th>
            <th class="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-if="conferences.length === 0">
            <td colspan="5" class="px-6 py-8 text-center text-slate-500">No conferences found in the database.</td>
          </tr>
          <tr v-for="conf in conferences" :key="conf._id" class="hover:bg-slate-50">
            <td class="px-6 py-4">
              <div class="w-24 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                <img :src="conf.image || 'https://scpsn.org.ng/wp-content/uploads/2021/10/banner.jpg'" class="w-full h-full object-cover" />
              </div>
            </td>
            <td class="px-6 py-4">
              <p class="font-semibold text-slate-800 line-clamp-2 max-w-sm">{{ conf.title }}</p>
            </td>
            <td class="px-6 py-4">
              <div class="space-y-1">
                <div class="flex items-center gap-1.5 text-sm text-slate-600">
                  <LucideCalendar :size="14" class="text-[#003366]" />
                  {{ conf.date || 'To be announced' }}
                </div>
                <div class="flex items-center gap-1.5 text-sm text-slate-500">
                  <LucideMapPin :size="14" class="text-[#003366]" />
                  {{ conf.location || 'Location pending' }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="space-y-1.5">
                <span class="inline-block px-2.5 py-1 bg-white border border-slate-200 text-[#003366] text-[10px] font-bold rounded-lg shadow-sm">
                  {{ conf.status || 'Active' }}
                </span>
                <div class="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                  <LucideUsers :size="14" class="text-[#003366]" />
                  {{ conf.registeredCount || 0 }} registered
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-right space-x-3">
              <button @click="openSlideOver(conf)" class="text-sm font-bold text-[#003366] hover:text-[#004080] transition-colors" title="Edit Conference">
                Edit
              </button>
              <button class="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors" title="Manage Abstracts">
                Abstracts
              </button>
              <button class="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors" title="Archive">
                Archive
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Slide Over for Create/Edit -->
    <SlideOver
      v-model="showSlideOver"
      :title="isEditing ? 'Edit Conference' : 'New Conference'"
      :subtitle="isEditing ? 'Update existing conference details' : 'Create a new scheduled conference'"
      size="lg"
    >
      <div class="space-y-6">
        <AnimatedInput v-model="formData.title" label="Conference Title" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
           <AnimatedInput v-model="formData.date" label="Date" type="date" />
           <SelectInput v-model="formData.status" label="Status" :options="['Active', 'Upcoming', 'Completed', 'Cancelled']" />
        </div>
        <AnimatedInput v-model="formData.location" label="Location / Venue" />
        <ImageUpload v-model="formData.image" label="Cover Image" />
        <AnimatedInput v-model="formData.description" label="Conference Description" type="textarea" :rows="4" />
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end w-full">
          <button @click="showSlideOver = false" class="px-5 py-2.5 text-base font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
          <button @click="saveConference" :disabled="saving" class="px-5 py-2.5 text-base font-bold text-white bg-[#003366] hover:bg-[#002855] rounded-xl transition-all flex items-center gap-2">
            <LucideLoader2 v-if="saving" class="w-4 h-4 animate-spin" />
            <LucideSave v-else class="w-4 h-4" />
            Save Conference
          </button>
        </div>
      </template>
    </SlideOver>
  </div>
</template>

<script setup>
import { LucidePlus, LucideCalendar, LucideMapPin, LucideUsers, LucideDownload, LucideUpload, LucideLoader2, LucideFileSpreadsheet, LucideEdit, LucideFileText, LucideArchive, LucideSave } from 'lucide-vue-next'

import SlideOver from '@/components/core/SlideOver.vue'
import Loader from '@/components/core/Loader.vue'
import EmptyState from '@/components/core/EmptyState.vue'
import AnimatedInput from '@/components/AnimatedInput.vue'
import SelectInput from '@/components/SelectInput.vue'
import ImageUpload from '@/components/core/ImageUpload.vue'
import { useGetConferences } from '@/composables/modules/conferences/useGetConferences'
import { onMounted, ref, reactive } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { loading, conferences, getConferences } = useGetConferences()
const { showToast } = useCustomToast()
const api = useApi()
const importing = ref(false)
const fileInput = ref(null)

const showSlideOver = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const selectedConference = ref(null)
const formData = reactive({
  title: '',
  date: '',
  location: '',
  status: 'Active',
  image: '',
  description: ''
})

const openSlideOver = (conf = null) => {
  if (conf && conf._id) {
    isEditing.value = true
    selectedConference.value = conf
    formData.title = conf.title || ''
    formData.date = conf.date || ''
    formData.location = conf.location || ''
    formData.status = conf.status || 'Active'
    formData.image = conf.image || ''
    formData.description = conf.description || ''
  } else {
    isEditing.value = false
    selectedConference.value = null
    formData.title = ''
    formData.date = ''
    formData.location = ''
    formData.status = 'Active'
    formData.image = ''
    formData.description = ''
  }
  showSlideOver.value = true
}

const saveConference = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await api.conferences.update(selectedConference.value._id, formData)
      showToast({ title: 'Success', message: 'Conference updated successfully.', toastType: 'success' })
    } else {
      await api.conferences.create(formData)
      showToast({ title: 'Success', message: 'Conference scheduled successfully.', toastType: 'success' })
    }
    showSlideOver.value = false
    getConferences()
  } catch (err) {
    showToast({ title: 'Error', message: err.message || 'Failed to save conference.', toastType: 'error' })
  } finally {
    saving.value = false
  }
}

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
    
    showToast({ title: 'Import Successful', message: 'Conferences imported successfully.', toastType: 'success' })
    getConferences() // Refresh list
  } catch (err) {
    showToast({ title: 'Import Error', message: err.message || 'An error occurred during import', toastType: 'error' })
  } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

onMounted(() => {
  getConferences()
})
</script>
