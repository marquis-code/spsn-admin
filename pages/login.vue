<template>
  <div class="min-h-screen bg-white flex overflow-hidden font-sans">
    <!-- Left Side: Login Form -->
    <div class="w-full lg:w-[45%] flex flex-col justify-center p-8 md:p-16 lg:p-24 relative z-10 bg-white">
      <div class="max-w-md w-full mx-auto">
        <!-- Logo/Header Section -->
        <header class="mb-12">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 mb-6">
            <LucideShieldCheck :size="16" class="text-[#033958]" />
            <span class="text-[10px] font-bold  tracking-[0.2em] text-slate-500">Secure Admin Access</span>
          </div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight mb-4">
            Welcome <span class="text-[#033958]">Back</span>
          </h1>
          <p class="text-slate-500 text-lg font-medium leading-relaxed">
            Enter your administrative credentials to manage the platform.
          </p>
        </header>

        <!-- Professional Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-1">
            <AnimatedInput 
              v-model="email" 
              type="email" 
              label="Email Address"
              placeholder="admin@scpsn.org.ng"
              position="top"
            >
              <template #right>
                <LucideUser :size="18" class="text-slate-300 group-focus-within:text-[#033958] transition-colors" />
              </template>
            </AnimatedInput>
            
            <AnimatedInput 
              v-model="password" 
              type="password" 
              label="Password"
              placeholder="••••••••••••"
              position="bottom"
            />
          </div>

          <div class="flex items-center justify-between py-2">
            <label class="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" class="w-4 h-4 rounded border-slate-300 text-[#033958] focus:ring-[#033958] transition-all">
              <span class="text-sm font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
            </label>
            <button type="button" class="text-sm font-bold text-[#033958] hover:text-[#055a8c] transition-colors">
              Forgot Password?
            </button>
          </div>

          <!-- Login Action -->
          <div class="pt-4">
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full group relative flex items-center justify-center gap-3 bg-[#033958] hover:bg-[#022f42] text-white py-3 rounded-2xl text-sm font-bold tracking-widest  shadow-xl shadow-[#033958]/20 transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
              <div v-if="loading" class="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
              <template v-else>
                <span>Login to Dashboard</span>
                <LucideArrowRight :size="18" class="group-hover:translate-x-1 transition-transform" />
              </template>
            </button>
          </div>
        </form>

        <!-- Footer -->
        <footer class="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-bold text-slate-400  tracking-widest">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            System Fully Operational
          </div>
          <span>&copy; 2024 SCPSN &bull; Admin v2.0</span>
        </footer>
      </div>
    </div>

    <!-- Right Side: Visual Content -->
    <div class="hidden lg:block lg:w-[55%] relative overflow-hidden bg-[#033958]">
      <!-- Background Image with Overlay -->
      <img 
        src="/images/auth-bg.png" 
        alt="Auth Background" 
        class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 scale-110 animate-subtle-zoom"
      />
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-[#033958]/80 via-transparent to-[#033958]/40"></div>

      <!-- Floating Content -->
      <div class="absolute inset-0 flex flex-col items-center justify-center text-white p-12 text-center">
        <div class="max-w-lg space-y-8 backdrop-blur-md bg-white/5 p-12 rounded-[40px] border border-white/10 shadow-2xl">
          <div class="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-inner">
            <LucideShieldCheck :size="40" class="text-cyan-400" />
          </div>
          <h2 class="text-4xl font-bold tracking-tight">Enterprise Intelligence</h2>
          <p class="text-white/70 text-lg leading-relaxed">
            Experience the next generation of platform management with our streamlined administrative interface.
          </p>
          <div class="grid grid-cols-3 gap-6 pt-4">
            <div class="text-center">
              <div class="text-2xl font-black text-cyan-400 tracking-tighter">99.9%</div>
              <div class="text-[10px] font-bold  tracking-widest text-white/40">Uptime</div>
            </div>
            <div class="text-center border-x border-white/10">
              <div class="text-2xl font-black text-cyan-400 tracking-tighter">256-bit</div>
              <div class="text-[10px] font-bold  tracking-widest text-white/40">Encryption</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-black text-cyan-400 tracking-tighter">Instant</div>
              <div class="text-[10px] font-bold  tracking-widest text-white/40">Analytics</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Animated Decorative Elements -->
      <div class="absolute top-10 right-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
    </div>
  </div>
</template>

<script setup>
import { useLogin } from '@/composables/modules/auth/useLogin'
import { LucideUser, LucideLock, LucideShieldCheck, LucideArrowRight } from 'lucide-vue-next'
import AnimatedInput from '@/components/AnimatedInput.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'auth'
})

const email = ref('')
const password = ref('')
const router = useRouter()
const { loading, login } = useLogin()

const handleLogin = async () => {
  const res = await login({ email: email.value, password: password.value })
  if (res) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes subtle-zoom {
  0% { transform: scale(1.1); }
  100% { transform: scale(1.2); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}

.animate-subtle-zoom {
  animation: subtle-zoom 20s infinite alternate ease-in-out;
}
</style>


