<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-[9999] flex justify-end">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" @click="close"></div>
    
    <!-- Side Drawer -->
    <div class="bg-white shadow-2xl w-full md:w-1/2 h-full flex flex-col relative z-10 animate-in slide-in-from-right duration-300">
      
      <!-- Header -->
      <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
        <div>
          <h3 class="text-xl font-bold text-slate-800">Abstract Review</h3>
          <p class="text-[11px] text-slate-400 font-bold mt-1">ID: {{ abstract?._id || 'N/A' }}</p>
        </div>
        <div class="flex items-center gap-3">
           <span :class="['badge-premium text-[10px] px-3 py-1', getStatusClass(abstract?.status)]">
             {{ abstract?.status || 'Pending' }}
           </span>
           <button @click="close" class="p-2 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl transition-all shadow-sm">
             <LucideX :size="18" />
           </button>
        </div>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div class="flex flex-col gap-10">
          
          <!-- Details Section -->
          <div class="space-y-8">
            <div class="space-y-6">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Author Information</h4>
              
              <div class="space-y-4">
                 <div>
                   <p class="text-[10px] text-slate-400 font-bold mb-1">Lead Investigator</p>
                   <p class="text-sm font-bold text-slate-800">{{ abstract?.primaryAuthor || 'N/A' }}</p>
                 </div>
                 <div>
                   <p class="text-[10px] text-slate-400 font-bold mb-1">Email Address</p>
                   <p class="text-sm font-bold text-[#003366]">{{ abstract?.email || 'N/A' }}</p>
                 </div>
                 <div>
                   <p class="text-[10px] text-slate-400 font-bold mb-1">Affiliation / Institution</p>
                   <p class="text-sm font-medium text-slate-600 leading-relaxed">{{ abstract?.affiliation || 'N/A' }}</p>
                 </div>
              </div>
            </div>

            <div class="space-y-6">
              <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Submission Details</h4>
              
              <div class="space-y-4">
                 <div>
                   <p class="text-[10px] text-slate-400 font-bold mb-1">Target Conference</p>
                   <p class="text-xs font-bold text-slate-800">{{ abstract?.conference || 'N/A' }}</p>
                 </div>
                 <div>
                   <p class="text-[10px] text-slate-400 font-bold mb-1">Submitted On</p>
                   <p class="text-xs font-bold text-slate-800">{{ formatDate(abstract?.createdAt) }}</p>
                 </div>
                 <div v-if="abstract?.keywords && abstract.keywords.length">
                   <p class="text-[10px] text-slate-400 font-bold mb-2">Keywords</p>
                   <div class="flex flex-wrap gap-2">
                     <span v-for="kw in abstract.keywords" :key="kw" class="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold border border-slate-200">
                       {{ kw }}
                     </span>
                   </div>
                 </div>
              </div>
            </div>
          </div>

          <!-- Abstract Body Section -->
          <div class="space-y-6 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100">
             <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Scientific Title</h4>
             <h2 class="text-xl sm:text-2xl font-black text-slate-800 leading-tight mb-8">{{ abstract?.title || 'No Title Provided' }}</h2>

             <h4 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Abstract Content</h4>
             
             <div v-if="abstract?.fileUrl" class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
                      <LucideFileText :size="24" />
                   </div>
                   <div>
                      <h4 class="font-bold text-sm text-slate-800">Attached Document</h4>
                      <p class="text-[11px] text-slate-500 font-medium">Click to view or download</p>
                   </div>
                </div>
                <a :href="abstract.fileUrl" target="_blank" class="px-4 py-2 bg-slate-50 hover:bg-indigo-50 text-indigo-600 font-bold text-xs rounded-lg transition-colors border border-slate-200">
                   Download
                </a>
             </div>

             <div v-else class="prose prose-sm prose-slate max-w-none text-slate-600 leading-loose whitespace-pre-wrap">
               {{ abstract?.abstractBody || abstract?.content || 'No abstract content provided.' }}
             </div>
             
             <div v-if="!abstract?.fileUrl" class="flex justify-end pt-4 mt-8 border-t border-slate-200 border-dashed">
                <span class="text-[10px] font-bold text-slate-400">Word Count: {{ getWordCount(abstract?.abstractBody || abstract?.content) }}</span>
             </div>
          </div>

        </div>
      </div>

      <!-- Footer Actions -->
      <div class="px-8 py-5 border-t border-slate-100 bg-white flex justify-between items-center shrink-0">
         <button @click="close" class="px-5 py-2.5 text-slate-500 hover:bg-slate-50 font-bold text-xs rounded-xl transition-all">
            Close
         </button>
         
         <div class="flex items-center gap-3">
            <button @click="updateStatus('rejected')" :disabled="loading" class="px-6 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-xl transition-all border border-rose-100">
               Decline
            </button>
            <button @click="updateStatus('accepted')" :disabled="loading" class="btn-premium px-8">
               <LucideLoader2 v-if="loading" class="w-4 h-4 animate-spin mr-2" />
               <LucideCheckCircle v-else class="w-4 h-4 mr-2" />
               Accept Abstract
            </button>
         </div>
      </div>

    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { LucideX, LucideCheckCircle, LucideLoader2, LucideFileText } from 'lucide-vue-next'
import { ref } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { abstracts_api } from '@/api_factory/modules/abstracts'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  abstract: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'status-updated'])
const { showToast } = useCustomToast()
const loading = ref(false)

const close = () => {
  emit('update:modelValue', false)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const d = new Date(dateString)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const getWordCount = (text) => {
  if (!text) return 0
  return text.trim().split(/\s+/).length
}

const getStatusClass = (status) => {
  switch (status) {
    case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100'
    case 'under_review': return 'bg-[#003366]/5 text-[#003366] border-[#003366]/10'
    case 'accepted': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    case 'rejected': return 'bg-rose-50 text-rose-600 border-rose-100'
    default: return 'bg-amber-50 text-amber-600 border-amber-100'
  }
}

const updateStatus = async (status) => {
  if (!props.abstract?._id) return
  loading.value = true
  try {
    await abstracts_api.update(props.abstract._id, { status })
    showToast({ title: 'Status Updated', message: `Abstract marked as ${status}.`, toastType: 'success' })
    props.abstract.status = status
    emit('status-updated', props.abstract)
    if (status === 'accepted') {
      close()
    }
  } catch (error) {
    showToast({ title: 'Error', message: 'Could not update abstract status.', toastType: 'error' })
  } finally {
    loading.value = false
  }
}
</script>
