<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-accent">Conference Management</h2>
        <p class="text-sm text-gray-400">Schedule and manage association conferences and seminars.</p>
      </div>
      <button class="btn-primary px-6 font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
        <LucidePlus :size="18" /> Create New Conference
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-16">
      <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="conf in conferences" :key="conf._id" class="admin-card overflow-hidden group">
        <div class="h-40 -mx-6 -mt-6 mb-6 overflow-hidden relative">
          <img :src="conf.image || 'https://scpsn.org.ng/wp-content/uploads/2021/10/banner.jpg'" class="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
          <div class="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full uppercase">{{ conf.status || 'Open' }}</div>
        </div>
        <h4 class="font-bold text-accent text-lg mb-2">{{ conf.title }}</h4>
        <div class="space-y-3 mb-6">
           <div class="flex items-center gap-2 text-xs text-gray-500 font-semibold">
              <LucideCalendar :size="14" class="text-primary" />
              {{ conf.date || 'TBD' }}
           </div>
           <div class="flex items-center gap-2 text-xs text-gray-500 font-semibold">
              <LucideMapPin :size="14" class="text-primary" />
              {{ conf.location || 'TBD' }}
           </div>
           <div class="flex items-center gap-2 text-xs text-gray-500 font-semibold">
              <LucideUsers :size="14" class="text-primary" />
              {{ conf.registeredCount || 0 }} Registered
           </div>
        </div>
        
        <div class="pt-4 border-t flex justify-between items-center">
           <div class="flex gap-4">
              <button class="text-xs font-bold text-primary hover:underline">Edit</button>
              <button class="text-xs font-bold text-accent-light hover:underline">Abstracts</button>
           </div>
           <button class="text-xs font-bold text-red-400 hover:underline">Archive</button>
        </div>
      </div>
      <div v-if="conferences.length === 0" class="col-span-full admin-card text-center py-10 text-gray-400">No conferences found.</div>
    </div>
  </div>
</template>

<script setup>
import { LucidePlus, LucideCalendar, LucideMapPin, LucideUsers } from 'lucide-vue-next'
import { useGetConferences } from '@/composables/modules/conferences/useGetConferences'
import { onMounted } from 'vue'

const { loading, conferences, getConferences } = useGetConferences()

onMounted(() => {
  getConferences()
})
</script>
