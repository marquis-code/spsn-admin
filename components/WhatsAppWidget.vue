<template>
  <div class="fixed bottom-24 right-6 z-[100] group/wa">
    <!-- Popup Menu -->
    <transition 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-4 opacity-0 scale-95"
      enter-to-class="translate-y-0 opacity-100 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100 scale-100"
      leave-to-class="translate-y-4 opacity-0 scale-95"
    >
      <div v-if="showWhatsAppMenu" class="absolute bottom-20 right-0 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform origin-bottom-right">
        <div class="bg-[#25D366] p-6 text-white">
          <h4 class="font-black text-lg leading-tight text-white mb-1">Contact Us</h4>
          <p class="text-white/80 text-xs font-medium">Choose your vibe below!</p>
        </div>
        <div class="p-4 space-y-2">
          <a 
            href="https://wa.me/2349060012295?text=Hello WiseKings! I'd like to place an order." 
            target="_blank"
            class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors group/link"
            @click="showWhatsAppMenu = false"
          >
            <div class="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover/link:bg-emerald-600 group-hover/link:text-white transition-all">
              <Icon name="lucide:shopping-bag" size="20" />
            </div>
            <div>
              <div class="text-sm font-black text-gray-900">Orders</div>
              <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">0906 001 2295</div>
            </div>
          </a>
          <a 
            href="https://wa.me/2347036989975?text=Hello WiseKings! I need some help." 
            target="_blank"
            class="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors group/link"
            @click="showWhatsAppMenu = false"
          >
            <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover/link:bg-blue-600 group-hover/link:text-white transition-all">
              <Icon name="lucide:headphones" size="20" />
            </div>
            <div>
              <div class="text-sm font-black text-gray-900">Help Line</div>
              <div class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">0703 698 9975</div>
            </div>
          </a>
        </div>
      </div>
    </transition>

    <!-- Main Button -->
    <button 
      @click="showWhatsAppMenu = !showWhatsAppMenu"
      class="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-200 border-4 border-white active:scale-95 transition-all group-hover/wa:rotate-12"
    >
      <Icon v-if="!showWhatsAppMenu" name="logos:whatsapp-icon" size="28" />
      <Icon v-else name="lucide:x" size="24" />
      
      <!-- Pulse Effect -->
      <span class="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 -z-10"></span>
    </button>
  </div>
</template>

<script setup lang="ts">
const showWhatsAppMenu = ref(false)
</script>
