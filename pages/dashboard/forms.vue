<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex justify-between items-center px-1">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 tracking-tight">Custom Form Management</h2>
        <p class="text-base text-slate-500 font-medium">Create and manage dynamic forms for membership, congresses, or surveys.</p>
      </div>
      <button 
        @click="showCreateDrawer = true"
        class="bg-[#003366] hover:bg-[#004080] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 shadow-sm"
      >
         <LucidePlus :size="18" /> 
         Create new form
      </button>
    </div>

    <!-- Create Form Drawer -->
    <SlideOver 
      v-model="showCreateDrawer" 
      title="Create Custom Form" 
      subtitle="Design a dynamic data collection point for your practitioners."
      size="lg"
    >
      <div class="space-y-8">
        <!-- Basic Info -->
        <div class="space-y-4">
          <p class="text-[10px] font-black text-slate-400 ">General Information</p>
          <AnimatedInput v-model="newForm.title" label="Form Title" placeholder="e.g. 2026 Congress Registration" />
          <AnimatedInput v-model="newForm.description" label="Form Description (Internal)" type="textarea" :rows="2" />
        </div>

        <!-- Field Builder -->
        <div class="space-y-6">
          <div class="flex items-center justify-between">
            <p class="text-[10px] font-black text-slate-400 ">Form Structure / Fields</p>
            <button @click="addField" class="text-[10px] font-black text-[#003366] hover:underline flex items-center gap-1">
              <LucidePlus :size="12" /> Add Field
            </button>
          </div>

          <div class="space-y-4">
            <div v-for="(field, i) in newForm.fields" :key="i" class="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 relative group">
              <button @click="removeField(i)" class="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition-colors">
                <LucideX :size="16" />
              </button>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatedInput v-model="field.label" label="Field Label" placeholder="e.g. Professional Category" />
                <SelectInput 
                  v-model="field.type" 
                  label="Input Type" 
                  :options="[
                    { label: 'Text Input', value: 'text' },
                    { label: 'Numeric', value: 'number' },
                    { label: 'Dropdown / Select', value: 'select' },
                    { label: 'Date Picker', value: 'date' },
                    { label: 'Long Text / Bio', value: 'textarea' },
                    { label: 'Checkbox', value: 'checkbox' }
                  ]" 
                />
              </div>

              <!-- Options for Select type -->
              <div v-if="field.type === 'select'" class="space-y-3 pt-2">
                <p class="text-[9px] font-bold text-slate-400 uppercase">Dropdown Options (Comma separated)</p>
                <AnimatedInput v-model="field.optionsRaw" placeholder="Full Member, Associate, Fellow..." />
              </div>

              <div class="flex items-center gap-6 pt-2">
                <div 
                  @click="field.required = !field.required" 
                  class="flex items-center gap-3 cursor-pointer select-none group"
                >
                  <div 
                    class="w-10 h-5 rounded-full p-1 transition-all duration-300 flex items-center" 
                    :class="field.required ? 'bg-[#003366] justify-end' : 'bg-slate-200 justify-start'"
                  >
                    <div class="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                  </div>
                  <span class="text-[11px] font-bold text-slate-500 ">Mandatory Response</span>
                </div>
              </div>

              <!-- Live Field Preview -->
              <div class="mt-4 p-5 bg-white rounded-[1.5rem] border border-slate-100 shadow-sm">
                <div class="flex items-center justify-between mb-4 pb-2 border-b border-slate-50">
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Runtime Preview</p>
                  <span v-if="field.required" class="text-[8px] font-black bg-rose-50 text-rose-500 px-2 py-0.5 rounded-full ">Required</span>
                </div>
                
                <div class="space-y-2.5">
                  <label class="text-[12px] font-bold text-slate-800 flex items-center gap-1.5">
                    {{ field.label || 'Unnamed Field' }}
                    <span v-if="field.required" class="text-rose-500 text-base">*</span>
                  </label>
                  
                  <div v-if="field.type === 'text'" class="h-11 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 flex items-center text-slate-300 text-[11px] italic">Enter text here...</div>
                  <div v-if="field.type === 'number'" class="h-11 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 flex items-center text-slate-300 text-[11px] italic">Enter numeric value...</div>
                  <div v-if="field.type === 'textarea'" class="h-24 w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-slate-300 text-[11px] italic">Enter detailed response...</div>
                  <div v-if="field.type === 'date'" class="h-11 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 flex items-center justify-between">
                    <span class="text-slate-300 text-[11px] italic">Select Date</span>
                    <LucideCalendar :size="14" class="text-slate-400" />
                  </div>
                  <div v-if="field.type === 'select'" class="h-11 w-full bg-slate-50 border border-slate-100 rounded-xl px-4 flex items-center justify-between">
                    <span class="text-slate-300 text-[11px] italic">Select an option</span>
                    <LucideChevronDown :size="14" class="text-slate-400" />
                  </div>
                  <div v-if="field.type === 'checkbox'" class="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-[#003366] transition-colors">
                    <div class="w-5 h-5 rounded-lg border-2 border-[#003366] bg-[#003366] shrink-0 flex items-center justify-center">
                      <LucideCheck :size="12" class="text-white" />
                    </div>
                    <span class="text-[11px] text-slate-600 font-bold leading-tight">Sample checkbox acceptance label</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button v-if="newForm.fields.length === 0" @click="addField" class="w-full py-10 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#003366] hover:border-[#003366]/20 transition-all">
            <LucidePlus :size="24" />
            <span class="text-xs font-bold">Initialize first field</span>
          </button>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <button @click="showCreateDrawer = false" class="btn-outline-admin flex-1">Cancel</button>
          <button 
            @click="handleCreate" 
            :disabled="creating || !newForm.title || newForm.fields.length === 0"
            class="bg-[#003366] hover:bg-[#004080] text-white flex-1 py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <LucideLoader2 v-if="creating" class="w-4 h-4 animate-spin" />
            {{ creating ? 'Syncing Structure...' : 'Build Form' }}
          </button>
        </div>
      </template>
    </SlideOver>

    <!-- Loading State -->
    <Loader v-if="loading" message="Loading forms..." />

    <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <!-- Existing Forms List -->
      <div class="lg:col-span-8 space-y-4">
        <div v-for="form in forms" :key="form._id" class="admin-card border-l-4 border-[#003366] group hover:border-[#003366] transition-all duration-300">
           <div class="flex justify-between items-start mb-5">
              <div class="space-y-1">
                <h4 class="font-bold text-slate-800 text-lg group-hover:text-[#003366] transition-colors leading-tight">{{ form.title }}</h4>
                <p class="text-[11px] text-slate-400 font-bold">{{ form.fields?.length || 0 }} Defined fields <span class="mx-1.5 opacity-30">|</span> Created on {{ formatDate(form.createdAt) }}</p>
              </div>
              <div class="flex items-center gap-1.5">
                 <button class="p-2 text-slate-400 hover:text-[#003366] hover:bg-slate-50 rounded-lg transition-all" title="Edit structure"><LucideEdit :size="16" /></button>
                 <button class="p-2 text-slate-400 hover:text-[#003366] hover:bg-slate-50 rounded-lg transition-all" title="Duplicate form"><LucideCopy :size="16" /></button>
                 <div class="w-[1px] h-4 bg-slate-100 mx-1"></div>
                  <button @click="confirmDelete(form)" class="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Delete form"><LucideTrash :size="16" /></button>
              </div>
           </div>
           
           <div class="flex items-center justify-between pt-4 border-t border-slate-50">
              <div class="flex items-center gap-4">
                <div class="flex -space-x-2">
                   <div v-for="j in 3" :key="j" class="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-[#003366] shadow-sm">U</div>
                </div>
                <span class="text-[11px] font-bold text-[#003366]">{{ form.submissionsCount || 0 }} Total responses</span>
              </div>
              <NuxtLink :to="`/dashboard/forms-data?id=${form._id}`" class="text-xs font-bold text-slate-400 hover:text-[#003366] hover:underline transition-colors flex items-center gap-1">
                View submission data management 
                <LucideArrowRight :size="14" />
              </NuxtLink>
           </div>
        </div>
        
        <EmptyState v-if="forms.length === 0" title="No forms" message="No custom forms have been created yet." :icon="LucideFileText" class="py-20 bg-white border border-slate-200 border-dashed rounded-3xl" />
      </div>

      <!-- Quick Templates Sidebar -->
      <div class="lg:col-span-4 space-y-8">
        <div class="admin-card p-6 bg-[#003366] text-white overflow-hidden relative shadow-lg">
           <div class="absolute -right-8 -bottom-8 opacity-10 transform -rotate-12">
             <LucideLayers :size="160" />
           </div>
           
           <h4 class="font-bold text-lg mb-6 flex items-center gap-2 relative z-10">
             <LucideFileStack :size="20" class="text-white/60" />
             Quick templates
           </h4>
           
           <div class="space-y-3 relative z-10">
              <button @click="useTemplate(t)" v-for="t in templates" :key="t" class="w-full p-4 bg-white/5 hover:bg-white/15 rounded-xl text-left transition-all border border-white/10 group">
                 <p class="text-xs font-bold text-white group-hover:translate-x-1 transition-transform">{{ t }}</p>
                 <p class="text-[10px] text-white/50 mt-1 font-medium tracking-wide">Ready-to-use professional fields</p>
              </button>
           </div>
           
           <div class="mt-8 pt-6 border-t border-white/10 relative z-10">
             <p class="text-[10px] text-white/40 font-bold text-center">SCPSN Administration System</p>
           </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation -->
    <ConfirmModal 
      v-model="showDeleteModal"
      title="Delete Form?"
      :message="`Are you sure you want to permanently delete the '${formToDelete?.title}' form? This will also remove all ${formToDelete?.submissionsCount || 0} submissions.`"
      confirmText="Delete Permanently"
      variant="danger"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { 
  LucidePlus, 
  LucideEdit, 
  LucideTrash, 
  LucideCopy, 
  LucideLayers, 
  LucideFileStack, 
  LucideArrowRight,
  LucideFileText,
  LucideX,
  LucideCheck,
  LucideLoader2,
  LucideCalendar,
  LucideChevronDown
} from 'lucide-vue-next'
import { useGetForms } from '@/composables/modules/forms/useGetForms'
import { useCreateForm } from '@/composables/modules/forms/useCreateForm'
import { useDeleteForm } from '@/composables/modules/forms/useDeleteForm'
import { onMounted, ref, reactive } from 'vue'
import Loader from '@/components/core/Loader.vue'
import EmptyState from '@/components/core/EmptyState.vue'
import SlideOver from '@/components/core/SlideOver.vue'
import ConfirmModal from '@/components/core/ConfirmModal.vue'
import AnimatedInput from '@/components/AnimatedInput.vue'
import SelectInput from '@/components/SelectInput.vue'

const { loading, forms, getForms } = useGetForms()
const { loading: creating, createForm } = useCreateForm()
const { loading: deleting, deleteForm } = useDeleteForm()

const showCreateDrawer = ref(false)
const showDeleteModal = ref(false)
const formToDelete = ref(null)

const newForm = reactive({
  title: '',
  description: '',
  fields: []
})

const useTemplate = (templateName) => {
  newForm.title = templateName
  newForm.description = `Dynamic form for ${templateName}`
  newForm.fields = [
    { label: 'Full Name', type: 'text', required: true, optionsRaw: '' },
    { label: 'Email Address', type: 'text', required: true, optionsRaw: '' },
    { label: 'Professional ID', type: 'text', required: true, optionsRaw: '' }
  ]
  showCreateDrawer.value = true
}

const confirmDelete = (form) => {
  formToDelete.value = form
  showDeleteModal.value = true
}

const handleDelete = async () => {
  const success = await deleteForm(formToDelete.value._id)
  if (success) {
    showDeleteModal.value = false
    getForms()
  }
}

const addField = () => {
  newForm.fields.push({
    label: '',
    type: 'text',
    required: false,
    optionsRaw: '',
    name: '' // Will be generated from label
  })
}

const removeField = (index) => {
  newForm.fields.splice(index, 1)
}

const handleCreate = async () => {
  // Process fields
  const processedFields = newForm.fields.map(f => ({
    ...f,
    name: f.label.toLowerCase().replace(/\s+/g, '_'),
    options: f.type === 'select' ? f.optionsRaw.split(',').map(o => o.trim()).filter(o => o) : []
  }))

  const success = await createForm({
    title: newForm.title,
    description: newForm.description,
    fields: processedFields
  })

  if (success) {
    showCreateDrawer.value = false
    // Reset form
    newForm.title = ''
    newForm.description = ''
    newForm.fields = []
    getForms()
  }
}

const templates = [
  'General Membership Registration',
  'Annual Congress Feedback',
  'Scientific Publication Request',
  'Administrative Support Ticket'
]

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

onMounted(() => {
  getForms()
})
</script>
