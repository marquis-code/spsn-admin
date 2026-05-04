<template>
  <div class="h-screen w-screen flex bg-slate-50 overflow-hidden font-sans fixed inset-0 z-50">
    <!-- Left Sidebar: Conversations -->
    <div class="w-full sm:w-[350px] md:w-[400px] flex-shrink-0 border-r border-slate-200 bg-white flex flex-col h-full z-20 transition-all duration-300">
      <!-- Sidebar Header -->
      <div class="p-6 bg-white border-b border-slate-100 shrink-0">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-black text-slate-800">Support Nexus</h2>
          <div class="flex gap-1">
            <button class="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400">
              <LucideFilter :size="16" />
            </button>
            <button class="p-2 hover:bg-slate-50 rounded-xl transition-all text-slate-400">
              <LucideMoreVertical :size="16" />
            </button>
          </div>
        </div>
        <div class="mt-4">
          <AnimatedInput 
            v-model="searchQuery" 
            placeholder="Search records..." 
            type="search"
          >
            <template #right>
              <LucideSearch :size="16" class="text-slate-300" />
            </template>
          </AnimatedInput>
        </div>
      </div>

      <!-- Rooms List -->
      <div class="flex-1 overflow-y-auto custom-scrollbar bg-white">
        <div
          v-for="room in sortedRooms"
          :key="room._id"
          @click="selectRoom(room._id)"
          :class="[
            'px-6 py-5 cursor-pointer transition-all flex items-center gap-4 relative group border-b border-slate-50',
            selectedRoom === room._id ? 'bg-slate-50' : 'hover:bg-slate-50/50'
          ]"
        >
          <div class="w-12 h-12 rounded-xl bg-slate-50 flex-shrink-0 flex items-center justify-center text-[#003366] font-bold border border-slate-100 relative transition-transform">
            {{ getInitials(room) }}
            <div v-if="isActive(room._id)" class="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-baseline mb-1">
              <h4 class="font-bold text-slate-800 text-[12px] truncate">{{ room.senderName || room._id }}</h4>
              <span class="text-[9px] text-slate-400 font-bold whitespace-nowrap">{{ formatTime(room.lastTimestamp) }}</span>
            </div>
            
            <div class="flex justify-between items-center gap-3">
              <p class="text-[11px] text-slate-400 truncate flex-1 font-medium leading-tight opacity-70">
                <span v-if="room.lastSender === 'admin'" class="text-[#003366] font-bold mr-1">Nexus:</span>
                {{ room.lastMessage }}
              </p>
              <div v-if="room.unreadCount > 0" class="min-w-[18px] h-[18px] px-1 bg-[#003366] text-white rounded-lg text-[9px] font-bold flex items-center justify-center">
                {{ room.unreadCount }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredRooms.length === 0" class="p-12 text-center flex flex-col items-center justify-center h-full opacity-20 grayscale">
          <LucideBot :size="48" class="text-slate-300 mb-6" />
          <p class="text-[11px] font-bold text-slate-400 leading-relaxed">No active transmissions</p>
        </div>
      </div>
    </div>

    <!-- Right Sidebar: Chat Area -->
    <div class="flex-1 flex flex-col bg-white relative z-10 overflow-hidden">
      <template v-if="selectedRoomData">
        <!-- Chat Header -->
        <div class="px-8 py-5 bg-white text-slate-800 flex items-center justify-between z-20 border-b border-slate-100 shrink-0">
          <div class="flex items-center gap-5">
            <button @click="selectedRoom = null" class="sm:hidden p-2 -ml-2 hover:bg-slate-50 rounded-lg transition-colors">
              <LucideArrowLeft :size="18" />
            </button>
            <div class="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center font-bold border border-slate-100 text-lg text-[#003366]">
              {{ selectedRoomData.senderName ? selectedRoomData.senderName.charAt(0).toUpperCase() : 'G' }}
            </div>
            <div>
              <h3 class="font-bold text-slate-800 text-[14px] leading-none">{{ selectedRoomData.senderName || 'Anonymous Guest' }}</h3>
              <div class="flex flex-col gap-1 mt-2">
                <p class="text-[10px] text-slate-400 font-bold max-w-[250px] truncate">{{ selectedRoomData.senderEmail || 'No email provided' }}</p>
                <div v-if="currentPage" class="flex items-center gap-1.5">
                   <span class="w-1.5 h-1.5 bg-[#003366] rounded-full"></span>
                   <p class="text-[9px] text-[#003366] font-bold truncate">Active: {{ currentPage.title }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <button @click="showCallModal = true" class="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-[#003366]"><LucidePhone :size="18" /></button>
            <button @click="showVideoModal = true" class="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-[#003366]"><LucideVideo :size="18" /></button>
            <div class="w-px h-6 bg-slate-100 mx-2"></div>
            <button class="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-[#003366]"><LucideSearch :size="18" /></button>
            <button class="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-[#003366]"><LucideMoreVertical :size="18" /></button>
          </div>
        </div>

        <!-- Agent Transfer Banner -->
        <div v-if="selectedRoomData.isTransferredToAgent" class="bg-slate-50 px-8 py-3 flex items-center justify-between border-b border-slate-100 z-10 shrink-0">
          <div class="flex items-center gap-3">
             <LucideUserPlus :size="16" class="text-[#003366]" />
             <span class="text-[10px] font-bold text-slate-600">Protocol transfer requested</span>
          </div>
          <button @click="acceptTransfer" class="px-5 py-2 bg-[#003366] hover:bg-[#002855] text-white rounded-xl text-[10px] font-bold transition-all active:scale-95">Engage protocol</button>
        </div>

        <!-- Messages Area -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-8 sm:p-12 space-y-8 z-10 custom-scrollbar scroll-smooth bg-slate-50/30">
          <div v-for="(group, date) in groupedMessages" :key="date" class="space-y-8">
            <div class="flex justify-center my-8">
              <span class="px-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[9px] font-bold text-slate-400">
                {{ date }}
              </span>
            </div>
            
            <div
              v-for="msg in group"
              :key="msg._id"
              :class="[
                'max-w-[70%] sm:max-w-[55%] p-5 rounded-2xl text-sm leading-relaxed relative transition-all duration-300',
                msg.sender === 'admin'
                  ? 'ml-auto bg-[#003366] text-white rounded-tr-none'
                  : 'mr-auto bg-white text-slate-700 rounded-tl-none border border-slate-100'
              ]"
            >
              <!-- AI Assistant Header -->
              <div v-if="msg.sender === 'ai'" class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <LucideBot :size="14" class="text-[#003366]" />
                <span class="text-[9px] font-bold text-[#003366] leading-none">Automated intelligence</span>
              </div>

              <!-- Attachments Viewer -->
              <div v-if="msg.attachments && msg.attachments.length > 0" class="mb-4 space-y-2">
                 <div v-for="(att, i) in msg.attachments" :key="i" class="rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                    <img v-if="att.startsWith('data:image')" :src="att" class="w-full max-h-[300px] object-cover" />
                    <div v-else class="p-4 flex items-center gap-3">
                      <LucideFile :size="20" class="text-slate-400" />
                      <span class="text-[10px] font-bold text-slate-500 truncate">Document attached</span>
                    </div>
                 </div>
              </div>

              <p class="whitespace-pre-wrap font-medium text-[11px] opacity-90">{{ msg.text }}</p>
              
              <div class="flex items-center justify-end gap-2 mt-3 opacity-40">
                <span class="text-[9px] font-bold">{{ formatTimeOnly(msg.createdAt) }}</span>
                <div v-if="msg.sender === 'admin'" class="flex items-center">
                   <LucideCheckCheck v-if="msg.status === 'read'" :size="10" />
                   <LucideCheck v-else :size="10" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Response Overlay -->
        <transition 
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="translate-y-4 opacity-0"
          enter-to-class="translate-y-0 opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="translate-y-0 opacity-100"
          leave-to-class="translate-y-4 opacity-0"
        >
          <div v-if="showPredefined" class="absolute bottom-[100px] left-8 right-8 bg-white border border-slate-200 rounded-3xl z-20 overflow-hidden max-h-[400px] flex flex-col">
            <div class="px-8 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h5 class="text-[10px] font-bold text-slate-500 flex items-center gap-2">
                <LucideZap :size="14" class="text-[#003366]" />
                Knowledge base protocols
              </h5>
              <button @click="showPredefined = false" class="text-slate-300 hover:text-slate-500 rounded-xl p-2 transition-all">
                <LucideClose :size="18" />
              </button>
            </div>
            <div class="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4 custom-scrollbar">
              <button 
                v-for="(res, i) in predefinedResponses" 
                :key="i"
                @click="sendQuickReply(res.text)"
                class="p-6 text-left border border-slate-100 hover:border-[#003366] hover:bg-slate-50 rounded-2xl transition-all group flex flex-col gap-2"
              >
                <span class="block text-[9px] font-bold text-slate-400 leading-none">{{ res.category }}</span>
                <span class="block text-[12px] font-bold text-slate-800">{{ res.label }}</span>
                <span class="block text-[11px] text-slate-400 font-medium line-clamp-2 leading-relaxed opacity-70">"{{ res.text }}"</span>
              </button>
            </div>
          </div>
        </transition>

        <div class="px-8 py-6 bg-white flex flex-col gap-4 z-30 border-t border-slate-100">
          <!-- Payload Preview -->
          <div v-if="pendingAttachments.length > 0" class="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-2xl w-full">
            <div v-for="(att, i) in pendingAttachments" :key="i" class="relative group">
              <img v-if="att.startsWith('data:image')" :src="att" class="w-14 h-14 object-cover rounded-xl border border-slate-200" />
              <div v-else class="w-14 h-14 bg-white rounded-xl flex items-center justify-center border border-slate-200"><LucideFile :size="18" class="text-slate-300" /></div>
              <button @click="pendingAttachments.splice(i, 1)" class="absolute -top-2 -right-2 w-5 h-5 bg-slate-800 text-white rounded-full flex items-center justify-center transition-opacity"><LucideClose :size="10" /></button>
            </div>
          </div>

          <div class="flex items-end gap-4 w-full">
            <div class="flex gap-2 mb-1.5">
              <div class="relative">
                <button @click="showEmoji = !showEmoji" class="p-2 text-slate-300 hover:text-[#003366] transition-all">
                  <LucideSmile :size="22" />
                </button>
                <div v-if="showEmoji" class="absolute bottom-full left-0 mb-4 bg-white border border-slate-200 p-4 rounded-2xl flex gap-2 w-[280px] flex-wrap z-[100]" @click.stop>
                   <button v-for="e in commonEmojis" :key="e" @click="replyText += e" class="text-xl hover:scale-125 transition-transform">{{ e }}</button>
                </div>
              </div>
              <button @click="$refs.fileInput.click()" class="p-2 text-slate-300 hover:text-[#003366] transition-all">
                <LucidePaperclip :size="22" />
              </button>
              <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept="image/*,.pdf,.doc,.docx" multiple />
            </div>
          
          <div class="flex-1 relative group flex items-center">
            <div class="w-full">
              <AnimatedInput
                v-model="replyText"
                @keydown.enter.prevent="sendReply"
                type="textarea"
                :rows="1"
                placeholder="Type transmission..."
                class="w-full !mb-0"
              />
            </div>
            
            <button 
              @click="showPredefined = !showPredefined"
              :class="['absolute right-3 top-3 p-1.5 rounded-lg transition-all z-10', showPredefined ? 'bg-[#003366] text-white' : 'text-[#003366] hover:bg-slate-100']"
            >
              <LucideZap :size="16" />
            </button>
          </div>

          <button
            @click="sendReply"
            :disabled="!replyText.trim() && pendingAttachments.length === 0"
            class="w-12 h-12 bg-[#003366] text-white rounded-xl flex items-center justify-center hover:bg-[#002855] transition-all active:scale-95 disabled:opacity-20 mb-0.5"
          >
            <LucideSend :size="18" class="ml-0.5" />
          </button>
          </div>
        </div>
      </template>

      <!-- Welcome State -->
      <template v-else>
        <div class="flex-1 flex flex-col items-center justify-center bg-slate-50/20">
          <div class="p-16 text-center max-w-xl space-y-8">
            <div class="w-32 h-32 bg-white rounded-[2.5rem] border border-slate-100 flex items-center justify-center mx-auto transition-all duration-700">
               <LucideMessageSquare :size="48" class="text-[#003366]" />
            </div>
            <div class="space-y-3">
              <h2 class="text-2xl font-black text-slate-800">Support Nexus Hub</h2>
              <p class="text-slate-400 font-bold text-[11px] leading-relaxed opacity-70">
                Encrypted communication protocol for real-time administrative assistance.
              </p>
            </div>
            <div class="flex flex-col items-center gap-3">
              <div class="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-xl">
                 <LucideLock :size="14" class="text-slate-300" />
                 <span class="text-[10px] text-slate-400 font-bold">Secure transmission active</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Call UI -->
      <div v-if="showCallModal || showVideoModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center">
        <div class="bg-slate-900 w-full max-w-sm rounded-[3rem] p-10 flex flex-col items-center justify-between min-h-[500px] border border-white/5 relative overflow-hidden animate-in zoom-in-95 duration-300">
           <div class="relative z-10 flex flex-col items-center text-center space-y-6 mt-10">
             <div class="w-24 h-24 rounded-3xl overflow-hidden border border-white/10 relative">
               <div class="absolute inset-0 bg-slate-800 flex items-center justify-center text-3xl font-black text-white">{{ selectedRoomData?.senderName?.charAt(0).toUpperCase() || 'G' }}</div>
             </div>
             <div>
               <h3 class="text-xl font-bold text-white">{{ selectedRoomData?.senderName || 'Anonymous guest' }}</h3>
               <p class="text-[11px] font-bold text-[#003366] mt-3">{{ showVideoModal ? 'Video protocol...' : 'Audio protocol...' }}</p>
             </div>
           </div>
           
           <div class="relative z-10 flex items-center gap-6 mb-10">
              <button class="w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-xl flex items-center justify-center transition-all"><LucideMic :size="18" /></button>
              <button @click="showCallModal = false; showVideoModal = false" class="w-16 h-16 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl flex items-center justify-center transition-all active:scale-95"><LucidePhoneOff :size="24" /></button>
              <button class="w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-xl flex items-center justify-center transition-all"><LucideVideo v-if="showVideoModal" :size="18" /><LucideVideoOff v-else :size="18" /></button>
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  LucideFilter, 
  LucideMoreVertical, 
  LucideSearch, 
  LucideArrowLeft, 
  LucidePhone, 
  LucideVideo, 
  LucideZap, 
  LucideBot, 
  LucideCheckCheck, 
  LucideCheck, 
  LucideSmile, 
  LucidePaperclip, 
  LucideSend, 
  LucideMessageSquare, 
  LucideLock,
  LucideGlobe,
  LucideUserPlus,
  LucideFile,
  LucideMic,
  LucidePhoneOff,
  LucideVideoOff,
  LucideX as LucideClose 
} from 'lucide-vue-next'
import AnimatedInput from '@/components/AnimatedInput.vue'
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { io } from 'socket.io-client'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({
  layout: false
})

const config = useRuntimeConfig()
const { showToast } = useCustomToast()
const apiBase = config.public.apiBase || 'http://localhost:3000/api'

const socket = ref(null)
const rooms = ref([])
const messages = ref([])
const predefinedResponses = ref([])
const selectedRoom = ref(null)
const replyText = ref('')
const searchQuery = ref('')
const showPredefined = ref(false)
const inputRef = ref(null)
const messagesContainer = ref(null)

const showCallModal = ref(false)
const showVideoModal = ref(false)
const showEmoji = ref(false)
const pendingAttachments = ref([])
const fileInput = ref(null)
const commonEmojis = ['👋', '👍', '😊', '✅', '🔬', '🏥', '📅', '💡', '⚠️', '📎', '👏', '🎉']

const activeUserPages = ref(new Map()) // roomId -> {title, url}

const filteredRooms = computed(() => {
  if (!searchQuery.value) return rooms.value
  const q = searchQuery.value.toLowerCase()
  return rooms.value.filter(r => 
    r._id.toLowerCase().includes(q) || 
    (r.senderName && r.senderName.toLowerCase().includes(q)) ||
    (r.lastMessage && r.lastMessage.toLowerCase().includes(q))
  )
})

const sortedRooms = computed(() => {
  return [...filteredRooms.value].sort((a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp))
})

const selectedRoomData = computed(() => {
  return rooms.value.find(r => r._id === selectedRoom.value)
})

const currentPage = computed(() => {
  if (!selectedRoom.value) return null
  return activeUserPages.value.get(selectedRoom.value) || (selectedRoomData.value?.pageTitle ? { title: selectedRoomData.value.pageTitle } : null)
})

const groupedMessages = computed(() => {
  const groups = {}
  messages.value.forEach(msg => {
    const date = new Date(msg.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const today = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    const dateLabel = date === today ? 'Today' : date
    
    if (!groups[dateLabel]) groups[dateLabel] = []
    groups[dateLabel].push(msg)
  })
  return groups
})

const getInitials = (room) => {
  if (room.senderName) return room.senderName.charAt(0).toUpperCase()
  return 'G'
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const adjustTextareaHeight = () => {
  // AnimatedInput handles resizing internally or we don't need it if we fixed the height
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const d = new Date(timestamp)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const formatTimeOnly = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const selectRoom = (roomId) => {
  selectedRoom.value = roomId
  messages.value = []
  showPredefined.value = false
  socket.value?.emit('adminJoinRoom', { roomId })
  socket.value?.emit('markRoomAsRead', { roomId })
}

const sendReply = () => {
  if ((!replyText.value.trim() && pendingAttachments.value.length === 0) || !selectedRoom.value) return
  socket.value?.emit('adminReply', {
    roomId: selectedRoom.value,
    message: replyText.value,
    adminName: 'SCPSN Admin',
    attachments: [...pendingAttachments.value]
  })
  replyText.value = ''
  pendingAttachments.value = []
  if (inputRef.value) inputRef.value.style.height = 'auto'
}

const acceptTransfer = () => {
  if (!selectedRoom.value) return
  
  const idx = rooms.value.findIndex(r => r._id === selectedRoom.value)
  if (idx !== -1) rooms.value[idx].isTransferredToAgent = false

  socket.value?.emit('agentAcceptedTransfer', {
    roomId: selectedRoom.value,
    adminName: 'SCPSN Expert Admin'
  })
}

const handleFileUpload = (e) => {
  const files = e.target.files
  if (!files || files.length === 0) return

  Array.from(files).forEach((file) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast({ title: 'File Too Large', message: 'Maximum 5MB file size allowed.', toastType: 'warning' })
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      pendingAttachments.value.push(ev.target.result)
    }
    reader.readAsDataURL(file)
  })
  
  e.target.value = ''
}

const sendQuickReply = (text) => {
  replyText.value = text
  sendReply()
  showPredefined.value = false
}

const isActive = (roomId) => {
  return activeUserPages.value.has(roomId)
}

onMounted(() => {
  const baseUrl = apiBase.replace('/api', '')
  socket.value = io(`${baseUrl}/chat`, {
    transports: ['websocket', 'polling'],
  })

  socket.value.on('connect', () => {
    socket.value.emit('adminJoin')
    socket.value.emit('getPredefinedResponses')
  })

  socket.value.on('roomsList', (data) => {
    rooms.value = data
  })

  socket.value.on('roomHistory', ({ roomId, messages: msgs }) => {
    if (roomId === selectedRoom.value) {
      messages.value = msgs
      scrollToBottom()
    }
  })

  socket.value.on('messageReceived', (msg) => {
    if (msg.roomId === selectedRoom.value) {
      messages.value.push(msg)
      scrollToBottom()
      socket.value.emit('messageRead', { messageId: msg._id, roomId: msg.roomId })
    }
    socket.value.emit('adminJoin')
  })

  socket.value.on('userMoved', ({ roomId, pageTitle, pageUrl }) => {
    activeUserPages.value.set(roomId, { title: pageTitle, url: pageUrl })
  })

  socket.value.on('statusUpdated', ({ messageId, status }) => {
    const msg = messages.value.find(m => m._id === messageId)
    if (msg) msg.status = status
  })

  socket.value.on('transferRequested', ({ roomId }) => {
    const r = rooms.value.find(room => room._id === roomId)
    if (r) {
      r.isTransferredToAgent = true
    }
  })

  socket.value.on('chatRated', ({ roomId, rating }) => {
    const r = rooms.value.find(room => room._id === roomId)
    if (r) r.rating = rating
  })

  socket.value.on('predefinedResponsesList', (data) => {
    predefinedResponses.value = data
  })
})

onUnmounted(() => {
  socket.value?.disconnect()
})

watch(selectedRoom, () => {
  nextTick(adjustTextareaHeight)
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.1);
}

</style>
