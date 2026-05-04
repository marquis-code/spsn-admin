<template>
  <ClientOnly>
    <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-[9999] flex items-center justify-end" @click.self="close">
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="close"></div>
        
        <Transition
          enter-active-class="transition duration-300 ease-out transform"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition duration-200 ease-in transform"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div v-if="modelValue" :class="['relative h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 w-full sm:max-w-md', sizeClass]">
            <!-- Header -->
            <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div>
                <h3 class="font-black text-slate-800 text-lg">{{ title }}</h3>
                <p v-if="subtitle" class="text-xs text-slate-500 font-medium mt-1">{{ subtitle }}</p>
              </div>
              <button @click="close" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all shadow-sm">
                <LucideX :size="20" />
              </button>
            </div>

            <!-- Content Slot -->
            <div class="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              <slot></slot>
            </div>

            <!-- Footer Slot -->
            <div v-if="$slots.footer" class="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 mt-auto">
              <slot name="footer"></slot>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import { LucideX } from 'lucide-vue-next'
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  size: { type: String, default: 'md' } // sm, md, lg, xl, full
})

const emit = defineEmits(['update:modelValue', 'close'])

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm': return 'sm:max-w-sm'
    case 'lg': return 'sm:max-w-lg'
    case 'xl': return 'sm:max-w-2xl'
    case 'full': return 'sm:max-w-full'
    case 'md':
    default: return 'sm:max-w-md'
  }
})
</script>
