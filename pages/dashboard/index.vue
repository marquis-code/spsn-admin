<template>
  <div class="space-y-8 pb-12 pt-2">
    <!-- Header Section -->
    <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-6 px-1">
      <div class="space-y-1">
        <h1 class="page-title">
          Dashboard <span class="text-[#003366]">Overview</span>
        </h1>
        <p class="page-subtitle flex items-center gap-2">
          <LucideActivity :size="16" class="text-[#003366] shrink-0" />
          Real-time platform analytics
        </p>
      </div>
      
      <div class="flex gap-3">
        <button class="btn-outline-admin px-5">
           Export Data
           <LucideDownload :size="15" class="ml-2" />
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in computedStats" :key="stat.label" class="stat-card group">
        <div class="flex justify-between items-start mb-5">
          <div class="stat-icon">
            <component :size="22" :is="stat.icon" />
          </div>
          <span class="stat-trend">{{ stat.trend }}</span>
        </div>
        
        <div class="space-y-1">
          <p class="stat-label">{{ stat.label }}</p>
          <div v-if="anyLoading" class="h-9 w-24 bg-slate-50 animate-pulse rounded-lg"></div>
          <p v-else class="stat-value">{{ stat.value }}</p>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Recent Appointments Table -->
      <div class="lg:col-span-8 space-y-4">
        <div class="admin-card !p-0 overflow-hidden">
          <div class="p-6 pb-4 flex justify-between items-center border-b border-slate-100">
            <h3 class="section-title">Recent Appointments</h3>
            <NuxtLink to="/dashboard/appointments" class="section-link">View all →</NuxtLink>
          </div>
          
          <div class="overflow-x-auto">
            <div v-if="appointmentsLoading" class="p-12 flex flex-col items-center justify-center gap-4">
              <div class="w-10 h-10 border-2 border-slate-100 border-t-[#003366] rounded-full animate-spin"></div>
              <p class="text-base font-medium text-slate-400">Loading appointments...</p>
            </div>
            
            <table v-else-if="recentAppointments.length > 0" class="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="appointment in recentAppointments" :key="appointment._id" class="group hover:bg-slate-50/50 transition-all cursor-pointer">
                  <td>
                    <div class="flex items-center gap-3">
                      <div class="member-avatar-sm bg-slate-50 text-[#003366]">
                        {{ getInitials(appointment.name) }}
                      </div>
                      <span class="font-semibold text-slate-700 text-base">{{ appointment.name }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="text-base font-medium text-slate-500">{{ appointment.category || 'General' }}</span>
                  </td>
                  <td>
                    <span class="text-base font-medium text-slate-600">{{ formatDate(appointment.date) }}</span>
                  </td>
                  <td>
                    <span :class="['badge-premium', getStatusClass(appointment.status)]">
                      {{ appointment.status || 'Pending' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <EmptyState 
              v-else 
              title="No Appointments" 
              message="No appointments found in the system."
              :icon="LucideCalendar"
            />
          </div>
        </div>
      </div>

      <!-- Recent Enquiries Sidebar -->
      <div class="lg:col-span-4 space-y-6">
         <div class="admin-card !p-0 overflow-hidden">
            <div class="p-6 pb-4 flex justify-between items-center border-b border-slate-100">
               <h3 class="section-title">New Enquiries</h3>
               <NuxtLink to="/dashboard/enquiries" class="section-link">View all →</NuxtLink>
            </div>
            
            <div class="p-4 space-y-3">
               <div v-if="enquiriesLoading" class="space-y-3">
                  <div v-for="i in 3" :key="i" class="h-24 bg-slate-50 animate-pulse rounded-xl"></div>
               </div>
               
               <template v-else-if="recentEnquiries.length > 0">
                  <div v-for="enquiry in recentEnquiries" :key="enquiry._id" class="p-4 bg-white border border-slate-100 rounded-xl hover:border-[#003366] transition-all cursor-pointer group">
                     <div class="space-y-3">
                        <div class="flex justify-between items-start">
                           <p class="text-base font-semibold text-slate-800 truncate">{{ enquiry.subject }}</p>
                           <LucideMessageCircle :size="14" class="text-slate-300 group-hover:text-[#003366] shrink-0" />
                        </div>
                        <p class="text-base text-slate-400 font-normal line-clamp-2 leading-relaxed">{{ enquiry.message }}</p>
                        <div class="flex justify-between items-center pt-2 border-t border-slate-50">
                           <span class="text-xs font-semibold text-[#003366]">{{ enquiry.status || 'New' }}</span>
                           <span class="text-xs font-medium text-slate-300">Received</span>
                        </div>
                     </div>
                  </div>
               </template>

               <EmptyState 
                  v-else 
                  title="No Enquiries" 
                  message="No enquiries at the moment."
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

import EmptyState from '@/components/core/EmptyState.vue'
import { useGetMembers } from '@/composables/modules/members/useGetMembers'
import { useGetAbstracts } from '@/composables/modules/abstracts/useGetAbstracts'
import { useGetAppointments } from '@/composables/modules/appointments/useGetAppointments'
import { useGetEnquiries } from '@/composables/modules/enquiries/useGetEnquiries'
import { onMounted, computed } from 'vue'
import { 
  LucideActivity, 
  LucideDownload, 
  LucideUsers, 
  LucideFileText, 
  LucideInbox, 
  LucideCalendar, 
  LucideMessageCircle 
} from 'lucide-vue-next'

const { members, getMembers, loading: membersLoading } = useGetMembers()
const { abstracts, getAbstracts, loading: abstractsLoading } = useGetAbstracts()
const { appointments, getAppointments, loading: appointmentsLoading } = useGetAppointments()
const { enquiries, getEnquiries, loading: enquiriesLoading } = useGetEnquiries()

const anyLoading = computed(() => membersLoading.value || abstractsLoading.value || enquiriesLoading.value || appointmentsLoading.value)

const computedStats = computed(() => [
  { label: 'Total Members', value: members.value?.length || 0, icon: LucideUsers, trend: '+12%' },
  { label: 'Pending Abstracts', value: abstracts.value?.filter(a => a.status === 'pending').length || 0, icon: LucideFileText, trend: '+3' },
  { label: 'Enquiries', value: enquiries.value?.length || 0, icon: LucideInbox, trend: '+8' },
  { label: 'Appointments', value: appointments.value?.length || 0, icon: LucideCalendar, trend: '+5' },
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
