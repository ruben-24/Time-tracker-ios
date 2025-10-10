import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WorkSession, Project, DailyTimesheet, TimeTrackingStats } from '@/types'

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
      entries: [],
      totalValue: 0,
      totalWorkTime: 0,
      totalBreakTime: 0,
      totalLunchTime: 0,
      isCompleted: false
    }
  })

  const currentSessionDuration = computed(() => {
    if (!currentSession.value?.workSession) return 0
    const now = new Date()
    const start = currentSession.value.workSession.startTime
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60)) // minutes
  })

  const totalValue = computed(() => 
    entries.value.reduce((sum, entry) => sum + entry.value, 0)
  )

  const stats = computed((): TimeTrackingStats => {
    const today = new Date().toISOString().split('T')[0]
    const todayEntries = entries.value.filter(entry => 
      entry.date.toISOString().split('T')[0] === today
    )

    const todayWorkTime = todayEntries
      .filter(e => e.workSession?.type === 'work')
      .reduce((sum, e) => sum + (e.workSession?.duration || 0), 0)
    
    const todayBreakTime = todayEntries
      .filter(e => e.workSession?.type === 'break')
      .reduce((sum, e) => sum + (e.workSession?.duration || 0), 0)
    
    const todayLunchTime = todayEntries
      .filter(e => e.workSession?.type === 'lunch')
      .reduce((sum, e) => sum + (e.workSession?.duration || 0), 0)

    // This week
    const startOfWeek = new Date()
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(endOfWeek.getDate() + 6)

    const weekEntries = entries.value.filter(entry => 
      entry.date >= startOfWeek && entry.date <= endOfWeek
    )

    const weekWorkTime = weekEntries
      .filter(e => e.workSession?.type === 'work')
      .reduce((sum, e) => sum + (e.workSession?.duration || 0), 0)
    
    const weekBreakTime = weekEntries
      .filter(e => e.workSession?.type === 'break')
      .reduce((sum, e) => sum + (e.workSession?.duration || 0), 0)
    
    const weekLunchTime = weekEntries
      .filter(e => e.workSession?.type === 'lunch')
      .reduce((sum, e) => sum + (e.workSession?.duration || 0), 0)

    return {
      today: {
        workTime: todayWorkTime,
        breakTime: todayBreakTime,
        lunchTime: todayLunchTime,
        sessions: todayEntries.filter(e => e.workSession).length
      },
      thisWeek: {
        workTime: weekWorkTime,
        breakTime: weekBreakTime,
        lunchTime: weekLunchTime,
        days: new Set(weekEntries.map(e => e.date.toISOString().split('T')[0])).size
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
  const addEntry = (entry: Omit<DataEntry, 'id'>) => {
    const newEntry: DataEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }
    entries.value.unshift(newEntry)
    return newEntry
  }

  const updateEntry = (id: string, updates: Partial<DataEntry>) => {
    const index = entries.value.findIndex(entry => entry.id === id)
    if (index !== -1) {
      entries.value[index] = { ...entries.value[index], ...updates }
    }
  }

  const deleteEntry = (id: string) => {
    const index = entries.value.findIndex(entry => entry.id === id)
    if (index !== -1) {
      entries.value.splice(index, 1)
    }
  }

  const startWork = (categoryId?: string, notes?: string) => {
    if (currentSession.value) return false

    const newEntry: DataEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: 'Sesiune de lucru',
      description: notes || 'Lucru în curs',
      category: categoryId || '3', // Muncă
      value: 0,
      date: new Date(),
      tags: ['lucru'],
      status: 'active',
      workSession: {
        startTime: new Date(),
        duration: 0,
        type: 'work',
        status: 'active'
      }
    }

    currentSession.value = newEntry
    entries.value.unshift(newEntry)
    return true
  }

  const startBreak = (notes?: string) => {
    if (currentSession.value) return false

    const newEntry: DataEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: 'Pauză',
      description: notes || 'Pauză de lucru',
      category: '2', // Personal
      value: 0,
      date: new Date(),
      tags: ['pauză'],
      status: 'active',
      workSession: {
        startTime: new Date(),
        duration: 0,
        type: 'break',
        status: 'active'
      }
    }

    currentSession.value = newEntry
    entries.value.unshift(newEntry)
    return true
  }

  const startLunch = (notes?: string) => {
    if (currentSession.value) return false

    const newEntry: DataEntry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: 'Pauză de masă',
      description: notes || 'Pauză de masă',
      category: '2', // Personal
      value: 0,
      date: new Date(),
      tags: ['masă'],
      status: 'active',
      workSession: {
        startTime: new Date(),
        duration: 0,
        type: 'lunch',
        status: 'active'
      }
    }

    currentSession.value = newEntry
    entries.value.unshift(newEntry)
    return true
  }

  const stopCurrentSession = () => {
    if (!currentSession.value?.workSession) return false

    const now = new Date()
    const duration = Math.floor((now.getTime() - currentSession.value.workSession.startTime.getTime()) / (1000 * 60))
    
    currentSession.value.workSession.endTime = now
    currentSession.value.workSession.duration = duration
    currentSession.value.workSession.status = 'completed'
    currentSession.value.status = 'completed'

    // Update today's timesheet
    updateTodayTimesheet()

    currentSession.value = null
    return true
  }

  const pauseCurrentSession = () => {
    if (!currentSession.value?.workSession) return false
    currentSession.value.workSession.status = 'paused'
    return true
  }

  const resumeCurrentSession = () => {
    if (!currentSession.value?.workSession) return false
    currentSession.value.workSession.status = 'active'
    return true
  }

  const updateTodayTimesheet = () => {
    const today = new Date().toISOString().split('T')[0]
    const todayEntries = entries.value.filter(entry => 
      entry.date.toISOString().split('T')[0] === today
    )

    const workTime = todayEntries
      .filter(e => e.workSession?.type === 'work')
      .reduce((sum, e) => sum + (e.workSession?.duration || 0), 0)
    
    const breakTime = todayEntries
      .filter(e => e.workSession?.type === 'break')
      .reduce((sum, e) => sum + (e.workSession?.duration || 0), 0)
    
    const lunchTime = todayEntries
      .filter(e => e.workSession?.type === 'lunch')
      .reduce((sum, e) => sum + (e.workSession?.duration || 0), 0)

    const totalValue = todayEntries.reduce((sum, e) => sum + e.value, 0)

    const existingTimesheet = dailyTimesheets.value.find(ts => ts.date === today)
    
    if (existingTimesheet) {
      existingTimesheet.entries = todayEntries
      existingTimesheet.totalValue = totalValue
      existingTimesheet.totalWorkTime = workTime
      existingTimesheet.totalBreakTime = breakTime
      existingTimesheet.totalLunchTime = lunchTime
    } else {
      dailyTimesheets.value.push({
        id: `timesheet-${today}`,
        date: today,
        entries: todayEntries,
        totalValue,
        totalWorkTime: workTime,
        totalBreakTime: breakTime,
        totalLunchTime: lunchTime,
        isCompleted: false
      })
    }
  }

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }
    categories.value.push(newCategory)
    return newCategory
  }

  const updateCategory = (id: string, updates: Partial<Category>) => {
    const index = categories.value.findIndex(category => category.id === id)
    if (index !== -1) {
      categories.value[index] = { ...categories.value[index], ...updates }
    }
  }

  const deleteCategory = (id: string) => {
    const index = categories.value.findIndex(category => category.id === id)
    if (index !== -1) {
      categories.value.splice(index, 1)
    }
  }

  const getEntriesByCategory = (categoryId: string) => {
    return entries.value.filter(entry => entry.category === categoryId)
  }

  const searchEntries = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return entries.value.filter(entry => 
      entry.title.toLowerCase().includes(lowercaseQuery) ||
      entry.description.toLowerCase().includes(lowercaseQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  }

  const getEntriesByDate = (date: string) => {
    return entries.value.filter(entry => 
      entry.date.toISOString().split('T')[0] === date
    )
  }

  return {
    // State
    entries,
    categories,
    currentSession,
    dailyTimesheets,
    
    // Getters
    totalEntries,
    entriesByCategory,
    totalValue,
    isWorking,
    isOnBreak,
    isOnLunch,
    todayTimesheet,
    currentSessionDuration,
    stats,
    
    // Actions
    addEntry,
    updateEntry,
    deleteEntry,
    addCategory,
    updateCategory,
    deleteCategory,
    getEntriesByCategory,
    searchEntries,
    getEntriesByDate,
    startWork,
    startBreak,
    startLunch,
    stopCurrentSession,
    pauseCurrentSession,
    resumeCurrentSession,
    updateTodayTimesheet
  }
})