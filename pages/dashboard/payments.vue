<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 px-1">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Financial Audit & Payments</h2>
        <p class="text-[11px] sm:text-sm text-slate-500 font-medium">Monitor and manage institutional financial transactions and membership dues.</p>
      </div>
      <div class="flex gap-2 sm:gap-3 flex-wrap">
         <button @click="getPayments" class="btn-outline-admin px-4 sm:px-5">
           <LucideRefreshCw :size="14" :class="['mr-2', loading ? 'animate-spin' : '']" />
           Sync
         </button>
         <button @click="triggerExport" class="btn-outline-admin px-4 sm:px-5">
           <LucideDownload :size="14" class="mr-2" />
           Export
         </button>
         <button @click="triggerDownloadTemplate" class="text-slate-600 hover:text-[#003366] hover:bg-slate-50 border border-slate-200 rounded-xl px-3 sm:px-5 flex items-center gap-1.5 transition-all text-[11px] font-bold">
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

    <!-- Financial Performance Summary -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
       <div v-for="stat in financialStats" :key="stat.label" class="admin-card flex flex-col items-center py-8 sm:py-10 group hover:border-[#003366] transition-all duration-300">
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 mb-3">{{ stat.label }}</span>
          <span class="text-2xl sm:text-3xl font-bold text-slate-800 group-hover:text-[#003366] transition-colors">{{ stat.value }}</span>
          <div class="w-8 h-[2px] bg-slate-100 mt-4 group-hover:w-12 group-hover:bg-[#003366] transition-all"></div>
       </div>
    </div>

    <!-- Loading State -->
    <Loader v-if="loading" message="Loading transactions..." />

    <!-- Transaction Ledger Table -->
    <div v-else class="admin-card !p-0 overflow-hidden">
       <div class="px-6 sm:px-8 py-5 sm:py-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-3 bg-white rounded-t-3xl">
          <h3 class="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
            <LucideCreditCard :size="18" class="text-[#003366]" />
            Recent transaction history
          </h3>
          <span class="text-[10px] sm:text-[11px] text-slate-400 font-bold">{{ payments.length }} Transactions Found</span>
       </div>
       <div class="overflow-x-auto">
       <table class="admin-table">
          <thead>
             <tr>
                <th class="!pl-8">Reference ID</th>
                <th>Subscriber / Member</th>
                <th>Classification</th>
                <th>Amount (NGN)</th>
                <th>Status</th>
                <th>Date applied</th>
                <th class="text-right !pr-8">Actions</th>
             </tr>
          </thead>
          <tbody>
             <tr v-for="payment in payments" :key="payment._id" class="group hover:bg-slate-50 transition-colors">
                <td class="py-5 !pl-8">
                  <span class="text-[10px] font-mono font-bold text-slate-400">{{ payment.reference?.substring(0, 12) || 'N/A' }}</span>
                </td>
                <td class="font-bold text-slate-800 text-sm group-hover:text-[#003366] transition-colors">
                  {{ payment.userEmail || payment.user?.email || 'System User' }}
                </td>
                <td class="text-xs font-bold text-slate-500">
                  {{ payment.paymentType || 'Institutional dues' }}
                </td>
                <td class="font-bold text-slate-800 text-sm">
                  ₦{{ formatCurrency(payment.amount) }}
                </td>
                <td>
                  <span :class="['badge-premium text-[8px]', getStatusClass(payment.status)]">
                    {{ payment.status || 'Verified' }}
                  </span>
                </td>
                <td class="text-slate-400 font-bold text-[11px]">{{ formatDate(payment.createdAt) }}</td>
                <td class="text-right !pr-8">
                   <button class="text-slate-400 hover:text-[#003366] transition-colors p-2 rounded-lg hover:bg-slate-100">
                     <LucideEye :size="16" />
                   </button>
                </td>
             </tr>
             <tr v-if="payments.length === 0">
                <td colspan="7" class="py-12">
                  <EmptyState title="No transactions" message="No recorded transactions found in the financial ledger." :icon="LucideCreditCard" />
                </td>
             </tr>
          </tbody>
        </table>
       </div>
    </div>
  </div>
</template>

<script setup>
import { 
  LucideCreditCard, 
  LucideRefreshCw, 
  LucideEye,
  LucideUpload,
  LucideLoader2,
  LucideFileSpreadsheet,
  LucideDownload
} from 'lucide-vue-next'

import { useGetPayments } from '@/composables/modules/payments/useGetPayments'
import { onMounted, computed, ref } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import Loader from '@/components/core/Loader.vue'
import EmptyState from '@/components/core/EmptyState.vue'

const { loading, payments, getPayments } = useGetPayments()
const { showToast } = useCustomToast()
const api = useApi()
const importing = ref(false)
const fileInput = ref(null)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const triggerExport = () => {
  api.payments.export()
}

const triggerDownloadTemplate = () => {
  api.payments.downloadTemplate()
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  importing.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const { error } = await api.payments.import(formData)
    if (error) throw new Error(error.message || 'Import failed')

    showToast({ title: 'Import Successful', message: 'Payments imported successfully.', toastType: 'success' })
    getPayments()
  } catch (err) {
    showToast({ title: 'Import Error', message: err.message || 'An error occurred during import', toastType: 'error' })
  } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}


const financialStats = computed(() => {
  const total = payments.value?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0
  const count = payments.value?.length || 0
  const successCount = payments.value?.filter(p => p.status === 'success' || p.status === 'Verified').length || 0
  
  return [
    { label: 'Total revenue volume', value: `₦${formatCurrency(total / 1000)}k` },
    { label: 'Successful audits', value: successCount },
    { label: 'Outstanding requests', value: count - successCount },
    { label: 'Ledger records', value: count }
  ]
})

const formatCurrency = (val) => {
  if (!val) return '0.00'
  return new Intl.NumberFormat('en-NG', { minimumFractionDigits: 2 }).format(val)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const getStatusClass = (status) => {
  if (status === 'success' || status === 'Verified') return 'bg-emerald-50 text-emerald-600 border-emerald-100'
  if (status === 'pending') return 'bg-amber-50 text-amber-600 border-amber-100'
  return 'bg-rose-50 text-rose-600 border-rose-100'
}

onMounted(() => {
  getPayments()
})
</script>
