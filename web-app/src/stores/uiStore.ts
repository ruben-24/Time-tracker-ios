import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const sidebarOpen = ref(true)
  const theme = ref<'light' | 'dark' | 'auto'>('auto')
  const currentView = ref('Dashboard')
  const loading = ref(false)
  const notifications = ref<Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timestamp: Date
  }>>([])

  // Getters
  const isDark = computed(() => {
    if (theme.value === 'auto') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return theme.value === 'dark'
  })

  const unreadNotifications = computed(() => 
    notifications.value.filter(n => !n.read)
  )

  // Actions
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const setTheme = (newTheme: 'light' | 'dark' | 'auto') => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
  }

  const setCurrentView = (view: string) => {
    currentView.value = view
  }

  const setLoading = (isLoading: boolean) => {
    loading.value = isLoading
  }

  const addNotification = (notification: Omit<typeof notifications.value[0], 'id' | 'timestamp'>) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    }
    notifications.value.unshift(newNotification)
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(newNotification.id)
    }, 5000)
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearAllNotifications = () => {
    notifications.value = []
  }

  // Initialize theme from localStorage
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null
    if (savedTheme) {
      theme.value = savedTheme
    }
  }

  return {
    // State
    sidebarOpen,
    theme,
    currentView,
    loading,
    notifications,
    
    // Getters
    isDark,
    unreadNotifications,
    
    // Actions
    toggleSidebar,
    setTheme,
    setCurrentView,
    setLoading,
    addNotification,
    removeNotification,
    clearAllNotifications,
    initTheme
  }
})