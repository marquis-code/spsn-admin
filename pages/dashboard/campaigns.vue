<template>
  <div class="space-y-10 pb-20">
    <!-- Page Header -->
    <div class="flex justify-between items-center px-1">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Campaigns & Communications</h2>
        <p class="text-sm text-slate-500 font-medium">Design and broadcast dynamic templates directly to all registered members.</p>
      </div>
      <button
        @click="broadcast"
        :disabled="sending"
        class="bg-[#003366] hover:bg-[#004080] text-white px-8 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-[#003366]/20 disabled:opacity-50"
      >
        <LucideLoader2 v-if="sending" class="w-4 h-4 animate-spin" />
        <LucideSend v-else class="w-4 h-4" />
        {{ sending ? 'Broadcasting...' : 'Broadcast to Members' }}
      </button>
    </div>

    <!-- Navigation Tabs -->
    <div class="flex gap-2 flex-wrap bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          'px-6 py-3 rounded-xl font-bold text-[11px] transition-all flex items-center gap-2.5',
          activeTab === tab.key ? 'bg-[#003366] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        ]"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Layout: Left Editor, Right Preview -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start transition-all duration-500">
      
      <!-- Left Panel: Form Editor -->
      <div class="space-y-6">
        
        <!-- Member Spotlight Editor -->
        <div v-if="activeTab === 'spotlight'" class="admin-card p-10 space-y-6 animate-in fade-in slide-in-from-bottom-2">
           <h3 class="text-lg font-bold text-slate-800 mb-6">Spotlight Details</h3>
           <AnimatedInput v-model="forms.spotlight.name" label="Member Full Name" />
           <AnimatedInput v-model="forms.spotlight.designation" label="Professional Designation" />
           <ImageUpload v-model="forms.spotlight.image" label="Profile Photo" />
           <AnimatedInput v-model="forms.spotlight.bio" label="Short Biography / Quote" type="textarea" />
        </div>

        <!-- Webinar Editor -->
        <div v-if="activeTab === 'webinar'" class="admin-card p-10 space-y-6 animate-in fade-in slide-in-from-bottom-2">
           <h3 class="text-lg font-bold text-slate-800 mb-6">Webinar Configuration</h3>
           <AnimatedInput v-model="forms.webinar.theme" label="Main Theme" />
           <AnimatedInput v-model="forms.webinar.subtheme" label="Subtheme / Objective" />
           <div class="grid grid-cols-2 gap-4">
              <AnimatedInput v-model="forms.webinar.date" label="Date" type="date" />
              <AnimatedInput v-model="forms.webinar.time" label="Time" type="time" />
           </div>
           <AnimatedInput v-model="forms.webinar.venue" label="Venue (e.g. Google Meet)" />
           <div class="grid grid-cols-2 gap-4">
              <AnimatedInput v-model="forms.webinar.chiefHost" label="Chief Host Name" />
              <AnimatedInput v-model="forms.webinar.host" label="Host / Moderator" />
           </div>
           
           <div class="border-t border-slate-100 pt-6 mt-6">
             <div class="flex justify-between items-center mb-4">
               <h4 class="font-bold text-slate-700 text-sm">Speakers</h4>
               <button @click="addSpeaker" class="text-xs text-[#003366] hover:underline flex items-center gap-1 font-bold">
                 <LucidePlus :size="14" /> Add Speaker
               </button>
             </div>
             <div v-for="(speaker, idx) in forms.webinar.speakers" :key="idx" class="bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100 relative group">
                <button @click="removeSpeaker(idx)" class="absolute top-2 right-2 text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <LucideTrash2 :size="16" />
                </button>
                <AnimatedInput v-model="speaker.name" label="Speaker Name" class="mb-4" />
                <AnimatedInput v-model="speaker.title" label="Speaker Title / Role" class="mb-4" />
                <ImageUpload v-model="speaker.image" label="Speaker Photo" />
             </div>
           </div>
        </div>

        <!-- Happy New Month Editor -->
        <div v-if="activeTab === 'new_month'" class="admin-card p-10 space-y-6 animate-in fade-in slide-in-from-bottom-2">
           <h3 class="text-lg font-bold text-slate-800 mb-6">New Month Greetings</h3>
           <AnimatedInput v-model="forms.new_month.month" label="Target Month (e.g. October)" />
           <AnimatedInput v-model="forms.new_month.title" label="Headline / Greeting" />
           <AnimatedInput v-model="forms.new_month.message" label="Main Message" type="textarea" />
           <AnimatedInput v-model="forms.new_month.tagline" label="Tagline / Quote" />
           <ImageUpload v-model="forms.new_month.image" label="Cover Image" />
           <AnimatedInput v-model="forms.new_month.bgColor" label="Background Theme Color (Hex)" type="color" class="h-14" />
        </div>

      </div>

      <!-- Right Panel: Live Preview -->
      <div class="admin-card p-4 min-h-[600px] flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 sticky top-10">
        
        <!-- Spotlight Preview -->
        <div v-if="activeTab === 'spotlight'" class="w-full max-w-[400px] bg-[#2f5a8a] rounded-3xl p-8 text-center text-white shadow-2xl relative overflow-hidden">
           <!-- Decorative bg blobs -->
           <div class="absolute -top-10 -left-10 w-40 h-40 bg-[#1e4069] rounded-full blur-2xl opacity-50"></div>
           <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-[#3f7ab8] rounded-full blur-2xl opacity-50"></div>
           
           <div class="relative z-10">
             <p class="text-sm font-black tracking-widest text-[#93bfe8] mb-2 uppercase drop-shadow-sm">Member Spotlight Feature</p>
             <h3 class="text-4xl font-black mb-8 leading-tight tracking-tight shadow-slate-900 drop-shadow-md">MEET OUR<br/>MEMBER</h3>
             
             <div class="mx-auto w-48 h-48 rounded-full border-4 border-white overflow-hidden shadow-xl mb-6 relative">
                <img :src="forms.spotlight.image || 'https://via.placeholder.com/200'" class="w-full h-full object-cover" />
             </div>
             
             <h4 class="text-xl font-bold mb-1">{{ forms.spotlight.name || 'Dr. Member Name' }}</h4>
             <p class="text-xs text-[#93bfe8] font-bold tracking-wide">{{ forms.spotlight.designation || 'Professional Designation' }}</p>
             
             <p v-if="forms.spotlight.bio" class="mt-6 text-sm italic text-slate-200 border-t border-[#3f7ab8] pt-6 leading-relaxed">
               "{{ forms.spotlight.bio }}"
             </p>
           </div>
        </div>

        <!-- Webinar Preview -->
        <div v-if="activeTab === 'webinar'" class="w-full max-w-[500px] bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row text-slate-800 border border-slate-200">
           <div class="w-full md:w-2/3 p-6 flex flex-col relative z-10">
              <h2 class="text-2xl font-black text-slate-200 uppercase tracking-tighter leading-none mb-6">SCPSN<br/>Monthly<br/>Webinar</h2>
              <div class="bg-[#6d28d9] text-white p-5 -ml-6 mr-6 rounded-r-3xl mb-6 shadow-md relative z-20 transform translate-x-2">
                 <h3 class="text-base font-black uppercase mb-2 leading-tight shadow-sm">{{ forms.webinar.theme || 'Webinar Theme' }}</h3>
                 <p class="text-xs text-[#ddd6fe] leading-snug">Subtheme: {{ forms.webinar.subtheme || 'Enter a subtheme here' }}</p>
              </div>
              <div class="flex gap-4 mb-6">
                 <div class="flex items-center gap-2 font-bold text-sm text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                   <LucideCalendar class="text-[#6d28d9]" :size="16"/> {{ forms.webinar.date || 'Date' }}
                 </div>
                 <div class="flex items-center gap-2 font-bold text-sm text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                   <LucideClock class="text-[#6d28d9]" :size="16"/> {{ forms.webinar.time || 'Time' }}
                 </div>
              </div>
              <div class="mt-auto">
                 <div class="inline-flex items-center gap-2 bg-[#6d28d9] text-white px-5 py-2.5 rounded-full text-xs font-black tracking-wider uppercase shadow-md shadow-[#6d28d9]/30">
                    <LucideMapPin :size="14" /> VENUE: {{ forms.webinar.venue || 'Location' }}
                 </div>
              </div>
           </div>
           
           <div class="w-full md:w-1/3 bg-[#fdf4ff] border-l border-slate-100 flex flex-col items-center relative overflow-hidden pb-4">
              <div class="absolute -top-10 -right-10 w-24 h-24 bg-[#e879f9] opacity-10 rounded-full blur-xl"></div>
              
              <div class="bg-[#6d28d9] text-white w-full text-center py-2.5 rounded-b-2xl font-black text-[10px] tracking-widest uppercase mb-6 shadow-sm z-10 relative">
                 The Speakers
              </div>
              
              <div class="flex-1 flex flex-col items-center gap-6 w-full px-4 relative z-10">
                 <div v-for="(sp, idx) in (forms.webinar.speakers.length ? forms.webinar.speakers : [{}])" :key="idx" class="text-center w-full">
                    <img :src="sp.image || 'https://via.placeholder.com/100'" class="w-16 h-16 rounded-full border-2 border-[#6d28d9] object-cover mx-auto mb-2 shadow-md shadow-slate-200" />
                    <h4 class="text-[11px] font-black text-slate-800 leading-tight">{{ sp.name || 'Speaker Name' }}</h4>
                    <p class="text-[9px] font-bold text-[#e11d48]">{{ sp.title || 'Role / Designation' }}</p>
                 </div>
              </div>
              
              <div class="mt-8 bg-[#6d28d9] text-white w-[90%] rounded-xl p-3 text-[9px] text-center shadow-lg relative z-10">
                 <span class="opacity-70 font-bold uppercase tracking-wider block mb-1">Chief Host:</span> 
                 <span class="font-black">{{ forms.webinar.chiefHost || 'President' }}</span>
                 <div class="h-px bg-white/20 my-2"></div>
                 <span class="opacity-70 font-bold uppercase tracking-wider block mb-1">Host:</span> 
                 <span class="font-black">{{ forms.webinar.host || 'Publicity Team' }}</span>
              </div>
           </div>
        </div>

        <!-- Happy New Month Preview -->
        <div v-if="activeTab === 'new_month'" class="w-full max-w-[400px] rounded-3xl overflow-hidden shadow-2xl relative" :style="{ backgroundColor: forms.new_month.bgColor }">
           <div class="bg-[#eef2f6] pt-10 pb-12 px-8 text-center rounded-bl-[60px] shadow-sm relative z-10 border-b border-slate-200">
              <h3 class="text-[#0f172a] font-black text-3xl leading-none drop-shadow-sm tracking-tight">Happy New<br/>Month from<br/><span class="text-[#2563eb]">SCPSN</span></h3>
           </div>
           
           <div class="p-8 text-white relative z-10">
              <div class="w-full h-40 rounded-2xl overflow-hidden mb-8 shadow-xl shadow-black/20 border-2 border-white/10 ring-4 ring-black/5">
                 <img :src="forms.new_month.image || 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80'" class="w-full h-full object-cover" />
              </div>
              
              <h4 class="text-2xl font-black mb-3 leading-tight tracking-tight text-white drop-shadow-md">{{ forms.new_month.title || 'Welcome to a Vibrant New Month Ahead!' }}</h4>
              <p class="text-sm font-medium opacity-90 leading-relaxed drop-shadow-sm">{{ forms.new_month.message || 'Join us as we celebrate the start of a new month. Let us embark on a month full of growth and discovery.' }}</p>
              
              <div class="mt-8 bg-[#0f172a] text-center py-4 rounded-xl shadow-lg border border-white/10 transform hover:scale-[1.02] transition-transform">
                 <span class="font-black text-white tracking-wide">{{ forms.new_month.tagline || 'Fresh month, fresh energy' }}</span>
              </div>
              
              <p class="mt-8 text-[10px] text-center opacity-70 font-bold leading-relaxed tracking-wider">
                Stay up to date with the latest trends!!!<br/>
                Join us on all Social media platforms<br/>
                @thescpsn Today
              </p>
           </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  LucideSend, 
  LucideLoader2, 
  LucideStar, 
  LucideVideo, 
  LucideCalendarDays,
  LucidePlus,
  LucideTrash2,
  LucideCalendar,
  LucideClock,
  LucideMapPin
} from 'lucide-vue-next'
import AnimatedInput from '@/components/AnimatedInput.vue'
import ImageUpload from '@/components/core/ImageUpload.vue'
import { ref, reactive } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'

const api = useApi()
const { showToast } = useCustomToast()

const sending = ref(false)
const activeTab = ref('spotlight')

const tabs = [
  { key: 'spotlight', label: 'Member Spotlight', icon: LucideStar },
  { key: 'webinar', label: 'Monthly Webinar', icon: LucideVideo },
  { key: 'new_month', label: 'Happy New Month', icon: LucideCalendarDays },
]

const forms = reactive({
  spotlight: {
    name: 'Dr. Kevin Odega, PhD, FIBMS',
    designation: 'Specialist Biomedical Scientist & Quality Systems Leader',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80',
    bio: ''
  },
  webinar: {
    theme: 'Harnessing Artificial Intelligence; Achieving 10x Efficiency in Daily and Professional Workflows',
    subtheme: 'Redefining Accuracy; How AI is Transforming Quality Assurance and Patient Safety in Cellular Pathology Laboratories',
    date: 'Friday, 28 November 2026',
    time: '07:00 PM',
    venue: 'Google Meet',
    chiefHost: 'Bankole K. Julius (National President)',
    host: 'Publicity Team',
    speakers: [
      { name: 'Christian Sebastian Ijomah (Guru Chris)', title: 'AI Educator | No-Code Builder | Digital Strategist', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80' },
      { name: 'Dr. Jean Emile Njab', title: 'Regional Coordinator | ASLM (West and Central Africa) | AI and Laboratory expert', image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80' }
    ]
  },
  new_month: {
    month: 'October',
    title: 'Welcome to a Vibrant New Month Ahead!',
    message: 'Join us as we celebrate the start of October with enthusiasm and positivity. Let\'s embark on a month full of growth and discovery.',
    tagline: 'Fresh month, fresh energy',
    image: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80',
    bgColor: '#9f4f7d'
  }
})

const addSpeaker = () => {
  forms.webinar.speakers.push({ name: '', title: '', image: '' })
}

const removeSpeaker = (idx) => {
  forms.webinar.speakers.splice(idx, 1)
}

const broadcast = async () => {
  if (!confirm(`Are you sure you want to broadcast this ${tabs.find(t => t.key === activeTab.value).label} to all registered members via email?`)) {
    return
  }
  
  sending.value = true
  try {
    const payload = {
      type: activeTab.value,
      data: forms[activeTab.value]
    }
    
    await api.campaigns.broadcast(payload)
    showToast({ title: 'Broadcast Dispatched', message: 'The campaign is being sent to all active members.', toastType: 'success' })
  } catch (error) {
    showToast({ title: 'Broadcast Failed', message: 'There was an issue dispatching the emails.', toastType: 'error' })
  } finally {
    sending.value = false
  }
}
</script>
