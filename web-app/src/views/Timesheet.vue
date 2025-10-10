<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-dark-900 dark:text-dark-100 mb-2">
          Timesheet
        </h1>
        <p class="text-dark-600 dark:text-dark-400">
          Vezi și gestionează orele lucrate
        </p>
      </div>
      <div class="flex space-x-3">
        <select
          v-model="selectedPeriod"
          class="px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
        >
          <option value="today">Astăzi</option>
          <option value="week">Săptămâna aceasta</option>
          <option value="month">Luna aceasta</option>
        </select>
        <button class="btn-secondary">
          <Download class="w-4 h-4 mr-2" />
          Exportă
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Ore Lucrate</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">
              {{ formatDuration(periodStats.workTime) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <Clock class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Pauze</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">
              {{ formatDuration(periodStats.breakTime) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <Coffee class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Pauză de Masă</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">
              {{ formatDuration(periodStats.lunchTime) }}
            </p>
          </div>
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Utensils class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Sesiuni</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">
              {{ periodStats.sessions }}
            </p>
          </div>
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Play class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
    </div>

    <!-- Timesheet Table -->
    <div class="card">
      <div class="p-6 border-b border-dark-200 dark:border-dark-700">
        <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-100">
          Detalii Timesheet
        </h3>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-dark-50 dark:bg-dark-700/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                Data
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                Tip
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                Proiect
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                Început
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                Sfârșit
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                Durată
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-dark-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-dark-200 dark:divide-dark-700">
            <tr v-if="filteredSessions.length === 0">
              <td colspan="7" class="px-6 py-12 text-center text-dark-500 dark:text-dark-400">
                <Clock class="w-12 h-12 mx-auto mb-4 text-dark-400 dark:text-dark-500" />
                <p>Nu există sesiuni pentru perioada selectată</p>
              </td>
            </tr>
            <tr
              v-for="session in filteredSessions"
              :key="session.id"
              class="hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-dark-900 dark:text-dark-100">
                {{ formatDate(session.startTime) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getSessionBadgeClass(session.type)"
                >
                  <component :is="getSessionIcon(session.type)" class="w-3 h-3 mr-1" />
                  {{ getSessionTitle(session.type) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-dark-900 dark:text-dark-100">
                {{ session.project ? getProjectName(session.project) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-dark-900 dark:text-dark-100">
                {{ formatTime(session.startTime) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-dark-900 dark:text-dark-100">
                {{ session.endTime ? formatTime(session.endTime) : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900 dark:text-dark-100">
                {{ formatDuration(session.duration) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusBadgeClass(session.status)"
                >
                  {{ getStatusTitle(session.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Daily Breakdown -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-100 mb-6">
        Rezumat Zilnic
      </h3>
      
      <div class="space-y-4">
        <div
          v-for="day in dailyBreakdown"
          :key="day.date"
          class="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-700/50 rounded-lg"
        >
          <div class="flex items-center space-x-4">
            <div class="text-sm font-medium text-dark-900 dark:text-dark-100">
              {{ formatDate(new Date(day.date)) }}
            </div>
            <div class="flex space-x-4 text-sm text-dark-600 dark:text-dark-400">
              <span class="flex items-center">
                <Clock class="w-4 h-4 mr-1" />
                {{ formatDuration(day.workTime) }} lucru
              </span>
              <span class="flex items-center">
                <Coffee class="w-4 h-4 mr-1" />
                {{ formatDuration(day.breakTime) }} pauze
              </span>
              <span class="flex items-center">
                <Utensils class="w-4 h-4 mr-1" />
                {{ formatDuration(day.lunchTime) }} masă
              </span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg font-semibold text-dark-900 dark:text-dark-100">
              {{ formatDuration(day.totalTime) }}
            </div>
            <div class="text-sm text-dark-500 dark:text-dark-400">
              {{ day.sessions }} sesiuni
            </div>
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
  Clock, 
  Coffee, 
  Utensils, 
  Play, 
  Download 
} from 'lucide-vue-next'

const dataStore = useDataStore()
const { entries, categories, stats } = dataStore

const selectedPeriod = ref('today')

const filteredSessions = computed(() => {
  const now = new Date()
  let startDate: Date
  let endDate: Date

  switch (selectedPeriod.value) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      break
    case 'week':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - now.getDay())
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 7)
      break
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      break
    default:
      startDate = new Date(0)
      endDate = new Date()
  }

  return workSessions.filter(session => 
    session.startTime >= startDate && session.startTime < endDate
  ).sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
})

const periodStats = computed(() => {
  const sessions = filteredSessions.value
  
  const workTime = sessions
    .filter(s => s.type === 'work')
    .reduce((sum, s) => sum + s.duration, 0)
  
  const breakTime = sessions
    .filter(s => s.type === 'break')
    .reduce((sum, s) => sum + s.duration, 0)
  
  const lunchTime = sessions
    .filter(s => s.type === 'lunch')
    .reduce((sum, s) => sum + s.duration, 0)

  return {
    workTime,
    breakTime,
    lunchTime,
    sessions: sessions.length
  }
})

const dailyBreakdown = computed(() => {
  const sessions = filteredSessions.value
  const groupedByDate: Record<string, any> = {}

  sessions.forEach(session => {
    const date = session.startTime.toISOString().split('T')[0]
    if (!groupedByDate[date]) {
      groupedByDate[date] = {
        date,
        workTime: 0,
        breakTime: 0,
        lunchTime: 0,
        sessions: 0
      }
    }

    groupedByDate[date].sessions++
    if (session.type === 'work') {
      groupedByDate[date].workTime += session.duration
    } else if (session.type === 'break') {
      groupedByDate[date].breakTime += session.duration
    } else if (session.type === 'lunch') {
      groupedByDate[date].lunchTime += session.duration
    }
  })

  return Object.values(groupedByDate)
    .map(day => ({
      ...day,
      totalTime: day.workTime + day.breakTime + day.lunchTime
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
})

const getSessionIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    'work': Play,
    'break': Coffee,
    'lunch': Utensils
  }
  return iconMap[type] || Clock
}

const getSessionTitle = (type: string) => {
  const titleMap: Record<string, string> = {
    'work': 'Lucru',
    'break': 'Pauză',
    'lunch': 'Masă'
  }
  return titleMap[type] || 'Sesiune'
}

const getSessionBadgeClass = (type: string) => {
  const classMap: Record<string, string> = {
    'work': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'break': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
    'lunch': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
  }
  return classMap[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
}

const getStatusBadgeClass = (status: string) => {
  const classMap: Record<string, string> = {
    'active': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'paused': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
  }
  return classMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
}

const getStatusTitle = (status: string) => {
  const titleMap: Record<string, string> = {
    'active': 'Activ',
    'completed': 'Completat',
    'paused': 'Pauzat'
  }
  return titleMap[status] || status
}

const getProjectName = (projectId: string) => {
  const project = projects.find(p => p.id === projectId)
  return project?.name || 'Proiect necunoscut'
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ro-RO', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}
</script>