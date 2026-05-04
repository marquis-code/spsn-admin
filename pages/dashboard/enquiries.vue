<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-1">
      <div>
        <h2 class="text-xl sm:text-2xl font-black text-slate-800">Inbound Communications</h2>
        <p class="text-[11px] text-slate-400 font-bold mt-1">Registry support & communication hub</p>
      </div>
      <div class="flex gap-2 sm:gap-3 flex-wrap">
        <button @click="triggerExport" class="btn-outline-admin px-4 sm:px-5">
          <LucideDownload :size="14" class="mr-2" />
          Export
        </button>
        <button @click="triggerDownloadTemplate" class="text-slate-600 hover:text-[#003366] hover:bg-slate-50 border border-slate-200 rounded-xl px-4 sm:px-5 flex items-center gap-2 transition-all text-[11px] font-bold">
          <LucideFileSpreadsheet :size="14" />
          Template
        </button>
        <button @click="triggerFileInput" class="btn-premium px-4 sm:px-5" :disabled="importing">
          <LucideLoader2 v-if="importing" class="w-4 h-4 animate-spin mr-2" />
          <LucideUpload v-else :size="14" class="mr-2" />
          Import
        </button>
      </div>
      <input type="file" ref="fileInput" accept=".xlsx, .xls, .csv" class="hidden" @change="handleFileUpload" />
    </div>

    <!-- Data Display Area -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-32 gap-4">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-slate-100 border-t-[#003366]"></div>
      <p class="text-[11px] font-bold text-slate-400">Synchronizing communications...</p>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <!-- Enquiry List -->
      <div class="lg:col-span-8 space-y-4">
        <template v-if="enquiries.length > 0">
          <div v-for="enquiry in enquiries" :key="enquiry._id" class="admin-card group border-slate-200 hover:border-[#003366] transition-all duration-300">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#003366] font-bold border border-slate-100 group-hover:bg-[#003366] group-hover:text-white transition-all text-[10px]">
                  {{ getInitials(enquiry.name) }}
                </div>
                <div class="min-w-0">
                  <h4 class="font-bold text-slate-800 text-[13px] group-hover:text-[#003366] transition-colors truncate">{{ enquiry.name }}</h4>
                  <p class="text-[10px] text-slate-400 font-bold opacity-60">{{ formatDate(enquiry.createdAt) }}</p>
                </div>
              </div>
              <span :class="['badge-premium text-[8px] shrink-0', enquiry.status === 'new' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-500 border-slate-100']">
                {{ enquiry.status || 'New message' }}
              </span>
            </div>

            <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-5">
              <h5 class="text-[11px] font-bold text-slate-700 mb-2 flex items-center gap-2">
                <LucideInbox :size="14" class="text-[#003366] shrink-0" />
                <span class="truncate">Subject: {{ enquiry.subject }}</span>
              </h5>
              <p class="text-[11px] text-slate-500 font-medium leading-relaxed italic line-clamp-3 opacity-70">"{{ enquiry.message }}"</p>
            </div>

            <div class="flex items-center gap-5 pt-4 border-t border-slate-50">
              <button class="text-[10px] font-bold text-[#003366] flex items-center gap-2 hover:underline transition-all">
                <LucideReply :size="14" />
                Respond
              </button>
              <div class="w-[1px] h-3 bg-slate-100"></div>
              <button @click="confirmArchive(enquiry)" class="text-[10px] font-bold text-slate-400 flex items-center gap-2 hover:text-slate-600 transition-all">
                <LucideArchive :size="14" />
                Archive
              </button>
            </div>
          </div>
        </template>

        <EmptyState 
          v-else 
          title="Inbox empty" 
          message="No incoming communications or enquiries found in the registry support hub."
          :icon="LucideInbox"
          class="min-h-[400px]"
        />
      </div>

      <!-- Quick Actions & Templates -->
      <div class="lg:col-span-4 space-y-6">
        <div class="admin-card border-slate-200">
          <h3 class="font-bold text-slate-800 text-[11px] mb-6 border-b border-slate-50 pb-4 flex items-center gap-3">
            <LucideMessageSquare :size="16" class="text-[#003366]" />
            Transmission protocols
          </h3>
          <div class="space-y-3">
            <button v-for="t in templates" :key="t" class="w-full p-4 text-left text-[11px] font-bold text-slate-400 hover:bg-slate-50 hover:text-[#003366] rounded-xl border border-slate-100 transition-all">
              {{ t }}
            </button>
          </div>
        </div>

        <div class="admin-card bg-slate-50 border-slate-100">
          <h4 class="text-[10px] font-bold text-slate-400 mb-5">Analytics command</h4>
          <div class="flex justify-between items-center mb-2">
            <span class="text-[11px] text-slate-500 font-bold">Avg. engagement time</span>
            <span class="text-[11px] font-black text-slate-800">2.4 hours</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Archive Confirmation Modal -->
    <ConfirmModal
      v-model="showArchiveModal"
      title="Archive transmission"
      :message="`Move this communication from ${selectedEnquiry?.name || 'this sender'} to archives? Secure record retention will be maintained.`"
      confirm-text="Confirm archive"
      variant="warning"
      @confirm="handleArchive"
    />
  </div>
</template>

<script setup>
import {
  LucideReply,
  LucideArchive,
  LucideDownload,
  LucideUpload,
  LucideLoader2,
  LucideInbox,
  LucideMessageSquare,
  LucideFileSpreadsheet
} from 'lucide-vue-next'
import EmptyState from '@/components/core/EmptyState.vue'
import ConfirmModal from '@/components/core/ConfirmModal.vue'
import { useGetEnquiries } from '@/composables/modules/enquiries/useGetEnquiries'
import { onMounted, ref } from 'vue'

const { loading, enquiries, getEnquiries } = useGetEnquiries()
const api = useApi()
const importing = ref(false)
const fileInput = ref(null)
const showArchiveModal = ref(false)
const selectedEnquiry = ref(null)

const confirmArchive = (enquiry) => {
  selectedEnquiry.value = enquiry
  showArchiveModal.value = true
}

const handleArchive = () => {
  // TODO: Call API to archive enquiry
  showArchiveModal.value = false
  selectedEnquiry.value = null
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const triggerExport = () => {
  api.enquiries.export()
}

const triggerDownloadTemplate = () => {
  api.enquiries.downloadTemplate()
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  importing.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const { data, error } = await api.enquiries.import(formData)
    if (error) throw new Error(error.message || 'Import failed')

    alert(`Success: Enquiries imported successfully.`)
    getEnquiries()
  } catch (err) {
    alert(err.message || 'An error occurred during import')
  } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const templates = [
  'Membership Registration Support',
  'Congress Enrollment Guidelines',
  'Scientific Abstract Formatting',
  'Payment & Invoice Inquiry'
]

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  getEnquiries()
})
</script>
