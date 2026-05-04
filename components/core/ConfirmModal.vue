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
      <div v-if="modelValue" class="fixed inset-0 z-[9999] flex items-center justify-center p-4" @click.self="cancel">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

        <!-- Modal Card -->
        <Transition
          enter-active-class="transition duration-250 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div v-if="modelValue" class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 z-10">
            <!-- Header -->
            <div class="px-7 pt-7 pb-2">
              <div class="flex items-start gap-4">
                <div :class="[
                  'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm',
                  variant === 'danger' ? 'bg-rose-50 text-rose-500' : variant === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-[#003366]/10 text-[#003366]'
                ]">
                  <LucideAlertTriangle v-if="variant === 'danger' || variant === 'warning'" :size="22" />
                  <LucideShieldCheck v-else :size="22" />
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-lg font-bold text-slate-800 tracking-tight leading-tight">{{ title }}</h3>
                  <p class="text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">{{ message }}</p>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="px-7 pb-6 pt-5 flex items-center justify-end gap-3">
              <button
                @click="cancel"
                :disabled="loading"
                class="px-6 py-2.5 text-xs font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all disabled:opacity-50"
              >
                {{ cancelText }}
              </button>
              <button
                @click="confirm"
                :disabled="loading"
                :class="[
                  'px-6 py-2.5 text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 active:scale-95',
                  variant === 'danger' ? 'bg-rose-500 hover:bg-rose-600 text-white' : variant === 'warning' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-[#003366] hover:bg-[#004080] text-white'
                ]"
              >
                <div v-if="loading" class="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import { LucideAlertTriangle, LucideShieldCheck } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: 'Confirm action' },
  message: { type: String, default: 'Are you sure you want to proceed?' },
  confirmText: { type: String, default: 'Confirm' },
  cancelText: { type: String, default: 'Cancel' },
  variant: { type: String, default: 'default' }, // 'default' | 'danger' | 'warning'
  loading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const cancel = () => {
  if (props.loading) return
  emit('update:modelValue', false)
  emit('cancel')
}

const confirm = () => {
  emit('confirm')
}
</script>
