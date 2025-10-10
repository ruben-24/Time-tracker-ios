<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-dark-900 dark:text-dark-100 mb-2">
          Contorizare Timp
        </h1>
        <p class="text-dark-600 dark:text-dark-400">
          Gestionează sesiunile de lucru și pauzele
        </p>
      </div>
    </div>

    <!-- Current Session Display -->
    <div v-if="currentSession" class="card p-8">
      <div class="text-center">
        <div class="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <component :is="getSessionIcon(currentSession.type)" class="w-16 h-16 text-white" />
        </div>
        
        <h2 class="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-2">
          {{ getSessionTitle(currentSession.type) }}
        </h2>
        
        <p class="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4 font-mono">
          {{ formatDuration(currentSessionDuration) }}
        </p>
        
        <p class="text-dark-600 dark:text-dark-400 mb-6">
          Început: {{ formatTime(currentSession.startTime) }}
        </p>
        
        <div class="flex justify-center space-x-4">
          <button 
            @click="pauseCurrentSession"
            v-if="currentSession.status === 'active'"
            class="btn-secondary"
          >
            <Pause class="w-4 h-4 mr-2" />
            Pauză
          </button>
          <button 
            @click="resumeCurrentSession"
            v-if="currentSession.status === 'paused'"
            class="btn-primary"
          >
            <Play class="w-4 h-4 mr-2" />
            Continuă
          </button>
          <button 
            @click="stopCurrentSession"
            class="btn-secondary bg-red-500 hover:bg-red-600 text-white"
          >
            <Square class="w-4 h-4 mr-2" />
            Oprește
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Start Work -->
      <div class="card p-6 text-center card-hover">
        <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Play class="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-2">
          Începe Lucrul
        </h3>
        <p class="text-dark-600 dark:text-dark-400 mb-4">
          Pornește o sesiune de lucru
        </p>
        <select 
          v-model="selectedProject"
          class="input-field mb-4"
        >
          <option value="">Selectează proiectul</option>
          <option 
            v-for="project in activeProjects" 
            :key="project.id" 
            :value="project.id"
          >
            {{ project.name }}
          </option>
        </select>
        <button 
          @click="startWorkSession"
          class="btn-primary w-full"
        >
          <Play class="w-4 h-4 mr-2" />
          Începe Lucrul
        </button>
      </div>

      <!-- Start Break -->
      <div class="card p-6 text-center card-hover">
        <div class="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Coffee class="w-8 h-8 text-orange-600 dark:text-orange-400" />
        </div>
        <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-2">
          Pauză
        </h3>
        <p class="text-dark-600 dark:text-dark-400 mb-4">
          Ia o pauză de la lucru
        </p>
        <button 
          @click="startBreakSession"
          class="btn-secondary w-full"
        >
          <Coffee class="w-4 h-4 mr-2" />
          Începe Pauza
        </button>
      </div>

      <!-- Start Lunch -->
      <div class="card p-6 text-center card-hover">
        <div class="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Utensils class="w-8 h-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-2">
          Pauză de Masă
        </h3>
        <p class="text-dark-600 dark:text-dark-400 mb-4">
          Ia pauza de masă
        </p>
        <button 
          @click="startLunchSession"
          class="btn-secondary w-full"
        >
          <Utensils class="w-4 h-4 mr-2" />
          Începe Masa
        </button>
      </div>
    </div>

    <!-- Today's Summary -->
    <div class="card p-6">
      <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-6">
        Rezumatul Zilei
      </h3>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Clock class="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <p class="text-2xl font-bold text-green-700 dark:text-green-300">
            {{ formatDuration(stats.today.workTime) }}
          </p>
          <p class="text-sm text-green-600 dark:text-green-400">Ore lucrate</p>
        </div>
        
        <div class="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <Coffee class="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
          <p class="text-2xl font-bold text-orange-700 dark:text-orange-300">
            {{ formatDuration(stats.today.breakTime) }}
          </p>
          <p class="text-sm text-orange-600 dark:text-orange-400">Pauze</p>
        </div>
        
        <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <Utensils class="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
          <p class="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {{ formatDuration(stats.today.lunchTime) }}
          </p>
          <p class="text-sm text-purple-600 dark:text-purple-400">Pauză de masă</p>
        </div>
      </div>
    </div>

    <!-- Recent Sessions -->
    <div class="card p-6">
      <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-6">
        Sesiuni Recente
      </h3>
      
      <div v-if="recentSessions.length === 0" class="text-center py-8">
        <Clock class="w-12 h-12 text-dark-400 dark:text-dark-500 mx-auto mb-4" />
        <p class="text-dark-500 dark:text-dark-400">Nu există sesiuni încă</p>
      </div>
      
      <div v-else class="space-y-4">
        <div
          v-for="session in recentSessions"
          :key="session.id"
          class="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-700/50 rounded-lg"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="getSessionBgClass(session.type)"
            >
              <component :is="getSessionIcon(session.type)" class="w-5 h-5" :class="getSessionTextClass(session.type)" />
            </div>
            <div>
              <h4 class="font-medium text-dark-900 dark:text-dark-100">
                {{ getSessionTitle(session.type) }}
              </h4>
              <p class="text-sm text-dark-500 dark:text-dark-400">
                {{ formatTime(session.startTime) }} - {{ session.endTime ? formatTime(session.endTime) : 'În curs' }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <p class="font-semibold text-dark-900 dark:text-dark-100">
              {{ formatDuration(session.duration) }}
            </p>
            <p class="text-sm text-dark-500 dark:text-dark-400">
              {{ session.project ? getProjectName(session.project) : 'Fără proiect' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTimeTrackingStore } from '@/stores/dataStore'
import { useUIStore } from '@/stores/uiStore'
import { 
  Play, 
  Pause, 
  Square, 
  Coffee, 
  Utensils, 
  Clock 
} from 'lucide-vue-next'

const timeStore = useTimeTrackingStore()
const uiStore = useUIStore()
const { 
  currentSession, 
  projects, 
  stats, 
  currentSessionDuration, 
  todayTimesheet,
  startWork,
  startBreak,
  startLunch,
  stopCurrentSession,
  pauseCurrentSession,
  resumeCurrentSession
} = timeStore
const { addNotification } = uiStore

const selectedProject = ref('')

const activeProjects = computed(() => 
  projects.filter(project => project.isActive)
)

const recentSessions = computed(() => 
  todayTimesheet.workSessions
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
    .slice(0, 10)
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
    'work': 'Lucru',
    'break': 'Pauză',
    'lunch': 'Pauză de masă'
  }
  return titleMap[type] || 'Sesiune'
}

const getSessionBgClass = (type: string) => {
  const classMap: Record<string, string> = {
    'work': 'bg-green-100 dark:bg-green-900/30',
    'break': 'bg-orange-100 dark:bg-orange-900/30',
    'lunch': 'bg-purple-100 dark:bg-purple-900/30'
  }
  return classMap[type] || 'bg-gray-100 dark:bg-gray-900/30'
}

const getSessionTextClass = (type: string) => {
  const classMap: Record<string, string> = {
    'work': 'text-green-600 dark:text-green-400',
    'break': 'text-orange-600 dark:text-orange-400',
    'lunch': 'text-purple-600 dark:text-purple-400'
  }
  return classMap[type] || 'text-gray-600 dark:text-gray-400'
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

const getProjectName = (projectId: string) => {
  const project = projects.find(p => p.id === projectId)
  return project?.name || 'Proiect necunoscut'
}

const startWorkSession = () => {
  const success = startWork(selectedProject.value || undefined)
  if (success) {
    addNotification({
      type: 'success',
      title: 'Sesiune de lucru începută',
      message: 'Ai început să lucrezi!'
    })
    selectedProject.value = ''
  }
}

const startBreakSession = () => {
  const success = startBreak()
  if (success) {
    addNotification({
      type: 'info',
      title: 'Pauză începută',
      message: 'Ai început o pauză!'
    })
  }
}

const startLunchSession = () => {
  const success = startLunch()
  if (success) {
    addNotification({
      type: 'info',
      title: 'Pauză de masă începută',
      message: 'Ai început pauza de masă!'
    })
  }
}
</script>