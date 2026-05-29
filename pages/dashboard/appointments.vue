<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-1">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Appointment Management</h2>
        <p class="text-sm text-slate-500 font-medium">Review and confirm pathology consultation requests.</p>
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
      </div>
      <input type="file" ref="fileInput" accept=".xlsx, .xls, .csv" class="hidden" @change="handleFileUpload" />
    </div>

    <!-- Loading State -->
    <Loader v-if="loading" message="Loading appointments..." />

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
      <!-- Stats Summary -->
      <div class="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6">
        <div class="admin-card p-5 lg:p-6 border-slate-200 bg-[#003366] text-white col-span-2 lg:col-span-1">
          <p class="text-[10px] font-bold opacity-70 mb-2">Today's schedule</p>
          <div class="flex items-baseline gap-2">
            <p class="text-3xl lg:text-4xl font-bold">{{ appointments.length }}</p>
            <span class="text-xs opacity-60 font-medium">Bookings</span>
          </div>
        </div>

        <div class="admin-card p-5 lg:p-6 border-slate-200 col-span-2 lg:col-span-1">
          <h3 class="text-xs font-bold text-slate-400 mb-4">Quick filters</h3>
          <div class="space-y-2">
            <button class="w-full text-left px-4 py-2 bg-slate-50 text-[#003366] font-bold text-xs rounded-lg border border-slate-100">All appointments</button>
            <button class="w-full text-left px-4 py-2 text-slate-500 font-bold text-xs rounded-lg hover:bg-slate-50 transition-all">Pending approval</button>
            <button class="w-full text-left px-4 py-2 text-slate-500 font-bold text-xs rounded-lg hover:bg-slate-50 transition-all">Confirmed sessions</button>
          </div>
        </div>
      </div>

      <!-- Appointments Table -->
      <div class="lg:col-span-9">
        <div class="admin-table-container overflow-x-auto">
          <table class="admin-table min-w-[700px]">
            <thead>
              <tr>
                <th>Requestor details</th>
                <th>Category</th>
                <th class="hidden sm:table-cell">Schedule date & time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="appointment in paginatedAppointments" :key="appointment._id" class="group hover:bg-slate-50 transition-colors">
                <td class="py-5">
                  <div class="flex flex-col gap-0.5">
                    <span class="font-bold text-slate-800 text-sm group-hover:text-[#003366] transition-colors">{{ appointment.name }}</span>
                    <span class="text-[11px] text-slate-400 font-medium truncate max-w-[180px]">{{ appointment.email }}</span>
                  </div>
                </td>
                <td>
                  <span class="px-2 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-[10px] font-bold">{{ appointment.category || 'Consultation' }}</span>
                </td>
                <td class="hidden sm:table-cell">
                  <div class="flex flex-col gap-0.5">
                    <span class="font-bold text-slate-700 text-xs">{{ formatDate(appointment.date) }}</span>
                    <span class="text-[11px] text-[#003366] font-bold">{{ appointment.time || '09:00 AM' }}</span>
                  </div>
                </td>
                <td>
                  <span :class="['badge-premium text-[8px]', getStatusClass(appointment.status)]">
                    {{ appointment.status || 'Pending' }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center gap-2 sm:gap-3">
                    <button @click="confirmApprove(appointment)" class="text-[#003366] font-bold hover:text-[#004080] transition-colors p-1" title="Approve">
                      <LucideCheck :size="16" />
                    </button>
                    <div class="w-[1px] h-3 bg-slate-200"></div>
                    <button @click="confirmDecline(appointment)" class="text-rose-500 font-bold hover:text-rose-600 transition-colors p-1" title="Decline">
                      <LucideX :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="appointments.length === 0">
                <td colspan="5" class="py-12">
                  <EmptyState title="No appointments" message="No appointment requests were found for the selected period." :icon="LucideCalendar" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Pagination v-if="appointments.length > 0" v-model:currentPage="currentPage" :totalItems="appointments.length" :pageSize="pageSize" />
      </div>
    </div>

    <!-- Approve Confirmation Modal -->
    <ConfirmModal
      v-model="showApproveModal"
      title="Approve Appointment"
      :message="`Confirm approval for ${selectedAppointment?.name || 'this appointment'}? The member will be notified.`"
      confirm-text="Approve"
      variant="default"
      @confirm="handleApprove"
    />

    <!-- Decline Confirmation Modal -->
    <ConfirmModal
      v-model="showDeclineModal"
      title="Decline Appointment"
      :message="`Are you sure you want to decline the appointment for ${selectedAppointment?.name || 'this member'}? This action will notify them of the decline.`"
      confirm-text="Decline"
      variant="danger"
      @confirm="handleDecline"
    />
  </div>
</template>

<script setup>
import { LucideDownload, LucideUpload, LucideLoader2, LucideFileSpreadsheet, LucideCheck, LucideX, LucideCalendar } from 'lucide-vue-next'

import ConfirmModal from '@/components/core/ConfirmModal.vue'
import Loader from '@/components/core/Loader.vue'
import EmptyState from '@/components/core/EmptyState.vue'
import Pagination from '@/components/core/Pagination.vue'
import { useGetAppointments } from '@/composables/modules/appointments/useGetAppointments'
import { onMounted, ref, computed } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { loading, appointments, getAppointments } = useGetAppointments()
const { showToast } = useCustomToast()
const api = useApi()
const importing = ref(false)
const fileInput = ref(null)
const showApproveModal = ref(false)
const showDeclineModal = ref(false)
const selectedAppointment = ref(null)

const currentPage = ref(1)
const pageSize = ref(10)

const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return appointments.value.slice(start, end)
})

const confirmApprove = (appointment) => {
  selectedAppointment.value = appointment
  showApproveModal.value = true
}

const confirmDecline = (appointment) => {
  selectedAppointment.value = appointment
  showDeclineModal.value = true
}

const handleApprove = () => {
  // TODO: Call API to approve appointment
  showApproveModal.value = false
  selectedAppointment.value = null
}

const handleDecline = () => {
  // TODO: Call API to decline appointment
  showDeclineModal.value = false
  selectedAppointment.value = null
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const triggerExport = () => {
  api.appointments.export()
}

const triggerDownloadTemplate = () => {
  api.appointments.downloadTemplate()
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  importing.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const { data, error } = await api.appointments.import(formData)
    if (error) throw new Error(error.message || 'Import failed')

    showToast({ title: 'Import Successful', message: 'Appointments imported successfully.', toastType: 'success' })
    getAppointments()
  } catch (err) {
    showToast({ title: 'Import Error', message: err.message || 'An error occurred during import', toastType: 'error' })
  } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    case 'denied': return 'bg-rose-50 text-rose-600 border-rose-100'
    default: return 'bg-amber-50 text-amber-600 border-amber-100'
  }
}

onMounted(() => {
  getAppointments()
})
</script>
