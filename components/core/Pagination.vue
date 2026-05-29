<template>
  <div class="flex items-center justify-between border-t border-slate-100 bg-white px-4 py-3 sm:px-6 rounded-b-2xl mt-4">
    <div class="flex flex-1 justify-between sm:hidden">
      <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Previous</button>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Next</button>
    </div>
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-slate-700 font-medium">
          Showing <span class="font-bold text-[#003366]">{{ totalItems > 0 ? startIndex + 1 : 0 }}</span> to <span class="font-bold text-[#003366]">{{ Math.min(endIndex, totalItems) }}</span> of <span class="font-bold text-[#003366]">{{ totalItems }}</span> results
        </p>
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button @click="prevPage" :disabled="currentPage === 1" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
            <span class="sr-only">Previous</span>
            <LucideChevronLeft class="h-5 w-5" aria-hidden="true" />
          </button>
          
          <button 
            v-for="page in displayedPages" 
            :key="page"
            @click="goToPage(page)"
            :class="[
              page === currentPage ? 'relative z-10 inline-flex items-center bg-[#003366] px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003366]' : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0'
            ]"
          >
            {{ page }}
          </button>
          
          <button @click="nextPage" :disabled="currentPage === totalPages" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50">
            <span class="sr-only">Next</span>
            <LucideChevronRight class="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { LucideChevronLeft, LucideChevronRight } from 'lucide-vue-next'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalItems: { type: Number, required: true },
  pageSize: { type: Number, default: 10 }
})

const emit = defineEmits(['update:currentPage'])

const totalPages = computed(() => Math.ceil(props.totalItems / props.pageSize) || 1)
const startIndex = computed(() => (props.currentPage - 1) * props.pageSize)
const endIndex = computed(() => startIndex.value + props.pageSize)

const displayedPages = computed(() => {
  const pages = []
  const maxDisplayed = 5
  
  if (totalPages.value <= maxDisplayed) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    if (props.currentPage <= 3) {
      for (let i = 1; i <= maxDisplayed; i++) pages.push(i)
    } else if (props.currentPage >= totalPages.value - 2) {
      for (let i = totalPages.value - 4; i <= totalPages.value; i++) pages.push(i)
    } else {
      for (let i = props.currentPage - 2; i <= props.currentPage + 2; i++) pages.push(i)
    }
  }
  return pages
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    emit('update:currentPage', page)
  }
}

const prevPage = () => goToPage(props.currentPage - 1)
const nextPage = () => goToPage(props.currentPage + 1)
</script>
