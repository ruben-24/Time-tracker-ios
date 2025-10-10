<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-dark-900 dark:text-dark-100 mb-2">
          Analiză și Statistici
        </h1>
        <p class="text-dark-600 dark:text-dark-400">
          Explorează datele tale cu vizualizări interactive
        </p>
      </div>
      <div class="flex space-x-3">
        <select
          v-model="selectedPeriod"
          class="px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
        >
          <option value="7">Ultimele 7 zile</option>
          <option value="30">Ultimele 30 zile</option>
          <option value="90">Ultimele 90 zile</option>
          <option value="365">Ultimul an</option>
        </select>
        <button class="btn-secondary">
          <Download class="w-4 h-4 mr-2" />
          Exportă Raport
        </button>
      </div>
    </div>

    <!-- Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Total Intrări</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">{{ analyticsData.totalEntries }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <FileText class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
          <TrendingUp class="w-4 h-4 mr-1" />
          +{{ Math.floor(Math.random() * 20) + 5 }}% față de perioada anterioară
        </div>
      </div>

      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Valoare Medie</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">
              {{ averageValue.toLocaleString('ro-RO') }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <DollarSign class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-dark-500 dark:text-dark-400">
          <BarChart3 class="w-4 h-4 mr-1" />
          Per intrare
        </div>
      </div>

      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Cea mai Populară</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">
              {{ topCategory?.name || 'N/A' }}
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <TrendingUp class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-dark-500 dark:text-dark-400">
          <PieChart class="w-4 h-4 mr-1" />
          {{ topCategory?.count || 0 }} intrări
        </div>
      </div>

      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Rata de Creștere</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">
              +{{ growthRate }}%
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <Activity class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
          <ArrowUp class="w-4 h-4 mr-1" />
          Față de luna trecută
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Monthly Trend Chart -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100">
            Tendința Lunară
          </h3>
          <div class="flex space-x-2">
            <button class="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg">
              Valoare
            </button>
            <button class="px-3 py-1 text-sm text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg">
              Cantitate
            </button>
          </div>
        </div>
        
        <div class="h-64 flex items-end justify-between space-x-2">
          <div
            v-for="(item, index) in monthlyTrendData"
            :key="index"
            class="flex-1 flex flex-col items-center"
          >
            <div 
              class="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-300 hover:from-primary-600 hover:to-primary-500"
              :style="{ height: `${(item.value / Math.max(...monthlyTrendData.map(d => d.value))) * 200}px` }"
            ></div>
            <div class="mt-2 text-xs text-dark-600 dark:text-dark-400 text-center">
              <div class="font-medium">{{ item.value.toLocaleString('ro-RO') }}</div>
              <div class="text-dark-500 dark:text-dark-500">{{ item.month }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Category Distribution -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100">
            Distribuția pe Categorii
          </h3>
          <button class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
            Vezi detalii
          </button>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="category in topCategories"
            :key="category.category"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: getCategoryColor(category.category) }"
              ></div>
              <span class="text-sm font-medium text-dark-900 dark:text-dark-100">
                {{ getCategoryName(category.category) }}
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-24 bg-dark-200 dark:bg-dark-700 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-500"
                  :style="{ 
                    width: `${category.percentage}%`,
                    backgroundColor: getCategoryColor(category.category)
                  }"
                ></div>
              </div>
              <span class="text-sm font-medium text-dark-900 dark:text-dark-100 w-12 text-right">
                {{ category.count }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Statistics -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Status Distribution -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-100 mb-4">
          Status Intrări
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm text-dark-700 dark:text-dark-300">Active</span>
            </div>
            <span class="text-sm font-medium text-dark-900 dark:text-dark-100">
              {{ statusDistribution.active }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-sm text-dark-700 dark:text-dark-300">În așteptare</span>
            </div>
            <span class="text-sm font-medium text-dark-900 dark:text-dark-100">
              {{ statusDistribution.pending }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span class="text-sm text-dark-700 dark:text-dark-300">Inactive</span>
            </div>
            <span class="text-sm font-medium text-dark-900 dark:text-dark-100">
              {{ statusDistribution.inactive }}
            </span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-100 mb-4">
          Activitate Recentă
        </h3>
        <div class="space-y-3">
          <div
            v-for="entry in recentActivity"
            :key="entry.id"
            class="flex items-center space-x-3"
          >
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <Plus class="w-4 h-4 text-primary-600 dark:text-primary-400" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-dark-900 dark:text-dark-100 truncate">
                {{ entry.title }}
              </p>
              <p class="text-xs text-dark-500 dark:text-dark-400">
                {{ formatDate(entry.date) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Insights -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-100 mb-4">
          Insight-uri Rapide
        </h3>
        <div class="space-y-4">
          <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div class="flex items-center space-x-2">
              <TrendingUp class="w-4 h-4 text-green-600 dark:text-green-400" />
              <span class="text-sm font-medium text-green-800 dark:text-green-200">
                Creștere constantă
              </span>
            </div>
            <p class="text-xs text-green-700 dark:text-green-300 mt-1">
              Datele tale cresc cu {{ growthRate }}% lunar
            </p>
          </div>
          
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div class="flex items-center space-x-2">
              <Target class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span class="text-sm font-medium text-blue-800 dark:text-blue-200">
                Categoria dominantă
              </span>
            </div>
            <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">
              {{ topCategory?.name }} reprezintă {{ topCategory?.percentage?.toFixed(1) }}% din total
            </p>
          </div>
          
          <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div class="flex items-center space-x-2">
              <Clock class="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span class="text-sm font-medium text-purple-800 dark:text-purple-200">
                Activitate recentă
              </span>
            </div>
            <p class="text-xs text-purple-700 dark:text-purple-300 mt-1">
              {{ recentActivity.length }} intrări în ultimele 7 zile
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStore } from '@/stores/dataStore'
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  PieChart, 
  Activity, 
  ArrowUp, 
  Download,
  Plus,
  Target,
  Clock
} from 'lucide-vue-next'

const dataStore = useDataStore()
const { entries, categories, analyticsData } = dataStore

const selectedPeriod = ref('30')

const averageValue = computed(() => {
  if (entries.length === 0) return 0
  const total = entries.reduce((sum, entry) => sum + entry.value, 0)
  return Math.round(total / entries.length)
})

const topCategory = computed(() => {
  if (analyticsData.topCategories.length === 0) return null
  return {
    name: getCategoryName(analyticsData.topCategories[0].category),
    count: analyticsData.topCategories[0].count,
    percentage: analyticsData.topCategories[0].percentage
  }
})

const topCategories = computed(() => analyticsData.topCategories)

const monthlyTrendData = computed(() => {
  // Generate sample data for the last 6 months
  const months = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun']
  return months.map((month, index) => ({
    month,
    value: Math.floor(Math.random() * 10000) + 1000
  }))
})

const statusDistribution = computed(() => {
  const distribution = { active: 0, inactive: 0, pending: 0 }
  entries.forEach(entry => {
    distribution[entry.status]++
  })
  return distribution
})

const recentActivity = computed(() => 
  [...entries]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)
)

const growthRate = computed(() => Math.floor(Math.random() * 30) + 10)

const getCategoryColor = (categoryId: string) => {
  const category = categories.find(cat => cat.id === categoryId)
  return category?.color || '#6b7280'
}

const getCategoryName = (categoryId: string) => {
  const category = categories.find(cat => cat.id === categoryId)
  return category?.name || 'Necunoscut'
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit'
  })
}
</script>