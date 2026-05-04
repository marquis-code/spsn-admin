<template>
  <div class="flex flex-col items-center justify-center py-24 gap-4">
    <div class="animate-spin rounded-full h-10 w-10 border-2 border-slate-100 border-t-[#003366]"></div>
    <p v-if="message" class="text-[11px] font-bold text-slate-400">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading data...'
  }
})
</script>
