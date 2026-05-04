<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 px-1">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Website Management</h2>
        <p class="text-sm text-slate-500 font-medium">End-to-end control of website content, navigation, images, and social presence.</p>
      </div>
      <div class="flex gap-3">
        <button @click="resetForm" class="btn-outline-admin px-5">
          <LucideRotateCcw :size="14" class="mr-2" />
          Discard changes
        </button>
        <button @click="handleSave" :disabled="saving" class="bg-[#003366] hover:bg-[#004080] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm disabled:opacity-50">
          <LucideLoader2 v-if="saving" class="w-4 h-4 animate-spin" />
          <LucideSave v-else :size="14" />
          Publish changes
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <Loader v-if="loading || !formData" message="Synchronizing website CMS schema..." />

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Section Navigation -->
      <div class="lg:col-span-3">
        <div class="bg-white rounded-3xl border border-slate-100 p-2 sm:p-4 sticky top-8">
          <h3 class="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-4 mb-3">Content Categories</h3>
          <div class="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-hide">
            <button 
              v-for="section in sections" :key="section.id"
              @click="activeSection = section.id" 
              :class="['flex-shrink-0 flex items-center gap-3 px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap', activeSection === section.id ? 'bg-[#003366] text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent']"
            >
              <component :is="section.icon" :size="16" class="sm:w-[18px] sm:h-[18px]" />
              {{ section.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Editor Panels -->
      <div class="lg:col-span-9 space-y-6">
        
        <!-- GLOBAL SETTINGS -->
        <div v-if="activeSection === 'global'" class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideSettings2 :size="24" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">Identity & Logo</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Control your global brand assets.</p>
              </div>
            </div>
            <div class="space-y-6">
              <AnimatedInput v-model="formData.global.siteName" label="Website Name" />
              <ImageUpload v-model="formData.global.logoUrl" label="Institutional Logo" />
            </div>
          </div>

          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideShare2 :size="24" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">Social Presence</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Manage end-to-end social media connectivity.</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatedInput v-model="formData.global.socialLinks.facebook" label="Facebook Profile" />
              <AnimatedInput v-model="formData.global.socialLinks.twitter" label="X / Twitter Handle" />
              <AnimatedInput v-model="formData.global.socialLinks.linkedin" label="LinkedIn Company Page" />
              <AnimatedInput v-model="formData.global.socialLinks.instagram" label="Instagram Handle" />
            </div>
          </div>
        </div>

        <!-- NAVIGATION -->
        <div v-if="activeSection === 'nav'" class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideMenu :size="24" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">Main Navbar</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Control website navigation structure.</p>
              </div>
            </div>
            <div class="space-y-4">
              <div v-for="(item, i) in formData.global.navigation.main" :key="i" class="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group">
                <AnimatedInput v-model="item.label" label="Link Text" class="flex-1" />
                <AnimatedInput v-model="item.to" label="Path" class="flex-1" />
                <button @click="formData.global.navigation.main.splice(i, 1)" class="text-slate-300 hover:text-rose-500 transition-colors p-2 mt-4"><LucideTrash2 :size="18" /></button>
              </div>
              <button @click="formData.global.navigation.main.push({ label: '', to: '' })" class="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 hover:text-[#003366] hover:border-[#003366]/20 transition-all text-xs font-bold flex items-center justify-center gap-2">
                <LucidePlus :size="14" /> Add Navigation Link
              </button>
            </div>
          </div>
        </div>

        <!-- HOME PAGE -->
        <div v-if="activeSection === 'home'" class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          <!-- SECTION HEADERS -->
          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideType :size="24" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-slate-800">Section Headers</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Control the main headlines and descriptions across the landing page.</p>
              </div>
            </div>
            <div class="space-y-8">
              <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pillars Section</p>
                <AnimatedInput v-model="formData.public.home.homeHeaders.pillarsTitle" label="Main Pillars Headline" />
                <AnimatedInput v-model="formData.public.home.homeHeaders.pillarsSubtitle" label="Pillars Supportive Text" type="textarea" :rows="2" />
              </div>
              <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
                <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initiatives Section</p>
                <AnimatedInput v-model="formData.public.home.homeHeaders.initiativesTitle" label="Initiatives Headline" />
                <AnimatedInput v-model="formData.public.home.homeHeaders.initiativesSubtitle" label="Initiatives Supportive Text" type="textarea" :rows="2" />
              </div>
            </div>
          </div>
          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideLayoutTemplate :size="24" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-slate-800">Hero Carousel</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Manage the cinematic slides on the home page.</p>
              </div>
              <button @click="formData.public.home.slides.push({ tag: '', title: '', desc: '', image: '' })" class="p-2 bg-slate-50 text-[#003366] rounded-xl hover:bg-[#003366] hover:text-white transition-all">
                <LucidePlus :size="18" />
              </button>
            </div>
            <div class="space-y-12">
              <div v-for="(slide, i) in formData.public.home.slides" :key="i" class="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group">
                <button @click="formData.public.home.slides.splice(i, 1)" class="absolute top-4 right-4 p-2 text-rose-300 hover:text-rose-500 transition-colors">
                  <LucideTrash2 :size="18" />
                </button>
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AnimatedInput v-model="slide.tag" label="Slide Tag (Top Small Text)" />
                    <AnimatedInput v-model="slide.title" label="Main Heading" />
                  </div>
                  <AnimatedInput v-model="slide.desc" label="Description Narrative" type="textarea" :rows="2" />
                  <ImageUpload v-model="slide.image" :label="'Slide ' + (i+1) + ' Background Image'" />
                </div>
              </div>
            </div>
          </div>

          <!-- CORE PILLARS (Standardization, etc) -->
          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideZap :size="24" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-slate-800">Institutional Pillars</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Control the 4 main value blocks (Standardization, etc).</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div v-for="(pillar, i) in formData.public.home.pillars" :key="i" class="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <AnimatedInput v-model="pillar.title" label="Pillar Title" />
                <AnimatedInput v-model="pillar.desc" label="Pillar Narrative" type="textarea" :rows="2" />
                <ImageUpload v-model="pillar.image" label="Optional Icon/Image" />
              </div>
            </div>
          </div>

          <!-- STRATEGIC INITIATIVES -->
          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideTarget :size="24" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-slate-800">Scientific Initiatives</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Manage the strategic growth projects.</p>
              </div>
            </div>
            <div class="space-y-6">
              <div v-for="(ini, i) in formData.public.home.initiatives" :key="i" class="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <AnimatedInput v-model="ini.title" label="Initiative Title" />
                <AnimatedInput v-model="ini.desc" label="Short Description" type="textarea" :rows="2" />
                <ImageUpload v-model="ini.image" label="Card Image" />
              </div>
            </div>
          </div>

          <!-- MEMBER TIERS -->
          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideUsers :size="24" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-slate-800">Membership Tiers</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Define membership categories and pricing.</p>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-for="(tier, i) in formData.public.home.tiers" :key="i" class="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <AnimatedInput v-model="tier.title" label="Tier Title" />
                <AnimatedInput v-model="tier.price" label="Annual Fee (NGN)" />
              </div>
            </div>
          </div>

          <!-- LIVE STATS -->
          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideBarChart3 :size="24" />
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-slate-800">Impact Metrics</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Control the statistical indicators shown to the public.</p>
              </div>
            </div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div v-for="(stat, i) in formData.public.home.stats" :key="i" class="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                <AnimatedInput v-model="stat.label" label="Label" />
                <AnimatedInput v-model="stat.value" label="Numeric Value" />
              </div>
            </div>
          </div>

        </div>

        <!-- ABOUT PAGE -->
        <div v-if="activeSection === 'about'" class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucideInfo :size="24" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">Organization profile</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Manage end-to-end institutional values.</p>
              </div>
            </div>
            <div class="space-y-6">
              <AnimatedInput v-model="formData.public.about.mission" label="Mission Statement" type="textarea" :rows="3" />
              <AnimatedInput v-model="formData.public.about.vision" label="Vision Statement" type="textarea" :rows="3" />
              <AnimatedInput v-model="formData.public.about.history" label="Historical Context" type="textarea" :rows="4" />
              <ImageUpload v-model="formData.public.about.aboutImage" label="About Page Hero Image" />
            </div>
          </div>
        </div>

        <!-- CONTACT PAGE -->
        <div v-if="activeSection === 'contact'" class="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div class="bg-white rounded-[2.5rem] border border-slate-100 p-8 sm:p-10 shadow-sm">
            <div class="flex items-center gap-3 mb-8 pb-6 border-b border-slate-100">
              <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#003366] border border-slate-100 shrink-0">
                <LucidePhoneCall :size="24" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-slate-800">Connection Points</h3>
                <p class="text-xs text-slate-400 font-medium mt-0.5">Manage how users contact the secretariat.</p>
              </div>
            </div>
            <div class="space-y-6">
              <AnimatedInput v-model="formData.public.contact.email" label="Official Contact Email" />
              <AnimatedInput v-model="formData.public.contact.phone" label="Hotline Number" />
              <AnimatedInput v-model="formData.public.contact.address" label="Secretariat HQ Address" type="textarea" :rows="2" />
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  LucideSave, LucideRotateCcw, LucideLoader2, LucideGlobe, LucideSettings2, 
  LucideShare2, LucideMenu, LucidePlus, LucideTrash2, LucideLayoutTemplate, 
  LucideZap, LucideInfo, LucidePhoneCall, LucideTarget, LucideBarChart3,
  LucideType
} from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useCMS } from '@/composables/core/useCMS'
import { useCustomToast } from '@/composables/core/useCustomToast'
import Loader from '@/components/core/Loader.vue'
import AnimatedInput from '@/components/AnimatedInput.vue'
import ImageUpload from '@/components/core/ImageUpload.vue'

const { loading, saving, cmsConfig, loadCMS, saveCMS } = useCMS()
const { showToast } = useCustomToast()

const activeSection = ref('global')
const formData = ref(null)

const sections = [
  { id: 'global', label: 'Global Settings', icon: LucideSettings2 },
  { id: 'nav', label: 'Navigation', icon: LucideMenu },
  { id: 'home', label: 'Home Page', icon: LucideLayoutTemplate },
  { id: 'about', label: 'About Page', icon: LucideInfo },
  { id: 'contact', label: 'Contact Page', icon: LucidePhoneCall },
]

const initializeForm = () => {
  if (cmsConfig.value) {
    formData.value = JSON.parse(JSON.stringify(cmsConfig.value))
  }
}

const resetForm = () => {
  initializeForm()
  showToast({ title: 'Changes Discarded', message: 'The local draft has been reset.', toastType: 'info' })
}

const handleSave = async () => {
  try {
    await saveCMS(formData.value)
    showToast({ title: 'System Published', message: 'All website content has been updated end-to-end.', toastType: 'success' })
  } catch (error) {
    showToast({ title: 'Critical Error', message: error.message || 'Failed to sync content.', toastType: 'error' })
  }
}

onMounted(async () => {
  await loadCMS()
  initializeForm()
})
</script>
