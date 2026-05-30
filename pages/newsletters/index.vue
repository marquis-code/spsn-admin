<template>
  <main class="min-h-screen bg-slate-50/50 p-6">
    <div class="max-w-7xl mx-auto space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-800">Newsletters Dashboard</h1>
          <p class="text-base text-slate-500">Manage categories, campaigns, and view subscriptions.</p>
        </div>
        <div class="flex gap-3">
          <NuxtLink to="/newsletters/categories" class="btn-outline-primary">Manage Categories</NuxtLink>
          <NuxtLink to="/newsletters/campaigns" class="btn-primary">Manage Campaigns</NuxtLink>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-base font-medium text-slate-500">Total Subscribers</p>
              <h3 class="text-3xl font-bold text-slate-800 mt-2">{{ subscriptions.length }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-base font-medium text-slate-500">Total Revenue</p>
              <h3 class="text-3xl font-bold text-slate-800 mt-2">₦{{ totalRevenue.toLocaleString() }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-base font-medium text-slate-500">Campaigns Sent</p>
              <h3 class="text-3xl font-bold text-slate-800 mt-2">{{ publishedCampaigns }}</h3>
            </div>
            <div class="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Subscriptions List -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-slate-800">Recent Subscriptions</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-base text-left">
            <thead class="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4 font-medium">Email</th>
                <th class="px-6 py-4 font-medium">Categories</th>
                <th class="px-6 py-4 font-medium">Amount</th>
                <th class="px-6 py-4 font-medium">Status</th>
                <th class="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-if="loading">
                <td colspan="5" class="px-6 py-8 text-center text-slate-500">Loading subscriptions...</td>
              </tr>
              <tr v-else-if="subscriptions.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-slate-500">No subscriptions found.</td>
              </tr>
              <tr v-for="sub in subscriptions.slice(0, 10)" :key="sub._id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 font-medium text-slate-900">{{ sub.email }}</td>
                <td class="px-6 py-4 text-slate-600">
                  <span v-for="cat in sub.categories" :key="cat._id" class="inline-block px-2 py-1 bg-slate-100 text-xs rounded-md mr-2 mb-1">
                    {{ cat.title }}
                  </span>
                </td>
                <td class="px-6 py-4 font-medium">₦{{ sub.totalAmount.toLocaleString() }}</td>
                <td class="px-6 py-4">
                  <span :class="['px-2.5 py-1 rounded-full text-xs font-medium', sub.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700']">
                    {{ sub.isPaid ? 'Paid' : 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-slate-500">{{ new Date(sub.createdAt).toLocaleDateString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useNewsletters } from '@/composables/useNewsletters'



const { loading, subscriptions, campaigns, fetchSubscriptions, fetchCampaigns } = useNewsletters()

onMounted(() => {
  fetchSubscriptions()
  fetchCampaigns()
})

const totalRevenue = computed(() => {
  return subscriptions.value.filter(s => s.isPaid).reduce((sum, s) => sum + s.totalAmount, 0)
})

const publishedCampaigns = computed(() => {
  return campaigns.value.filter(c => c.status === 'PUBLISHED').length
})
</script>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm;
}
.btn-outline-primary {
  @apply px-4 py-2 bg-white text-blue-600 border border-blue-200 font-medium rounded-lg hover:bg-blue-50 transition-colors;
}
</style>
