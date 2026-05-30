<template>
  <main class="min-h-screen bg-slate-50/50 p-6">
    <div class="max-w-6xl mx-auto space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Association Gallery</h1>
          <p class="text-base text-slate-500">Manage images displayed in the public association gallery.</p>
        </div>
        <button @click="openModal()" class="btn-primary flex items-center gap-2">
          <Icon name="lucide:plus" size="16" />
          Add Images
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-base text-left">
          <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-medium">Image</th>
              <th class="px-6 py-4 font-medium">Title & Category</th>
              <th class="px-6 py-4 font-medium">Order</th>
              <th class="px-6 py-4 font-medium">Status</th>
              <th class="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-if="loading && items.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">Loading gallery...</td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">No images found. Add one to display in the gallery.</td>
            </tr>
            <tr v-for="item in items" :key="item._id" class="hover:bg-slate-50">
              <td class="px-6 py-4">
                <div class="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 shadow-sm">
                  <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" />
                  <span v-else class="text-xs text-slate-400">No Image</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-800">{{ item.title || 'No Caption' }}</p>
                <span class="inline-block mt-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded-md uppercase tracking-wider">
                  {{ item.category }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="font-mono text-slate-600 font-medium">{{ item.order }}</span>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', item.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700']">
                  {{ item.isActive ? 'Active' : 'Hidden' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="openModal(item)" class="text-blue-600 hover:underline text-xs font-medium mr-3">Edit</button>
                <button @click="handleDelete(item._id)" class="text-red-600 hover:underline text-xs font-medium">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
            <h3 class="font-bold text-slate-800">{{ isEditMode ? 'Edit Image' : 'Batch Upload Images' }}</h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600 transition-colors">
              <Icon name="lucide:x" size="20" />
            </button>
          </div>
          
          <div class="p-6 overflow-y-auto flex-1 bg-slate-50/30">
            <!-- Edit Mode -->
            <form v-if="isEditMode" @submit.prevent="handleSubmit" class="space-y-5">
              <div>
                <CoreImageUpload v-model="singleForm.imageUrl" label="Gallery Image" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="col-span-2">
                  <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Caption (Optional)</label>
                  <input v-model="singleForm.title" type="text" placeholder="Enter an optional caption..." class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Category</label>
                  <select v-model="singleForm.category" class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                    <option value="general">General</option>
                    <option value="conferences">Conferences</option>
                    <option value="events">Events</option>
                    <option value="training">Training</option>
                    <option value="awards">Awards</option>
                  </select>
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Display Order</label>
                  <input v-model.number="singleForm.order" type="number" class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>
              <div class="flex items-center gap-3 pt-2">
                <input v-model="singleForm.isActive" type="checkbox" id="isActiveSingle" class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer">
                <label for="isActiveSingle" class="text-sm text-slate-700 font-medium cursor-pointer">Visible on Website</label>
              </div>
            </form>

            <!-- Batch Add Mode -->
            <div v-else class="space-y-6">
              <CoreBatchImageUpload v-model="batchUrls" label="Select Images" />

              <div v-if="batchItems.length > 0" class="space-y-4">
                <h4 class="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2">Image Details</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div v-for="(item, index) in batchItems" :key="item.imageUrl" class="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex gap-4 relative group">
                    
                    <button @click="removeBatchItem(index)" class="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                      <Icon name="lucide:x" size="14" />
                    </button>

                    <div class="w-24 h-24 shrink-0 rounded-lg overflow-hidden border border-slate-100">
                      <img :src="item.imageUrl" class="w-full h-full object-cover" />
                    </div>
                    
                    <div class="flex-1 space-y-3">
                      <div>
                        <input v-model="item.title" type="text" placeholder="Caption (optional)" class="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                      </div>
                      <div class="flex gap-2">
                        <select v-model="item.category" class="flex-1 px-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                          <option value="general">General</option>
                          <option value="conferences">Conferences</option>
                          <option value="events">Events</option>
                          <option value="training">Training</option>
                          <option value="awards">Awards</option>
                        </select>
                        <div class="flex items-center gap-1.5">
                          <input v-model="item.isActive" type="checkbox" :id="'active-'+index" class="w-3.5 h-3.5 text-blue-600 rounded border-slate-300">
                          <label :for="'active-'+index" class="text-xs font-medium text-slate-600">Active</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="p-6 border-t border-slate-100 bg-white shrink-0 flex justify-end gap-3">
            <button type="button" @click="closeModal" class="px-5 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="button" @click="handleSubmit" :disabled="loading || (!isEditMode && batchItems.length === 0)" class="px-5 py-2.5 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
              <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ isEditMode ? 'Save Changes' : (batchItems.length > 0 ? `Upload ${batchItems.length} Images` : 'Upload Images') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useGallery } from '@/composables/useGallery'

definePageMeta({
  layout: 'default'
})

const { loading, items, fetchGallery, updateGalleryItem, createGalleryItemsBatch, deleteGalleryItem } = useGallery()

const isModalOpen = ref(false)
const isEditMode = ref(false)

// Edit mode state
const singleForm = ref({ _id: null, title: '', imageUrl: '', category: 'general', order: 0, isActive: true })

// Batch mode state
const batchUrls = ref([])
const batchItems = ref([])

watch(batchUrls, (newUrls) => {
  // Sync the form array with uploaded URLs without losing data for existing ones
  const newItems = newUrls.map(url => {
    const existing = batchItems.value.find(item => item.imageUrl === url)
    if (existing) return existing
    return {
      imageUrl: url,
      title: '',
      category: 'general',
      order: 0,
      isActive: true
    }
  })
  batchItems.value = newItems
}, { deep: true })

onMounted(() => {
  fetchGallery()
})

const openModal = (item = null) => {
  if (item) {
    isEditMode.value = true
    singleForm.value = { ...item }
  } else {
    isEditMode.value = false
    batchUrls.value = []
    batchItems.value = []
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const removeBatchItem = (index) => {
  batchUrls.value.splice(index, 1)
}

const handleSubmit = async () => {
  if (isEditMode.value) {
    if (!singleForm.value.imageUrl) return
    await updateGalleryItem(singleForm.value._id, singleForm.value)
  } else {
    if (batchItems.value.length === 0) return
    await createGalleryItemsBatch(batchItems.value)
  }
  if (!loading.value) closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this gallery image?')) {
    await deleteGalleryItem(id)
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-[#003366] text-white font-medium rounded-lg hover:bg-[#002244] transition-colors shadow-sm;
}
::selection {
  background: #003366;
  color: white;
}
</style>
