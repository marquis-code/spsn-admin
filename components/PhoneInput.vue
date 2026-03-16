<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const countries = [
  { name: 'Nigeria', dialCode: '234', code: 'NG', flag: '🇳🇬' },
  { name: 'United States', dialCode: '1', code: 'US', flag: '🇺🇸' },
  { name: 'United Kingdom', dialCode: '44', code: 'GB', flag: '🇬🇧' },
  { name: 'Ghana', dialCode: '233', code: 'GH', flag: '🇬🇭' },
  { name: 'Kenya', dialCode: '254', code: 'KE', flag: '🇰🇪' },
]

const selectedCountry = ref(countries[0])
const phoneNumber = ref('')
const error = ref('')

watch(() => props.modelValue, (newVal) => {
  if (!newVal) {
    phoneNumber.value = ''
    return
  }
  // Try to parse country code from newVal if it's there, but for simplicity:
  if (!phoneNumber.value) {
    // Basic extraction - this is a simplification
    const match = countries.find(c => newVal.startsWith(`+${c.dialCode}`))
    if (match) {
      selectedCountry.value = match
      phoneNumber.value = newVal.replace(`+${match.dialCode}`, '')
    } else {
      phoneNumber.value = newVal
    }
  }
}, { immediate: true })

const updateValue = () => {
  const fullNumber = `+${selectedCountry.value.dialCode}${phoneNumber.value}`
  emit('update:modelValue', fullNumber)
  validatePhone()
}

const validatePhone = () => {
  if (!phoneNumber.value) {
    error.value = ''
    return
  }
  const regex = /^\d{7,15}$/
  error.value = regex.test(phoneNumber.value) ? '' : 'Please enter a valid phone number'
}
</script>

<template>
  <div class="relative mb-2">
    <label class="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
    <div class="flex gap-2">
      <select 
        v-model="selectedCountry"
        @change="updateValue"
        class="w-32 py-3.5 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#033958] focus:border-[#033958]"
      >
        <option 
          v-for="country in countries" 
          :key="country.code"
          :value="country"
        >
          {{ country.flag }} +{{ country.dialCode }}
        </option>
      </select>
      <input
        v-model="phoneNumber"
        type="tel"
        class="flex-1 py-3.5 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#033958] focus:border-[#033958] transition-all duration-300"
        @input="updateValue"
      />
    </div>
    <span v-if="error" class="text-red-500 text-xs mt-1 ml-1">{{ error }}</span>
  </div>
</template>