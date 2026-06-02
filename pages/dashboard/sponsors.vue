<template>
  <main class="min-h-screen bg-slate-50/50 p-6">
    <div class="max-w-6xl mx-auto space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Sponsor Management</h1>
          <p class="text-base text-slate-500">Manage sponsors that appear on the public website's animated marquee.</p>
        </div>
        <button @click="openModal()" class="btn-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Sponsor
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-base text-left">
          <thead class="text-sm text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-medium">Logo</th>
              <th class="px-6 py-4 font-medium">Name & Link</th>
              <th class="px-6 py-4 font-medium">Tier</th>
              <th class="px-6 py-4 font-medium">Status</th>
              <th class="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-if="loading && sponsors.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">Loading sponsors...</td>
            </tr>
            <tr v-else-if="sponsors.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">No sponsors found. Add one to display on the landing page.</td>
            </tr>
            <tr v-for="sponsor in sponsors" :key="sponsor._id" class="hover:bg-slate-50">
              <td class="px-6 py-4">
                <div class="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 p-2 shadow-sm">
                  <img v-if="sponsor.logoUrl" :src="sponsor.logoUrl" class="w-full h-full object-contain" />
                  <span v-else class="text-sm text-slate-400">No Logo</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="font-semibold text-slate-800">{{ sponsor.name }}</p>
                <a v-if="sponsor.websiteUrl" :href="sponsor.websiteUrl" target="_blank" class="text-sm text-blue-600 hover:underline truncate max-w-[200px] block">{{ sponsor.websiteUrl }}</a>
                <span v-else class="text-sm text-slate-400">No Link</span>
              </td>
              <td class="px-6 py-4">
                <span class="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-sm font-bold rounded-md uppercase">
                  {{ sponsor.tier }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="['px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider', sponsor.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700']">
                  {{ sponsor.isActive ? 'Active' : 'Hidden' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="openModal(sponsor)" class="text-blue-600 hover:underline text-sm font-medium mr-3">Edit</button>
                <button @click="handleDelete(sponsor._id)" class="text-red-600 hover:underline text-sm font-medium">Delete</button>
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
            <h3 class="font-bold text-slate-800">{{ form._id ? 'Edit Sponsor' : 'Add Sponsor' }}</h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto flex-1">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Sponsor Name</label>
                <input v-model="form.name" type="text" required class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <CoreImageUpload v-model="form.logoUrl" label="Sponsor Logo" />
                <p class="text-[10px] text-slate-400 mt-1">Upload a transparent PNG or SVG for best results on the marquee.</p>
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Website URL</label>
                <input v-model="form.websiteUrl" type="url" placeholder="https://example.com" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Sponsorship Tier</label>
                <select v-model="form.tier" required class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all">
                  <option value="PLATINUM">Platinum</option>
                  <option value="GOLD">Gold</option>
                  <option value="SILVER">Silver</option>
                  <option value="BRONZE">Bronze</option>
                  <option value="NONE">None</option>
                </select>
              </div>
              <div class="flex items-center gap-3 pt-2">
                <input v-model="form.isActive" type="checkbox" id="isActive" class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer">
                <label for="isActive" class="text-base text-slate-700 font-medium cursor-pointer">Sponsor is Active (Visible on Website)</label>
              </div>
            </form>
          </div>
          <div class="p-6 border-t border-slate-100 bg-white shrink-0 flex justify-end gap-3">
            <button type="button" @click="closeModal" class="px-5 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="button" @click="handleSubmit" :disabled="loading" class="px-5 py-2.5 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
              <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ form._id ? 'Save Changes' : 'Add Sponsor' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSponsors } from '@/composables/useSponsors'


const { loading, sponsors, fetchSponsors, createSponsor, updateSponsor, deleteSponsor } = useSponsors()

const isModalOpen = ref(false)
const form = ref({ _id: null, name: '', logoUrl: '', websiteUrl: '', tier: 'NONE', isActive: true })

onMounted(() => {
  fetchSponsors()
})

const openModal = (sponsor = null) => {
  if (sponsor) {
    form.value = { ...sponsor }
  } else {
    form.value = { _id: null, name: '', logoUrl: '', websiteUrl: '', tier: 'NONE', isActive: true }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSubmit = async () => {
  if (!form.value.name || !form.value.logoUrl) return
  
  if (form.value._id) {
    await updateSponsor(form.value._id, form.value)
  } else {
    await createSponsor(form.value)
  }
  if (!loading.value) closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this sponsor permanently?')) {
    await deleteSponsor(id)
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm;
}
</style>
