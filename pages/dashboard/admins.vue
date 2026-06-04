<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center px-1">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Admin Management</h2>
        <p class="text-base text-slate-500 font-medium">Manage administrators and their specific module permissions.</p>
      </div>
      <div class="flex gap-3">
        <button @click="openSlideOver()" class="bg-[#003366] hover:bg-[#004080] text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm">
          <LucidePlus :size="14" />
          New Admin
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <Loader v-if="loading" message="Loading admins..." />

    <!-- Admins Table -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-base text-left">
        <thead class="text-sm text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-6 py-4 font-medium">Profile</th>
            <th class="px-6 py-4 font-medium">Email</th>
            <th class="px-6 py-4 font-medium">Role</th>
            <th class="px-6 py-4 font-medium">Permissions</th>
            <th class="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-if="admins.length === 0">
            <td colspan="5" class="px-6 py-8">
              <EmptyState title="No administrators" message="No administrators were found in the database." :icon="LucideShield" />
            </td>
          </tr>
          <tr v-for="admin in admins" :key="admin._id" class="hover:bg-slate-50">
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#003366] font-bold text-lg border border-slate-200">
                  {{ admin.fullName?.charAt(0).toUpperCase() || admin.email.charAt(0).toUpperCase() }}
                </div>
                <span class="font-semibold text-slate-800">{{ admin.fullName || 'Admin User' }}</span>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="text-slate-600">{{ admin.email }}</span>
            </td>
            <td class="px-6 py-4">
              <span class="inline-block px-2.5 py-1 text-sm font-bold rounded-md" :class="admin.role === 'super_admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-[#1d4e89]'">
                {{ admin.role === 'super_admin' ? 'Super Admin' : 'Admin' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <span v-if="admin.role !== 'super_admin'" class="text-sm text-slate-500">
                {{ admin.permissions?.length || 0 }} module(s)
              </span>
              <span v-else class="text-sm text-slate-500">
                All modules
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-3">
              <button @click="openSlideOver(admin)" class="text-sm font-bold text-[#003366] hover:text-[#004080] transition-colors" title="Edit Admin">
                Edit
              </button>
              <button v-if="admin.role !== 'super_admin' && currentUser?.email !== admin.email" @click="deleteAdmin(admin._id)" class="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors" title="Delete Admin">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Slide Over for Create/Edit -->
    <SlideOver
      v-model="showSlideOver"
      :title="isEditing ? 'Edit Administrator' : 'New Administrator'"
      :subtitle="isEditing ? 'Update admin details and permissions' : 'Create a new admin and assign permissions'"
      size="lg"
    >
      <div class="space-y-6">
        <AnimatedInput v-model="formData.fullName" label="Full Name" />
        <AnimatedInput v-model="formData.email" label="Email Address" type="email" />
        <AnimatedInput v-model="formData.password" label="Password (Leave blank to keep existing)" type="password" v-if="isEditing" />
        <AnimatedInput v-model="formData.password" label="Password" type="password" v-else />
        
        <div v-if="formData.role !== 'super_admin'" class="space-y-4">
          <label class="block text-sm font-bold text-slate-700 border-b border-slate-200 pb-2">Module Permissions</label>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="mod in availableModules" :key="mod.key" class="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50 cursor-pointer" @click="togglePermission(mod.key)">
              <div class="w-5 h-5 rounded border border-slate-300 flex items-center justify-center bg-white" :class="{'bg-[#003366] border-[#003366]': formData.permissions.includes(mod.key)}">
                <LucideCheck v-if="formData.permissions.includes(mod.key)" class="text-white" :size="12" />
              </div>
              <span class="text-sm font-medium text-slate-700 select-none">{{ mod.label }}</span>
            </div>
          </div>
        </div>
        
        <div v-else class="p-4 bg-purple-50 text-purple-700 rounded-xl text-sm font-medium flex gap-3">
          <LucideInfo :size="20" class="shrink-0" />
          This user is a Super Admin and has unrestricted access to all modules, including managing other admins.
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end w-full">
          <button @click="showSlideOver = false" class="px-5 py-2.5 text-base font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
          <button @click="saveAdmin" :disabled="saving" class="px-5 py-2.5 text-base font-bold text-white bg-[#003366] hover:bg-[#002855] rounded-xl transition-all flex items-center gap-2">
            <LucideLoader2 v-if="saving" class="w-4 h-4 animate-spin" />
            <LucideSave v-else class="w-4 h-4" />
            Save Administrator
          </button>
        </div>
      </template>
    </SlideOver>
  </div>
</template>

<script setup>
import { LucidePlus, LucideShield, LucideLoader2, LucideEdit, LucideTrash2, LucideSave, LucideCheck, LucideInfo } from 'lucide-vue-next'
import SlideOver from '@/components/core/SlideOver.vue'
import Loader from '@/components/core/Loader.vue'
import EmptyState from '@/components/core/EmptyState.vue'
import AnimatedInput from '@/components/AnimatedInput.vue'
import { onMounted, ref, reactive } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useAuth } from '@/composables/useAuth'

const { showToast } = useCustomToast()
const api = useApi()
const router = useRouter()
const { user: currentUser } = useAuth()

const loading = ref(false)
const admins = ref([])
const showSlideOver = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const selectedAdmin = ref(null)

const formData = reactive({
  fullName: '',
  email: '',
  password: '',
  role: 'admin',
  permissions: []
})

const availableModules = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'members', label: 'Members' },
  { key: 'enrollments', label: 'Enrollments' },
  { key: 'events', label: 'Events' },
  { key: 'abstracts', label: 'Abstracts' },
  { key: 'blogs', label: 'News / Blogs' },
  { key: 'appointments', label: 'Appointments' },
  { key: 'enquiries', label: 'Enquiries' },
  { key: 'chat', label: 'Chat' },
  { key: 'forms', label: 'Forms' },
  { key: 'payments', label: 'Payments' },
  { key: 'cms-website', label: 'Website CMS' },
  { key: 'cms-members', label: 'Member CMS' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'adverts', label: 'Adverts' },
  { key: 'sponsors', label: 'Sponsors' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'campaigns', label: 'Campaigns' },
  { key: 'newsletters', label: 'Newsletters' },
  { key: 'excos', label: 'Executives' },
  { key: 'settings', label: 'Settings' }
]

const togglePermission = (key) => {
  const index = formData.permissions.indexOf(key)
  if (index > -1) {
    formData.permissions.splice(index, 1)
  } else {
    formData.permissions.push(key)
  }
}

const getAdmins = async () => {
  loading.value = true
  try {
    const res = await api.admins.getAll()
    admins.value = res.data
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to fetch admins.', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

const openSlideOver = (admin = null) => {
  if (admin && admin._id) {
    isEditing.value = true
    selectedAdmin.value = admin
    formData.fullName = admin.fullName || ''
    formData.email = admin.email || ''
    formData.password = ''
    formData.role = admin.role || 'admin'
    formData.permissions = admin.permissions ? [...admin.permissions] : []
  } else {
    isEditing.value = false
    selectedAdmin.value = null
    formData.fullName = ''
    formData.email = ''
    formData.password = ''
    formData.role = 'admin'
    formData.permissions = []
  }
  showSlideOver.value = true
}

const saveAdmin = async () => {
  saving.value = true
  try {
    const payload = {
      fullName: formData.fullName,
      email: formData.email,
      permissions: formData.permissions
    }
    if (formData.password) {
      payload.password = formData.password
    }

    if (isEditing.value) {
      await api.admins.update(selectedAdmin.value._id, payload)
      showToast({ title: 'Success', message: 'Admin updated successfully.', toastType: 'success' })
    } else {
      await api.admins.create(payload)
      showToast({ title: 'Success', message: 'Admin created successfully.', toastType: 'success' })
    }
    showSlideOver.value = false
    getAdmins()
  } catch (err) {
    showToast({ title: 'Error', message: err.message || 'Failed to save admin.', toastType: 'error' })
  } finally {
    saving.value = false
  }
}

const deleteAdmin = async (id) => {
  if (!confirm('Are you sure you want to delete this administrator?')) return
  try {
    await api.admins.delete(id)
    showToast({ title: 'Success', message: 'Admin deleted successfully.', toastType: 'success' })
    getAdmins()
  } catch (err) {
    showToast({ title: 'Error', message: err.message || 'Failed to delete admin.', toastType: 'error' })
  }
}

onMounted(() => {
  if (currentUser.value?.role !== 'super_admin') {
    router.push('/dashboard')
    showToast({ title: 'Access Denied', message: 'You do not have permission to view this page.', toastType: 'error' })
    return
  }
  getAdmins()
})
</script>
