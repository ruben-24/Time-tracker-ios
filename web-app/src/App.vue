<template>
  <div :class="['min-h-screen transition-all duration-300', { 'dark': isDark }]">
    <!-- Background Pattern -->
    <div class="fixed inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900 opacity-50"></div>
    <div class="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
    
    <!-- Mobile-specific styles -->
    <div class="fixed inset-0 pointer-events-none">
      <div class="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/80 to-transparent dark:from-dark-900/80"></div>
      <div class="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white/80 to-transparent dark:from-dark-900/80"></div>
    </div>
    
    <!-- Main Layout -->
    <div class="relative z-10 flex h-screen">
      <!-- Sidebar -->
      <Sidebar v-if="sidebarOpen" />
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <Header />
        
        <!-- Page Content -->
        <main class="flex-1 overflow-auto p-6">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
    </div>
    
    <!-- Notifications -->
    <NotificationContainer />
    
    <!-- Loading Overlay -->
    <LoadingOverlay v-if="loading" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useUIStore } from '@/stores/uiStore'
import { useDataStore } from '@/stores/dataStore'
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import NotificationContainer from '@/components/ui/NotificationContainer.vue'
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'

const uiStore = useUIStore()
const dataStore = useDataStore()
const { isDark, sidebarOpen, loading, initTheme } = uiStore

onMounted(() => {
  initTheme()
})
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>