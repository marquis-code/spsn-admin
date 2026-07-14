<template>
  <div class="auth-page">
    <!-- Left: Form -->
    <div class="form-side">
      <div class="form-inner">

        <div class="org-mark">
          <span class="org-dot"></span>
          <span>SCPSN · Secure Portal</span>
        </div>

        <header class="form-header">
          <h1>Welcome back</h1>
          <p>Sign in to your administrative account to manage the platform.</p>
        </header>

        <form @submit.prevent="handleLogin" class="login-form">

          <div class="field-stack">
            <div class="field-item">
              <label for="email">Email address</label>
              <div class="input-wrap" :class="{ focused: emailFocused }">
                <LucideUser :size="15" class="input-icon" />
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="admin@scpsn.org.ng"
                  @focus="emailFocused = true"
                  @blur="emailFocused = false"
                />
              </div>
            </div>

            <div class="field-item">
              <label for="password">Password</label>
              <div class="input-wrap" :class="{ focused: passwordFocused }">
                <LucideLock :size="15" class="input-icon" />
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  @focus="passwordFocused = true"
                  @blur="passwordFocused = false"
                />
                <button type="button" class="toggle-pw" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                  <LucideEye v-if="!showPassword" :size="14" />
                  <LucideEyeOff v-else :size="14" />
                </button>
              </div>
            </div>
          </div>

          <div class="form-meta">
            <label class="remember-label">
              <input type="checkbox" v-model="remember" />
              <span>Remember me</span>
            </label>
            <button type="button" class="forgot-btn" @click.prevent="navigateTo('/forgot-password')">Forgot password?</button>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            <template v-else>
              <span>Sign in to dashboard</span>
              <LucideArrowRight :size="16" />
            </template>
          </button>

        </form>

        <footer class="form-footer">
          <span class="status-row">
            <span class="status-dot"></span>
            All systems operational
          </span>
          <span>© 2024 SCPSN · v2.0</span>
        </footer>
      </div>
    </div>

    <!-- Right: Visual Panel -->
    <div class="visual-side">
      <div class="visual-inner">

        <!-- Subtle hex pattern -->
        <svg class="hex-pattern" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="hexPat" x="0" y="0" width="40" height="46" patternUnits="userSpaceOnUse">
              <polygon points="20,2 37,11 37,29 20,38 3,29 3,11" fill="none" stroke="#0f4c35" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexPat)" opacity="0.35"/>
        </svg>

        <!-- Scope ring -->
        <div class="scope-ring">
          <div class="scope-cross scope-h"></div>
          <div class="scope-cross scope-v"></div>
          <div class="cell c1"></div>
          <div class="cell c2"></div>
          <div class="cell c3"></div>
          <div class="cell c4"></div>
          <div class="cell c5"></div>
        </div>

        <div class="visual-text">
          <div class="slide-tag">H&amp;E Stain · ×40 · Slide SPN-2024</div>
          <h2>Pathology<br><em>Intelligence</em></h2>
          <p>Next-generation platform management for the Society for Cellular Pathology Scientists of Nigeria.</p>
        </div>

        <!-- Stats -->
        <div class="stat-row">
          <div class="stat">
            <span class="stat-n">12.4k</span>
            <span class="stat-l">Specimens</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-n">384</span>
            <span class="stat-l">Members</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-n">99.9%</span>
            <span class="stat-l">Uptime</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { LucideUser, LucideLock, LucideArrowRight, LucideEye, LucideEyeOff } from 'lucide-vue-next'
import { useLogin } from '@/composables/modules/auth/useLogin'

definePageMeta({ layout: 'auth' })

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const emailFocused = ref(false)
const passwordFocused = ref(false)
const router = useRouter()
const { loading, login } = useLogin()

const handleLogin = async () => {
  const res = await login({ email: email.value, password: password.value })
  if (res?.requires2FA) {
    router.push({ path: '/verify-2fa', query: { email: email.value } })
  } else if (res) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');

/* ── Layout ──────────────────────────────────────────── */
.auth-page {
  display: flex;
  min-height: 100vh;
  background: #fff;
  font-family: 'Outfit', sans-serif;
}

/* ── Left: Form side ─────────────────────────────────── */
.form-side {
  width: 46%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 40px;
  background: #fff;
  border-right: 1px solid #e8ede9;
}

.form-inner {
  width: 100%;
  max-width: 380px;
}

.org-mark {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
  padding: 5px 12px;
  border: 1px solid #c6ddd0;
  border-radius: 4px;
  background: #f4faf7;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: #2d6a4f;
  font-weight: 500;
}

.org-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2d6a4f;
  flex-shrink: 0;
}

/* ── Header ──────────────────────────────────────────── */
.form-header {
  margin-bottom: 32px;
}

.form-header h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 38px;
  font-weight: 600;
  color: #0d1f16;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: 8px;
}

.form-header p {
  font-size: 14px;
  color: #6b7c72;
  font-weight: 400;
  line-height: 1.55;
}

/* ── Form ────────────────────────────────────────────── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-item label {
  font-size: 12px;
  font-weight: 500;
  color: #3a4f42;
  letter-spacing: 0.01em;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  height: 48px;
  border: 1px solid #d4e0d8;
  border-radius: 8px;
  background: #fafcfb;
  transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
}

.input-wrap.focused {
  border-color: #2d6a4f;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.08);
}

.input-icon {
  color: #a0b4a8;
  flex-shrink: 0;
}

.input-wrap.focused .input-icon {
  color: #2d6a4f;
}

.input-wrap input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: #0d1f16;
  font-weight: 400;
}

.input-wrap input::placeholder {
  color: #b0bfb7;
}

.toggle-pw {
  background: none;
  border: none;
  cursor: pointer;
  color: #9aada3;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.15s;
}
.toggle-pw:hover { color: #2d6a4f; }

/* ── Form meta ───────────────────────────────────────── */
.form-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.remember-label {
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  font-size: 13px;
  color: #5a7065;
  font-weight: 400;
}

.remember-label input {
  width: 14px;
  height: 14px;
  accent-color: #2d6a4f;
  cursor: pointer;
}

.forgot-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #2d6a4f;
  font-family: 'Outfit', sans-serif;
  transition: color 0.15s;
  padding: 0;
}
.forgot-btn:hover { color: #1a4a33; }

/* ── Submit ──────────────────────────────────────────── */
.submit-btn {
  height: 50px;
  background: #1a4a33;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  letter-spacing: 0.01em;
  transition: background 0.18s, transform 0.1s;
}
.submit-btn:hover { background: #143d29; }
.submit-btn:active { transform: scale(0.99); }
.submit-btn:disabled { opacity: 0.55; cursor: not-allowed; }

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Footer ──────────────────────────────────────────── */
.form-footer {
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #eef3f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #9aada3;
  font-weight: 400;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #2d6a4f;
  animation: pulse 2.4s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ── Right: Visual side ──────────────────────────────── */
.visual-side {
  width: 54%;
  background: #0d1f16;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hex-pattern {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.visual-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  padding: 48px 40px;
  text-align: center;
}

/* ── Scope ring ──────────────────────────────────────── */
.scope-ring {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 1px solid rgba(45, 212, 160, 0.25);
  position: relative;
  flex-shrink: 0;
}

.scope-ring::before {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  border: 1px solid rgba(45, 212, 160, 0.1);
}

.scope-cross {
  position: absolute;
  background: rgba(45, 212, 160, 0.2);
}

.scope-h {
  left: 12%;
  right: 12%;
  top: 50%;
  height: 1px;
  transform: translateY(-50%);
}

.scope-v {
  top: 12%;
  bottom: 12%;
  left: 50%;
  width: 1px;
  transform: translateX(-50%);
}

.cell {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(45, 212, 160, 0.35);
  background: rgba(45, 212, 160, 0.04);
  animation: cellpulse 3s ease-in-out infinite;
}
.c1 { width: 26px; height: 26px; top: 28%; left: 22%; animation-delay: 0s; }
.c2 { width: 18px; height: 18px; top: 52%; left: 52%; animation-delay: 0.6s; }
.c3 { width: 22px; height: 22px; top: 18%; left: 54%; animation-delay: 1.1s; }
.c4 { width: 14px; height: 14px; top: 62%; left: 26%; animation-delay: 1.7s; }
.c5 { width: 30px; height: 30px; top: 42%; left: 55%; animation-delay: 2.2s; }

@keyframes cellpulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.85; }
}

/* ── Visual text ─────────────────────────────────────── */
.visual-text {
  color: #fff;
}

.slide-tag {
  font-size: 11px;
  color: rgba(45, 212, 160, 0.7);
  letter-spacing: 0.06em;
  font-weight: 400;
  margin-bottom: 12px;
}

.visual-text h2 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 40px;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 12px;
  color: #f0ede8;
}

.visual-text h2 em {
  font-style: italic;
  color: #2dd4a0;
}

.visual-text p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.65;
  font-weight: 300;
  max-width: 280px;
}

/* ── Stats ───────────────────────────────────────────── */
.stat-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 28px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.03);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-n {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px;
  font-weight: 600;
  color: #2dd4a0;
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-l {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
  font-weight: 400;
  letter-spacing: 0.04em;
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: rgba(255, 255, 255, 0.08);
}

/* ── Responsive ──────────────────────────────────────── */
@media (max-width: 900px) {
  .auth-page { flex-direction: column; }
  .form-side { width: 100%; border-right: none; }
  .visual-side { display: none; }
}
</style>