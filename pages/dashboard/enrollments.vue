<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center px-1">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Enrollment Protocols</h2>
        <p class="text-sm text-slate-500 font-medium">Verify and authenticate new and renewal membership requests.</p>
      </div>
      <button @click="getMembers" class="btn-outline-admin px-5">
        <LucideRefreshCw :size="14" :class="['mr-2', loading ? 'animate-spin' : '']" />
        Sync protocol queue
      </button>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div class="admin-card p-6 flex flex-col items-center">
          <span class="text-[11px] font-bold text-slate-400 mb-2">Pending verification</span>
          <span class="text-3xl font-black text-brand-dark">{{ pendingEnrollments.length }}</span>
       </div>
       <div class="admin-card p-6 flex flex-col items-center">
          <span class="text-[11px] font-bold text-slate-400 mb-2">New registrants</span>
          <span class="text-3xl font-black text-brand-cyan">{{ newRegistrantsCount }}</span>
       </div>
       <div class="admin-card p-6 flex flex-col items-center">
          <span class="text-[11px] font-bold text-slate-400 mb-2">Annual renewals</span>
          <span class="text-3xl font-black text-[#003366]">{{ renewalsCount }}</span>
       </div>
    </div>

    <!-- Loading State -->
    <Loader v-if="loading" message="Loading enrollments..." />

    <!-- Queue Table -->
    <div v-else class="admin-table-container">
       <div class="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-3xl">
          <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
            <LucideShieldCheck :size="18" class="text-brand-cyan" />
            Verification queue
          </h3>
          <span class="text-[11px] text-slate-400 font-bold">{{ pendingEnrollments.length }} Pending Transmission(s)</span>
       </div>
       <table class="admin-table">
          <thead>
             <tr>
                <th class="!pl-8">Member identity</th>
                <th>Type</th>
                <th>Institution</th>
                <th>Proof of payment</th>
                <th>Applied on</th>
                <th class="text-right !pr-8">Protocol action</th>
             </tr>
          </thead>
          <tbody>
             <tr v-for="member in pendingEnrollments" :key="member._id" class="group hover:bg-slate-50 transition-colors">
                <td class="py-5 !pl-8">
                   <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#003366] font-bold">
                         {{ member.fullName?.charAt(0) || 'M' }}
                      </div>
                      <div>
                         <p class="font-bold text-slate-800 text-sm">{{ member.fullName }}</p>
                         <p class="text-[10px] text-slate-400 font-bold">{{ member.email }}</p>
                      </div>
                   </div>
                </td>
                <td>
                   <span :class="['px-3 py-1 rounded-full text-[10px] font-bold', member.enrollmentInfo?.membershipType === 'New' ? 'bg-brand-cyan/10 text-brand-cyan' : 'bg-[#003366]/10 text-[#003366]']">
                      {{ member.enrollmentInfo?.membershipType || 'Standard' }}
                   </span>
                </td>
                <td class="text-xs font-bold text-slate-500">
                   {{ member.enrollmentInfo?.institution || 'General' }}
                </td>
                <td>
                   <a v-if="member.enrollmentInfo?.proofOfPaymentUrl" :href="member.enrollmentInfo.proofOfPaymentUrl" target="_blank" class="flex items-center gap-2 text-brand-cyan font-bold text-[11px] hover:underline">
                      <LucideFileImage :size="16" />
                      View proof
                   </a>
                   <span v-else class="text-[11px] font-bold text-slate-300">No receipt</span>
                </td>
                <td class="text-slate-400 font-bold text-[11px]">
                   {{ formatDate(member.enrollmentInfo?.enrollmentDate) }}
                </td>
                <td class="text-right !pr-8">
                   <div class="flex justify-end gap-2">
                      <button @click="verifyEnrollment(member, 'Verified')" class="bg-emerald-500 text-white p-2 rounded-lg hover:bg-emerald-600 transition-all shadow-sm">
                         <LucideCheck :size="16" />
                      </button>
                      <button @click="verifyEnrollment(member, 'Rejected')" class="bg-rose-500 text-white p-2 rounded-lg hover:bg-rose-600 transition-all shadow-sm">
                         <LucideX :size="16" />
                      </button>
                   </div>
                </td>
             </tr>
             <tr v-if="pendingEnrollments.length === 0">
                <td colspan="6" class="py-12">
                  <EmptyState title="No pending enrollments" message="The verification queue is currently empty." :icon="LucideClipboardList" />
                </td>
             </tr>
          </tbody>
       </table>
    </div>

    <ConfirmModal
      v-model="showVerifyModal"
      :title="selectedStatus === 'Verified' ? 'Approve Protocol' : 'Reject Protocol'"
      :message="selectedStatus === 'Verified' ? `Approve ${selectedMember?.fullName}'s enrollment protocol?` : `Reject ${selectedMember?.fullName}'s submission?`"
      :confirm-text="selectedStatus === 'Verified' ? 'Approve' : 'Reject'"
      :variant="selectedStatus === 'Verified' ? 'default' : 'danger'"
      @confirm="handleVerify"
    />
  </div>
</template>

<script setup>
import { 
  LucideRefreshCw, 
  LucideShieldCheck, 
  LucideFileImage, 
  LucideCheck, 
  LucideX 
} from 'lucide-vue-next'
import ConfirmModal from '@/components/core/ConfirmModal.vue'
import { useGetMembers } from '@/composables/modules/members/useGetMembers'
import { computed, onMounted } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import Loader from '@/components/core/Loader.vue'
import EmptyState from '@/components/core/EmptyState.vue'
import { LucideClipboardList } from 'lucide-vue-next'

const { loading, members, getMembers } = useGetMembers()
const { showToast } = useCustomToast()
const api = useApi()

const showVerifyModal = ref(false)
const selectedMember = ref(null)
const selectedStatus = ref('')

const pendingEnrollments = computed(() => {
  return members.value.filter(m => m.enrollmentInfo?.paymentStatus === 'Pending')
})

const newRegistrantsCount = computed(() => pendingEnrollments.value.filter(m => m.enrollmentInfo?.membershipType === 'New').length)
const renewalsCount = computed(() => pendingEnrollments.value.filter(m => m.enrollmentInfo?.membershipType === 'Renewal').length)

const verifyEnrollment = (member, status) => {
  selectedMember.value = member
  selectedStatus.value = status
  showVerifyModal.value = true
}

const handleVerify = async () => {
  if (!selectedMember.value) return

  const member = selectedMember.value
  const status = selectedStatus.value

  try {
    await api.members.update(member._id, {
      'enrollmentInfo.paymentStatus': status,
      isActive: status === 'Verified'
    })
    showToast({ title: 'Protocol Executed', message: `Protocol ${status === 'Verified' ? 'Authenticated' : 'Rejected'}.`, toastType: 'success' })
    getMembers()
  } catch (e) {
    showToast({ title: 'Protocol Failure', message: 'Verification protocol failure.', toastType: 'error' })
  } finally {
    showVerifyModal.value = false
    selectedMember.value = null
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(() => {
  getMembers()
})
</script>
