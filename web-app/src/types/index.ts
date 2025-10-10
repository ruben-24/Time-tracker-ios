export interface WorkSession {
  id: string
  startTime: Date
  endTime?: Date
  duration: number // in minutes
  type: 'work' | 'break' | 'lunch'
  status: 'active' | 'completed' | 'paused'
  notes?: string
  project?: string
}

export interface Project {
  id: string
  name: string
  color: string
  description?: string
  isActive: boolean
  hourlyRate?: number
}

export interface DailyTimesheet {
  id: string
  date: string // YYYY-MM-DD
  workSessions: WorkSession[]
  totalWorkTime: number // in minutes
  totalBreakTime: number // in minutes
  totalLunchTime: number // in minutes
  startTime?: Date
  endTime?: Date
  isCompleted: boolean
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  workSettings: {
    workDayStart: string // HH:MM
    workDayEnd: string // HH:MM
    breakDuration: number // in minutes
    lunchDuration: number // in minutes
    workDays: number[] // 0-6 (Sunday-Saturday)
    autoBreakReminder: boolean
    breakReminderInterval: number // in minutes
  }
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    notifications: boolean
    soundEnabled: boolean
  }
}

export interface TimeTrackingStats {
  today: {
    workTime: number
    breakTime: number
    lunchTime: number
    sessions: number
  }
  thisWeek: {
    workTime: number
    breakTime: number
    lunchTime: number
    days: number
  }
  thisMonth: {
    workTime: number
    breakTime: number
    lunchTime: number
    days: number
  }
  averageDaily: {
    workTime: number
    breakTime: number
    lunchTime: number
  }
}

export interface NotificationSettings {
  breakReminders: boolean
  endOfDayReminder: boolean
  overtimeWarning: boolean
  weeklyReport: boolean
  soundEnabled: boolean
}