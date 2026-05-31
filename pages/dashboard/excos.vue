<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center px-1">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Executives Management</h2>
        <p class="text-base text-slate-500 font-medium">Manage the executives (excos) of the association.</p>
      </div>
      <div class="flex gap-3">
        <button @click="openSlideOver()" class="bg-[#003366] hover:bg-[#004080] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm">
          <LucidePlus :size="14" />
          New Executive
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <Loader v-if="loading" message="Loading excos..." />

    <!-- Excos Table -->
    <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <table class="w-full text-base text-left">
        <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="px-6 py-4 font-medium">Profile Picture</th>
            <th class="px-6 py-4 font-medium">Name</th>
            <th class="px-6 py-4 font-medium">Position</th>
            <th class="px-6 py-4 font-medium">Bio</th>
            <th class="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-if="excos.length === 0">
            <td colspan="5" class="px-6 py-8">
              <EmptyState title="No executives" message="No executives were found in the database." :icon="LucideUsers" />
            </td>
          </tr>
          <tr v-for="exco in excos" :key="exco._id" class="hover:bg-slate-50">
            <td class="px-6 py-4">
              <div class="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shadow-sm">
                <img :src="exco.profilePicture || 'https://via.placeholder.com/150'" class="w-full h-full object-cover" />
              </div>
            </td>
            <td class="px-6 py-4">
              <p class="font-semibold text-slate-800">{{ exco.name }}</p>
            </td>
            <td class="px-6 py-4">
              <span class="inline-block px-2.5 py-1 bg-blue-50 text-[#003366] text-xs font-bold rounded-md">
                {{ exco.position }}
              </span>
            </td>
            <td class="px-6 py-4">
              <p class="text-sm text-slate-500 line-clamp-2 max-w-xs">{{ exco.bio || 'No bio provided' }}</p>
            </td>
            <td class="px-6 py-4 text-right space-x-3">
              <button @click="openSlideOver(exco)" class="text-xs font-bold text-[#003366] hover:text-[#004080] transition-colors" title="Edit Exco">
                Edit
              </button>
              <button @click="deleteExco(exco._id)" class="text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors" title="Delete Exco">
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
      :title="isEditing ? 'Edit Executive' : 'New Executive'"
      :subtitle="isEditing ? 'Update existing executive details' : 'Add a new executive'"
      size="lg"
      persistent
    >
      <div class="space-y-6">
        <AnimatedInput v-model="formData.name" label="Full Name" />
        <AnimatedInput v-model="formData.position" label="Position" />
        
        <div class="space-y-2">
          <label class="block text-sm font-medium text-slate-700">Profile Picture</label>
          <div class="relative w-full h-48 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center overflow-hidden group cursor-pointer">
            <input type="file" @change="handleFileChange" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            
            <template v-if="previewImage">
              <img :src="previewImage" class="absolute inset-0 w-full h-full object-cover z-0" :class="{ 'opacity-50': imageUploading }" />
              <div v-if="imageUploading" class="absolute inset-0 flex items-center justify-center z-10">
                <LucideLoader2 class="w-8 h-8 text-[#003366] animate-spin" />
              </div>
              <div v-else class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity z-0">
                <div class="bg-white/90 px-4 py-2 rounded-lg text-sm font-bold text-slate-800 flex items-center gap-2 shadow-sm">
                  <LucideUpload :size="16" />
                  Change Picture
                </div>
              </div>
            </template>
            <template v-else>
              <div class="w-12 h-12 rounded-full bg-[#003366]/10 flex items-center justify-center mb-3">
                <LucideImage class="text-[#003366]" :size="24" />
              </div>
              <p class="text-sm font-bold text-slate-700">Click to upload a picture</p>
              <p class="text-xs text-slate-500 mt-1">PNG, JPG, JPEG (Max. 5MB)</p>
            </template>
          </div>
        </div>

        <AnimatedInput v-model="formData.bio" label="Bio (Optional)" type="textarea" :rows="4" />
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end w-full">
          <button @click="showSlideOver = false" class="px-5 py-2.5 text-base font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
          <button @click="saveExco" :disabled="saving" class="px-5 py-2.5 text-base font-bold text-white bg-[#003366] hover:bg-[#002855] rounded-xl transition-all flex items-center gap-2">
            <LucideLoader2 v-if="saving" class="w-4 h-4 animate-spin" />
            <LucideSave v-else class="w-4 h-4" />
            Save Executive
          </button>
        </div>
      </template>
    </SlideOver>
  </div>
</template>

<script setup>
import { LucidePlus, LucideBriefcase, LucideUsers, LucideLoader2, LucideEdit, LucideTrash2, LucideSave, LucideImage, LucideUpload } from 'lucide-vue-next'

import SlideOver from '@/components/core/SlideOver.vue'
import Loader from '@/components/core/Loader.vue'
import EmptyState from '@/components/core/EmptyState.vue'
import AnimatedInput from '@/components/AnimatedInput.vue'
import { useGetExcos } from '@/composables/modules/excos/useGetExcos'
import { onMounted, ref, reactive } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { loading, excos, getExcos } = useGetExcos()
const { showToast } = useCustomToast()
const api = useApi()

const showSlideOver = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const imageUploading = ref(false)
const selectedExco = ref(null)
const previewImage = ref(null)

const formData = reactive({
  name: '',
  position: '',
  bio: '',
  profilePicture: ''
})

const handleFileChange = async (e) => {
  const file = e.target.files[0]
  if (file) {
    previewImage.value = URL.createObjectURL(file)
    imageUploading.value = true
    
    try {
      const uploadData = new FormData()
      uploadData.append('file', file)
      const response = await api.upload.image(uploadData)
      if (response.data && response.data.url) {
        formData.profilePicture = response.data.url
        previewImage.value = response.data.url
      }
    } catch (err) {
      showToast({ title: 'Upload Failed', message: 'Could not upload profile picture.', toastType: 'error' })
    } finally {
      imageUploading.value = false
    }
  }
}

const openSlideOver = (exco = null) => {
  previewImage.value = null
  if (exco && exco._id) {
    isEditing.value = true
    selectedExco.value = exco
    formData.name = exco.name || ''
    formData.position = exco.position || ''
    formData.bio = exco.bio || ''
    formData.profilePicture = exco.profilePicture || ''
    previewImage.value = exco.profilePicture || ''
  } else {
    isEditing.value = false
    selectedExco.value = null
    formData.name = ''
    formData.position = ''
    formData.bio = ''
    formData.profilePicture = ''
  }
  showSlideOver.value = true
}

const saveExco = async () => {
  if (imageUploading.value) {
     showToast({ title: 'Please wait', message: 'Image is still uploading', toastType: 'info' })
     return
  }
  
  saving.value = true
  try {
    const payload = {
      name: formData.name,
      position: formData.position,
      bio: formData.bio,
      profilePicture: formData.profilePicture
    }

    if (isEditing.value) {
      await api.excos.update(selectedExco.value._id, payload)
      showToast({ title: 'Success', message: 'Executive updated successfully.', toastType: 'success' })
    } else {
      if (!formData.profilePicture) {
         showToast({ title: 'Error', message: 'Profile picture is required', toastType: 'error' })
         saving.value = false
         return
      }
      await api.excos.create(payload)
      showToast({ title: 'Success', message: 'Executive created successfully.', toastType: 'success' })
    }
    showSlideOver.value = false
    getExcos()
  } catch (err) {
    showToast({ title: 'Error', message: err.message || 'Failed to save executive.', toastType: 'error' })
  } finally {
    saving.value = false
  }
}

const deleteExco = async (id) => {
  if (!confirm('Are you sure you want to delete this executive?')) return
  try {
    await api.excos.delete(id)
    showToast({ title: 'Success', message: 'Executive deleted successfully.', toastType: 'success' })
    getExcos()
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to delete executive.', toastType: 'error' })
  }
}

onMounted(() => {
  getExcos()
})
</script>
