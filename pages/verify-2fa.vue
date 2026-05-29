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
          <h1>Verify Identity</h1>
          <p>We sent a 6-digit verification code to <strong class="email-highlight">{{ maskedEmail }}</strong>. Enter it below to continue.</p>
        </header>

        <form @submit.prevent="handleVerify" class="login-form">

          <!-- OTP digit boxes -->
          <div class="otp-section">
            <label class="otp-label">Verification Code</label>
            <div class="otp-boxes" @paste="handlePaste">
              <input
                v-for="(_, i) in 6"
                :key="i"
                :ref="el => { if (el) otpRefs[i] = el }"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="1"
                class="otp-digit"
                :class="{ filled: digits[i], active: activeIdx === i, error: hasError }"
                :value="digits[i]"
                @input="onDigitInput($event, i)"
                @keydown="onKeyDown($event, i)"
                @focus="activeIdx = i"
                @blur="activeIdx = -1"
              />
            </div>
            <transition name="fade">
              <p v-if="hasError" class="otp-error">Invalid or expired code. Please try again.</p>
            </transition>
          </div>

          <!-- Resend -->
          <div class="resend-row">
            <span class="resend-text">Didn't receive the code?</span>
            <button
              v-if="resendCooldown <= 0"
              type="button"
              class="resend-btn"
              @click="handleResend"
              :disabled="resending"
            >
              {{ resending ? 'Sending...' : 'Resend code' }}
            </button>
            <span v-else class="resend-timer">Resend in {{ resendCooldown }}s</span>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading || otpValue.length < 6">
            <span v-if="loading" class="spinner"></span>
            <template v-else>
              <span>Verify &amp; continue</span>
              <LucideArrowRight :size="16" />
            </template>
          </button>

          <div class="back-row">
            <button type="button" class="back-btn" @click.prevent="navigateTo('/login')">
              <LucideArrowLeft :size="14" />
              <span>Back to sign in</span>
            </button>
          </div>

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

        <svg class="hex-pattern" viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <pattern id="hexPat2fa" x="0" y="0" width="40" height="46" patternUnits="userSpaceOnUse">
              <polygon points="20,2 37,11 37,29 20,38 3,29 3,11" fill="none" stroke="#0f4c35" stroke-width="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexPat2fa)" opacity="0.35"/>
        </svg>

        <!-- Shield icon -->
        <div class="shield-ring">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#2dd4a0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          <div class="shield-pulse"></div>
        </div>

        <div class="visual-text">
          <div class="slide-tag">Two-Factor Authentication · Active</div>
          <h2>Secure<br><em>Verification</em></h2>
          <p>Your account is protected with an additional layer of security via one-time codes.</p>
        </div>

        <div class="stat-row">
          <div class="stat">
            <span class="stat-n">256-bit</span>
            <span class="stat-l">Encryption</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-n">5 min</span>
            <span class="stat-l">Code Expiry</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-n">2FA</span>
            <span class="stat-l">Enabled</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { LucideArrowRight, LucideArrowLeft } from 'lucide-vue-next'
import { useVerify2FA } from '@/composables/modules/auth/useVerify2FA'
import { auth_api } from '@/api_factory/modules/auth'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: 'auth' })

const router = useRouter()
const route = useRoute()
const email = route.query.email || ''
const { showToast } = useCustomToast()

const digits = ref(['', '', '', '', '', ''])
const otpRefs = ref([])
const activeIdx = ref(-1)
const hasError = ref(false)
const resendCooldown = ref(60)
const resending = ref(false)
let cooldownInterval = null

const { loading, verify } = useVerify2FA()

const otpValue = computed(() => digits.value.join(''))

const maskedEmail = computed(() => {
  if (!email) return '***'
  const [local, domain] = email.split('@')
  if (!domain) return email
  const masked = local.length > 2
    ? local[0] + '•'.repeat(local.length - 2) + local[local.length - 1]
    : local[0] + '•'
  return `${masked}@${domain}`
})

const onDigitInput = (e, idx) => {
  hasError.value = false
  const val = e.target.value.replace(/\D/g, '')
  digits.value[idx] = val ? val[val.length - 1] : ''

  if (val && idx < 5) {
    otpRefs.value[idx + 1]?.focus()
  }

  // Auto-submit when all 6 digits filled
  if (otpValue.value.length === 6) {
    handleVerify()
  }
}

const onKeyDown = (e, idx) => {
  if (e.key === 'Backspace') {
    if (!digits.value[idx] && idx > 0) {
      digits.value[idx - 1] = ''
      otpRefs.value[idx - 1]?.focus()
      e.preventDefault()
    }
  } else if (e.key === 'ArrowLeft' && idx > 0) {
    otpRefs.value[idx - 1]?.focus()
    e.preventDefault()
  } else if (e.key === 'ArrowRight' && idx < 5) {
    otpRefs.value[idx + 1]?.focus()
    e.preventDefault()
  }
}

const handlePaste = (e) => {
  e.preventDefault()
  const pasted = (e.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
  if (!pasted) return
  for (let i = 0; i < 6; i++) {
    digits.value[i] = pasted[i] || ''
  }
  const focusIdx = Math.min(pasted.length, 5)
  otpRefs.value[focusIdx]?.focus()
  if (pasted.length === 6) {
    handleVerify()
  }
}

const handleVerify = async () => {
  if (!email || otpValue.value.length < 6) return
  hasError.value = false
  const res = await verify({ email, otp: otpValue.value })
  if (res) {
    router.push('/dashboard')
  } else {
    hasError.value = true
    // Shake & clear
    digits.value = ['', '', '', '', '', '']
    setTimeout(() => otpRefs.value[0]?.focus(), 300)
  }
}

const handleResend = async () => {
  if (!email) return
  resending.value = true
  try {
    await auth_api.login({ email, password: '__resend_otp__' })
  } catch {
    // The login will fail but we still want to allow retry
  }
  resending.value = false
  resendCooldown.value = 60
  startCooldown()
  showToast({ title: 'Code Sent', message: 'A new verification code has been sent to your email.', toastType: 'success' })
}

const startCooldown = () => {
  if (cooldownInterval) clearInterval(cooldownInterval)
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval)
      cooldownInterval = null
    }
  }, 1000)
}

onMounted(() => {
  startCooldown()
  setTimeout(() => otpRefs.value[0]?.focus(), 200)
})

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})
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
  max-width: 400px;
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

.email-highlight {
  color: #2d6a4f;
  font-weight: 500;
}

/* ── Form ────────────────────────────────────────────── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ── OTP Section ─────────────────────────────────────── */
.otp-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.otp-label {
  font-size: 12px;
  font-weight: 500;
  color: #3a4f42;
  letter-spacing: 0.01em;
}

.otp-boxes {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.otp-digit {
  width: 52px;
  height: 60px;
  border: 1.5px solid #d4e0d8;
  border-radius: 10px;
  background: #fafcfb;
  text-align: center;
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 600;
  color: #0d1f16;
  caret-color: #2d6a4f;
  outline: none;
  transition: all 0.2s ease;
}

.otp-digit::placeholder {
  color: #d4e0d8;
}

.otp-digit.active {
  border-color: #2d6a4f;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.1);
  transform: translateY(-2px);
}

.otp-digit.filled {
  border-color: #2d6a4f;
  background: #f0f9f4;
  color: #1a4a33;
}

.otp-digit.error {
  border-color: #dc2626;
  background: #fef2f2;
  animation: shake 0.5s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}

.otp-error {
  font-size: 12px;
  color: #dc2626;
  font-weight: 400;
  margin: 0;
  text-align: center;
}

/* ── Resend ──────────────────────────────────────────── */
.resend-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
}

.resend-text {
  color: #6b7c72;
}

.resend-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  color: #2d6a4f;
  font-family: 'Outfit', sans-serif;
  transition: color 0.15s;
  padding: 0;
}
.resend-btn:hover { color: #1a4a33; }
.resend-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.resend-timer {
  color: #9aada3;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

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
.submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Back ────────────────────────────────────────────── */
.back-row {
  display: flex;
  justify-content: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: #6b7c72;
  font-family: 'Outfit', sans-serif;
  transition: color 0.15s;
  padding: 0;
}
.back-btn:hover { color: #2d6a4f; }

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

/* ── Fade transition ─────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

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

/* ── Shield ──────────────────────────────────────────── */
.shield-ring {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid rgba(45, 212, 160, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.shield-ring::before {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  border: 1px solid rgba(45, 212, 160, 0.12);
}

.shield-pulse {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(45, 212, 160, 0.15);
  animation: shieldPulse 2.5s ease-in-out infinite;
}

@keyframes shieldPulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.08); opacity: 0; }
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
  .form-side { width: 100%; border-right: none; padding: 32px 20px; }
  .visual-side { display: none; }
  .otp-digit { width: 44px; height: 52px; font-size: 20px; }
  .otp-boxes { gap: 8px; }
}

@media (max-width: 400px) {
  .otp-digit { width: 38px; height: 46px; font-size: 18px; border-radius: 8px; }
  .otp-boxes { gap: 6px; }
}
</style>