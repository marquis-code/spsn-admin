<template>
  <div class="space-y-2 relative">
    <label v-if="label" class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">{{ label }}</label>
    <div class="relative group">
      <Icon name="lucide:map-pin" size="18" class="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#033958] transition-colors" />
      <input 
        ref="autocompleteInput"
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        :placeholder="placeholder" 
        :required="required"
        class="w-full pl-12 pr-5 py-4 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-900 focus:ring-2 focus:ring-[#033958] outline-none transition-all" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
declare const google: any

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Enter address...'
  },
  required: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'place-changed'])
const autocompleteInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  if (typeof google === 'undefined') return
  
  if (autocompleteInput.value) {
    const autocomplete = new google.maps.places.Autocomplete(autocompleteInput.value, {
      componentRestrictions: { country: 'NG' },
      fields: ['address_components', 'geometry', 'formatted_address'],
    })

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace()
      if (!place.geometry || !place.geometry.location) return

      const addressData = {
        address: place.formatted_address || '',
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        city: '',
        state: ''
      }

      // Parse city/state
      place.address_components?.forEach((comp: any) => {
        if (comp.types.includes('locality')) addressData.city = comp.long_name
        if (comp.types.includes('administrative_area_level_1')) addressData.state = comp.long_name
      })

      emit('update:modelValue', addressData.address)
      emit('place-changed', addressData)
    })
  }
})
</script>
