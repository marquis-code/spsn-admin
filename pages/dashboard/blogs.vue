<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 px-1">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">News & Publications</h2>
        <p class="text-sm text-slate-500 font-medium">Manage association news, journals and research publications.</p>
      </div>
      <div class="flex gap-2 sm:gap-3 flex-wrap">
        <button @click="triggerExport" class="btn-outline-admin px-4 sm:px-5">
          <LucideDownload :size="14" class="mr-2" />
          Export
        </button>
        <button @click="triggerDownloadTemplate" class="text-slate-600 hover:text-[#003366] hover:bg-slate-50 border border-slate-200 rounded-xl px-4 sm:px-5 flex items-center gap-1.5 transition-all text-[11px] font-bold">
          <LucideFileSpreadsheet :size="14" />
          Template
        </button>
        <button @click="triggerFileInput" class="btn-premium px-4 sm:px-5" :disabled="importing">
          <LucideLoader2 v-if="importing" class="w-4 h-4 animate-spin mr-2" />
          <LucideUpload v-else :size="14" class="mr-2" />
          Import
        </button>
        <button @click="openSlideOver" class="bg-[#003366] hover:bg-[#004080] text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm">
          <LucidePlus :size="14" />
          <span class="hidden xs:inline">New post</span>
        </button>
      </div>
      <input type="file" ref="fileInput" accept=".xlsx, .xls, .csv" class="hidden" @change="handleFileUpload" />
    </div>

    <!-- Loading State -->
    <Loader v-if="loading" message="Loading publications..." />

    <!-- Main Content Grid -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
      <!-- Publication List -->
      <div class="lg:col-span-8 space-y-4">
        <div v-for="blog in blogs" :key="blog._id" class="admin-card flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 group hover:border-[#003366] transition-all duration-300">
          <div class="w-full sm:w-36 lg:w-40 h-40 sm:h-32 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100 p-1">
            <img :src="blog.image || 'https://scpsn.org.ng/wp-content/uploads/2021/10/banner.jpg'" class="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700" alt="Cover" />
          </div>
          <div class="flex-grow flex flex-col justify-center min-w-0">
            <div class="flex flex-wrap justify-between items-start gap-2 mb-3">
              <span class="px-2.5 py-1 bg-[#003366]/5 text-[#003366] rounded-lg text-[10px] font-bold border border-[#003366]/10">{{ blog.category || 'Journal article' }}</span>
              <span class="text-[10px] text-slate-400 font-bold">{{ formatDate(blog.createdAt) }}</span>
            </div>
            <h4 class="font-bold text-slate-800 text-base sm:text-lg mb-2 leading-tight group-hover:text-[#003366] transition-colors line-clamp-1">{{ blog.title }}</h4>
            <p class="text-xs text-slate-500 font-medium line-clamp-2 mb-4 sm:mb-5 leading-relaxed overflow-hidden">{{ blog.excerpt || blog.content?.substring(0, 140) }}...</p>

            <div class="flex flex-wrap items-center gap-3 sm:gap-5 text-[10px] font-bold">
              <button @click="openSlideOver(blog)" class="text-[#003366] hover:text-[#004080] p-1 transition-colors" title="Edit"><LucideEdit :size="16" /></button>
              <button class="text-slate-400 hover:text-slate-600 p-1 transition-colors" title="Preview"><LucideEye :size="16" /></button>
              <button @click="confirmDelete(blog)" class="text-rose-500 hover:text-rose-600 p-1 transition-colors sm:ml-auto" title="Delete"><LucideTrash :size="16" /></button>
            </div>
          </div>
        </div>
        <EmptyState 
          v-if="blogs.length === 0"
          title="No publications"
          message="No news articles or publications were found."
          :icon="LucideFileText"
        />
      </div>

      <!-- Sidebar Content -->
      <div class="lg:col-span-4 space-y-6 lg:space-y-8">
        <div class="admin-card p-5 lg:p-6 border-slate-200">
          <h3 class="font-bold text-slate-800 text-base mb-5 lg:mb-6 border-b border-slate-100 pb-3 flex items-center gap-2">
            <LucideActivity :size="18" class="text-[#003366]" />
            Publication metrics
          </h3>
          <div class="space-y-4 lg:space-y-5">
            <div class="flex justify-between items-center p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 font-bold">Total publications</span>
              <span class="text-xl font-bold text-[#003366]">{{ blogs.length }}</span>
            </div>
            <div class="flex justify-between items-center p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span class="text-xs text-slate-500 font-bold">Scientific papers</span>
              <span class="text-xl font-bold text-slate-800">{{ blogs.filter(b => b.category === 'Paper').length }}</span>
            </div>
            <div class="flex justify-between items-center p-3 lg:p-4 bg-slate-50 rounded-xl border border-slate-100 opacity-50">
              <span class="text-xs text-slate-500 font-bold">Drafts pending</span>
              <span class="text-xl font-bold text-slate-800">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmModal
      v-model="showDeleteModal"
      title="Delete Publication"
      :message="`Are you sure you want to delete '${selectedBlog?.title || 'this publication'}'? This action is permanent and cannot be reversed.`"
      confirm-text="Delete"
      variant="danger"
      @confirm="handleDelete"
    />

    <!-- Slide Over for Create/Edit -->
    <SlideOver
      v-model="showSlideOver"
      :title="isEditing ? 'Edit Publication' : 'New Publication'"
      :subtitle="isEditing ? 'Update existing publication details' : 'Create a new journal article or news post'"
      size="xl"
    >
      <div class="space-y-6">
        <AnimatedInput v-model="formData.title" label="Publication Title" />
        <SelectInput v-model="formData.category" label="Category" :options="['Journal article', 'News', 'Paper', 'Research']" />
        <AnimatedInput v-model="formData.excerpt" label="Short Excerpt" type="textarea" :rows="2" />
        <AnimatedInput v-model="formData.content" label="Full Content" type="textarea" :rows="6" />
        <ImageUpload v-model="formData.image" label="Cover Image" />
        <AnimatedInput v-model="formData.author" label="Author Name" />
      </div>

      <template #footer>
        <div class="flex gap-3 justify-end w-full">
          <button @click="showSlideOver = false" class="px-5 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
          <button @click="savePost" :disabled="saving" class="px-5 py-2.5 text-sm font-bold text-white bg-[#003366] hover:bg-[#002855] rounded-xl transition-all flex items-center gap-2">
            <LucideLoader2 v-if="saving" class="w-4 h-4 animate-spin" />
            <LucideSave v-else class="w-4 h-4" />
            Save Publication
          </button>
        </div>
      </template>
    </SlideOver>
  </div>
</template>

<script setup>
import { LucidePlus, LucideEdit, LucideEye, LucideTrash, LucideDownload, LucideUpload, LucideLoader2, LucideActivity, LucideFileSpreadsheet, LucideSave, LucideFileText } from 'lucide-vue-next'

import ConfirmModal from '@/components/core/ConfirmModal.vue'
import Loader from '@/components/core/Loader.vue'
import EmptyState from '@/components/core/EmptyState.vue'
import SlideOver from '@/components/core/SlideOver.vue'
import AnimatedInput from '@/components/AnimatedInput.vue'
import SelectInput from '@/components/SelectInput.vue'
import ImageUpload from '@/components/core/ImageUpload.vue'
import { useGetBlogs } from '@/composables/modules/blogs/useGetBlogs'
import { onMounted, ref, reactive } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { loading, blogs, getBlogs } = useGetBlogs()
const { showToast } = useCustomToast()
const api = useApi()
const importing = ref(false)
const fileInput = ref(null)
const showDeleteModal = ref(false)
const selectedBlog = ref(null)

const showSlideOver = ref(false)
const isEditing = ref(false)
const saving = ref(false)
const formData = reactive({
  title: '',
  category: 'Journal article',
  excerpt: '',
  content: '',
  image: '',
  author: ''
})

const openSlideOver = (blog = null) => {
  if (blog && blog._id) {
    isEditing.value = true
    selectedBlog.value = blog
    formData.title = blog.title || ''
    formData.category = blog.category || 'Journal article'
    formData.excerpt = blog.excerpt || ''
    formData.content = blog.content || ''
    formData.image = blog.image || ''
    formData.author = blog.author || ''
  } else {
    isEditing.value = false
    selectedBlog.value = null
    formData.title = ''
    formData.category = 'Journal article'
    formData.excerpt = ''
    formData.content = ''
    formData.image = ''
    formData.author = ''
  }
  showSlideOver.value = true
}

const savePost = async () => {
  saving.value = true
  try {
    if (isEditing.value) {
      await api.blogs.update(selectedBlog.value._id, formData)
      showToast({ title: 'Success', message: 'Publication updated successfully.', toastType: 'success' })
    } else {
      await api.blogs.create(formData)
      showToast({ title: 'Success', message: 'Publication created successfully.', toastType: 'success' })
    }
    showSlideOver.value = false
    getBlogs()
  } catch (err) {
    showToast({ title: 'Error', message: err.message || 'Failed to save publication.', toastType: 'error' })
  } finally {
    saving.value = false
  }
}

const confirmDelete = (blog) => {
  selectedBlog.value = blog
  showDeleteModal.value = true
}

const handleDelete = async () => {
  try {
    await api.blogs.delete(selectedBlog.value._id)
    showToast({ title: 'Deleted', message: 'Publication deleted successfully.', toastType: 'success' })
    getBlogs()
  } catch (err) {
    showToast({ title: 'Error', message: err.message || 'Failed to delete publication.', toastType: 'error' })
  } finally {
    showDeleteModal.value = false
    selectedBlog.value = null
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const triggerExport = () => {
  api.blogs.export()
}

const triggerDownloadTemplate = () => {
  api.blogs.downloadTemplate()
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  importing.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const { data, error } = await api.blogs.import(formData)
    if (error) throw new Error(error.message || 'Import failed')

    showToast({ title: 'Import Successful', message: 'Blog posts imported successfully.', toastType: 'success' })
    getBlogs()
  } catch (err) {
    showToast({ title: 'Import Error', message: err.message || 'An error occurred during import', toastType: 'error' })
  } finally {
    importing.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  getBlogs()
})
</script>
