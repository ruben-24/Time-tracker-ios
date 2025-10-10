<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <transition-group name="notification" tag="div">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="max-w-sm w-full bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-dark-200 dark:border-dark-700 p-4 animate-slide-in"
        :class="{
          'border-green-200 dark:border-green-800': notification.type === 'success',
          'border-red-200 dark:border-red-800': notification.type === 'error',
          'border-yellow-200 dark:border-yellow-800': notification.type === 'warning',
          'border-blue-200 dark:border-blue-800': notification.type === 'info'
        }"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <CheckCircle v-if="notification.type === 'success'" class="w-5 h-5 text-green-500" />
            <XCircle v-else-if="notification.type === 'error'" class="w-5 h-5 text-red-500" />
            <AlertTriangle v-else-if="notification.type === 'warning'" class="w-5 h-5 text-yellow-500" />
            <Info v-else class="w-5 h-5 text-blue-500" />
          </div>
          <div class="ml-3 flex-1">
            <h4 class="text-sm font-medium text-dark-900 dark:text-dark-100">
              {{ notification.title }}
            </h4>
            <p class="mt-1 text-sm text-dark-600 dark:text-dark-400">
              {{ notification.message }}
            </p>
          </div>
          <div class="ml-4 flex-shrink-0">
            <button
              @click="removeNotification(notification.id)"
              class="inline-flex text-dark-400 hover:text-dark-600 dark:hover:text-dark-300 transition-colors"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUIStore } from '@/stores/uiStore'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const uiStore = useUIStore()
const { removeNotification } = uiStore

const notifications = computed(() => uiStore.notifications)
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>