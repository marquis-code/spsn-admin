<template>
  <div class="space-y-6 sm:space-y-8">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-1">
      <div>
        <h2 class="text-xl sm:text-2xl font-black text-slate-800">Member Directory</h2>
        <p class="text-[11px] text-slate-400 font-bold mt-1">Registry database: {{ members.length }} practitioners</p>
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

    <!-- Filters Section -->
    <div class="admin-card py-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center sm:justify-between">
      <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center w-full sm:w-auto">
        <div class="w-full sm:w-40">
          <SelectInput v-model="roleFilter" label="Role" :options="['All roles', 'Regular member', 'Fellow', 'Student']" />
        </div>
        <div class="w-full sm:w-40">
          <SelectInput v-model="statusFilter" label="Status" :options="['Active status', 'Active only', 'Inactive']" />
        </div>
      </div>
      <div class="w-full sm:w-64">
        <AnimatedInput v-model="searchQuery" label="Search directory..." />
      </div>
    </div>

    <!-- Data Display Area -->
    <div class="admin-card !p-0 overflow-hidden min-h-[400px] flex flex-col">
      <!-- Loading State -->
      <div v-if="loading" class="flex-1 flex flex-col items-center justify-center py-24 gap-4">
        <div class="animate-spin rounded-full h-10 w-10 border-2 border-slate-100 border-t-[#003366]"></div>
        <p class="text-[11px] font-bold text-slate-400">Synchronizing registry...</p>
      </div>

      <!-- Members Table -->
      <template v-else-if="filteredMembers.length > 0">
        <div class="overflow-x-auto">
          <table class="admin-table min-w-[1000px]">
            <thead>
              <tr>
                <th>Practitioner info</th>
                <th>Membership ID</th>
                <th>Designation</th>
                <th class="hidden lg:table-cell">Specialization</th>
                <th class="hidden md:table-cell">Enrollment date</th>
                <th>Status</th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in filteredMembers" :key="member._id" class="group hover:bg-slate-50/50 transition-colors">
                <td>
                  <div class="flex items-center gap-4">
                    <div class="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-[#003366] font-bold border border-slate-100 text-[10px]">
                      {{ getInitials(member.name) }}
                    </div>
                    <div class="min-w-0">
                      <p class="font-bold text-slate-800 text-xs">{{ member.name }}</p>
                      <p class="text-[10px] text-slate-400 font-bold opacity-60">{{ member.email }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="font-mono text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">{{ member.membershipId || 'Pending' }}</span>
                </td>
                <td>
                  <span class="font-bold text-slate-700 text-[11px]">{{ member.role || 'Member' }}</span>
                </td>
                <td class="hidden lg:table-cell">
                  <span class="text-[11px] text-slate-400 font-bold">{{ member.specialization || 'General' }}</span>
                </td>
                <td class="hidden md:table-cell">
                  <span class="text-[11px] text-slate-400 font-bold">{{ formatDate(member.createdAt) }}</span>
                </td>
                <td>
                  <span :class="['badge-premium text-[8px]', member.isActive !== false ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100']">
                    {{ member.isActive !== false ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center gap-3">
                    <button @click="viewDetails(member)" class="text-[#003366] hover:text-[#004080] transition-colors p-1" title="View Details">
                      <LucideEye :size="16" />
                    </button>
                    <div class="h-4 w-[1px] bg-slate-100"></div>
                    <button @click="confirmRemove(member)" class="text-rose-500 hover:text-rose-600 transition-colors p-1" title="Remove Member">
                      <LucideTrash2 :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>

      <!-- Empty State -->
      <EmptyState 
        v-else 
        title="No members found" 
        message="The directory search returned no active or pending member records matching your criteria."
        :icon="LucideUsers"
        class="flex-1"
      />
    </div>

    <!-- Remove Confirmation Modal -->
    <ConfirmModal
      v-model="showRemoveModal"
      title="De-list member"
      :message="`Are you sure you want to remove ${selectedMember?.name || 'this member'} from the active directory? This operation is irreversible.`"
      confirm-text="Remove member"
      variant="danger"
      @confirm="handleRemoveMember"
    />

    <!-- Member Details Slide-Over -->
    <MemberDetailsModal
      v-model="showDetailsModal"
      :member="selectedMemberForDetails"
    />
  </div>
</template>

<script setup>
import { LucideSearch, LucideLoader2, LucideDownload, LucideUpload, LucideFileSpreadsheet, LucideUsers, LucideEye, LucideTrash2 } from 'lucide-vue-next'
import EmptyState from '@/components/core/EmptyState.vue'
import ConfirmModal from '@/components/core/ConfirmModal.vue'
import MemberDetailsModal from '@/components/core/MemberDetailsModal.vue'
import AnimatedInput from '@/components/AnimatedInput.vue'
import SelectInput from '@/components/SelectInput.vue'
import { useGetMembers } from '@/composables/modules/members/useGetMembers'
import { computed, onMounted, ref } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { loading, members, getMembers } = useGetMembers()
const { showToast } = useCustomToast()
const api = useApi()
const searchQuery = ref('')
const roleFilter = ref('All roles')
const statusFilter = ref('Active status')
const fileInput = ref(null)
const importing = ref(false)
const showRemoveModal = ref(false)
const selectedMember = ref(null)

const showDetailsModal = ref(false)
const selectedMemberForDetails = ref(null)

const viewDetails = (member) => {
  selectedMemberForDetails.value = member
  showDetailsModal.value = true
}

const confirmRemove = (member) => {
  selectedMember.value = member
  showRemoveModal.value = true
}

const handleRemoveMember = () => {
  // TODO: Call API to remove member
  showRemoveModal.value = false
  selectedMember.value = null
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const triggerExport = () => {
  api.members.export()
}

const triggerDownloadTemplate = () => {
  api.members.downloadTemplate()
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  importing.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const { data, error } = await api.members.import(formData)

    if (error) throw new Error(error.message || 'Import failed')

    showToast({ title: 'Import Successful', message: `${data.imported} members imported. ${data.skipped} skipped.`, toastType: 'success' })
    getMembers()
  } catch (err) {
    showToast({ title: 'Import Error', message: err.message || 'An error occurred during import', toastType: 'error' })
  } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

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
