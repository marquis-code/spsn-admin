<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center px-2">
      <div>
        <h2 class="text-3xl font-bold text-accent">Administrative Overview</h2>
        <p class="text-sm text-gray-400 font-semibold uppercase tracking-widest mt-1">Real-time Association Metrics</p>
      </div>
      <div class="flex gap-4">
        <button class="bg-white border text-accent px-6 py-2.5 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">Download Report</button>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="stat in computedStats" :key="stat.label" class="admin-card group hover:border-primary transition-all">
        <div class="flex justify-between items-start mb-4">
          <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-accent group-hover:text-primary transition-colors">
            <component :is="stat.icon" :size="20" />
          </div>
        </div>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ stat.label }}</p>
        <p class="text-3xl font-bold text-accent mt-1">{{ stat.value }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Recent Appointments -->
      <div class="lg:col-span-2 admin-card h-full">
        <div class="flex justify-between items-center mb-8">
          <h3 class="font-bold text-accent text-lg">Recent Appointments</h3>
          <NuxtLink to="/appointments" class="text-xs font-bold text-primary hover:underline">View All →</NuxtLink>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr class="text-[10px] text-gray-400 uppercase tracking-widest border-b font-bold">
                <th class="pb-4">Member</th>
                <th class="pb-4">Category</th>
                <th class="pb-4">Date</th>
                <th class="pb-4">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              <tr v-for="appointment in recentAppointments" :key="appointment._id" class="text-xs group hover:bg-slate-50 transition-colors">
                <td class="py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-accent">
                      {{ getInitials(appointment.name) }}
                    </div>
                    <span class="font-bold text-accent">{{ appointment.name }}</span>
                  </div>
                </td>
                <td class="py-4 font-semibold text-accent-light">{{ appointment.category || 'Consult' }}</td>
                <td class="py-4 text-gray-400">{{ formatDate(appointment.date) }}</td>
                <td class="py-4">
                  <span :class="['px-2 py-0.5 rounded-full text-[9px] font-bold uppercase', getStatusClass(appointment.status)]">
                    {{ appointment.status || 'Pending' }}
                  </span>
                </td>
              </tr>
              <tr v-if="appointments.length === 0">
                <td colspan="4" class="py-10 text-center text-gray-400">No recent appointments.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recent Inquiries -->
      <div class="admin-card h-full">
         <div class="flex justify-between items-center mb-8">
            <h3 class="font-bold text-accent text-lg">Recent Inquiries</h3>
            <NuxtLink to="/enquiries" class="text-xs font-bold text-primary hover:underline">Manage All</NuxtLink>
         </div>
         <div class="space-y-6">
            <div v-for="enquiry in recentEnquiries" :key="enquiry._id" class="flex gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all cursor-pointer">
               <div class="w-2 h-2 rounded-full bg-primary mt-1 flex-shrink-0"></div>
               <div>
                  <p class="text-xs font-bold text-accent mb-1">{{ enquiry.subject }}</p>
                  <p class="text-[10px] text-gray-400 line-clamp-2">"{{ enquiry.message }}"</p>
                  <p class="text-[9px] font-bold text-primary mt-3 uppercase tracking-widest">{{ enquiry.status || 'New' }}</p>
               </div>
            </div>
            <div v-if="enquiries.length === 0" class="text-center py-10 text-gray-400 text-xs">No recent inquiries.</div>
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
  LucideCreditCard
} from 'lucide-vue-next'
import { useGetMembers } from '@/composables/modules/members/useGetMembers'
import { useGetAbstracts } from '@/composables/modules/abstracts/useGetAbstracts'
import { useGetAppointments } from '@/composables/modules/appointments/useGetAppointments'
import { useGetEnquiries } from '@/composables/modules/enquiries/useGetEnquiries'
import { onMounted, computed } from 'vue'

const { members, getMembers } = useGetMembers()
const { abstracts, getAbstracts } = useGetAbstracts()
const { appointments, getAppointments } = useGetAppointments()
const { enquiries, getEnquiries } = useGetEnquiries()

const computedStats = computed(() => [
  { label: 'Total Members', value: members.value.length, icon: LucideUsers },
  { label: 'Pending Abstracts', value: abstracts.value.filter(a => a.status === 'pending').length, icon: LucideFileText },
  { label: 'Total Inquiries', value: enquiries.value.length, icon: LucideCreditCard },
  { label: 'Upcoming Appts', value: appointments.value.length, icon: LucideCalendar },
])

const recentAppointments = computed(() => appointments.value.slice(0, 5))
const recentEnquiries = computed(() => enquiries.value.slice(0, 3))

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
    case 'approved': return 'bg-green-100 text-green-600'
    case 'denied': return 'bg-red-100 text-red-600'
    default: return 'bg-orange-100 text-orange-600'
  }
}

onMounted(() => {
  getMembers()
  getAbstracts()
  getAppointments()
  getEnquiries()
})
</script>
