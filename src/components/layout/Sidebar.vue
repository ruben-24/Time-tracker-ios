<template>
  <aside class="w-64 bg-white/80 dark:bg-dark-800/80 backdrop-blur-lg border-r border-dark-200 dark:border-dark-700 flex flex-col">
    <!-- Logo Section -->
    <div class="p-6 border-b border-dark-200 dark:border-dark-700">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
          <Database class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-gradient">Data Manager</h1>
          <p class="text-sm text-dark-500 dark:text-dark-400">Modern & Intuitive</p>
        </div>
      </div>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2">
      <router-link
        v-for="item in navigationItems"
        :key="item.name"
        :to="item.path"
        class="sidebar-item group"
        :class="{ active: $route.name === item.name }"
      >
        <component :is="item.icon" class="w-5 h-5 mr-3 transition-transform group-hover:scale-110" />
        <span class="font-medium">{{ item.label }}</span>
        <div v-if="item.badge" class="ml-auto bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs px-2 py-1 rounded-full">
          {{ item.badge }}
        </div>
      </router-link>
    </nav>
    
    <!-- User Section -->
    <div class="p-4 border-t border-dark-200 dark:border-dark-700">
      <div class="flex items-center space-x-3 p-3 rounded-lg bg-dark-50 dark:bg-dark-700/50">
        <div class="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-500 rounded-full flex items-center justify-center">
          <User class="w-4 h-4 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-dark-900 dark:text-dark-100 truncate">Utilizator</p>
          <p class="text-xs text-dark-500 dark:text-dark-400 truncate">admin@example.com</p>
        </div>
        <button @click="toggleTheme" class="p-1.5 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors">
          <Sun v-if="isDark" class="w-4 h-4 text-dark-600 dark:text-dark-400" />
          <Moon v-else class="w-4 h-4 text-dark-600 dark:text-dark-400" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/uiStore'
import { useDataStore } from '@/stores/dataStore'
import { 
  Database, 
  LayoutDashboard, 
  PlusCircle, 
  BarChart3, 
  Settings, 
  User, 
  Sun, 
  Moon 
} from 'lucide-vue-next'

const uiStore = useUIStore()
const dataStore = useDataStore()
const { isDark, toggleTheme } = uiStore
const { totalEntries } = dataStore

const navigationItems = computed(() => [
  {
    name: 'Dashboard',
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    name: 'DataEntry',
    path: '/data-entry',
    label: 'Introducere Date',
    icon: PlusCircle,
    badge: totalEntries > 0 ? totalEntries : undefined
  },
  {
    name: 'Analytics',
    path: '/analytics',
    label: 'Analiză',
    icon: BarChart3
  },
  {
    name: 'Settings',
    path: '/settings',
    label: 'Setări',
    icon: Settings
  }
])
</script>