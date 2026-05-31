<template>
  <div class="flex flex-col items-center justify-center py-24 gap-4">
    <LucideLoader2 class="animate-spin text-[#003366]" :size="40" stroke-width="2" />
    <p v-if="message" class="text-sm font-bold text-slate-500">{{ message }}</p>
  </div>
</template>

<script setup>
import { LucideLoader2 } from 'lucide-vue-next'

defineProps({
  message: {
    type: String,
    default: 'Loading data...'
  }
})
</script>
