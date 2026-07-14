<template>
  <main class="min-h-screen bg-slate-50/50 p-6">
    <div class="max-w-6xl mx-auto space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Bi-Annual Association Digests</h1>
          <p class="text-base text-slate-500">Manage digests that appear on the public website.</p>
        </div>
        <button @click="openModal()" class="btn-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          Add Digest
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-base text-left">
          <thead class="text-sm text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-medium">Year</th>
              <th class="px-6 py-4 font-medium">Title</th>
              <th class="px-6 py-4 font-medium">Document</th>
              <th class="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-if="loading && digests.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-slate-500">Loading digests...</td>
            </tr>
            <tr v-else-if="digests.length === 0">
              <td colspan="4" class="px-6 py-8 text-center text-slate-500">No digests found. Add one to display on the website.</td>
            </tr>
            <tr v-for="digest in digests" :key="digest._id" class="hover:bg-slate-50">
              <td class="px-6 py-4 font-bold text-slate-800">
                {{ digest.year }}
              </td>
              <td class="px-6 py-4">
                <p class="font-medium text-slate-800">{{ digest.title }}</p>
              </td>
              <td class="px-6 py-4">
                <a v-if="digest.pdfUrl" :href="digest.pdfUrl" target="_blank" class="text-blue-600 hover:underline flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  View PDF
                </a>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="openModal(digest)" class="text-blue-600 hover:underline text-sm font-medium mr-3">Edit</button>
                <button @click="handleDelete(digest._id)" class="text-red-600 hover:underline text-sm font-medium">Delete</button>
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
            <h3 class="font-bold text-slate-800">{{ form._id ? 'Edit Digest' : 'Add Digest' }}</h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="p-6 overflow-y-auto flex-1">
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Title</label>
                <input v-model="form.title" type="text" required class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Year</label>
                <input v-model="form.year" type="number" required class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label class="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">PDF Document</label>
                <div class="relative w-full">
                  <input @change="handleFileChange" type="file" id="pdfUpload" accept="application/pdf" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div class="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors" :class="{ 'border-blue-500 bg-blue-50': fileToUpload || form.pdfUrl }">
                    <div v-if="fileToUpload" class="flex flex-col items-center">
                      <div class="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <p class="text-sm font-semibold text-slate-800">{{ fileToUpload.name }}</p>
                      <p class="text-xs text-slate-500 mt-1">Ready to upload</p>
                    </div>
                    <div v-else-if="form.pdfUrl" class="flex flex-col items-center">
                      <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                      </div>
                      <p class="text-sm font-semibold text-slate-800">Current PDF uploaded</p>
                      <p class="text-xs text-slate-500 mt-1">Click or drag here to replace</p>
                    </div>
                    <div v-else class="flex flex-col items-center">
                      <div class="w-12 h-12 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <p class="text-sm font-semibold text-slate-700">Click or drag a PDF here</p>
                      <p class="text-xs text-slate-500 mt-1">Maximum file size 100MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div class="p-6 border-t border-slate-100 bg-white shrink-0 flex justify-end gap-3">
            <button type="button" @click="closeModal" class="px-5 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="button" @click="handleSubmit" :disabled="loading" class="px-5 py-2.5 text-base font-medium text-white bg-blue-600 hover:bg-[#1d4e89] rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
              <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {{ form._id ? 'Save Changes' : 'Add Digest' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDigests } from '@/composables/useDigests'

const { loading, digests, fetchDigests, createDigest, updateDigest, deleteDigest } = useDigests()

const isModalOpen = ref(false)
const form = ref({ _id: null, title: '', year: new Date().getFullYear(), pdfUrl: '' })
const fileToUpload = ref(null)

onMounted(() => {
  fetchDigests()
})

const openModal = (digest = null) => {
  if (digest) {
    form.value = { ...digest }
  } else {
    form.value = { _id: null, title: '', year: new Date().getFullYear(), pdfUrl: '' }
  }
  fileToUpload.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleFileChange = (e) => {
  if (e.target.files.length > 0) {
    fileToUpload.value = e.target.files[0]
  }
}

const handleSubmit = async () => {
  if (!form.value.title || !form.value.year) return
  if (!form.value._id && !fileToUpload.value) {
    alert("Please upload a PDF document for the new digest.")
    return
  }
  
  const formData = new FormData()
  formData.append('title', form.value.title)
  formData.append('year', form.value.year)
  if (fileToUpload.value) {
    formData.append('file', fileToUpload.value)
  }

  if (form.value._id) {
    await updateDigest(form.value._id, formData)
  } else {
    await createDigest(formData)
  }
  if (!loading.value) closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this digest permanently?')) {
    await deleteDigest(id)
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-[#1d4e89] transition-colors shadow-sm;
}
</style>
