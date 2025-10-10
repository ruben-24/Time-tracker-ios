<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-dark-900 dark:text-dark-100 mb-2">
          Rapoarte
        </h1>
        <p class="text-dark-600 dark:text-dark-400">
          Analizează productivitatea și orele lucrate
        </p>
      </div>
      <div class="flex space-x-3">
        <select
          v-model="selectedPeriod"
          class="px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
        >
          <option value="week">Săptămâna aceasta</option>
          <option value="month">Luna aceasta</option>
          <option value="quarter">Trimestrul acesta</option>
          <option value="year">Anul acesta</option>
        </select>
        <button class="btn-secondary">
          <Download class="w-4 h-4 mr-2" />
          Exportă PDF
        </button>
      </div>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Ore Totale</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">
              {{ formatDuration(periodStats.totalWorkTime) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Clock class="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Ore Medii/Zi</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">
              {{ formatDuration(periodStats.averageDaily) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <BarChart3 class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-dark-500 dark:text-dark-400">
          <Calendar class="w-4 h-4 mr-1" />
          {{ periodStats.workDays }} zile lucrate
        </div>
      </div>

      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Eficiență</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">
              {{ efficiencyPercentage }}%
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Target class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
          <Activity class="w-4 h-4 mr-1" />
          Productivitate ridicată
        </div>
      </div>

      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Proiecte Active</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">
              {{ activeProjectsCount }}
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <Folder class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-dark-500 dark:text-dark-400">
          <Briefcase class="w-4 h-4 mr-1" />
          Proiecte în lucru
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Work Hours Trend -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100">
            Tendința Orelor de Lucru
          </h3>
          <div class="flex space-x-2">
            <button class="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg">
              Zilnic
            </button>
            <button class="px-3 py-1 text-sm text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg">
              Săptămânal
            </button>
          </div>
        </div>
        
        <div class="h-64 flex items-end justify-between space-x-2">
          <div
            v-for="(day, index) in weeklyTrend"
            :key="index"
            class="flex-1 flex flex-col items-center"
          >
            <div 
              class="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-lg transition-all duration-300 hover:from-primary-600 hover:to-primary-500"
              :style="{ height: `${(day.hours / Math.max(...weeklyTrend.map(d => d.hours))) * 200}px` }"
            ></div>
            <div class="mt-2 text-xs text-dark-600 dark:text-dark-400 text-center">
              <div class="font-medium">{{ day.hours }}h</div>
              <div class="text-dark-500 dark:text-dark-500">{{ day.day }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Project Distribution -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100">
            Distribuția pe Proiecte
          </h3>
          <button class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
            Vezi detalii
          </button>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="project in projectStats"
            :key="project.id"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: project.color }"
              ></div>
              <span class="text-sm font-medium text-dark-900 dark:text-dark-100">
                {{ project.name }}
              </span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-24 bg-dark-200 dark:bg-dark-700 rounded-full h-2">
                <div 
                  class="h-2 rounded-full transition-all duration-500"
                  :style="{ 
                    width: `${project.percentage}%`,
                    backgroundColor: project.color
                  }"
                ></div>
              </div>
              <span class="text-sm font-medium text-dark-900 dark:text-dark-100 w-16 text-right">
                {{ formatDuration(project.hours) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detailed Analytics -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Work Pattern -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-100 mb-4">
          Modelul de Lucru
        </h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-sm text-dark-700 dark:text-dark-300">Ore de vârf</span>
            </div>
            <span class="text-sm font-medium text-dark-900 dark:text-dark-100">
              {{ peakHours }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span class="text-sm text-dark-700 dark:text-dark-300">Ore medii</span>
            </div>
            <span class="text-sm font-medium text-dark-900 dark:text-dark-100">
              {{ averageHours }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span class="text-sm text-dark-700 dark:text-dark-300">Ore minime</span>
            </div>
            <span class="text-sm font-medium text-dark-900 dark:text-dark-100">
              {{ minHours }}
            </span>
          </div>
        </div>
      </div>

      <!-- Productivity Insights -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-100 mb-4">
          Insight-uri Productivitate
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
              Orele de lucru cresc cu {{ Math.floor(Math.random() * 15) + 5 }}% săptămânal
            </p>
          </div>
          
          <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div class="flex items-center space-x-2">
              <Target class="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span class="text-sm font-medium text-blue-800 dark:text-blue-200">
                Obiectiv atins
              </span>
            </div>
            <p class="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Ai atins {{ Math.floor(Math.random() * 20) + 80 }}% din obiectivul săptămânal
            </p>
          </div>
          
          <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div class="flex items-center space-x-2">
              <Clock class="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span class="text-sm font-medium text-purple-800 dark:text-purple-200">
                Program optim
              </span>
            </div>
            <p class="text-xs text-purple-700 dark:text-purple-300 mt-1">
              Cea mai productivă oră: {{ peakHours }}
            </p>
          </div>
        </div>
      </div>

      <!-- Weekly Summary -->
      <div class="card p-6">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-100 mb-4">
          Rezumat Săptămânal
        </h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-sm text-dark-600 dark:text-dark-400">Luni</span>
            <div class="flex items-center space-x-2">
              <div class="w-16 bg-dark-200 dark:bg-dark-700 rounded-full h-2">
                <div class="h-2 bg-green-500 rounded-full" style="width: 85%"></div>
              </div>
              <span class="text-sm font-medium text-dark-900 dark:text-dark-100">6.8h</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-dark-600 dark:text-dark-400">Marți</span>
            <div class="flex items-center space-x-2">
              <div class="w-16 bg-dark-200 dark:bg-dark-700 rounded-full h-2">
                <div class="h-2 bg-green-500 rounded-full" style="width: 100%"></div>
              </div>
              <span class="text-sm font-medium text-dark-900 dark:text-dark-100">8.0h</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-dark-600 dark:text-dark-400">Miercuri</span>
            <div class="flex items-center space-x-2">
              <div class="w-16 bg-dark-200 dark:bg-dark-700 rounded-full h-2">
                <div class="h-2 bg-green-500 rounded-full" style="width: 75%"></div>
              </div>
              <span class="text-sm font-medium text-dark-900 dark:text-dark-100">6.0h</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-dark-600 dark:text-dark-400">Joi</span>
            <div class="flex items-center space-x-2">
              <div class="w-16 bg-dark-200 dark:bg-dark-700 rounded-full h-2">
                <div class="h-2 bg-green-500 rounded-full" style="width: 90%"></div>
              </div>
              <span class="text-sm font-medium text-dark-900 dark:text-dark-100">7.2h</span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-dark-600 dark:text-dark-400">Vineri</span>
            <div class="flex items-center space-x-2">
              <div class="w-16 bg-dark-200 dark:bg-dark-700 rounded-full h-2">
                <div class="h-2 bg-green-500 rounded-full" style="width: 60%"></div>
              </div>
              <span class="text-sm font-medium text-dark-900 dark:text-dark-100">4.8h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTimeTrackingStore } from '@/stores/dataStore'
import { 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Calendar, 
  Target, 
  Activity, 
  Folder, 
  Briefcase,
  Download
} from 'lucide-vue-next'

const timeStore = useTimeTrackingStore()
const { workSessions, projects, stats } = timeStore

const selectedPeriod = ref('week')

const periodStats = computed(() => {
  // Calculate based on selected period
  const now = new Date()
  let workDays = 0
  
  switch (selectedPeriod.value) {
    case 'week':
      workDays = 5 // Working days in a week
      break
    case 'month':
      workDays = 22 // Average working days in a month
      break
    case 'quarter':
      workDays = 66 // Average working days in a quarter
      break
    case 'year':
      workDays = 260 // Average working days in a year
      break
  }

  return {
    totalWorkTime: stats.thisWeek.workTime,
    averageDaily: stats.averageDaily.workTime,
    workDays,
    efficiency: 85 // Mock data
  }
})

const efficiencyPercentage = computed(() => {
  return Math.floor(Math.random() * 20) + 80 // Mock data
})

const activeProjectsCount = computed(() => 
  projects.filter(project => project.isActive).length
)

const weeklyTrend = computed(() => {
  // Mock data for weekly trend
  return [
    { day: 'L', hours: 6.8 },
    { day: 'M', hours: 8.0 },
    { day: 'Mi', hours: 6.0 },
    { day: 'J', hours: 7.2 },
    { day: 'V', hours: 4.8 },
    { day: 'S', hours: 0 },
    { day: 'D', hours: 0 }
  ]
})

const projectStats = computed(() => {
  return projects.map(project => ({
    id: project.id,
    name: project.name,
    color: project.color,
    hours: Math.floor(Math.random() * 40) + 10, // Mock data
    percentage: Math.floor(Math.random() * 30) + 20 // Mock data
  }))
})

const peakHours = computed(() => {
  return '10:00-11:00' // Mock data
})

const averageHours = computed(() => {
  return '7.2h/zi' // Mock data
})

const minHours = computed(() => {
  return '4.8h' // Mock data
})

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}
</script>