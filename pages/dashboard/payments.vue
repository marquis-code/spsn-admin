<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 px-1">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Financial Audit & Payments</h2>
        <p class="text-[11px] sm:text-base text-slate-500 font-medium">Monitor and manage institutional financial transactions and membership dues.</p>
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
          <h3 class="font-bold text-slate-800 text-base sm:text-base flex items-center gap-2">
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
             <tr v-for="payment in paginatedPayments" :key="payment._id" class="group hover:bg-slate-50 transition-colors">
                <td class="py-5 !pl-8">
                  <span class="text-[10px] font-mono font-bold text-slate-400">{{ payment.reference?.substring(0, 12) || 'N/A' }}</span>
                </td>
                <td class="font-bold text-slate-800 text-base group-hover:text-[#003366] transition-colors">
                  {{ payment.userEmail || payment.user?.email || 'System User' }}
                </td>
                <td class="text-sm font-bold text-slate-500">
                  {{ payment.paymentType || 'Institutional dues' }}
                </td>
                <td class="font-bold text-slate-800 text-base">
                  ₦{{ formatCurrency(payment.amount) }}
                </td>
                <td>
                  <span :class="['badge-premium text-[8px]', getStatusClass(payment.status)]">
                    {{ payment.status || 'Verified' }}
                  </span>
                </td>
                <td class="text-slate-400 font-bold text-[11px]">{{ formatDate(payment.createdAt) }}</td>
                <td class="text-right !pr-8 flex justify-end gap-2">
                   <button @click="viewPaymentDetails(payment)" class="text-slate-400 hover:text-[#003366] transition-colors p-2 rounded-lg hover:bg-slate-100" title="View Details">
                     <LucideEye :size="16" />
                   </button>
                   <button v-if="payment.status === 'pending' && payment.receiptUrl" @click="openReviewModal(payment)" class="bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap" title="Review Receipt">
                     Review
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
       <Pagination v-if="payments.length > 0" v-model:currentPage="currentPage" :totalItems="payments.length" :pageSize="pageSize" />
    </div>

    <!-- Review Modal -->
    <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="closeReviewModal"></div>
      <div class="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 class="text-xl font-bold text-slate-800">Review Manual Payment</h3>
            <p class="text-base text-slate-500 font-medium">Verify the receipt below against your bank records.</p>
          </div>
          <button @click="closeReviewModal" class="text-slate-400 hover:bg-slate-50 p-2 rounded-xl transition-colors">
             <LucideX :size="20" />
          </button>
        </div>
        <div class="p-6 overflow-y-auto space-y-6">
           <div class="grid grid-cols-2 gap-4">
             <div class="bg-slate-50 p-4 rounded-xl">
               <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Subscriber</p>
               <p class="font-bold text-slate-800">{{ activePayment?.userEmail || activePayment?.member?.email || 'N/A' }}</p>
             </div>
             <div class="bg-slate-50 p-4 rounded-xl">
               <p class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Amount Declared</p>
               <p class="font-bold text-slate-800 text-lg">₦{{ formatCurrency(activePayment?.amount) }}</p>
             </div>
           </div>
           
           <div class="border border-slate-200 rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center min-h-[300px]">
              <img v-if="activePayment?.receiptUrl" :src="activePayment.receiptUrl" class="w-full h-auto object-contain max-h-[500px]" alt="Payment Receipt" />
              <p v-else class="text-slate-400 font-bold">No receipt image provided</p>
           </div>
           
           <div v-if="rejecting" class="space-y-2">
             <label class="text-sm font-bold text-slate-800">Reason for rejection (sent to member):</label>
             <textarea v-model="rejectReason" rows="3" class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-base focus:outline-none focus:border-[#003366]"></textarea>
           </div>
        </div>
        <div class="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
           <button v-if="!rejecting" @click="rejecting = true" class="px-6 py-2.5 rounded-xl font-bold text-base text-rose-600 hover:bg-rose-50 transition-colors">
             Reject Payment
           </button>
           <button v-if="rejecting" @click="rejecting = false" class="px-6 py-2.5 rounded-xl font-bold text-base text-slate-500 hover:bg-slate-100 transition-colors">
             Cancel Rejection
           </button>
           <button v-if="rejecting" @click="processReject" :disabled="submitting || !rejectReason" class="px-6 py-2.5 rounded-xl font-bold text-base bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50">
             <LucideLoader2 v-if="submitting" class="w-4 h-4 animate-spin" />
             Confirm Rejection
           </button>
           <button v-if="!rejecting" @click="processApprove" :disabled="submitting" class="px-6 py-2.5 rounded-xl font-bold text-base bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50">
             <LucideLoader2 v-if="submitting" class="w-4 h-4 animate-spin" />
             Approve Payment
           </button>
        </div>
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
  LucideDownload,
  LucideX
} from 'lucide-vue-next'

import { useGetPayments } from '@/composables/modules/payments/useGetPayments'
import { onMounted, computed, ref } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import Loader from '@/components/core/Loader.vue'
import EmptyState from '@/components/core/EmptyState.vue'
import Pagination from '@/components/core/Pagination.vue'

const { loading, payments, getPayments } = useGetPayments()
const { showToast } = useCustomToast()
const api = useApi()
const importing = ref(false)
const fileInput = ref(null)

const currentPage = ref(1)
const pageSize = ref(10)

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return payments.value.slice(start, end)
})

const triggerFileInput = () => {
  fileInput.value?.click()
}

const showReviewModal = ref(false)
const activePayment = ref(null)
const rejecting = ref(false)
const rejectReason = ref('')
const submitting = ref(false)

const viewPaymentDetails = (payment) => {
  showToast({ title: 'Info', message: 'Full transaction log view coming soon.', toastType: 'info' })
}

const openReviewModal = (payment) => {
  activePayment.value = payment
  rejecting.value = false
  rejectReason.value = ''
  showReviewModal.value = true
}

const closeReviewModal = () => {
  showReviewModal.value = false
  activePayment.value = null
}

const processApprove = async () => {
  submitting.value = true
  try {
    const { error } = await api.payments.approve(activePayment.value._id)
    if (error) throw new Error(error.message || 'Failed to approve payment')
    showToast({ title: 'Success', message: 'Payment approved successfully.', toastType: 'success' })
    closeReviewModal()
    getPayments()
  } catch (err) {
    showToast({ title: 'Error', message: err.message, toastType: 'error' })
  } finally {
    submitting.value = false
  }
}

const processReject = async () => {
  submitting.value = true
  try {
    const { error } = await api.payments.reject(activePayment.value._id, rejectReason.value)
    if (error) throw new Error(error.message || 'Failed to reject payment')
    showToast({ title: 'Payment Rejected', message: 'The member will be notified.', toastType: 'success' })
    closeReviewModal()
    getPayments()
  } catch (err) {
    showToast({ title: 'Error', message: err.message, toastType: 'error' })
  } finally {
    submitting.value = false
  }
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
