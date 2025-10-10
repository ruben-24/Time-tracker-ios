<template>
  <div class="space-y-8">
    <!-- Welcome Section -->
    <div class="glass p-8 rounded-2xl">
      <div class="flex items-center justify-between">
        <div>
        <h1 class="text-3xl font-bold text-dark-900 dark:text-dark-100 mb-2">
          Bună dimineața! ⏰
        </h1>
        <p class="text-dark-600 dark:text-dark-400 text-lg">
          Gata să începi să contorizezi orele de lucru?
        </p>
        </div>
        <div class="hidden md:block">
          <div class="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center animate-float">
            <Clock class="w-12 h-12 text-white" />
          </div>
        </div>
      </div>
    </div>

    <!-- Current Session (Time Tracking) -->
    <div v-if="currentSession" class="card p-6 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center animate-pulse">
            <component :is="getSessionIcon(currentSession.type)" class="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-primary-900 dark:text-primary-100">
              {{ getSessionTitle(currentSession.type) }}
            </h3>
            <p class="text-primary-700 dark:text-primary-300">
              {{ formatDuration(currentSessionDuration) }} - {{ formatTime(currentSession.startTime) }}
            </p>
          </div>
        </div>
        <div class="text-right">
          <p class="text-3xl font-bold text-primary-900 dark:text-primary-100">
            {{ formatDuration(currentSessionDuration) }}
          </p>
          <p class="text-sm text-primary-700 dark:text-primary-300">Timp activ</p>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Ore Lucrate Astăzi</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">{{ formatDuration(stats.today.workTime) }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Clock class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
          <TrendingUp class="w-4 h-4 mr-1" />
          {{ stats.today.sessions }} sesiuni
        </div>
      </div>

      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Pauze Astăzi</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">{{ formatDuration(stats.today.breakTime) }}</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Coffee class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-dark-500 dark:text-dark-400">
          <Activity class="w-4 h-4 mr-1" />
          Pauze de lucru
        </div>
      </div>

      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Pauză de Masă</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">{{ formatDuration(stats.today.lunchTime) }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <Utensils class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
          <TrendingUp class="w-4 h-4 mr-1" />
          Timp de masă
        </div>
      </div>

      <div class="card p-6 card-hover">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-dark-600 dark:text-dark-400">Proiecte Active</p>
            <p class="text-3xl font-bold text-dark-900 dark:text-dark-100">{{ activeProjects }}</p>
          </div>
          <div class="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
            <Folder class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm text-dark-500 dark:text-dark-400">
          <Tag class="w-4 h-4 mr-1" />
          Proiecte în curs
        </div>
      </div>
    </div>

    <!-- Recent Sessions -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Sessions -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100">
            Sesiuni Recente
          </h3>
          <router-link to="/timesheet" class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
            Vezi toate
          </router-link>
        </div>
        
        <div v-if="recentSessions.length === 0" class="text-center py-8">
          <Clock class="w-12 h-12 text-dark-400 dark:text-dark-500 mx-auto mb-4" />
          <p class="text-dark-500 dark:text-dark-400 mb-4">Nu există sesiuni încă</p>
          <router-link to="/time-tracker" class="btn-primary">
            Începe prima sesiune
          </router-link>
        </div>
        
        <div v-else class="space-y-4">
          <div
            v-for="session in recentSessions.slice(0, 5)"
            :key="session.id"
            class="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-700/50 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
          >
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <component :is="getSessionIcon(session.type)" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h4 class="font-medium text-dark-900 dark:text-dark-100">{{ getSessionTitle(session.type) }}</h4>
                <p class="text-sm text-dark-500 dark:text-dark-400">{{ formatTime(session.startTime) }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-dark-900 dark:text-dark-100">{{ formatDuration(session.duration) }}</p>
              <p class="text-sm text-dark-500 dark:text-dark-400">{{ session.status }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Projects Overview -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100">
            Proiecte
          </h3>
          <router-link to="/reports" class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
            Vezi rapoarte
          </router-link>
        </div>
        
        <div class="space-y-4">
          <div
            v-for="project in projects"
            :key="project.id"
            class="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-700/50 rounded-lg"
          >
            <div class="flex items-center space-x-3">
              <div 
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :style="{ backgroundColor: project.color + '20' }"
              >
                <Folder class="w-5 h-5" :style="{ color: project.color }" />
              </div>
              <div>
                <h4 class="font-medium text-dark-900 dark:text-dark-100">{{ project.name }}</h4>
                <p class="text-sm text-dark-500 dark:text-dark-400">{{ project.description }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-semibold text-dark-900 dark:text-dark-100">
                {{ getSessionsByProject(project.id).length }}
              </p>
              <p class="text-sm text-dark-500 dark:text-dark-400">sesiuni</p>
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
        <router-link to="/time-tracker" class="btn-primary text-center">
          <Play class="w-5 h-5 mr-2" />
          Începe Lucrul
        </router-link>
        <router-link to="/timesheet" class="btn-secondary text-center">
          <Calendar class="w-5 h-5 mr-2" />
          Vezi Timesheet
        </router-link>
        <router-link to="/reports" class="btn-secondary text-center">
          <BarChart3 class="w-5 h-5 mr-2" />
          Vezi Rapoarte
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTimeTrackingStore } from '@/stores/dataStore'
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
  Heart,
  Play,
  Coffee,
  Utensils
} from 'lucide-vue-next'

const timeStore = useTimeTrackingStore()
const { currentSession, projects, stats, currentSessionDuration, todayTimesheet } = timeStore

const activeProjects = computed(() => 
  projects.filter(project => project.isActive).length
)

const recentSessions = computed(() => 
  todayTimesheet.workSessions
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
    .slice(0, 5)
)

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
    'work': 'Lucru în curs',
    'break': 'Pauză activă',
    'lunch': 'Pauză de masă'
  }
  return titleMap[type] || 'Sesiune activă'
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

const getSessionsByProject = (projectId: string) => {
  return timeStore.getSessionsByProject(projectId)
}
</script>