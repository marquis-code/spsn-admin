<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center px-1">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Custom Form Management</h2>
        <p class="text-sm text-slate-500 font-medium">Create and manage dynamic forms for membership, congresses, or surveys.</p>
      </div>
      <button class="bg-[#003366] hover:bg-[#004080] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm">
         <LucidePlus :size="18" /> 
         Create new form
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-24">
      <div class="animate-spin rounded-xl h-10 w-10 border-t-2 border-[#003366]"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Existing Forms List -->
      <div class="lg:col-span-8 space-y-4">
        <div v-for="form in forms" :key="form._id" class="admin-card border-l-4 border-[#003366] group hover:border-[#003366] transition-all duration-300">
           <div class="flex justify-between items-start mb-5">
              <div class="space-y-1">
                <h4 class="font-bold text-slate-800 text-lg group-hover:text-[#003366] transition-colors leading-tight">{{ form.title }}</h4>
                <p class="text-[11px] text-slate-400 font-bold italic">{{ form.fields?.length || 0 }} Defined fields <span class="mx-1.5 opacity-30">|</span> Created on {{ formatDate(form.createdAt) }}</p>
              </div>
              <div class="flex items-center gap-1.5">
                 <button class="p-2 text-slate-400 hover:text-[#003366] hover:bg-slate-50 rounded-lg transition-all" title="Edit structure"><LucideEdit :size="16" /></button>
                 <button class="p-2 text-slate-400 hover:text-[#003366] hover:bg-slate-50 rounded-lg transition-all" title="Duplicate form"><LucideCopy :size="16" /></button>
                 <div class="w-[1px] h-4 bg-slate-100 mx-1"></div>
                 <button class="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Delete form"><LucideTrash :size="16" /></button>
              </div>
           </div>
           
           <div class="flex items-center justify-between pt-4 border-t border-slate-50">
              <div class="flex items-center gap-4">
                <div class="flex -space-x-2">
                   <div v-for="j in 3" :key="j" class="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-[#003366] shadow-sm">U</div>
                </div>
                <span class="text-[11px] font-bold text-[#003366]">{{ form.submissionsCount || 0 }} Total responses</span>
              </div>
              <NuxtLink :to="`/forms-data?id=${form._id}`" class="text-xs font-bold text-slate-400 hover:text-[#003366] hover:underline transition-colors flex items-center gap-1">
                View submission data management 
                <LucideArrowRight :size="14" />
              </NuxtLink>
           </div>
        </div>
        
        <div v-if="forms.length === 0" class="py-20 bg-white border border-slate-200 border-dashed rounded-3xl text-center text-slate-400 font-medium italic text-sm">No custom forms have been created yet.</div>
      </div>

      <!-- Quick Templates Sidebar -->
      <div class="lg:col-span-4 space-y-8">
        <div class="admin-card p-6 bg-[#003366] text-white overflow-hidden relative shadow-lg">
           <div class="absolute -right-8 -bottom-8 opacity-10 transform -rotate-12">
             <LucideLayers :size="160" />
           </div>
           
           <h4 class="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
             <LucideFileStack :size="20" class="text-white/60" />
             Quick templates
           </h4>
           
           <div class="space-y-3 relative z-10">
              <button v-for="t in templates" :key="t" class="w-full p-4 bg-white/5 hover:bg-white/15 rounded-xl text-left transition-all border border-white/10 group">
                 <p class="text-xs font-bold text-white group-hover:translate-x-1 transition-transform">{{ t }}</p>
                 <p class="text-[10px] text-white/50 mt-1 font-medium tracking-wide">Ready-to-use professional fields</p>
              </button>
           </div>
           
           <div class="mt-8 pt-6 border-t border-white/10 relative z-10">
             <p class="text-[10px] text-white/40 font-bold text-center italic">SCPSN Administration System</p>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  LucidePlus, 
  LucideEdit, 
  LucideTrash, 
  LucideCopy, 
  LucideLayers, 
  LucideFileStack, 
  LucideArrowRight 
} from 'lucide-vue-next'
import { useGetForms } from '@/composables/modules/forms/useGetForms'
import { onMounted } from 'vue'

const { loading, forms, getForms } = useGetForms()

const templates = [
  'General Membership Registration',
  'Annual Congress Feedback',
  'Scientific Publication Request',
  'Administrative Support Ticket'
]

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  getForms()
})
</script>
