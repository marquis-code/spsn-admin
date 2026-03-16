<template>
  <div class="h-full flex flex-col bg-slate-50">
    <div class="p-6 border-b bg-white">
      <h2 class="text-2xl font-bold text-accent">Appointment Management</h2>
      <p class="text-sm text-gray-400">Review and confirm pathology consultation requests.</p>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
    </div>

    <div v-else class="flex-grow p-6 overflow-y-auto">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Stats Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <div class="admin-card bg-primary text-white">
            <p class="text-[10px] font-bold uppercase opacity-80 mb-1">Today's Appointments</p>
            <p class="text-3xl font-bold">{{ appointments.length }}</p>
          </div>
        </div>

        <!-- Appointment Table -->
        <div class="lg:col-span-3">
          <div class="admin-card">
            <div class="overflow-x-auto">
              <table class="w-full text-left">
                <thead>
                  <tr class="text-[10px] text-gray-400 uppercase tracking-widest border-b font-bold">
                    <th class="pb-4">Requestor</th>
                    <th class="pb-4">Category</th>
                    <th class="pb-4">Schedule</th>
                    <th class="pb-4">Status</th>
                    <th class="pb-4">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y">
                  <tr v-for="appointment in appointments" :key="appointment._id" class="text-xs group hover:bg-slate-50 transition-colors">
                    <td class="py-4">
                      <div class="flex flex-col">
                        <span class="font-bold text-accent">{{ appointment.name }}</span>
                        <span class="text-[10px] text-gray-400 text-ellipsis overflow-hidden">{{ appointment.email }}</span>
                      </div>
                    </td>
                    <td class="py-4">
                      <span class="px-2 py-0.5 bg-brand-blue/10 text-brand-blue rounded-full text-[9px] font-bold">{{ appointment.category || 'Consultation' }}</span>
                    </td>
                    <td class="py-4 font-semibold text-accent-light">{{ formatDate(appointment.date) }} • {{ appointment.time || '09:00 AM' }}</td>
                    <td class="py-4">
                      <span :class="['px-2 py-0.5 rounded-full text-[9px] font-bold', getStatusClass(appointment.status)]">
                        {{ appointment.status || 'Pending Approval' }}
                      </span>
                    </td>
                    <td class="py-4">
                       <div class="flex gap-2">
                          <button class="text-primary font-bold hover:underline">Approve</button>
                          <button class="text-red-400 font-bold hover:underline">Deny</button>
                       </div>
                    </td>
                  </tr>
                  <tr v-if="appointments.length === 0">
                    <td colspan="5" class="py-10 text-center text-gray-400">No appointments found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGetAppointments } from '@/composables/modules/appointments/useGetAppointments'
import { onMounted } from 'vue'

const { loading, appointments, getAppointments } = useGetAppointments()

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
  getAppointments()
})
</script>
