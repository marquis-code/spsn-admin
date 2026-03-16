<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue: string
  label: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const showPassword = ref(false)
const error = ref('')

const handleInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)
  validatePassword(value)
}

const validatePassword = (value: string) => {
  if (!value) {
    error.value = ''
    return
  }
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  error.value = regex.test(value) ? '' : 'Password must be at least 8 characters long with at least one number, special character, uppercase and lowercase letter'
}
</script>

<template>
  <div class="relative mb-2">
    <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ label }}</label>
    <div class="relative">
      <input
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        class="w-full py-3.5 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#033958] focus:border-[#033958] transition-all duration-300"
        @input="handleInput"
      />
      <button
        type="button"
        class="absolute inset-y-0 right-0 pr-3 flex items-center"
        @click="showPassword = !showPassword"
      >
        <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.888 9.888L3 3m18 18l-6.888-6.888" />
        </svg>
      </button>
    </div>
    <div v-if="error" class="text-red-500 text-xs mt-1 ml-1">{{ error }}</div>
  </div>
</template>