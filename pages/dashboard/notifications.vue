<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-4 px-1">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">System Alerts & Notifications</h2>
        <p class="text-base text-slate-500 font-medium">Review pending verification requests, payments, and system updates.</p>
      </div>
      <button @click="markAllAsRead" class="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[11px] font-bold hover:border-[#003366] hover:text-[#003366] transition-all">
        Mark all as read
      </button>
    </div>

    <!-- Notifications List -->
    <div class="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
      <div class="divide-y divide-slate-50">
        <div v-if="notifications.length === 0" class="p-20 text-center">
           <EmptyState title="No notifications" message="Your admin alert queue is currently empty." :icon="LucideBellOff" />
        </div>

        <div 
          v-for="notif in notifications" 
          :key="notif.id"
          class="p-6 sm:p-8 hover:bg-slate-50/50 transition-all flex gap-5 sm:gap-6 items-start group"
          :class="{ 'bg-[#003366]/5': !notif.read }"
        >
          <div :class="[
            'w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm transition-transform group-hover:scale-110',
            notif.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
            notif.type === 'warning' ? 'bg-amber-50 text-amber-600 border-amber-100' :
            notif.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-100' :
            'bg-[#003366]/10 text-[#003366] border-[#003366]/20'
          ]">
            <component :is="getIcon(notif.type)" :size="24" />
          </div>

          <div class="flex-1 space-y-2 min-w-0">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div class="flex items-center gap-3">
                <h4 class="text-[13px] sm:text-base font-bold text-slate-800 truncate">{{ notif.title }}</h4>
                <span v-if="!notif.read" class="px-2 py-0.5 bg-[#003366] text-white text-[9px] font-black rounded-full tracking-widest uppercase">New</span>
              </div>
              <span class="text-[10px] sm:text-sm font-bold text-slate-400 shrink-0">{{ notif.time }}</span>
            </div>
            <p class="text-[11px] sm:text-base text-slate-500 leading-relaxed max-w-3xl">{{ notif.message }}</p>
            
            <div class="pt-4 flex items-center gap-4">
               <button @click="markAsRead(notif.id)" v-if="!notif.read" class="text-[10px] font-black text-[#003366] hover:underline transition-all">Mark as read</button>
               <button class="text-[10px] font-black text-slate-400 hover:text-slate-800 transition-colors">Archive</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  LucideCheckCircle, 
  LucideAlertTriangle, 
  LucideXCircle, 
  LucideInfo,
  LucideBellOff
} from 'lucide-vue-next'
import { useNotifications } from '@/composables/core/useNotifications'
import EmptyState from '@/components/core/EmptyState.vue'

const { notifications, markAsRead, markAllAsRead } = useNotifications()

const getIcon = (type) => {
  switch (type) {
    case 'success': return LucideCheckCircle
    case 'warning': return LucideAlertTriangle
    case 'error': return LucideXCircle
    default: return LucideInfo
  }
}
</script>

<style scoped>
.animate-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
