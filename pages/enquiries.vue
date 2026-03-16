<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-accent">General Enquiries</h2>
        <p class="text-sm text-gray-400">Manage support tickets and guest inquiries from the website.</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Enquiry List -->
      <div class="lg:col-span-2 space-y-4">
        <div v-for="enquiry in enquiries" :key="enquiry._id" class="admin-card group hover:border-primary transition-all cursor-pointer">
           <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-3">
                 <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-accent font-bold">
                    {{ getInitials(enquiry.name) }}
                 </div>
                 <div>
                    <h4 class="font-bold text-sm text-accent">{{ enquiry.name }}</h4>
                    <p class="text-[10px] text-gray-400 font-semibold">{{ formatDate(enquiry.createdAt) }}</p>
                 </div>
              </div>
              <span :class="['px-2 py-0.5 rounded-full text-[9px] font-bold uppercase', enquiry.status === 'new' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-gray-500']">
                 {{ enquiry.status || 'New' }}
              </span>
           </div>
           <h5 class="text-xs font-bold text-accent-light mb-2">Subject: {{ enquiry.subject }}</h5>
           <p class="text-[11px] text-gray-400 line-clamp-2 italic mb-4">"{{ enquiry.message }}"</p>
           
           <div class="flex items-center gap-4 pt-4 border-t border-slate-50">
              <button class="text-[10px] font-bold text-primary flex items-center gap-1"><LucideReply :size="12" /> Reply</button>
              <button class="text-[10px] font-bold text-gray-400 flex items-center gap-1"><LucideArchive :size="12" /> Archive</button>
           </div>
        </div>
        <div v-if="enquiries.length === 0" class="admin-card text-center py-10 text-gray-400">No enquiries found.</div>
      </div>

      <!-- Quick Actions -->
      <div class="space-y-6">
         <div class="admin-card">
            <h3 class="font-bold text-sm text-accent mb-4">Response Templates</h3>
            <div class="space-y-2">
               <button v-for="t in templates" :key="t" class="w-full p-3 text-left text-[10px] font-bold text-gray-500 hover:bg-slate-50 rounded-lg border transition-all">
                  {{ t }}
               </button>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { LucideReply, LucideArchive } from 'lucide-vue-next'
import { useGetEnquiries } from '@/composables/modules/enquiries/useGetEnquiries'
import { onMounted } from 'vue'

const { loading, enquiries, getEnquiries } = useGetEnquiries()

const templates = [
  'Membership Information Request',
  'Congress Registration Help',
  'Abstract Submission Guidelines',
  'Payment Issue Resolution'
]

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  getEnquiries()
})
</script>
