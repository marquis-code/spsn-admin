<template>
  <div class="space-y-3">
    <label v-if="label" class="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">{{ label }}</label>
    
    <div class="relative group">
      <!-- Preview / Placeholder -->
      <div 
        class="w-full h-48 rounded-3xl border-2 border-dashed border-slate-100 bg-slate-50 overflow-hidden flex flex-col items-center justify-center transition-all group-hover:border-[#003366]/20 group-hover:bg-slate-100/50 relative"
      >
        <img v-if="modelValue" :src="modelValue" class="w-full h-full object-cover" />
        <div v-else class="flex flex-col items-center gap-3 text-slate-400">
          <LucideImagePlus :size="32" class="opacity-50" />
          <span class="text-[10px] font-bold">Click to upload image</span>
        </div>

        <!-- Overlays -->
        <div v-if="uploading" class="absolute inset-0 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center gap-4 z-[100] animate-in fade-in duration-300">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-slate-100 border-t-[#003366] rounded-full animate-spin"></div>
            <LucideCloudUpload :size="24" class="absolute inset-0 m-auto text-[#003366] animate-bounce" />
          </div>
          <div class="text-center">
            <p class="text-[11px] font-black text-[#003366] uppercase tracking-widest">Syncing to Cloudinary</p>
            <p class="text-[9px] font-bold text-slate-400 mt-1">Please wait while we optimize your asset...</p>
          </div>
        </div>

        <button 
          @click="$refs.fileInput.click()" 
          class="absolute inset-0 z-10 w-full h-full opacity-0 cursor-pointer"
          :disabled="uploading"
        ></button>
      </div>

      <!-- Quick Actions -->
      <div v-if="modelValue" class="absolute top-4 right-4 flex gap-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
        <button @click="$refs.fileInput.click()" class="p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-[#003366] hover:bg-[#003366] hover:text-white transition-all" title="Change Image">
          <LucideEdit3 :size="16" />
        </button>
        <button @click="$emit('update:modelValue', '')" class="p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-rose-500 hover:bg-rose-500 hover:text-white transition-all" title="Remove Image">
          <LucideTrash2 :size="16" />
        </button>
      </div>
    </div>

    <input 
      type="file" 
      ref="fileInput" 
      class="hidden" 
      accept="image/*" 
      @change="handleFileChange"
    />
    
    <p v-if="modelValue" class="text-[9px] font-bold text-slate-300 truncate px-2">Path: {{ modelValue }}</p>
  </div>
</template>

<script setup>
import { LucideImagePlus, LucideLoader2, LucideEdit3, LucideTrash2, LucideCloudUpload } from 'lucide-vue-next'
import { ref } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'

const props = defineProps({
  modelValue: String,
  label: String
})

const emit = defineEmits(['update:modelValue'])

const api = useApi()
const { showToast } = useCustomToast()
const uploading = ref(false)
const fileInput = ref(null)

const handleFileChange = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Basic validation
  if (file.size > 5 * 1024 * 1024) {
    showToast({ title: 'File Too Large', message: 'Maximum image size is 5MB.', toastType: 'warning' })
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const { data, error } = await api.upload.image(formData)
    
    if (error) throw new Error(error.message || 'Upload failed')

    // Expecting backend to return { url: 'https://cloudinary.com/...' }
    if (data && data.url) {
      emit('update:modelValue', data.url)
      showToast({ title: 'Image Uploaded', message: 'Asset successfully synced to Cloudinary.', toastType: 'success' })
    }
  } catch (err) {
    showToast({ title: 'Upload Error', message: err.message || 'Failed to upload image.', toastType: 'error' })
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>
