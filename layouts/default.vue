<template>
  <div class="h-screen w-full flex bg-[#F9FAFB] overflow-hidden font-sans">
    <!-- Mobile Backdrop -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] lg:hidden"
        @click="sidebarOpen = false"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <aside :class="[
      'fixed lg:relative inset-y-0 left-0 z-[120] flex-shrink-0 w-[280px] bg-white border-r border-slate-200 flex flex-col h-full transition-transform duration-300 ease-in-out',
      sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]">
      <!-- Sidebar Header -->
      <div class="p-6 lg:p-8 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-[#003366] rounded-xl flex items-center justify-center text-white font-black shrink-0">
            SC
          </div>
          <div class="truncate">
            <h1 class="font-bold text-slate-800 text-[14px] leading-none">SCPSN Admin</h1>
            <p class="text-[10px] text-slate-400 font-bold mt-1.5 opacity-60">Nexus portal</p>
          </div>
        </div>
        <button @click="sidebarOpen = false" class="lg:hidden p-2 -mr-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
          <LucideX :size="18" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 lg:px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          @click="sidebarOpen = false"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 font-bold transition-all duration-200 group hover:bg-slate-50 hover:text-[#003366]"
          active-class="!bg-slate-50 !text-[#003366] border border-slate-100"
        >
          <component :is="item.icon" :size="16" class="opacity-70 group-hover:opacity-100 shrink-0" />
          <span class="text-[12px] truncate">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Sidebar Footer -->
      <div class="p-5 lg:p-6 border-t border-slate-100 bg-slate-50/50 mt-auto">
        <div class="flex flex-col gap-1 mb-4">
          <p class="text-[10px] font-bold text-slate-400">Active session</p>
          <p class="text-[12px] font-bold text-slate-800 truncate">{{ user?.name || 'Administrator' }}</p>
        </div>
        <button @click="showLogoutModal = true" class="w-full flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-[11px] text-red-500 font-bold hover:bg-red-50 hover:border-red-100 transition-all">
          <LucidePower :size="12" />
          End session
        </button>
      </div>
    </aside>

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col h-full min-w-0 overflow-hidden relative">
      <!-- Header -->
      <header class="h-16 lg:h-20 bg-white px-4 lg:px-8 flex justify-between items-center border-b border-slate-200 shrink-0 z-[90]">
        <!-- Left: Hamburger + Search -->
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <button @click="sidebarOpen = true" class="lg:hidden p-2 -ml-1 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors shrink-0">
            <LucideMenu :size="20" />
          </button>
          <div class="hidden sm:flex items-center gap-3 group max-w-md w-full ml-4">
            <div class="text-slate-300 group-focus-within:text-[#003366] transition-colors shrink-0">
              <LucideSearch :size="16" />
            </div>
            <input type="text" placeholder="Search system..." class="bg-transparent border-none focus:ring-0 text-[12px] font-bold text-slate-600 w-full placeholder:text-slate-300 min-w-0" />
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-3 lg:gap-6 shrink-0">
          <button class="sm:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
            <LucideSearch :size="18" />
          </button>
          <button class="relative text-slate-400 p-2 hover:bg-slate-50 rounded-lg transition-colors">
            <LucideBell :size="18" />
            <span class="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-[#003366] rounded-full border border-white"></span>
          </button>

          <div class="hidden sm:block h-6 w-px bg-slate-100"></div>

          <div class="flex items-center gap-3 cursor-pointer group">
            <div class="text-right hidden md:block">
              <p class="text-[11px] font-bold text-slate-800">{{ user?.name || 'Admin user' }}</p>
              <p class="text-[10px] text-[#003366] font-bold opacity-60">Master admin</p>
            </div>
            <div class="w-9 h-9 lg:w-10 lg:h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#003366] font-bold border border-slate-100 group-hover:bg-[#003366] group-hover:text-white transition-all text-sm">
              {{ user?.name ? user.name.charAt(0).toUpperCase() : 'A' }}
            </div>
          </div>
        </div>
      </header>

      <!-- Scrollable Content Area -->
      <main 
        :class="[
          'flex-1 overflow-y-auto bg-[#F9FAFB] relative overflow-x-hidden',
          isChatRoute ? 'p-0' : 'p-4 sm:p-6 md:p-8 lg:p-10'
        ]"
      >
        <div :class="[isChatRoute ? 'max-w-none w-full h-full' : 'max-w-7xl mx-auto min-h-full']">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import {
  LucideLayoutDashboard,
  LucideUsers,
  LucideFileText,
  LucideCalendar,
  LucideCheckSquare,
  LucideMessageCircle,
  LucideClipboardList,
  LucideCreditCard,
  LucideNewspaper,
  LucideSearch,
  LucideBell,
  LucidePower,
  LucideSettings,
  LucideMessagesSquare,
  LucideMenu,
  LucideShieldCheck,
  LucideX
} from 'lucide-vue-next'
import ConfirmModal from '@/components/core/ConfirmModal.vue'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const { user, logout } = useAuth()
const route = useRoute()

const sidebarOpen = ref(false)
const showLogoutModal = ref(false)

const isChatRoute = computed(() => route.path === '/dashboard/chat')

const menuItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LucideLayoutDashboard },
  { label: 'Members', to: '/dashboard/members', icon: LucideUsers },
  { label: 'Enrollments', to: '/dashboard/enrollments', icon: LucideShieldCheck },
  { label: 'Events & Conferences', to: '/dashboard/conferences', icon: LucideCalendar },
  { label: 'Scientific Abstracts', to: '/dashboard/abstracts', icon: LucideFileText },
  { label: 'News & Publications', to: '/dashboard/blogs', icon: LucideNewspaper },
  { label: 'Appointments', to: '/dashboard/appointments', icon: LucideCheckSquare },
  { label: 'Enquiries', to: '/dashboard/enquiries', icon: LucideMessageCircle },
  { label: 'Live Chat', to: '/dashboard/chat', icon: LucideMessagesSquare },
  { label: 'Forms Management', to: '/dashboard/forms', icon: LucideClipboardList },
  { label: 'Payments', to: '/dashboard/payments', icon: LucideCreditCard },
  { label: 'Settings', to: '/dashboard/settings', icon: LucideSettings },
]

const handleLogout = () => {
  showLogoutModal.value = false
  logout()
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.06);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.12);
}
</style>
