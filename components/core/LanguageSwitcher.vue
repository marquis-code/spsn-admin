<template>
  <div class="relative group">
    <button class="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 transition-colors">
      <LucideGlobe :size="16" />
      <span class="hidden sm:inline-block">{{ currentLanguageName }}</span>
      <span class="sm:hidden uppercase">{{ currentLocale }}</span>
      <LucideChevronDown :size="14" class="opacity-50" />
    </button>
    <div class="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-100 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] overflow-hidden">
      <button 
        v-for="loc in locales" 
        :key="loc.code"
        @click="switchLanguage(loc.code)"
        class="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
        :class="{ 'text-[#003366] font-bold bg-slate-50': currentLocale === loc.code, 'text-slate-600': currentLocale !== loc.code }"
      >
        {{ loc.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from '#imports';
import { LucideGlobe, LucideChevronDown } from 'lucide-vue-next';

const { locale, locales: i18nLocales, setLocale } = useI18n();

const locales = computed(() => i18nLocales.value || []);
const currentLocale = computed(() => locale.value);

const currentLanguageName = computed(() => {
  const loc = locales.value.find(l => l.code === currentLocale.value);
  return loc ? loc.name : 'English';
});

const switchLanguage = async (code) => {
  if (currentLocale.value === code) return;
  await setLocale(code);
  localStorage.setItem('app-lang', code);
  // Reload to ensure API interceptors pick up the new language immediately
  window.location.reload();
};
</script>
