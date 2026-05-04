<template>
  <ClientOnly>
    <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="modelValue" class="fixed inset-0 z-[9999] flex items-center justify-end" @click.self="close">
        <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="close"></div>
        
        <Transition
          enter-active-class="transition duration-300 ease-out transform"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition duration-200 ease-in transform"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div v-if="modelValue" class="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-slate-200">
            <!-- Header -->
            <div class="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 class="font-black text-slate-800 text-lg">Practitioner Details</h3>
              <button @click="close" class="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl transition-all shadow-sm">
                <LucideX :size="20" />
              </button>
            </div>

            <!-- Content -->
            <div v-if="member" class="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              <!-- Profile Header -->
              <div class="flex items-center gap-5">
                <div class="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#003366] font-black border border-slate-100 text-xl shadow-sm">
                  {{ getInitials(member.name) }}
                </div>
                <div>
                  <h4 class="text-xl font-bold text-slate-800">{{ member.name }}</h4>
                  <p class="text-xs font-bold text-slate-400 mt-1">{{ member.email }}</p>
                  <span :class="['inline-block mt-2 badge-premium text-[9px]', member.isActive !== false ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100']">
                    {{ member.isActive !== false ? 'Active Account' : 'Inactive Account' }}
                  </span>
                </div>
              </div>

              <!-- Information Grid -->
              <div class="space-y-6">
                <div>
                  <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Professional Identity</h5>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p class="text-[10px] font-bold text-slate-400 mb-1">Membership ID</p>
                      <p class="text-xs font-bold text-slate-800 font-mono">{{ member.membershipId || 'Pending' }}</p>
                    </div>
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p class="text-[10px] font-bold text-slate-400 mb-1">Designation</p>
                      <p class="text-xs font-bold text-slate-800">{{ member.role || 'Member' }}</p>
                    </div>
                    <div class="bg-slate-50 p-3 rounded-xl border border-slate-100 col-span-2">
                      <p class="text-[10px] font-bold text-slate-400 mb-1">Specialization</p>
                      <p class="text-xs font-bold text-slate-800">{{ member.specialization || 'General Clinical Pharmacy' }}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Contact & Operations</h5>
                  <div class="space-y-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-[#003366]/5 text-[#003366] flex items-center justify-center shrink-0">
                        <LucidePhone :size="14" />
                      </div>
                      <div>
                        <p class="text-[10px] font-bold text-slate-400">Phone Number</p>
                        <p class="text-xs font-bold text-slate-800">{{ member.phone || 'Not provided' }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-lg bg-[#003366]/5 text-[#003366] flex items-center justify-center shrink-0">
                        <LucideCalendar :size="14" />
                      </div>
                      <div>
                        <p class="text-[10px] font-bold text-slate-400">Enrollment Date</p>
                        <p class="text-xs font-bold text-slate-800">{{ formatDate(member.createdAt) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="member.isBoardMember">
                  <h5 class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-100 pb-2">Leadership Status</h5>
                  <div class="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                    <LucideAward :size="18" class="text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <p class="text-xs font-bold text-amber-900">Scientific Board Member</p>
                      <p class="text-[10px] font-bold text-amber-700/70 mt-1">Designation: {{ member.designation || 'Board Member' }}</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Footer Actions -->
            <div class="p-6 border-t border-slate-100 bg-slate-50/50 mt-auto">
              <button @click="close" class="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                Close details
              </button>
            </div>

          </div>
        </Transition>
      </div>
    </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import { LucideX, LucidePhone, LucideCalendar, LucideAward } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  member: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue'])

const close = () => {
  emit('update:modelValue', false)
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
