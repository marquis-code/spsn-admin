<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <label v-if="label" class="text-[11px] font-bold text-slate-400 ml-1">{{ label }}</label>
      <span v-if="uploadedUrls.length > 0" class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
        {{ uploadedUrls.length }} uploaded
      </span>
    </div>
    
    <div class="relative group">
      <!-- Dropzone -->
      <div 
        class="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 overflow-hidden flex flex-col items-center justify-center transition-all group-hover:border-[#003366]/30 group-hover:bg-slate-100/50 cursor-pointer"
        @click="$refs.fileInput.click()"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @drop.prevent="handleDrop"
        :class="{ 'border-[#003366] bg-blue-50/50': isDragging }"
      >
        <div v-if="!uploading" class="flex flex-col items-center gap-2 text-slate-400 pointer-events-none">
          <Icon name="lucide:images" size="28" :class="isDragging ? 'text-[#003366]' : 'opacity-60'" />
          <span class="text-[11px] font-bold text-slate-500">Click or drag images to batch upload</span>
          <span class="text-[9px] font-medium text-slate-400 max-w-xs text-center px-4">You can select multiple files at once. (JPG, PNG, WEBP)</span>
        </div>

        <!-- Uploading State -->
        <div v-else class="flex flex-col items-center justify-center gap-3">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 border-2 border-slate-200 border-t-[#003366] rounded-full animate-spin"></div>
            <span class="text-xs font-bold text-[#003366]">Uploading {{ totalToUpload }} files...</span>
          </div>
          <div class="w-48 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div class="h-full bg-[#003366] transition-all duration-300" :style="{ width: `${uploadProgress}%` }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hidden Input -->
    <input 
      type="file" 
      ref="fileInput" 
      class="hidden" 
      accept="image/*" 
      multiple
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  label: String
})

const emit = defineEmits(['update:modelValue'])

const { showToast } = useCustomToast()
const fileInput = ref(null)
const uploading = ref(false)
const isDragging = ref(false)
const totalToUpload = ref(0)
const completedUploads = ref(0)

const uploadedUrls = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const uploadProgress = computed(() => {
  if (totalToUpload.value === 0) return 0
  return Math.round((completedUploads.value / totalToUpload.value) * 100)
})

const processFiles = async (files) => {
  const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
  
  if (validFiles.length === 0) {
    showToast({ title: 'Invalid Files', message: 'Please select valid image files.', toastType: 'warning' })
    return
  }

  // Filter out oversized files
  const sizeLimit = 5 * 1024 * 1024 // 5MB
  const filesToUpload = validFiles.filter(f => {
    if (f.size > sizeLimit) {
      showToast({ title: 'File Skipped', message: `${f.name} exceeds 5MB limit.`, toastType: 'warning' })
      return false
    }
    return true
  })

  if (filesToUpload.length === 0) return

  uploading.value = true
  totalToUpload.value = filesToUpload.length
  completedUploads.value = 0
  
  const newUrls = []

  // Upload concurrently
  const uploadPromises = filesToUpload.map(async (file) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const res = await GATEWAY_ENDPOINT.post('/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (res.data && res.data.url) {
        newUrls.push(res.data.url)
      }
    } catch (err) {
      console.error(`Failed to upload ${file.name}:`, err)
      showToast({ title: 'Upload Error', message: `Failed to upload ${file.name}`, toastType: 'error' })
    } finally {
      completedUploads.value++
    }
  })

  await Promise.all(uploadPromises)

  // Append new URLs to existing list
  if (newUrls.length > 0) {
    uploadedUrls.value = [...uploadedUrls.value, ...newUrls]
    showToast({ title: 'Batch Upload Complete', message: `Successfully synced ${newUrls.length} images.`, toastType: 'success' })
  }

  uploading.value = false
  if (fileInput.value) fileInput.value.value = ''
}

const handleFileChange = (event) => {
  if (event.target.files?.length > 0) {
    processFiles(event.target.files)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  if (event.dataTransfer?.files?.length > 0) {
    processFiles(event.dataTransfer.files)
  }
}
</script>
