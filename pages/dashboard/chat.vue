<template>
  <div class="h-screen w-screen flex bg-slate-50 overflow-hidden font-sans fixed inset-0 z-50">
    <!-- Left Sidebar: Conversations -->
    <div class="w-full sm:w-[350px] md:w-[400px] flex-shrink-0 border-r border-slate-200 bg-white flex flex-col h-full z-20 transition-all duration-300">
      <!-- WhatsApp Web style Sidebar Header -->
      <div class="p-3 bg-[#f0f2f5] border-b border-slate-200 shrink-0 flex items-center justify-between">
        <div class="w-10 h-10 rounded-full bg-slate-300 overflow-hidden flex items-center justify-center font-bold text-white text-lg tracking-wider">
          A
        </div>
        <div class="flex gap-4 text-[#54656f]">
          <button class="transition-colors hover:text-slate-800"><LucideFilter :size="20" /></button>
          <button class="transition-colors hover:text-slate-800"><LucideMoreVertical :size="20" /></button>
        </div>
      </div>
      
      <div class="p-2 border-b border-slate-200 bg-white">
        <div class="relative group bg-[#f0f2f5] rounded-lg overflow-hidden flex items-center px-3">
          <LucideSearch :size="16" class="text-[#54656f] shrink-0" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search or start new chat" 
            class="w-full h-9 pl-4 bg-transparent text-[14px] text-[#111b21] outline-none placeholder:text-[#54656f]"
          />
        </div>
      </div>

      <!-- Rooms List -->
      <div class="flex-1 overflow-y-auto custom-scrollbar bg-white">
        <div
          v-for="room in sortedRooms"
          :key="room._id"
          @click="selectRoom(room._id)"
          :class="[
            'px-3 py-3 cursor-pointer transition-all flex items-center gap-3 relative group',
            selectedRoom === room._id ? 'bg-[#f0f2f5]' : 'hover:bg-[#f5f6f6] bg-white'
          ]"
        >
          <div class="relative shrink-0 ml-1">
            <div class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-slate-200 text-slate-500 overflow-hidden">
               <span>{{ getInitials(room) }}</span>
            </div>
            <div v-if="isActive(room._id)" class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#25D366] border-2 border-white rounded-full"></div>
          </div>
          
          <div class="flex-1 min-w-0 border-b border-[#f0f2f5] pb-3 pt-1">
            <div class="flex justify-between items-center mb-0.5">
              <h4 class="text-[17px] text-[#111b21] truncate">{{ room.senderName || room._id }}</h4>
              <span class="text-[12px] text-[#667781] whitespace-nowrap">{{ formatTime(room.lastTimestamp) }}</span>
            </div>
            
            <div class="flex justify-between items-center gap-3">
              <p class="text-[14px] text-[#667781] truncate flex-1 leading-tight">
                <span v-if="room.lastSender === 'admin'" class="text-[#111b21] font-medium mr-1">You:</span>
                {{ room.lastMessage }}
              </p>
              <div v-if="room.unreadCount > 0 && selectedRoom !== room._id" class="min-w-[20px] h-[20px] px-1 bg-[#25D366] text-white rounded-full text-[11px] font-bold flex items-center justify-center">
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
    <div class="flex-1 flex flex-col bg-[#F0F2F5] relative z-10 overflow-hidden">
      <template v-if="selectedRoomData">
        <!-- Chat Header -->
        <header class="px-4 py-2.5 bg-[#f0f2f5] flex items-center justify-between z-20 shrink-0">
          <div class="flex items-center gap-4 cursor-pointer">
            <button @click="selectedRoom = null" class="sm:hidden p-1 -ml-1 text-[#54656f] hover:bg-slate-200 rounded-full transition-colors">
              <LucideArrowLeft :size="20" />
            </button>
             <div class="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 overflow-hidden">
                <span>{{ selectedRoomData.senderName ? selectedRoomData.senderName.charAt(0).toUpperCase() : 'G' }}</span>
             </div>
             <div>
                <h3 class="text-[16px] text-[#111b21] leading-tight">{{ selectedRoomData.senderName || 'Anonymous Guest' }}</h3>
                <div class="flex items-center gap-2 mt-0.5">
                   <p class="text-[13px] text-[#667781] truncate max-w-[200px]">{{ selectedRoomData.senderEmail || 'No email provided' }}</p>
                   <span v-if="currentPage" class="text-[12px] text-[#25D366] font-medium hidden md:inline">• Active: {{ currentPage.title }}</span>
                </div>
             </div>
          </div>
          <div class="flex items-center gap-5 text-[#54656f]">
             <button @click="showCallModal = true" class="hover:text-slate-800 transition-all"><LucidePhone :size="20" /></button>
             <button @click="showVideoModal = true" class="hover:text-slate-800 transition-all"><LucideVideo :size="20" /></button>
             <button class="hover:text-slate-800 transition-all"><LucideSearch :size="20" /></button>
             <button class="hover:text-slate-800 transition-all"><LucideMoreVertical :size="20" /></button>
          </div>
        </header>

        <!-- Agent Transfer Banner -->
        <div v-if="selectedRoomData.isTransferredToAgent" class="bg-slate-50 px-8 py-3 flex items-center justify-between border-b border-slate-100 z-10 shrink-0">
          <div class="flex items-center gap-3">
             <LucideUserPlus :size="16" class="text-[#003366]" />
             <span class="text-[10px] font-bold text-slate-600">Protocol transfer requested</span>
          </div>
          <button @click="acceptTransfer" class="px-5 py-2 bg-[#003366] hover:bg-[#002855] text-white rounded-xl text-[10px] font-bold transition-all active:scale-95">Engage protocol</button>
        </div>

        <!-- Messages Area -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto px-16 py-8 space-y-2 z-10 custom-scrollbar scroll-smooth bg-[#efeae2] bg-[url('https://static.whatsapp.net/rsrc.php/v3/yl/r/17vXoB8fKIE.png')] bg-repeat relative">
          <div class="absolute inset-0 bg-white/40 pointer-events-none"></div>
          <div v-for="(group, date) in groupedMessages" :key="date" class="space-y-2 relative z-10">
            <div class="flex justify-center my-6">
              <span class="px-3 py-1.5 bg-[#f0f2f5] rounded-lg text-[12px] text-[#54656f] shadow-sm">
                {{ date }}
              </span>
            </div>
            
            <div
              v-for="msg in group"
              :key="msg._id"
              :class="['flex w-full relative z-10', msg.sender === 'admin' ? 'justify-end' : 'justify-start']"
            >
              <div :class="[
                'max-w-[85%] lg:max-w-[65%] px-2 pt-1.5 pb-2 rounded-lg shadow-sm relative text-[14.2px]',
                msg.sender === 'admin'
                  ? 'bg-[#dcf8c6] rounded-tr-none'
                  : 'bg-white rounded-tl-none'
              ]">
                <!-- WhatsApp Tails -->
                <div v-if="msg.sender === 'admin'" class="absolute top-0 -right-2 w-2 h-3 bg-[#dcf8c6] clip-path-bubble-right"></div>
                <div v-else class="absolute top-0 -left-2 w-2 h-3 bg-white clip-path-bubble-left"></div>
                
                <!-- AI Assistant Header -->
                <div v-if="msg.sender === 'ai'" class="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-100">
                  <LucideBot :size="16" class="text-[#00a884]" />
                  <span class="text-[12px] font-medium text-[#00a884] leading-none">Automated intelligence</span>
                </div>

                <!-- Attachments Viewer -->
                <div v-if="msg.attachments && msg.attachments.length > 0" class="mb-2 space-y-1">
                   <div v-for="(att, i) in msg.attachments" :key="i" class="rounded-lg overflow-hidden bg-black/5">
                      <img v-if="att.startsWith('data:image')" :src="att" class="w-full max-h-[300px] object-cover cursor-zoom-in" />
                      <div v-else class="p-3 flex items-center gap-3 bg-white/40 backdrop-blur-sm">
                        <div class="w-10 h-10 bg-[#ea4335] text-white flex items-center justify-center rounded">
                          <LucideFile :size="20" />
                        </div>
                        <span class="text-[14px] text-slate-800 truncate">Document attached</span>
                      </div>
                   </div>
                </div>

                <div v-if="msg.text" class="px-1 pr-14 relative">
                  <p class="whitespace-pre-wrap leading-snug text-[#111b21]">{{ msg.text }}</p>
                </div>
                
                <div class="absolute bottom-[2px] right-2 flex items-center justify-end gap-1 text-[#667781] bg-transparent pointer-events-none">
                  <span class="text-[11px] font-medium leading-none mt-1">{{ formatTimeOnly(msg.createdAt) }}</span>
                  <div v-if="msg.sender === 'admin'" class="flex items-center ml-0.5 mt-0.5">
                     <LucideCheckCheck v-if="msg.status === 'read'" :size="14" class="text-[#53bDEB]" />
                     <LucideCheckCheck v-else-if="msg.status === 'delivered'" :size="14" />
                     <LucideCheck v-else :size="14" />
                  </div>
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

        <!-- Robust Input Footer (WhatsApp Style) -->
        <footer class="px-4 py-2.5 bg-[#f0f2f5] z-20 flex items-end gap-3 relative min-h-[62px]">
          <!-- Payload Preview -->
          <div v-if="pendingAttachments.length > 0" class="absolute bottom-full left-4 bg-white p-2 border border-slate-100 rounded-lg shadow-lg flex items-center gap-2 mb-2 z-50">
            <div v-for="(att, i) in pendingAttachments" :key="i" class="relative group">
              <img v-if="att.startsWith('data:image')" :src="att" class="w-12 h-12 object-cover rounded-md border border-slate-200" />
              <div v-else class="w-12 h-12 bg-slate-100 rounded-md flex items-center justify-center"><LucideFile :size="18" class="text-slate-400" /></div>
              <button @click="pendingAttachments.splice(i, 1)" class="absolute -top-1 -right-1 w-4 h-4 bg-slate-800 text-white rounded-full flex items-center justify-center transition-opacity"><LucideClose :size="10" /></button>
            </div>
          </div>

          <div class="flex gap-2 mb-2 text-[#54656f]">
             <div class="relative">
                <button @click="showEmoji = !showEmoji" class="p-1 hover:text-slate-700 transition-all">
                  <LucideSmile :size="26" />
                </button>
                <div v-if="showEmoji" class="absolute bottom-full left-0 mb-4 bg-white shadow-lg border border-slate-100 p-4 rounded-xl flex gap-2 w-[280px] flex-wrap z-[100]" @click.stop>
                   <button v-for="e in commonEmojis" :key="e" @click="replyText += e" class="text-xl hover:scale-125 transition-transform">{{ e }}</button>
                </div>
             </div>
             <button @click="$refs.fileInput.click()" class="p-1 hover:text-slate-700 transition-all">
                <LucidePaperclip :size="24" />
             </button>
             <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept="image/*,.pdf,.doc,.docx" multiple />
          </div>
          
          <div class="flex-1 bg-white rounded-lg flex items-center overflow-hidden mb-1.5 shadow-sm border border-transparent relative">
             <input 
               v-model="replyText"
               @keyup.enter="sendReply"
               type="text" 
               placeholder="Type a message" 
               class="flex-1 px-4 py-2 pr-10 bg-white text-[15px] text-[#111b21] outline-none placeholder:text-[#8696a0]"
             />
             <button 
               @click="showPredefined = !showPredefined"
               :class="['absolute right-2 top-1.5 p-1.5 rounded transition-all z-10', showPredefined ? 'bg-slate-200 text-slate-600' : 'text-slate-400 hover:bg-slate-100']"
             >
               <LucideZap :size="18" />
             </button>
          </div>
          
          <div class="mb-2 text-[#54656f]">
            <button 
              @click="sendReply"
              class="p-1 hover:text-slate-700 transition-all"
            >
               <LucideSend v-if="replyText.trim() || pendingAttachments.length > 0" size="24" class="ml-1" />
               <LucideMic v-else size="24" />
            </button>
          </div>
        </footer>
      </template>

      <!-- Welcome State -->
      <template v-else>
        <div class="flex-1 flex flex-col items-center justify-center bg-[#F8F9FA] border-b-[6px] border-[#25D366]">
          <div class="p-8 text-center max-w-lg space-y-6">
            <div class="w-72 mx-auto">
               <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" class="w-20 h-20 mx-auto opacity-20 grayscale mb-6" />
            </div>
            <div class="space-y-3">
              <h2 class="text-[32px] font-light text-[#41525d]">WhatsApp Web</h2>
              <p class="text-[#8696a0] text-base leading-relaxed">
                Send and receive messages without keeping your phone online.<br/>
                Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
              </p>
            </div>
            <div class="flex flex-col items-center gap-3 pt-10">
              <div class="flex items-center gap-1.5 px-6 py-3">
                 <LucideLock :size="12" class="text-[#8696a0]" />
                 <span class="text-xs text-[#8696a0]">End-to-end encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Call UI -->
      <Teleport to="body">
        <div v-if="showCallModal || showVideoModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[9999] flex items-center justify-center">
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
      </Teleport>
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
const apiBase = config.public.apiBase || 'https://spsn-backend.onrender.com'

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

.clip-path-bubble-right {
  clip-path: polygon(0 0, 0% 100%, 100% 0);
}
.clip-path-bubble-left {
  clip-path: polygon(100% 0, 0 0, 100% 100%);
}
</style>
