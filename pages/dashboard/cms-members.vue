<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 px-1">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Member Portal CMS</h2>
        <p class="text-base text-slate-500 font-medium">Manage the internal experience for all registered practitioners.</p>
      </div>
      <div class="flex gap-3">
        <button @click="resetForm" class="btn-outline-admin px-5">
          <LucideRotateCcw :size="14" class="mr-2" />
          Reset Draft
        </button>
        <button @click="handleSave" :disabled="saving" class="bg-[#003366] hover:bg-[#004080] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm disabled:opacity-50">
          <LucideLoader2 v-if="saving" class="w-4 h-4 animate-spin" />
          <LucideSave v-else :size="14" />
          Push to Portal
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <Loader v-if="loading || !formData" message="Synchronizing portal schema..." />

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Section Navigation -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-3xl border border-slate-100 p-2 sm:p-4 sticky top-8">
          <h3 class="hidden sm:block text-[10px] font-bold text-slate-400  px-4 mb-3">Portal Sections</h3>
          <div class="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
            <button 
              v-for="section in sections" :key="section.id"
              @click="activeSection = section.id" 
              :class="['flex-shrink-0 flex items-center gap-3 px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-base font-bold transition-all whitespace-nowrap', activeSection === section.id ? 'bg-[#003366] text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent']"
            >
              <component :is="section.icon" :size="16" class="sm:w-[18px] sm:h-[18px]" />
              {{ section.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Editor Panels -->
      <div class="lg:col-span-9 space-y-6">
        
        <!-- WELCOME HUB -->
        <div v-if="activeSection === 'dashboard'" class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideLayoutDashboard :size="24" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">Member Hero</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Control the greeting and main banner on the dashboard.</p>
              </div>
            </div>
            <div class="space-y-6">
              <AnimatedInput v-model="formData.member.portal.welcomeTitle" label="Welcome Headline (e.g. Welcome Back,)" />
              <AnimatedInput v-model="formData.member.portal.welcomeSubtitle" label="Supportive Narrative" type="textarea" :rows="3" />
              <ImageUpload v-model="formData.member.portal.heroBg" label="Dashboard Hero Image" />
              <ImageUpload v-model="formData.member.portal.loginBg" label="Auth Page (Login) Hero Image" />
            </div>
          </div>

          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideBell :size="24" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">In-Portal Announcements</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Broadcast critical alerts to all members.</p>
              </div>
            </div>
            <div class="space-y-6">
              <AnimatedInput v-model="formData.member.portal.announcementTitle" label="Alert Title" />
              <AnimatedInput v-model="formData.member.portal.announcementText" label="Alert Message Content" type="textarea" :rows="2" />
              <AnimatedInput v-model="formData.member.portal.announcementLink" label="Target Action Link" />
            </div>
          </div>
        </div>

        <!-- BRANDING & SIDEBAR -->
        <div v-if="activeSection === 'branding'" class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideSidebar :size="24" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">Identity & Navigation</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Manage portal name, initials and sidebar branding.</p>
              </div>
            </div>
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatedInput v-model="formData.member.portal.siteName" label="Portal Name" />
                <AnimatedInput v-model="formData.member.portal.siteInitials" label="Branding Initials (e.g. SC)" />
              </div>
              <ImageUpload v-model="formData.member.portal.sidebarLogo" label="Portal Sidebar Logo" />
            </div>
          </div>
        </div>

        <!-- PAGE CONTENT -->
        <div v-if="activeSection === 'pages'" class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div v-for="(page, key) in formData.member.pages" :key="key" class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
             <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100 capitalize">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideFileText :size="24" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">{{ key }} Page</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Control content for the {{ key }} section.</p>
              </div>
            </div>
            <div class="space-y-6">
               <AnimatedInput v-model="page.title" label="Page Headline" />
               <AnimatedInput v-model="page.subtitle" label="Page Description" type="textarea" :rows="2" />
               <AnimatedInput v-if="page.deadlineText !== undefined" v-model="page.deadlineText" label="Specific Alert / Deadline Text" />
            </div>
          </div>
        </div>

        <!-- SUPPORT HUB -->
        <div v-if="activeSection === 'support'" class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideLifeBuoy :size="24" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">Support Resources</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Manage help desk content and guidelines.</p>
              </div>
            </div>
            <div class="space-y-6">
              <AnimatedInput v-model="formData.member.portal.guidelinesUrl" label="Scientific Guidelines URL" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  LucideSave, LucideRotateCcw, LucideLoader2, LucideLayoutDashboard, LucideSidebar, 
  LucideTrash2, LucidePlus, LucideLifeBuoy, LucideBell, LucideFileText, LucideSettings
} from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useCMS } from '@/composables/core/useCMS'
import { useCustomToast } from '@/composables/core/useCustomToast'
import Loader from '@/components/core/Loader.vue'
import AnimatedInput from '@/components/AnimatedInput.vue'
import ImageUpload from '@/components/core/ImageUpload.vue'

const { loading, saving, cmsConfig, loadCMS, saveCMS } = useCMS()
const { showToast } = useCustomToast()

const activeSection = ref('dashboard')
const formData = ref(null)

const sections = [
  { id: 'dashboard', label: 'Welcome Hub', icon: LucideLayoutDashboard },
  { id: 'branding', label: 'Branding & Logo', icon: LucideSettings },
  { id: 'pages', label: 'Page Content', icon: LucideFileText },
  { id: 'support', label: 'Support & Docs', icon: LucideLifeBuoy },
]

const initializeForm = () => {
  if (cmsConfig.value) {
    formData.value = JSON.parse(JSON.stringify(cmsConfig.value))
  }
}

const resetForm = () => {
  initializeForm()
  showToast({ title: 'Portal Draft Reset', message: 'All local edits have been discarded.', toastType: 'info' })
}

const handleSave = async () => {
  try {
    await saveCMS(formData.value)
    showToast({ title: 'Portal Synced', message: 'All member-only content is now live.', toastType: 'success' })
  } catch (error) {
    showToast({ title: 'Error', message: error.message || 'Failed to push portal updates.', toastType: 'error' })
  }
}

onMounted(async () => {
  await loadCMS()
  initializeForm()
})
</script>
