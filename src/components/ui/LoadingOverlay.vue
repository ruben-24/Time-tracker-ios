<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div class="bg-white dark:bg-dark-800 rounded-xl p-8 shadow-2xl">
      <div class="flex flex-col items-center space-y-4">
        <!-- Spinner -->
        <div class="relative">
          <div class="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 rounded-full animate-spin"></div>
          <div class="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-primary-500 rounded-full animate-spin"></div>
        </div>
        
        <!-- Loading Text -->
        <div class="text-center">
          <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-100 mb-2">
            Se încarcă...
          </h3>
          <p class="text-sm text-dark-600 dark:text-dark-400">
            Vă rugăm să așteptați
          </p>
        </div>
        
        <!-- Progress Bar -->
        <div class="w-48 bg-dark-200 dark:bg-dark-700 rounded-full h-2">
          <div class="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Loading overlay component - no additional logic needed
</script>