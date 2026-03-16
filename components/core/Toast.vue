<template>
  <TransitionGroup
    tag="div"
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
    class="fixed inset-0 flex flex-col items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[9999]"
  >
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden mb-3"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <LucideCheckCircle v-if="toast.type === 'success'" class="h-6 w-6 text-green-400" />
            <LucideXCircle v-else-if="toast.type === 'error'" class="h-6 w-6 text-red-400" />
            <LucideAlertCircle v-else-if="toast.type === 'warning'" class="h-6 w-6 text-yellow-400" />
            <LucideInfo v-else class="h-6 w-6 text-blue-400" />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">{{ toast.title }}</p>
            <p class="mt-1 text-sm text-gray-500">{{ toast.message }}</p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              @click="remove(toast.id)"
              class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <span class="sr-only">Close</span>
              <LucideX class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup>
import { ref } from 'vue'
import { LucideCheckCircle, LucideXCircle, LucideAlertCircle, LucideInfo, LucideX } from 'lucide-vue-next'

const toasts = ref([])
let nextId = 0

const showToast = (title, message, type = 'info', duration = 5000) => {
  const id = nextId++
  toasts.value.push({ id, title, message, type })

  if (duration > 0) {
    setTimeout(() => {
      remove(id)
    }, duration)
  }
}

const remove = (id) => {
  toasts.value = toasts.value.filter(t => t.id !== id)
}

defineExpose({
  showToast
})
</script>
