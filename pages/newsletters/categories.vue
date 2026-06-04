<template>
  <main class="min-h-screen bg-slate-50/50 p-6">
    <div class="max-w-5xl mx-auto space-y-8">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/newsletters" class="p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </NuxtLink>
          <div>
            <h1 class="text-2xl font-bold text-slate-800">Newsletter Categories</h1>
            <p class="text-base text-slate-500">Manage categories and subscription prices.</p>
          </div>
        </div>
        <button @click="openModal()" class="btn-primary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
          New Category
        </button>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table class="w-full text-base text-left">
          <thead class="text-sm text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 font-medium">Title</th>
              <th class="px-6 py-4 font-medium">Description</th>
              <th class="px-6 py-4 font-medium">Price (NGN)</th>
              <th class="px-6 py-4 font-medium">Status</th>
              <th class="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-if="loading && categories.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">Loading categories...</td>
            </tr>
            <tr v-else-if="categories.length === 0">
              <td colspan="5" class="px-6 py-8 text-center text-slate-500">No categories found. Create one above.</td>
            </tr>
            <tr v-for="cat in categories" :key="cat._id" class="hover:bg-slate-50">
              <td class="px-6 py-4 font-semibold text-slate-800">{{ cat.title }}</td>
              <td class="px-6 py-4 text-slate-600 max-w-xs truncate">{{ cat.description }}</td>
              <td class="px-6 py-4 font-medium text-brand-blue">{{ cat.price === 0 ? 'Free' : '₦' + cat.price.toLocaleString() }}</td>
              <td class="px-6 py-4">
                <span :class="['px-2.5 py-1 rounded-full text-sm font-medium', cat.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700']">
                  {{ cat.isActive ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="openModal(cat)" class="text-blue-600 hover:underline text-sm font-medium mr-3">Edit</button>
                <button @click="handleDelete(cat._id)" class="text-red-600 hover:underline text-sm font-medium">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 class="font-bold text-slate-800">{{ form._id ? 'Edit Category' : 'New Category' }}</h3>
            <button @click="closeModal" class="text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Title</label>
              <input v-model="form.title" type="text" required class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Description</label>
              <textarea v-model="form.description" required rows="3" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"></textarea>
            </div>
            <div>
              <label class="block text-sm font-bold text-slate-600 uppercase tracking-wider mb-2">Price (NGN) - 0 for Free</label>
              <input v-model.number="form.price" type="number" min="0" required class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
            </div>
            <div class="flex items-center gap-3 mt-4">
              <input v-model="form.isActive" type="checkbox" id="isActive" class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500">
              <label for="isActive" class="text-base text-slate-700 font-medium">Category is Active</label>
            </div>
            
            <div class="pt-6 flex justify-end gap-3">
              <button type="button" @click="closeModal" class="px-5 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
              <button type="submit" :disabled="loading" class="px-5 py-2.5 text-base font-medium text-white bg-blue-600 hover:bg-[#1d4e89] rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2">
                <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {{ form._id ? 'Save Changes' : 'Create Category' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useNewsletters } from '@/composables/useNewsletters'



const { loading, categories, fetchCategories, createCategory, updateCategory, deleteCategory } = useNewsletters()

const isModalOpen = ref(false)
const form = ref({ _id: null, title: '', description: '', price: 0, isActive: true })

onMounted(() => {
  fetchCategories()
})

const openModal = (cat = null) => {
  if (cat) {
    form.value = { ...cat }
  } else {
    form.value = { _id: null, title: '', description: '', price: 0, isActive: true }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const handleSubmit = async () => {
  if (form.value._id) {
    await updateCategory(form.value._id, form.value)
  } else {
    await createCategory(form.value)
  }
  if (!loading.value) closeModal()
}

const handleDelete = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    await deleteCategory(id)
  }
}
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-[#1d4e89] transition-colors shadow-sm;
}
</style>
