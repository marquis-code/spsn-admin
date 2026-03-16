<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-accent">Blog & Publication Manager</h2>
        <p class="text-sm text-gray-400">Manage association news, journals and research publications.</p>
      </div>
      <button class="btn-primary px-6 font-bold flex items-center gap-2">
        <LucidePlus :size="18" /> Create New Post
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Blog List -->
      <div class="lg:col-span-2 space-y-4">
        <div v-for="blog in blogs" :key="blog._id" class="admin-card flex gap-6 group hover:border-primary transition-all">
          <div class="w-32 h-24 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0 border">
             <img :src="blog.image || 'https://scpsn.org.ng/wp-content/uploads/2021/10/banner.jpg'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Blog" />
          </div>
          <div class="flex-grow">
            <div class="flex justify-between items-start mb-2">
              <span class="px-2 py-0.5 bg-brand-blue/10 text-brand-blue rounded-full text-[10px] font-bold uppercase">{{ blog.category || 'Article' }}</span>
              <span class="text-[10px] text-gray-400 font-semibold">{{ formatDate(blog.createdAt) }}</span>
            </div>
            <h4 class="font-bold text-accent mb-2">{{ blog.title }}</h4>
            <p class="text-xs text-gray-400 line-clamp-2 mb-4">{{ blog.excerpt || blog.content?.substring(0, 120) }}...</p>
            <div class="flex items-center gap-4 text-[10px] font-bold">
               <button class="text-primary flex items-center gap-1 hover:underline"><LucideEdit :size="12" /> Edit</button>
               <button class="text-gray-400 flex items-center gap-1 hover:underline"><LucideEye :size="12" /> Preview</button>
               <button class="text-red-400 flex items-center gap-1 hover:underline"><LucideTrash :size="12" /> Delete</button>
            </div>
          </div>
        </div>
        <div v-if="blogs.length === 0" class="admin-card text-center py-10 text-gray-400">No blog posts found.</div>
      </div>

      <!-- Categories & Stats -->
      <div class="space-y-6">
        <div class="admin-card">
          <h3 class="font-bold text-accent text-sm mb-4">Content Stats</h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-500">Published Posts</span>
              <span class="font-bold text-accent">{{ blogs.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucidePlus, LucideEdit, LucideEye, LucideTrash } from 'lucide-vue-next'
import { useGetBlogs } from '@/composables/modules/blogs/useGetBlogs'
import { onMounted } from 'vue'

const { loading, blogs, getBlogs } = useGetBlogs()

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  getBlogs()
})
</script>
