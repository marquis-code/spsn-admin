<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-accent">Dynamic Form Builder</h2>
        <p class="text-sm text-gray-400">Create custom forms for membership, congresses or surveys.</p>
      </div>
      <button class="btn-primary px-6 font-bold flex items-center gap-2">
         <LucidePlus :size="18" /> Create New Form
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Existing Forms -->
      <div class="lg:col-span-2 space-y-4">
        <div v-for="form in forms" :key="form._id" class="admin-card border-l-4 border-primary group hover:bg-slate-50 transition-all cursor-pointer">
           <div class="flex justify-between items-start mb-4">
              <div>
                <h4 class="font-bold text-accent">{{ form.title }}</h4>
                <p class="text-[10px] text-gray-400 font-semibold">{{ form.fields?.length || 0 }} Fields • Created {{ formatDate(form.createdAt) }}</p>
              </div>
              <div class="flex gap-2">
                 <button class="p-2 text-accent-light hover:text-primary"><LucideEdit :size="16" /></button>
                 <button class="p-2 text-accent-light hover:text-primary"><LucideCopy :size="16" /></button>
                 <button class="p-2 text-accent-light hover:text-red-500"><LucideTrash :size="16" /></button>
              </div>
           </div>
           
           <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="flex -space-x-2">
                   <div v-for="j in 3" :key="j" class="w-6 h-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[8px] font-bold">U</div>
                </div>
                <span class="text-[10px] font-bold text-primary">{{ form.submissionsCount || 0 }} Submissions</span>
              </div>
              <NuxtLink :to="`/forms-data?id=${form._id}`" class="text-xs font-bold text-accent hover:underline">View Results →</NuxtLink>
           </div>
        </div>
        <div v-if="forms.length === 0" class="admin-card text-center py-10 text-gray-400">No forms found.</div>
      </div>

      <!-- Quick Template -->
      <div class="admin-card bg-brand-blue text-white">
         <h4 class="font-bold mb-6 italic underline decoration-primary decoration-4">Quick Templates</h4>
         <div class="space-y-3">
            <button v-for="t in templates" :key="t" class="w-full p-4 bg-white/10 hover:bg-white/20 rounded-xl text-left transition-all border border-white/10">
               <p class="text-xs font-bold">{{ t }}</p>
               <p class="text-[10px] text-gray-300 mt-1">Pre-built specialized fields</p>
            </button>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucidePlus, LucideEdit, LucideTrash, LucideCopy } from 'lucide-vue-next'
import { useGetForms } from '@/composables/modules/forms/useGetForms'
import { onMounted } from 'vue'

const { loading, forms, getForms } = useGetForms()

const templates = [
  'Membership Registration',
  'Event Feedback Survey',
  'Research Abstract Portal',
  'Volunteer Sign-up'
]

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  getForms()
})
</script>
