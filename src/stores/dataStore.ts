import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WorkSession, DailyTimesheet, Project, TimeTrackingStats } from '@/types'

export const useTimeTrackingStore = defineStore('timeTracking', () => {
  // State
  const currentSession = ref<WorkSession | null>(null)
  const workSessions = ref<WorkSession[]>([])
  const dailyTimesheets = ref<DailyTimesheet[]>([])
  const projects = ref<Project[]>([
    {
      id: '1',
      name: 'Proiect Principal',
      color: '#0ea5e9',
      description: 'Proiectul principal de lucru',
      isActive: true,
      hourlyRate: 50
    },
    {
      id: '2',
      name: 'Dezvoltare',
      color: '#10b981',
      description: 'Dezvoltare software',
      isActive: true,
      hourlyRate: 60
    },
    {
      id: '3',
      name: 'Design',
      color: '#8b5cf6',
      description: 'Design și UI/UX',
      isActive: true,
      hourlyRate: 45
    }
  ])

  // Getters
  const isWorking = computed(() => currentSession.value?.type === 'work' && currentSession.value?.status === 'active')
  const isOnBreak = computed(() => currentSession.value?.type === 'break' && currentSession.value?.status === 'active')
  const isOnLunch = computed(() => currentSession.value?.type === 'lunch' && currentSession.value?.status === 'active')
  
  const todayTimesheet = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return dailyTimesheets.value.find(ts => ts.date === today) || {
      id: `timesheet-${today}`,
      date: today,
      workSessions: [],
      totalWorkTime: 0,
      totalBreakTime: 0,
      totalLunchTime: 0,
      isCompleted: false
    }
  })

  const currentSessionDuration = computed(() => {
    if (!currentSession.value) return 0
    const now = new Date()
    const start = currentSession.value.startTime
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60)) // minutes
  })

  const stats = computed((): TimeTrackingStats => {
    const today = new Date().toISOString().split('T')[0]
    const todaySessions = workSessions.value.filter(session => 
      session.startTime.toISOString().split('T')[0] === today
    )

    const todayWorkTime = todaySessions
      .filter(s => s.type === 'work')
      .reduce((sum, s) => sum + s.duration, 0)
    
    const todayBreakTime = todaySessions
      .filter(s => s.type === 'break')
      .reduce((sum, s) => sum + s.duration, 0)
    
    const todayLunchTime = todaySessions
      .filter(s => s.type === 'lunch')
      .reduce((sum, s) => sum + s.duration, 0)

    // This week
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 6)

    const weekSessions = workSessions.value.filter(session => 
      session.startTime >= startOfWeek && session.startTime <= endOfWeek
    )

    const weekWorkTime = weekSessions
      .filter(s => s.type === 'work')
      .reduce((sum, s) => sum + s.duration, 0)
    
    const weekBreakTime = weekSessions
      .filter(s => s.type === 'break')
      .reduce((sum, s) => sum + s.duration, 0)
    
    const weekLunchTime = weekSessions
      .filter(s => s.type === 'lunch')
      .reduce((sum, s) => sum + s.duration, 0)

    return {
      today: {
        workTime: todayWorkTime,
        breakTime: todayBreakTime,
        lunchTime: todayLunchTime,
        sessions: todaySessions.length
      },
      thisWeek: {
        workTime: weekWorkTime,
        breakTime: weekBreakTime,
        lunchTime: weekLunchTime,
        days: new Set(weekSessions.map(s => s.startTime.toISOString().split('T')[0])).size
      },
      thisMonth: {
        workTime: 0, // Calculate based on month
        breakTime: 0,
        lunchTime: 0,
        days: 0
      },
      averageDaily: {
        workTime: weekWorkTime / 7,
        breakTime: weekBreakTime / 7,
        lunchTime: weekLunchTime / 7
      }
    }
  })

  // Actions
  const startWork = (projectId?: string, notes?: string) => {
    if (currentSession.value) return false

    const newSession: WorkSession = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      startTime: new Date(),
      duration: 0,
      type: 'work',
      status: 'active',
      notes,
      project: projectId
    }

    currentSession.value = newSession
    workSessions.value.push(newSession)
    return true
  }

  const startBreak = (notes?: string) => {
    if (currentSession.value) return false

    const newSession: WorkSession = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      startTime: new Date(),
      duration: 0,
      type: 'break',
      status: 'active',
      notes
    }

    currentSession.value = newSession
    workSessions.value.push(newSession)
    return true
  }

  const startLunch = (notes?: string) => {
    if (currentSession.value) return false

    const newSession: WorkSession = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      startTime: new Date(),
      duration: 0,
      type: 'lunch',
      status: 'active',
      notes
    }

    currentSession.value = newSession
    workSessions.value.push(newSession)
    return true
  }

  const stopCurrentSession = () => {
    if (!currentSession.value) return false

    const now = new Date()
    const duration = Math.floor((now.getTime() - currentSession.value.startTime.getTime()) / (1000 * 60))
    
    currentSession.value.endTime = now
    currentSession.value.duration = duration
    currentSession.value.status = 'completed'

    // Update today's timesheet
    updateTodayTimesheet()

    currentSession.value = null
    return true
  }

  const pauseCurrentSession = () => {
    if (!currentSession.value) return false
    currentSession.value.status = 'paused'
    return true
  }

  const resumeCurrentSession = () => {
    if (!currentSession.value) return false
    currentSession.value.status = 'active'
    return true
  }

  const updateTodayTimesheet = () => {
    const today = new Date().toISOString().split('T')[0]
    const todaySessions = workSessions.value.filter(session => 
      session.startTime.toISOString().split('T')[0] === today
    )

    const workTime = todaySessions
      .filter(s => s.type === 'work')
      .reduce((sum, s) => sum + s.duration, 0)
    
    const breakTime = todaySessions
      .filter(s => s.type === 'break')
      .reduce((sum, s) => sum + s.duration, 0)
    
    const lunchTime = todaySessions
      .filter(s => s.type === 'lunch')
      .reduce((sum, s) => sum + s.duration, 0)

    const existingTimesheet = dailyTimesheets.value.find(ts => ts.date === today)
    
    if (existingTimesheet) {
      existingTimesheet.workSessions = todaySessions
      existingTimesheet.totalWorkTime = workTime
      existingTimesheet.totalBreakTime = breakTime
      existingTimesheet.totalLunchTime = lunchTime
    } else {
      dailyTimesheets.value.push({
        id: `timesheet-${today}`,
        date: today,
        workSessions: todaySessions,
        totalWorkTime: workTime,
        totalBreakTime: breakTime,
        totalLunchTime: lunchTime,
        isCompleted: false
      })
    }
  }

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...project,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }
    projects.value.push(newProject)
    return newProject
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    const index = projects.value.findIndex(project => project.id === id)
    if (index !== -1) {
      projects.value[index] = { ...projects.value[index], ...updates }
    }
  }

  const deleteProject = (id: string) => {
    const index = projects.value.findIndex(project => project.id === id)
    if (index !== -1) {
      projects.value.splice(index, 1)
    }
  }

  const getSessionsByDate = (date: string) => {
    return workSessions.value.filter(session => 
      session.startTime.toISOString().split('T')[0] === date
    )
  }

  const getSessionsByProject = (projectId: string) => {
    return workSessions.value.filter(session => session.project === projectId)
  }

  return {
    // State
    currentSession,
    workSessions,
    dailyTimesheets,
    projects,
    
    // Getters
    isWorking,
    isOnBreak,
    isOnLunch,
    todayTimesheet,
    currentSessionDuration,
    stats,
    
    // Actions
    startWork,
    startBreak,
    startLunch,
    stopCurrentSession,
    pauseCurrentSession,
    resumeCurrentSession,
    updateTodayTimesheet,
    addProject,
    updateProject,
    deleteProject,
    getSessionsByDate,
    getSessionsByProject
  }
})