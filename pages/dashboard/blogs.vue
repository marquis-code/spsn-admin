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
        <button class="bg-[#003366] hover:bg-[#004080] text-white px-4 sm:px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm">
          <LucidePlus :size="14" />
          <span class="hidden xs:inline">New post</span>
        </button>
      </div>
      <input type="file" ref="fileInput" accept=".xlsx, .xls, .csv" class="hidden" @change="handleFileUpload" />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-24">
      <div class="animate-spin rounded-xl h-10 w-10 border-t-2 border-[#003366]"></div>
    </div>

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
              <button class="text-[#003366] flex items-center gap-1.5 hover:underline"><LucideEdit :size="14" /> Edit</button>
              <button class="text-slate-400 flex items-center gap-1.5 hover:text-slate-600 transition-colors"><LucideEye :size="14" /> Preview</button>
              <button @click="confirmDelete(blog)" class="text-rose-500 flex items-center gap-1.5 hover:text-rose-600 transition-colors sm:ml-auto"><LucideTrash :size="14" /> Delete</button>
            </div>
          </div>
        </div>
        <div v-if="blogs.length === 0" class="py-20 bg-white border border-slate-200 border-dashed rounded-3xl text-center text-slate-400 font-medium italic text-sm">No news articles or publications were found.</div>
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
  </div>
</template>

<script setup>
import { LucidePlus, LucideEdit, LucideEye, LucideTrash, LucideDownload, LucideUpload, LucideLoader2, LucideActivity, LucideFileSpreadsheet } from 'lucide-vue-next'

import ConfirmModal from '@/components/core/ConfirmModal.vue'
import { useGetBlogs } from '@/composables/modules/blogs/useGetBlogs'
import { onMounted, ref } from 'vue'

const { loading, blogs, getBlogs } = useGetBlogs()
const api = useApi()
const importing = ref(false)
const fileInput = ref(null)
const showDeleteModal = ref(false)
const selectedBlog = ref(null)

const confirmDelete = (blog) => {
  selectedBlog.value = blog
  showDeleteModal.value = true
}

const handleDelete = () => {
  // TODO: Call API to delete blog
  showDeleteModal.value = false
  selectedBlog.value = null
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

    alert(`Success: Blog posts imported successfully.`)
    getBlogs()
  } catch (err) {
    alert(err.message || 'An error occurred during import')
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
