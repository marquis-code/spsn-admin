<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r h-screen sticky top-0 flex flex-col pt-6 overflow-y-auto">
      <div class="px-6 mb-10 flex items-center gap-2">
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">CP</div>
        <h1 class="font-bold text-accent text-lg">SCPSN ADMIN</h1>
      </div>

      <nav class="flex-grow px-4 space-y-1">
        <NuxtLink v-for="item in menuItems" :key="item.to" :to="item.to" class="sidebar-link" active-class="sidebar-link-active">
          <component :is="item.icon" :size="20" />
          <span class="text-sm font-semibold">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <div class="p-4 border-t mt-auto">
         <div class="bg-primary/5 rounded-xl p-4">
            <p class="text-[10px] font-bold text-primary uppercase mb-1">Current User</p>
            <p class="text-sm font-bold text-accent">Admin Moderator</p>
            <button class="text-xs text-red-500 font-semibold mt-2 hover:underline">Logout</button>
         </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-grow flex flex-col h-screen overflow-hidden">
      <!-- Navbar -->
      <header class="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div class="flex items-center gap-4">
           <div class="bg-slate-100 p-2 rounded-lg text-accent-light">
             <LucideSearch :size="18" />
           </div>
           <input type="text" placeholder="Search anything..." class="bg-transparent border-none focus:ring-0 text-sm w-64" />
        </div>
        <div class="flex items-center gap-6">
           <button class="relative text-accent-light p-2 hover:bg-slate-50 rounded-lg">
             <LucideBell :size="20" />
             <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
           </button>
           <div class="h-8 w-[1px] bg-gray-200"></div>
           <div class="flex items-center gap-3">
             <div class="w-10 h-10 bg-gradient-to-tr from-primary to-primary-light rounded-xl flex items-center justify-center text-white font-bold">A</div>
             <div class="hidden sm:block">
               <p class="text-xs font-bold text-accent">Administrator</p>
               <p class="text-[10px] text-gray-400">admin@scpsn.org.ng</p>
             </div>
           </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-grow overflow-y-auto p-8">
        <slot />
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
  LucideNewspaper
} from 'lucide-vue-next'

const menuItems = [
  { label: 'Overview', to: '/', icon: LucideLayoutDashboard },
  { label: 'Members', to: '/members', icon: LucideUsers },
  { label: 'Conferences', to: '/conferences', icon: LucideCalendar },
  { label: 'Abstracts Review', to: '/abstracts', icon: LucideFileText },
  { label: 'Blog & News', to: '/blogs', icon: LucideNewspaper },
  { label: 'Appointments', to: '/appointments', icon: LucideCheckSquare },
  { label: 'Guest Inquiries', to: '/enquiries', icon: LucideMessageCircle },
  { label: 'Form Builder', to: '/forms', icon: LucideClipboardList },
  { label: 'Payments', to: '/payments', icon: LucideCreditCard },
]
</script>
