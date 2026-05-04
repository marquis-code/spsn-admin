<template>
  <div class="space-y-10 pb-20">
    <!-- Page Header -->
    <div class="flex justify-between items-center px-1">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Global Platform Configuration</h2>
        <p class="text-sm text-slate-500 font-medium">Centralized management for public-facing content and system parameters.</p>
      </div>
      <button
        @click="saveAllChanges"
        :disabled="saving"
        class="bg-[#003366] hover:bg-[#004080] text-white px-8 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-[#003366]/20 disabled:opacity-50"
      >
        <LucideLoader2 v-if="saving" class="w-4 h-4 animate-spin" />
        <LucideSave v-else class="w-4 h-4" />
        {{ saving ? 'Synchronizing...' : 'Apply global changes' }}
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
      <button
        @click="activeTab = 'membership'"
        :class="[
          'px-6 py-3 rounded-xl font-bold text-[11px] transition-all flex items-center gap-2.5',
          activeTab === 'membership' ? 'bg-[#003366] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        ]"
      >
        <LucideUserPlus class="w-4 h-4" />
        Enrollment hub
      </button>
      <button
        @click="activeTab = 'board'"
        :class="[
          'px-6 py-3 rounded-xl font-bold text-[11px] transition-all flex items-center gap-2.5',
          activeTab === 'board' ? 'bg-[#003366] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        ]"
      >
        <LucideUsers class="w-4 h-4" />
        Scientific board
      </button>
    </div>

    <!-- Content Sections -->
    <div class="transition-all duration-500">
      
      <!-- Primary Identity Settings -->
      <div v-if="activeTab === 'general'" class="admin-card p-10 space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div class="border-b border-slate-100 pb-5">
           <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
             <LucideSettings :size="20" class="text-[#003366]" />
             Core platform identity
           </h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
           <AnimatedInput v-model="config.siteName" label="Official organization name" />
           <AnimatedInput v-model="config.logoUrl" label="Primary brand logo URL" />
        </div>
        <AnimatedInput v-model="config.siteDescription" label="Platform metadescription (SEO)" type="textarea" />
      </div>

      <!-- Hero Visual Assets -->
      <div v-if="activeTab === 'hero'" class="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div class="flex justify-between items-center px-1">
          <h3 class="text-lg font-bold text-slate-800">Frontline visual assets</h3>
          <button @click="addSlide" class="text-xs font-bold text-[#003366] hover:bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 transition-all flex items-center gap-2">
            <LucidePlus :size="16" /> Append visual slide
          </button>
        </div>
        <div class="grid grid-cols-1 gap-6">
          <div v-for="(slide, i) in config.heroSlides" :key="i" class="admin-card p-10 space-y-6 relative overflow-hidden group">
            <div class="flex justify-between items-center relative z-10">
              <span class="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">Asset record #{{ i + 1 }}</span>
              <button @click="removeSlide(i)" class="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-all">
                <LucideTrash2 :size="18" />
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
               <div class="space-y-6">
                 <AnimatedInput v-model="slide.tag" label="Header badge / classification" />
                 <AnimatedInput v-model="slide.title" label="Headline content" />
                 <AnimatedInput v-model="slide.image" label="Background image URL" />
               </div>
               <AnimatedInput v-model="slide.desc" label="Supporting narrative text" type="textarea" class="h-full" />
            </div>
            <div class="absolute -right-16 -bottom-16 text-slate-50 opacity-[0.03] group-hover:text-[#003366] group-hover:opacity-[0.05] transition-all duration-1000">
               <LucideImage :size="240" />
            </div>
          </div>
        </div>
      </div>

      <!-- Performance Metrics -->
      <div v-if="activeTab === 'stats'" class="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div class="flex justify-between items-center px-1">
          <h3 class="text-lg font-bold text-slate-800">Public performance metrics</h3>
          <button @click="addStat" class="text-xs font-bold text-[#003366] hover:bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 transition-all flex items-center gap-2">
            <LucidePlus :size="16" /> Add metric entry
          </button>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="(stat, i) in config.stats" :key="i" class="admin-card p-8 flex gap-6 items-center">
            <div class="flex-1 space-y-4">
              <AnimatedInput v-model="stat.value" label="Numeric value (e.g. 5,000+)" />
              <AnimatedInput v-model="stat.label" label="Descriptive label" />
            </div>
            <button @click="removeStat(i)" class="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-3 rounded-2xl transition-all">
              <LucideTrash2 :size="20" />
            </button>
          </div>
        </div>
      </div>

      <!-- Content Pillars -->
      <div v-if="activeTab === 'pillars'" class="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div class="flex justify-between items-center px-1">
          <h3 class="text-lg font-bold text-slate-800">Operational excellence pillars</h3>
          <button @click="addPillar" class="text-xs font-bold text-[#003366] hover:bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 transition-all flex items-center gap-2">
            <LucidePlus :size="16" /> Add strategic pillar
          </button>
        </div>
        <div v-for="(pillar, i) in config.pillars" :key="i" class="admin-card p-10 space-y-6 relative group overflow-hidden">
          <div class="flex justify-between items-center relative z-10">
            <span class="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Definition area #{{ i + 1 }}</span>
            <button @click="removePillar(i)" class="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-all">
              <LucideTrash2 :size="18" />
            </button>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
             <div class="space-y-6">
               <AnimatedInput v-model="pillar.title" label="Pillar conclusion" />
               <AnimatedInput v-model="pillar.icon" label="Icon identifier (Lucide registry)" />
             </div>
             <AnimatedInput v-model="pillar.desc" label="Pillar narrative description" type="textarea" />
          </div>
          <div class="absolute -right-12 -bottom-12 text-slate-50 opacity-[0.03] group-hover:text-[#003366] group-hover:opacity-[0.05] transition-all duration-1000">
             <LucideColumns3 :size="180" />
          </div>
        </div>
      </div>

      <!-- Strategic Initiatives -->
      <div v-if="activeTab === 'initiatives'" class="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div class="flex justify-between items-center px-1">
          <h3 class="text-lg font-bold text-slate-800">Strategic objectives & campaigns</h3>
          <button @click="addInitiative" class="text-xs font-bold text-[#003366] hover:bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 transition-all flex items-center gap-2">
            <LucidePlus :size="16" /> Initialize new campaign
          </button>
        </div>
        <div v-for="(ini, i) in config.initiatives" :key="i" class="admin-card p-10 space-y-6">
          <div class="flex justify-between items-center">
            <span class="text-[11px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Directive entry #{{ i + 1 }}</span>
            <button @click="removeInitiative(i)" class="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-all">
              <LucideTrash2 :size="18" />
            </button>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <div class="space-y-6">
                <AnimatedInput v-model="ini.title" label="Operational headline" />
                <div class="grid grid-cols-2 gap-6">
                   <AnimatedInput v-model="ini.icon" label="Icon registry ID" />
                   <AnimatedInput v-model="ini.to" label="Target navigation URI" />
                </div>
             </div>
             <AnimatedInput v-model="ini.desc" label="Strategic context" type="textarea" />
          </div>
        </div>
      </div>

      <!-- Corporate Narrative -->
      <div v-if="activeTab === 'about'" class="admin-card p-10 space-y-10 animate-in fade-in slide-in-from-bottom-2">
        <div class="border-b border-slate-100 pb-5">
           <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
             <LucideInfo :size="20" class="text-[#003366]" />
             Organizational narrative & ethos
           </h3>
        </div>
        <div class="space-y-8">
          <AnimatedInput v-model="config.aboutContent.title" label="Primary ethos headline" />
          <AnimatedInput v-model="config.aboutContent.description" label="Global corporate history" type="textarea" />
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <AnimatedInput v-model="config.aboutContent.mission" label="Mission statement" type="textarea" />
            <AnimatedInput v-model="config.aboutContent.vision" label="Vision statement" type="textarea" />
          </div>
        </div>
      </div>

      <!-- Communication Parameters -->
      <div v-if="activeTab === 'contact'" class="admin-card p-10 space-y-10 animate-in fade-in slide-in-from-bottom-2">
        <div class="border-b border-slate-100 pb-5">
           <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
             <LucidePhone :size="20" class="text-[#003366]" />
             Official communication vectors
           </h3>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div class="space-y-8">
              <AnimatedInput v-model="config.contactInfo.email" label="Institutional email" type="email" />
              <AnimatedInput v-model="config.contactInfo.phone" label="Official contact line" type="tel" />
              <AnimatedInput v-model="config.contactInfo.address" label="Global headquarters address" type="textarea" />
           </div>
           <div class="space-y-6 bg-slate-50/50 p-8 rounded-3xl border border-slate-100">
              <h4 class="text-[11px] font-bold text-slate-400 mb-2">Social infrastructure</h4>
              <AnimatedInput v-model="config.socialLinks.facebook" label="Corporate Facebook" />
              <AnimatedInput v-model="config.socialLinks.twitter" label="Enterprise X (Twitter)" />
              <AnimatedInput v-model="config.socialLinks.linkedin" label="LinkedIn professional network" />
              <AnimatedInput v-model="config.socialLinks.instagram" label="Institutional Instagram" />
           </div>
        </div>
      </div>

      <!-- Intelligent Assistance -->
      <div v-if="activeTab === 'chatbot'" class="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div class="flex justify-between items-center px-1">
          <div>
            <h3 class="text-lg font-bold text-slate-800">Advanced AI knowledge engineering</h3>
            <p class="text-xs text-slate-400 font-medium">Fine-tune the intelligence parameters for automated member support.</p>
          </div>
          <button @click="addKnowledge" class="text-xs font-bold text-[#003366] hover:bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 transition-all flex items-center gap-2">
            <LucidePlus :size="16" /> Inject knowledge fact
          </button>
        </div>
        
        <div class="grid grid-cols-1 gap-4">
          <div v-for="(item, i) in config.chatbotKnowledge" :key="i" class="admin-card p-8 flex gap-6 items-start group">
            <div class="flex-1">
              <AnimatedInput v-model="config.chatbotKnowledge[i]" :label="`Knowledge proposition #${i + 1}`" type="textarea" />
            </div>
            <button @click="removeKnowledge(i)" class="text-slate-300 hover:text-rose-500 hover:bg-rose-50 p-3 rounded-2xl transition-all mt-4">
              <LucideTrash2 :size="20" />
            </button>
          </div>
        </div>
      </div>

      <!-- Content Response Templates -->
      <div v-if="activeTab === 'quickReplies'" class="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div class="flex justify-between items-center px-1">
          <div>
             <h3 class="text-lg font-bold text-slate-800">Operational content templates</h3>
             <p class="text-xs text-slate-400 font-medium">Predefined communicative assets for rapid response protocols.</p>
          </div>
          <button @click="addQuickReply" class="bg-[#003366] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#004080] transition-all shadow-md flex items-center gap-2">
            <LucidePlus :size="16" /> Create new asset
          </button>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="(res, i) in config.predefinedResponses" :key="i" class="admin-card p-10 space-y-6 border-l-4 border-l-[#003366]">
            <div class="flex justify-between items-center">
              <span class="text-[11px] font-bold text-[#003366] bg-slate-50 px-3 py-1 rounded-full">Directive entry #{{ i + 1 }}</span>
              <button @click="removeQuickReply(i)" class="text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-xl transition-all">
                <LucideTrash2 :size="18" />
              </button>
            </div>
            <div class="grid grid-cols-1 gap-6">
              <AnimatedInput v-model="res.category" label="Categorical classification" />
              <AnimatedInput v-model="res.label" label="Visual UI descriptor" />
              <AnimatedInput v-model="res.text" label="Proposition narrative" type="textarea" />
            </div>
          </div>
        </div>

        <div v-if="config.predefinedResponses.length === 0" class="py-32 bg-white border border-slate-200 border-dashed rounded-[40px] text-center space-y-6">
          <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100 text-slate-200">
            <LucideZapOff :size="40" />
          </div>
          <div class="space-y-2">
             <p class="font-bold text-slate-800">No content templates available</p>
             <p class="text-xs text-slate-400 font-medium">Initialize a new template to streamline communications</p>
          </div>
        </div>
      </div>

      <!-- Digitalized Enrollment Hub -->
      <div v-if="activeTab === 'membership'" class="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div class="flex justify-between items-center px-1">
          <div>
            <h3 class="text-lg font-bold text-slate-800">Enrollment protocol configuration</h3>
            <p class="text-xs text-slate-400 font-medium">Manage how potential members interact with the membership digitalization protocol.</p>
          </div>
        </div>

        <!-- Narrative & Legacy -->
        <div class="admin-card p-10 space-y-8">
           <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div class="space-y-6">
                 <h4 class="text-sm font-bold text-slate-800 border-l-4 border-l-[#003366] pl-4">Organizational narrative</h4>
                 <AnimatedInput v-model="config.membershipSettings.about" label="About SCPSN (Landing content)" type="textarea" />
              </div>
              <div class="space-y-6">
                 <div class="flex justify-between items-center">
                    <h4 class="text-sm font-bold text-slate-800 border-l-4 border-l-[#003366] pl-4">Historical leadership</h4>
                    <button @click="addLeader" class="text-[11px] font-bold text-[#003366] hover:underline">Append leader</button>
                 </div>
                 <div class="grid grid-cols-1 gap-4">
                    <div v-for="(leader, i) in config.membershipSettings.leadership" :key="i" class="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group">
                       <AnimatedInput v-model="leader.name" label="Leader name" class="flex-1" />
                       <AnimatedInput v-model="leader.tenure" label="Tenure (e.g. 2021-2025)" class="w-40" />
                       <button @click="removeLeader(i)" class="text-slate-300 hover:text-rose-500 transition-colors p-2"><LucideTrash2 :size="16" /></button>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <!-- Financial & Protocol Registry -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div class="admin-card p-10 space-y-6">
              <h4 class="text-sm font-bold text-slate-800 border-l-4 border-l-brand-cyan pl-4">Fee structure</h4>
              <AnimatedInput v-model="config.membershipSettings.newRegistrationFee" label="New registrant fee (₦)" type="number" />
              <AnimatedInput v-model="config.membershipSettings.renewalFee" label="Annual renewal fee (₦)" type="number" />
              <AnimatedInput v-model="config.membershipSettings.registrationDeadline" label="Enrollment deadline" type="date" />
           </div>
           <div class="admin-card p-10 space-y-6">
              <h4 class="text-sm font-bold text-slate-800 border-l-4 border-l-brand-cyan pl-4">Banking credentials</h4>
              <AnimatedInput v-model="config.membershipSettings.bankName" label="Financial institution" />
              <AnimatedInput v-model="config.membershipSettings.accountNumber" label="Registry account number" />
              <AnimatedInput v-model="config.membershipSettings.accountName" label="Account holder name" />
           </div>
           <div class="admin-card p-10 space-y-6">
              <h4 class="text-sm font-bold text-slate-800 border-l-4 border-l-brand-cyan pl-4">Communication vectors</h4>
              <div class="space-y-4">
                 <div v-for="(cp, i) in config.membershipSettings.contactPersons" :key="i" class="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <AnimatedInput v-model="cp.name" label="Inquiry contact" />
                    <AnimatedInput v-model="cp.phone" label="Mobile vector" />
                    <button @click="removeContactPerson(i)" class="text-slate-300 hover:text-rose-500 transition-colors"><LucideTrash2 :size="16" /></button>
                 </div>
                 <button @click="addContactPerson" class="text-[11px] font-bold text-[#003366] hover:underline w-full text-center">Add protocol contact</button>
              </div>
              <AnimatedInput v-model="config.membershipSettings.telegramLink" label="Telegram community URI" />
           </div>
        </div>

        <!-- Enrollment Benefits -->
        <div class="admin-card p-10 space-y-6">
           <div class="flex justify-between items-center border-b border-slate-100 pb-4">
              <h4 class="text-sm font-bold text-slate-800">Protocol benefits & strategic value</h4>
              <button @click="addBenefit" class="bg-[#003366] text-white px-5 py-2 rounded-xl text-[11px] font-bold hover:brightness-110 transition-all">Add strategic value</button>
           </div>
           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="(benefit, i) in config.membershipSettings.benefits" :key="i" class="flex gap-4 items-center bg-slate-50 p-4 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                 <div class="w-8 h-8 rounded-lg bg-[#003366]/10 flex items-center justify-center text-[#003366] font-bold">{{ i + 1 }}</div>
                 <AnimatedInput v-model="config.membershipSettings.benefits[i]" label="Strategic benefit" class="flex-1" />
                 <button @click="removeBenefit(i)" class="text-slate-300 hover:text-rose-500 transition-colors p-2"><LucideTrash2 :size="18" /></button>
              </div>
           </div>
        </div>
      </div>

      <!-- Scientific Board -->
      <div v-if="activeTab === 'board'" class="space-y-8 animate-in fade-in slide-in-from-bottom-2">
        <div class="flex justify-between items-center px-1">
          <div>
            <h3 class="text-lg font-bold text-slate-800">Scientific board appointments</h3>
            <p class="text-xs text-slate-400 font-medium">Elevate registered members to the official public-facing scientific board.</p>
          </div>
        </div>

        <div class="admin-card overflow-hidden">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Member profile</th>
                <th>Board designation</th>
                <th>Board status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="member in allMembers" :key="member._id">
                <td class="py-4">
                  <div class="flex items-center gap-3">
                    <div v-if="member.profileImage" class="w-10 h-10 rounded-xl overflow-hidden border border-slate-100">
                      <img :src="member.profileImage" class="w-full h-full object-cover" />
                    </div>
                    <div v-else class="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                      <LucideUser :size="20" />
                    </div>
                    <div>
                      <p class="font-bold text-slate-800 text-sm">{{ member.fullName || member.name }}</p>
                      <p class="text-[11px] text-slate-400 font-bold">{{ member.email }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <AnimatedInput 
                    v-model="member.designation" 
                    placeholder="e.g. Board Chairman" 
                    :disabled="!member.isBoardMember"
                    position="middle"
                  />
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button 
                    @click="member.isBoardMember = !member.isBoardMember"
                    :class="['w-12 h-6 rounded-full transition-all duration-300 relative', member.isBoardMember ? 'bg-emerald-500' : 'bg-slate-200']"
                  >
                    <div :class="['w-4 h-4 bg-white rounded-full shadow absolute top-1 transition-all duration-300', member.isBoardMember ? 'left-7' : 'left-1']"></div>
                  </button>
                </td>
                <td>
                   <button 
                    @click="updateMemberBoardStatus(member)"
                    class="text-[11px] font-bold px-4 py-2 bg-[#003366]/5 text-[#003366] rounded-lg hover:bg-[#003366] hover:text-white transition-all"
                    title="Apply changes"
                   >
                     <LucideCheck :size="16" />
                   </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  LucideSettings, 
  LucideImage, 
  LucideBarChart3, 
  LucideColumns3, 
  LucideRocket, 
  LucideInfo, 
  LucidePhone, 
  LucideBot, 
  LucideZap, 
  LucideSave, 
  LucideLoader2, 
  LucidePlus, 
  LucideTrash2,
  LucideZapOff,
  LucideUsers,
  LucideUser,
  LucideUserPlus,
  LucideAward,
  LucideCheckCircle,
  LucideSend,
  LucideCheck
} from 'lucide-vue-next'
import AnimatedInput from '@/components/AnimatedInput.vue'
import { ref, reactive, onMounted } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'

const api = useApi()
const { showToast } = useCustomToast()
const saving = ref(false)
const activeTab = ref('general')

const tabs = [
  { key: 'general', label: 'Platform identity', icon: LucideSettings },
  { key: 'hero', label: 'Visual assets', icon: LucideImage },
  { key: 'stats', label: 'Performance', icon: LucideBarChart3 },
  { key: 'pillars', label: 'Excellence pillars', icon: LucideColumns3 },
  { key: 'initiatives', label: 'Objectives', icon: LucideRocket },
  { key: 'about', label: 'Ethos', icon: LucideInfo },
  { key: 'contact', label: 'Vectors', icon: LucidePhone },
  { key: 'chatbot', label: 'AI parameters', icon: LucideBot },
  { key: 'quickReplies', label: 'Response hub', icon: LucideZap },
]

const config = reactive({
  siteName: '',
  siteDescription: '',
  logoUrl: '',
  heroSlides: [],
  stats: [],
  pillars: [],
  initiatives: [],
  marqueeItems: [],
  aboutContent: { title: '', description: '', mission: '', vision: '' },
  contactInfo: { email: '', phone: '', address: '' },
  socialLinks: { facebook: '', twitter: '', linkedin: '', instagram: '' },
  chatbotKnowledge: [],
  predefinedResponses: [],
  membershipSettings: {
    about: '',
    leadership: [],
    benefits: [],
    newRegistrationFee: 20000,
    renewalFee: 10000,
    bankName: '',
    accountNumber: '',
    accountName: '',
    registrationDeadline: '',
    contactPersons: [],
    telegramLink: ''
  }
})

const allMembers = ref([])

onMounted(async () => {
  const { data: cmsData } = await api.cms.getConfig()
  if (cmsData) {
    Object.assign(config, {
      siteName: cmsData.siteName || '',
      siteDescription: cmsData.siteDescription || '',
      logoUrl: cmsData.logoUrl || '',
      heroSlides: cmsData.heroSlides || [],
      stats: cmsData.stats || [],
      pillars: cmsData.pillars || [],
      initiatives: cmsData.initiatives || [],
      marqueeItems: cmsData.marqueeItems || [],
      aboutContent: cmsData.aboutContent || { title: '', description: '', mission: '', vision: '' },
      contactInfo: cmsData.contactInfo || { email: '', phone: '', address: '' },
      socialLinks: cmsData.socialLinks || { facebook: '', twitter: '', linkedin: '', instagram: '' },
      chatbotKnowledge: cmsData.chatbotKnowledge || [],
      predefinedResponses: cmsData.predefinedResponses || [],
      membershipSettings: cmsData.membershipSettings || {
        about: '',
        leadership: [],
        benefits: [],
        newRegistrationFee: 20000,
        renewalFee: 10000,
        bankName: '',
        accountNumber: '',
        accountName: '',
        registrationDeadline: '',
        contactPersons: [],
        telegramLink: ''
      }
    })
  }

  const { data: memberData } = await api.members.getAll()
  if (memberData) {
    allMembers.value = memberData
  }
})

const updateMemberBoardStatus = async (member) => {
  try {
    await api.members.update(member._id, { 
      isBoardMember: member.isBoardMember, 
      designation: member.designation 
    })
    showToast({ title: 'Update Successful', message: `Board appointment updated for ${member.fullName}`, toastType: 'success' })
  } catch (err) {
    showToast({ title: 'Update Failed', message: 'Failed to update board appointment.', toastType: 'error' })
  }
}

const saveAllChanges = async () => {
  saving.value = true
  try {
    await api.cms.updateConfig({ ...config })
    showToast({ title: 'Synchronization Complete', message: 'Global configuration updated.', toastType: 'success' })
  } catch (err) {
    showToast({ title: 'Synchronization Failure', message: 'Unable to commit changes to the platform registry.', toastType: 'error' })
  } finally {
    saving.value = false
  }
}

// Hero Slides
const addSlide = () => config.heroSlides.push({ tag: '', title: '', desc: '', image: '' })
const removeSlide = (i) => config.heroSlides.splice(i, 1)

// Stats
const addStat = () => config.stats.push({ value: '', label: '' })
const removeStat = (i) => config.stats.splice(i, 1)

// Pillars
const addPillar = () => config.pillars.push({ title: '', desc: '', icon: '' })
const removePillar = (i) => config.pillars.splice(i, 1)

// Initiatives
const addInitiative = () => config.initiatives.push({ title: '', desc: '', icon: '', to: '' })
const removeInitiative = (i) => config.initiatives.splice(i, 1)

// Chatbot Knowledge
const addKnowledge = () => config.chatbotKnowledge.push('')
const removeKnowledge = (i) => config.chatbotKnowledge.splice(i, 1)

// Quick Replies
const addQuickReply = () => config.predefinedResponses.push({ category: 'General support', label: '', text: '' })
const removeQuickReply = (i) => config.predefinedResponses.splice(i, 1)

// Membership Helpers
const addLeader = () => config.membershipSettings.leadership.push({ name: '', tenure: '' })
const removeLeader = (i) => config.membershipSettings.leadership.splice(i, 1)

const addBenefit = () => config.membershipSettings.benefits.push('')
const removeBenefit = (i) => config.membershipSettings.benefits.splice(i, 1)

const addContactPerson = () => config.membershipSettings.contactPersons.push({ name: '', phone: '' })
const removeContactPerson = (i) => config.membershipSettings.contactPersons.splice(i, 1)
</script>
