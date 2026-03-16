<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <div class="w-full max-w-sm">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold text-accent italic underline decoration-primary decoration-4">SCPSN ADMIN</h1>
        <p class="text-gray-400 font-bold mt-2 uppercase text-[10px] tracking-widest">Management Portal Login</p>
      </div>

      <div class="admin-card p-10 shadow-2xl shadow-slate-200">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Administrator Email</label>
            <input 
              v-model="email" 
              type="email" 
              required 
              class="w-full bg-slate-50 border rounded-xl px-4 py-3 text-accent font-semibold outline-none focus:ring-2 ring-primary transition-all"
              placeholder="admin@scpsn.org.ng"
            >
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
            <input 
              v-model="password" 
              type="password" 
              required 
              class="w-full bg-slate-50 border rounded-xl px-4 py-3 text-accent font-semibold outline-none focus:ring-2 ring-primary transition-all"
              placeholder="••••••••"
            >
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full btn-primary py-4 font-bold shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ loading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD' }}
          </button>
        </form>
        
        <div class="mt-8 pt-8 border-t text-center">
            <p class="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Secure Enterprise Access System</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLogin } from '@/composables/modules/auth/useLogin'

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
    router.push('/')
  }
}
</script>
