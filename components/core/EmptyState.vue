<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div class="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
      <component :is="icon" :size="32" stroke-width="1.5" />
    </div>
    <h3 class="text-[14px] font-bold text-slate-800 mb-2">{{ title }}</h3>
    <p class="text-[12px] text-slate-400 font-bold max-w-xs leading-relaxed opacity-60">{{ message }}</p>
    <slot name="action" />
  </div>
</template>

<script setup>
import { LucideInbox } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    default: 'No records found'
  },
  message: {
    type: String,
    default: 'The system has no data to display in this category at the moment.'
  },
  icon: {
    type: Object,
    default: LucideInbox
  }
})
</script>
