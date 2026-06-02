<template>
  <main class="min-h-screen bg-slate-50/50 p-6">
    <div class="max-w-6xl mx-auto space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Advert Management</h1>
          <p class="text-base text-slate-500">Manage promotional banners and adverts for the public website.</p>
        </div>
        <button @click="openModal()" class="btn-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          New Advert
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-base text-left">
          <thead class="text-sm text-slate-500  bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-medium">Preview</th>
              <th class="px-6 py-4 font-medium">Title & Link</th>
              <th class="px-6 py-4 font-medium">Placement (Section)</th>
              <th class="px-6 py-4 font-medium">Status & Clicks</th>
              <th class="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-if="loading && adverts.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">Loading adverts...</td>
            </tr>
            <tr v-else-if="adverts.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">No adverts found. Create one to display on the landing page.</td>
            </tr>
            <tr v-for="ad in adverts" :key="ad._id" class="hover:bg-slate-50">
              <td class="px-6 py-4">
                <div class="w-24 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                  <img v-if="ad.imageUrl" :src="ad.imageUrl" class="w-full h-full object-cover" />
                  <span v-else class="text-sm text-slate-400 flex items-center justify-center h-full">No Img</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-800">{{ ad.title }}</p>
                <a :href="ad.targetUrl" target="_blank" class="text-sm text-blue-600 hover:underline truncate max-w-[200px] block">{{ ad.targetUrl || 'No Link' }}</a>
              </td>
              <td class="px-6 py-4">
                <span class="inline-block px-2.5 py-1 bg-indigo-50 text-indigo-700 text-sm font-bold rounded-md">
                  {{ ad.section }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <span :class="['px-2.5 py-0.5 rounded-full text-[10px] font-bold  tracking-wider w-fit', ad.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700']">
                    {{ ad.isActive ? 'Active' : 'Hidden' }}
                  </span>
                  <span class="text-sm font-medium text-slate-500">{{ ad.clicks }} Clicks</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="openModal(ad)" class="text-blue-600 hover:underline text-sm font-medium mr-3">Edit</button>
                <button @click="handleDelete(ad._id)" class="text-red-600 hover:underline text-sm font-medium">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
            <h3 class="font-bold text-slate-800">{{ form._id ? 'Edit Advert' : 'New Advert' }}</h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto flex-1">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-slate-600  tracking-wider mb-2">Advert Title *</label>
                  <input v-model="form.title" type="text" required class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-600  tracking-wider mb-2">Target Link URL</label>
                  <input v-model="form.targetUrl" type="url" placeholder="https://example.com" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <CoreImageUpload v-model="form.imageUrl" label="Image URL (Banner Graphic) *" />
                <p class="text-[10px] text-slate-400 mt-1">Provide a high-quality landscape image for best results.</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-slate-600  tracking-wider mb-2">Company Name</label>
                  <input v-model="form.companyName" type="text" placeholder="e.g. Gemrook Laboratories" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-600  tracking-wider mb-2">Contact Phone</label>
                  <input v-model="form.contactPhone" type="text" placeholder="e.g. +1 234 567 8900" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-bold text-slate-600  tracking-wider mb-2">Contact Email</label>
                  <input v-model="form.contactEmail" type="email" placeholder="e.g. contact@example.com" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
                </div>
                <div>
                  <label class="block text-sm font-bold text-slate-600  tracking-wider mb-2">Landing Page Placement</label>
                  <select v-model="form.section" required class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                    <option value="BELOW_HERO">Below Hero (Top)</option>
                    <option value="IN_CONTENT_1">In Content (Middle)</option>
                    <option value="ABOVE_FOOTER">Above Footer (Bottom)</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-600  tracking-wider mb-2">Contact Address</label>
                <input v-model="form.contactAddress" type="text" placeholder="e.g. 123 Science Way, Lab City" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-600  tracking-wider mb-2">Services (Comma separated)</label>
                <textarea v-model="servicesText" rows="2" placeholder="Cytology, Histology, Molecular" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"></textarea>
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-600  tracking-wider mb-2">Benefits (Comma separated)</label>
                <textarea v-model="benefitsText" rows="2" placeholder="Rapid turnaround times, Easily accessible" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"></textarea>
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-600  tracking-wider mb-2">Target Audience (Comma separated)</label>
                <textarea v-model="targetAudienceText" rows="2" placeholder="Hospitals, Laboratories, Universities" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"></textarea>
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-600  tracking-wider mb-2">Optional Description</label>
                <textarea v-model="form.description" rows="2" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"></textarea>
              </div>
              <div class="flex items-center gap-3 pt-2">
                <input v-model="form.isActive" type="checkbox" id="isActive" class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer">
                <label for="isActive" class="text-base text-slate-700 font-medium cursor-pointer">Advert is Active (Visible)</label>
              </div>
            </form>
          </div>
          <div class="p-6 border-t border-slate-100 bg-white shrink-0 flex justify-end gap-3">
            <button type="button" @click="closeModal" class="px-5 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="button" @click="handleSubmit" :disabled="loading" class="px-5 py-2.5 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
              <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ form._id ? 'Save Changes' : 'Create Advert' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAdverts } from '@/composables/useAdverts'


const { loading, adverts, fetchAdverts, createAdvert, updateAdvert, deleteAdvert } = useAdverts()

const isModalOpen = ref(false)
const form = ref({ 
  _id: null, title: '', description: '', imageUrl: '', targetUrl: '', section: 'BELOW_HERO', isActive: true,
  companyName: '', contactPhone: '', contactEmail: '', contactAddress: '',
  services: [], benefits: [], targetAudience: []
})

// Helpers for array fields
const servicesText = computed({
  get: () => form.value.services ? form.value.services.join(', ') : '',
  set: (val) => form.value.services = val.split(',').map(s => s.trim()).filter(Boolean)
})
const benefitsText = computed({
  get: () => form.value.benefits ? form.value.benefits.join(', ') : '',
  set: (val) => form.value.benefits = val.split(',').map(s => s.trim()).filter(Boolean)
})
const targetAudienceText = computed({
  get: () => form.value.targetAudience ? form.value.targetAudience.join(', ') : '',
  set: (val) => form.value.targetAudience = val.split(',').map(s => s.trim()).filter(Boolean)
})

onMounted(() => {
  fetchAdverts()
})

const openModal = (ad = null) => {
  if (ad) {
    form.value = { ...ad }
  } else {
    form.value = { 
      _id: null, title: '', description: '', imageUrl: '', targetUrl: '', section: 'BELOW_HERO', isActive: true,
      companyName: '', contactPhone: '', contactEmail: '', contactAddress: '',
      services: [], benefits: [], targetAudience: []
    }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSubmit = async () => {
  // basic validation
  if (!form.value.title || !form.value.imageUrl) return
  
  if (form.value._id) {
    await updateAdvert(form.value._id, form.value)
  } else {
    await createAdvert(form.value)
  }
  if (!loading.value) closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this advert permanently?')) {
    await deleteAdvert(id)
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm;
}
</style>
