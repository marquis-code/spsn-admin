<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-accent">Member Directory</h2>
        <p class="text-sm text-gray-400">Total registered members: {{ members.length }}</p>
      </div>
      <button class="btn-primary px-6 font-bold">+ Import Members</button>
    </div>

    <!-- Filters -->
    <div class="admin-card py-4 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex gap-4 items-center">
        <select class="bg-slate-50 border rounded-lg px-3 py-2 text-xs font-bold text-accent">
          <option>All Roles</option>
          <option>Regular Member</option>
          <option>Fellow</option>
          <option>Student</option>
        </select>
        <select class="bg-slate-50 border rounded-lg px-3 py-2 text-xs font-bold text-accent">
          <option>Active Status</option>
          <option>Active Only</option>
          <option>Inactive</option>
        </select>
      </div>
      <div class="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 text-accent-light">
        <LucideSearch :size="16" />
        <input v-model="searchQuery" type="text" placeholder="Filter by name or email..." class="bg-transparent border-none text-xs w-64 outline-none" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
    </div>

    <!-- Table -->
    <div v-else class="admin-card">
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-[10px] text-gray-400 uppercase tracking-widest border-b font-bold">
              <th class="pb-4">Member Info</th>
              <th class="pb-4">Membership ID</th>
              <th class="pb-4">Role</th>
              <th class="pb-4">Specialization</th>
              <th class="pb-4">Join Date</th>
              <th class="pb-4">Status</th>
              <th class="pb-4">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="member in filteredMembers" :key="member._id" class="text-xs group hover:bg-slate-50/50 transition-colors">
              <td class="py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {{ getInitials(member.name) }}
                  </div>
                  <div>
                    <p class="font-bold text-accent">{{ member.name }}</p>
                    <p class="text-[10px] text-gray-400">{{ member.email }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 font-mono font-bold text-gray-400">{{ member.membershipId || 'N/A' }}</td>
              <td class="py-4 font-semibold text-accent-light">{{ member.role || 'Member' }}</td>
              <td class="py-4 text-gray-500">{{ member.specialization || 'General' }}</td>
              <td class="py-4 text-gray-400">{{ formatDate(member.createdAt) }}</td>
              <td class="py-4">
                <span :class="member.isActive !== false ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'" class="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                  {{ member.isActive !== false ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="py-4 space-x-2">
                <button class="text-primary hover:underline font-bold">Edit</button>
                <button class="text-red-400 hover:text-red-500 font-bold ml-2">Delete</button>
              </td>
            </tr>
            <tr v-if="filteredMembers.length === 0">
              <td colspan="7" class="py-10 text-center text-gray-400">No members found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideSearch } from 'lucide-vue-next'
import { useGetMembers } from '@/composables/modules/members/useGetMembers'
import { computed, onMounted } from 'vue'

const { loading, members, getMembers } = useGetMembers()
const searchQuery = ref('')

const filteredMembers = computed(() => {
  if (!searchQuery.value) return members.value
  const q = searchQuery.value.toLowerCase()
  return members.value.filter((m) =>
    m.name?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q)
  )
})

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  getMembers()
})
</script>
