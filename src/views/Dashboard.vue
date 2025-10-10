<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="glass p-8 rounded-2xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-dark-900 dark:text-dark-100 mb-2">
            Bun venit înapoi! 👋
          </h1>
          <p class="text-dark-600 dark:text-dark-400 text-lg">
            Iată o privire de ansamblu asupra datelor tale
          </p>
        </div>
        <div class="hidden md:block">
          <div class="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center animate-float">
            <Database class="w-12 h-12 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Total Intrări</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">{{ totalEntries }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <FileText class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
          <TrendingUp class="w-4 h-4 mr-1" />
          +12% față de luna trecută
        </div>
      </div>

      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Categorii</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">{{ categories.length }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Folder class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-dark-500 dark:text-dark-400">
          <Tag class="w-4 h-4 mr-1" />
          Organizate eficient
        </div>
      </div>

      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Valoare Totală</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">
              {{ totalValue.toLocaleString('ro-RO') }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
          <TrendingUp class="w-4 h-4 mr-1" />
          +8% față de luna trecută
        </div>
      </div>

      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Activități</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">{{ activeEntries }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <Activity class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-dark-500 dark:text-dark-400">
          <Clock class="w-4 h-4 mr-1" />
          În ultimele 24h
        </div>
      </div>
    </div>

    <!-- Recent Entries -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Data -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100">
            Intrări Recente
          </h3>
          <router-link to="/data-entry" class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
            Vezi toate
          </router-link>
        </div>
        
        <div v-if="recentEntries.length === 0" class="text-center py-8">
          <FileText class="w-12 h-12 text-dark-400 dark:text-dark-500 mx-auto mb-4" />
          <p class="text-dark-500 dark:text-dark-400 mb-4">Nu există intrări încă</p>
          <router-link to="/data-entry" class="btn-primary">
            Adaugă prima intrare
          </router-link>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="entry in recentEntries.slice(0, 5)"
            :key="entry.id"
            class="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-700/50 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <component :is="getCategoryIcon(entry.category)" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h4 class="font-medium text-dark-900 dark:text-dark-100">{{ entry.title }}</h4>
                <p class="text-sm text-dark-500 dark:text-dark-400">{{ entry.category }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-dark-900 dark:text-dark-100">{{ entry.value.toLocaleString('ro-RO') }}</p>
              <p class="text-sm text-dark-500 dark:text-dark-400">{{ formatDate(entry.date) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Overview -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100">
            Categorii
          </h3>
          <router-link to="/analytics" class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
            Vezi analize
          </router-link>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="category in categories"
            :key="category.id"
            class="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-700/50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :style="{ backgroundColor: category.color + '20' }"
              >
                <component :is="getCategoryIcon(category.name)" class="w-5 h-5" :style="{ color: category.color }" />
              </div>
              <div>
                <h4 class="font-medium text-dark-900 dark:text-dark-100">{{ category.name }}</h4>
                <p class="text-sm text-dark-500 dark:text-dark-400">{{ category.description }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-dark-900 dark:text-dark-100">
                {{ getEntriesByCategory(category.id).length }}
              </p>
              <p class="text-sm text-dark-500 dark:text-dark-400">intrări</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="card p-6">
      <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-6">
        Acțiuni Rapide
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <router-link to="/data-entry" class="btn-primary text-center">
          <Plus class="w-5 h-5 mr-2" />
          Adaugă Date
        </router-link>
        <router-link to="/analytics" class="btn-secondary text-center">
          <BarChart3 class="w-5 h-5 mr-2" />
          Vezi Analize
        </router-link>
        <button class="btn-secondary text-center">
          <Download class="w-5 h-5 mr-2" />
          Exportă Date
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import { 
  Database, 
  FileText, 
  TrendingUp, 
  Folder, 
  Tag, 
  DollarSign, 
  Activity, 
  Clock, 
  Plus, 
  BarChart3, 
  Download,
  DollarSign as DollarIcon,
  User,
  Briefcase,
  Heart
} from 'lucide-vue-next'

const dataStore = useDataStore()
const { entries, categories, totalEntries, getEntriesByCategory } = dataStore

const recentEntries = computed(() => 
  [...entries].sort((a, b) => b.date.getTime() - a.date.getTime())
)

const totalValue = computed(() => 
  entries.reduce((sum, entry) => sum + entry.value, 0)
)

const activeEntries = computed(() => 
  entries.filter(entry => entry.status === 'active').length
)

const getCategoryIcon = (categoryName: string) => {
  const category = categories.find(cat => cat.name === categoryName || cat.id === categoryName)
  if (!category) return FileText
  
  const iconMap: Record<string, any> = {
    'Financiar': DollarIcon,
    'Personal': User,
    'Muncă': Briefcase,
    'Sănătate': Heart
  }
  
  return iconMap[category.name] || FileText
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>