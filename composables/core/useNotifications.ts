import { ref, computed } from 'vue'

export interface Notification {
  id: string
  title: string
  message: string
  time: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
}

const notifications = ref<Notification[]>([
  {
    id: '1',
    title: 'Pending Registration',
    message: 'Dr. Jane Smith has requested verification for the Fellow membership tier.',
    time: '12 mins ago',
    type: 'info',
    read: false
  },
  {
    id: '2',
    title: 'Large Payment Processed',
    message: 'An institutional payment of ₦150,000 has been verified for the upcoming conference.',
    time: '2 hours ago',
    type: 'success',
    read: false
  },
  {
    id: '3',
    title: 'Support Escalation',
    message: 'You have a new unread live chat transmission requiring master admin protocol.',
    time: '4 hours ago',
    type: 'warning',
    read: false
  },
  {
    id: '4',
    title: 'Database Sync Completed',
    message: 'Nightly synchronization of member records across the network was successful.',
    time: '1 day ago',
    type: 'info',
    read: true
  }
])

export const useNotifications = () => {
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  const markAsRead = (id: string) => {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  const markAllAsRead = () => {
    notifications.value.forEach(n => n.read = true)
  }

  const addNotification = (notif: Omit<Notification, 'id' | 'read' | 'time'>) => {
    const newNotif: Notification = {
      ...notif,
      id: Math.random().toString(36).substring(7),
      read: false,
      time: 'Just now'
    }
    notifications.value.unshift(newNotif)
    playNotificationSound()
  }

  const playNotificationSound = () => {
    if (typeof window !== 'undefined') {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3')
      audio.play().catch(e => console.error('Audio play failed', e))
    }
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    playNotificationSound
  }
}
