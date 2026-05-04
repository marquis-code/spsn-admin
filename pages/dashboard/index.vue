<template>
  <div class="space-y-6 sm:space-y-10 pb-12 pt-2">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 px-1">
      <div class="space-y-2">
        <h1 class="text-2xl sm:text-3xl font-black text-slate-800">
          Dashboard <span class="text-[#003366]">Overview</span>
        </h1>
        <p class="text-slate-400 text-[10px] sm:text-[11px] font-bold flex items-center gap-2">
          <LucideActivity :size="14" class="text-[#003366] shrink-0" />
          Real-time platform analytics
        </p>
      </div>
      
      <div class="flex gap-2 sm:gap-3">
        <button class="btn-outline-admin px-4 sm:px-6">
           Direct Export
           <LucideDownload :size="14" class="ml-2" />
        </button>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in computedStats" :key="stat.label" class="admin-card p-6 group border-slate-100 hover:border-[#003366]">
        <div class="flex justify-between items-start mb-6">
          <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#003366] group-hover:bg-[#003366] group-hover:text-white transition-all duration-300">
            <component :size="20" :is="stat.icon" />
          </div>
          <span class="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">+12.5%</span>
        </div>
        
        <div class="space-y-1">
          <p class="text-[10px] font-bold text-slate-400">{{ stat.label }}</p>
          <div v-if="anyLoading" class="h-8 w-24 bg-slate-50 animate-pulse rounded-lg"></div>
          <p v-else class="text-3xl font-black text-slate-800">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Recent Appointments Table -->
      <div class="lg:col-span-8 space-y-4">
        <div class="admin-card !p-0 overflow-hidden">
          <div class="p-6 pb-4 flex justify-between items-center border-b border-slate-50">
            <h3 class="font-bold text-slate-800 text-xs sm:text-sm">Recent Appointments</h3>
            <NuxtLink to="/dashboard/appointments" class="text-[10px] font-bold text-[#003366] hover:underline">View Ledger</NuxtLink>
          </div>
          
          <div class="overflow-x-auto">
            <div v-if="appointmentsLoading" class="p-12 flex flex-col items-center justify-center gap-4">
              <div class="w-10 h-10 border-2 border-slate-100 border-t-[#003366] rounded-full animate-spin"></div>
              <p class="text-[11px] font-bold text-slate-400">Syncing records...</p>
            </div>
            
            <table v-else-if="recentAppointments.length > 0" class="admin-table">
              <thead>
                <tr>
                  <th>Practitioner</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appointment in recentAppointments" :key="appointment._id" class="group hover:bg-slate-50/50 transition-all cursor-pointer">
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-slate-50 text-[#003366] flex items-center justify-center font-bold text-[10px] border border-slate-100">
                        {{ getInitials(appointment.name) }}
                      </div>
                      <span class="font-bold text-slate-700 text-xs">{{ appointment.name }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="text-[11px] font-medium text-slate-500">{{ appointment.category || 'General' }}</span>
                  </td>
                  <td>
                    <span class="text-[11px] font-medium text-slate-600">{{ formatDate(appointment.date) }}</span>
                  </td>
                  <td>
                    <span :class="['badge-premium text-[8px]', getStatusClass(appointment.status)]">
                      {{ appointment.status || 'Verified' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <EmptyState 
              v-else 
              title="No Appointments" 
              message="No recent engagement protocols have been initialized in the system."
              :icon="LucideCalendar"
            />
          </div>
        </div>
      </div>

      <!-- Recent Enquiries Sidebar -->
      <div class="lg:col-span-4 space-y-6">
         <div class="admin-card !p-0 overflow-hidden">
            <div class="p-6 pb-4 flex justify-between items-center border-b border-slate-50">
               <h3 class="font-bold text-slate-800 text-xs sm:text-sm">New Enquiries</h3>
               <NuxtLink to="/dashboard/enquiries" class="text-[10px] font-bold text-[#003366] hover:underline">Inbox</NuxtLink>
            </div>
            
            <div class="p-4 space-y-3">
               <div v-if="enquiriesLoading" class="space-y-3">
                  <div v-for="i in 3" :key="i" class="h-24 bg-slate-50 animate-pulse rounded-xl"></div>
               </div>
               
               <template v-else-if="recentEnquiries.length > 0">
                  <div v-for="enquiry in recentEnquiries" :key="enquiry._id" class="p-4 bg-white border border-slate-100 rounded-xl hover:border-[#003366] transition-all cursor-pointer group">
                     <div class="space-y-3">
                        <div class="flex justify-between items-start">
                           <p class="text-[11px] font-bold text-slate-800 truncate">{{ enquiry.subject }}</p>
                           <LucideMessageCircle :size="12" class="text-slate-300 group-hover:text-[#003366]" />
                        </div>
                        <p class="text-[10px] text-slate-400 font-medium line-clamp-2 leading-relaxed opacity-70">{{ enquiry.message }}</p>
                        <div class="flex justify-between items-center pt-2 border-t border-slate-50">
                           <span class="text-[9px] font-bold text-[#003366]">{{ enquiry.status || 'New' }}</span>
                           <span class="text-[9px] font-medium text-slate-300">Received</span>
                        </div>
                     </div>
                  </div>
               </template>

               <EmptyState 
                  v-else 
                  title="Inbox Empty" 
                  message="All communication channels are currently clear."
                  :icon="LucideInbox"
                  class="py-10"
               />
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  LucideUsers, 
  LucideCalendar, 
  LucideFileText, 
  LucideCreditCard,
  LucideActivity,
  LucideDownload,
  LucideInbox,
  LucideMessageCircle
} from 'lucide-vue-next'
import EmptyState from '@/components/core/EmptyState.vue'
import { useGetMembers } from '@/composables/modules/members/useGetMembers'
import { useGetAbstracts } from '@/composables/modules/abstracts/useGetAbstracts'
import { useGetAppointments } from '@/composables/modules/appointments/useGetAppointments'
import { useGetEnquiries } from '@/composables/modules/enquiries/useGetEnquiries'
import { onMounted, computed } from 'vue'

const { members, getMembers, loading: membersLoading } = useGetMembers()
const { abstracts, getAbstracts, loading: abstractsLoading } = useGetAbstracts()
const { appointments, getAppointments, loading: appointmentsLoading } = useGetAppointments()
const { enquiries, getEnquiries, loading: enquiriesLoading } = useGetEnquiries()

const anyLoading = computed(() => membersLoading.value || abstractsLoading.value || enquiriesLoading.value || appointmentsLoading.value)

const computedStats = computed(() => [
  { label: 'Total Practitioners', value: members.value?.length || 0, icon: LucideUsers },
  { label: 'Pending Abstracts', value: abstracts.value?.filter(a => a.status === 'pending').length || 0, icon: LucideFileText },
  { label: 'Registry Inquiries', value: enquiries.value?.length || 0, icon: LucideInbox },
  { label: 'Scheduled Engagements', value: appointments.value?.length || 0, icon: LucideCalendar },
])

const recentAppointments = computed(() => appointments.value?.slice(0, 5) || [])
const recentEnquiries = computed(() => enquiries.value?.slice(0, 3) || [])

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
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
  getMembers()
  getAbstracts()
  getAppointments()
  getEnquiries()
})
</script>

<style scoped>
::selection {
  background: #003366;
  color: white;
}
</style>
