<template>
  <header class="bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg border-b border-dark-200 dark:border-dark-700 px-6 py-4">
    <div class="flex items-center justify-between">
      <!-- Left Section -->
      <div class="flex items-center space-x-4">
        <button 
          @click="toggleSidebar"
          class="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors lg:hidden"
        >
          <Menu class="w-5 h-5 text-dark-600 dark:text-dark-400" />
        </button>
        
        <div class="hidden lg:block">
          <h2 class="text-2xl font-bold text-dark-900 dark:text-dark-100">{{ currentView }}</h2>
          <p class="text-sm text-dark-500 dark:text-dark-400">Contorizare ore de lucru</p>
        </div>
      </div>
      
      <!-- Center Section - Search -->
      <div class="flex-1 max-w-md mx-8 hidden md:block">
        <div class="relative">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Caută în sesiuni..."
            class="w-full pl-10 pr-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
            @input="handleSearch"
          />
        </div>
      </div>
      
      <!-- Right Section -->
      <div class="flex items-center space-x-3">
        <!-- Notifications -->
        <div class="relative">
          <button 
            @click="toggleNotifications"
            class="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors relative"
          >
            <Bell class="w-5 h-5 text-dark-600 dark:text-dark-400" />
            <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {{ unreadCount }}
            </span>
          </button>
        </div>
        
        <!-- Quick Actions -->
        <div class="relative">
          <button 
            @click="toggleQuickActions"
            class="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
          >
            <Plus class="w-5 h-5 text-dark-600 dark:text-dark-400" />
          </button>
        </div>
        
        <!-- Profile Menu -->
        <div class="relative">
          <button 
            @click="toggleProfileMenu"
            class="flex items-center space-x-2 p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
          >
            <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
              <User class="w-4 h-4 text-white" />
            </div>
            <ChevronDown class="w-4 h-4 text-dark-600 dark:text-dark-400" />
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile Search -->
    <div v-if="showMobileSearch" class="mt-4 md:hidden">
      <div class="relative">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
        <input
          v-model="searchQuery"
          type="text"
            placeholder="Caută în sesiuni..."
          class="w-full pl-10 pr-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
          @input="handleSearch"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUIStore } from '@/stores/uiStore'
import { useTimeTrackingStore } from '@/stores/dataStore'
import { 
  Menu, 
  Search, 
  Bell, 
  Plus, 
  User, 
  ChevronDown 
} from 'lucide-vue-next'

const router = useRouter()
const uiStore = useUIStore()
const timeStore = useTimeTrackingStore()

const { currentView, toggleSidebar, unreadNotifications } = uiStore
const { workSessions } = timeStore

const searchQuery = ref('')
const showMobileSearch = ref(false)
const showNotifications = ref(false)
const showQuickActions = ref(false)
const showProfileMenu = ref(false)

const unreadCount = computed(() => unreadNotifications.length)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    const results = workSessions.filter(session => 
      session.notes?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      session.project?.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    console.log('Search results:', results)
    // Navigate to search results or show in modal
  }
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const toggleQuickActions = () => {
  showQuickActions.value = !showQuickActions.value
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}
</script>