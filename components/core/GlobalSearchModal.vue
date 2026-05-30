<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div v-if="modelValue" class="fixed inset-0 z-[9999] flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" @click="close"></div>
      
      <div class="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[80vh]">
        <!-- Search Input Header -->
        <div class="flex items-center gap-4 px-6 py-5 border-b border-slate-100 bg-white z-10 shrink-0">
          <LucideSearch :size="20" class="text-[#003366]" />
          <input 
            ref="searchInput"
            v-model="query"
            type="text" 
            placeholder="Search members, transactions, or system settings..." 
            class="flex-1 bg-transparent border-none focus:ring-0 text-[15px] font-bold text-slate-800 placeholder:text-slate-300 p-0"
            @keydown.esc="close"
          />
          <button @click="close" class="p-1 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"><LucideX :size="18" /></button>
        </div>

        <!-- Search Results / Empty State -->
        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-50/50">
          <div v-if="query.length === 0" class="py-10 text-center">
             <LucideSearch :size="32" class="text-slate-200 mx-auto mb-4" />
             <h4 class="text-[13px] font-bold text-slate-800">Global Command Center</h4>
             <p class="text-[11px] text-slate-400 font-bold mt-1">Start typing to search across the entire registry.</p>
             
             <div class="mt-8 max-w-sm mx-auto text-left">
                <h5 class="text-[10px] font-bold text-slate-400  mb-3">Quick Navigation</h5>
                <div class="space-y-1">
                   <button @click="navigate('/dashboard/members')" class="w-full flex items-center gap-3 p-3 hover:bg-white rounded-xl text-slate-600 hover:text-[#003366] transition-all font-bold text-xs border border-transparent hover:border-slate-100 hover:shadow-sm">
                      <LucideUsers :size="16" class="text-slate-400" /> Member Directory
                   </button>
                   <button @click="navigate('/dashboard/payments')" class="w-full flex items-center gap-3 p-3 hover:bg-white rounded-xl text-slate-600 hover:text-[#003366] transition-all font-bold text-xs border border-transparent hover:border-slate-100 hover:shadow-sm">
                      <LucideCreditCard :size="16" class="text-slate-400" /> Financial Ledger
                   </button>
                   <button @click="navigate('/dashboard/settings')" class="w-full flex items-center gap-3 p-3 hover:bg-white rounded-xl text-slate-600 hover:text-[#003366] transition-all font-bold text-xs border border-transparent hover:border-slate-100 hover:shadow-sm">
                      <LucideSettings :size="16" class="text-slate-400" /> System Preferences
                   </button>
                </div>
             </div>
          </div>
          <div v-else-if="filteredResults.length > 0" class="space-y-1">
            <h5 class="text-[10px] font-bold text-slate-400  mb-3 px-3 mt-2">Search Results</h5>
            <button 
              v-for="res in filteredResults" 
              :key="res.id"
              @click="navigate(res.to)"
              class="w-full flex items-center justify-between p-4 bg-white hover:bg-[#003366]/5 rounded-2xl text-left transition-all border border-slate-100 hover:border-[#003366]/20 group"
            >
              <div class="flex items-center gap-4">
                 <div class="w-10 h-10 bg-slate-50 group-hover:bg-white rounded-xl flex items-center justify-center border border-slate-100 group-hover:border-[#003366]/10 text-slate-400 group-hover:text-[#003366] transition-colors">
                    <component :is="res.icon" :size="18" />
                 </div>
                 <div>
                    <h6 class="text-[13px] font-bold text-slate-800 group-hover:text-[#003366] transition-colors">{{ res.title }}</h6>
                    <p class="text-[10px] font-bold text-slate-400 truncate max-w-sm">{{ res.description }}</p>
                 </div>
              </div>
              <LucideArrowRight :size="16" class="text-slate-300 group-hover:text-[#003366] transition-colors" />
            </button>
          </div>
          <div v-else class="py-16 text-center">
             <LucideSearchX :size="32" class="text-slate-200 mx-auto mb-4" />
             <h4 class="text-[13px] font-bold text-slate-800">No results found</h4>
             <p class="text-[11px] text-slate-400 font-bold mt-1">We couldn't find anything matching "{{ query }}".</p>
          </div>
        </div>
        
        <div class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
           <span class="text-[9px] font-bold text-slate-400  flex items-center gap-2"><LucideCommand :size="10" /> SCPSN Global Search</span>
           <span class="text-[9px] font-bold text-slate-400">Press Esc to close</span>
        </div>
      </div>
    </div>
  </Transition>
</Teleport>
</ClientOnly>
</template>

<script setup>

import { ref, watch, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const searchInput = ref(null)
const query = ref('')

const close = () => {
  emit('update:modelValue', false)
  query.value = ''
}

const navigate = (path) => {
  close()
  router.push(path)
}

watch(() => props.modelValue, (val) => {
  if (val) {
    nextTick(() => {
      if (searchInput.value) searchInput.value.focus()
    })
  } else {
    query.value = ''
  }
})

// Mock global search data
const searchableItems = [
  { id: 1, title: 'Manage Member Directory', description: 'View, filter and update all registered members.', to: '/dashboard/members', icon: 'LucideUsers' },
  { id: 2, title: 'Pending Enrollments', description: 'Verify new member applications.', to: '/dashboard/enrollments', icon: 'LucideShieldCheck' },
  { id: 3, title: 'Financial Ledger', description: 'Audit all incoming transaction logs and dues.', to: '/dashboard/payments', icon: 'LucideCreditCard' },
  { id: 4, title: 'Live Support Nexus', description: 'Respond to incoming member chat transmissions.', to: '/dashboard/chat', icon: 'LucideMessageCircle' },
  { id: 5, title: 'Publications & News', description: 'Draft or edit scientific articles.', to: '/dashboard/blogs', icon: 'LucideFileText' },
  { id: 6, title: 'Global System Settings', description: 'Update institutional preferences and platform config.', to: '/dashboard/settings', icon: 'LucideSettings' }
]

const filteredResults = computed(() => {
  const q = query.value.toLowerCase()
  if (!q) return []
  return searchableItems.filter(item => 
    item.title.toLowerCase().includes(q) || 
    item.description.toLowerCase().includes(q)
  )
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.12); }
</style>
