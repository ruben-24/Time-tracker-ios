export interface DataEntry {
  id: string
  title: string
  description: string
  category: string
  value: number
  date: Date
  tags: string[]
  status: 'active' | 'inactive' | 'pending'
  metadata?: Record<string, any>
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  description?: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    notifications: boolean
  }
}

export interface AnalyticsData {
  totalEntries: number
  categoriesCount: Record<string, number>
  monthlyTrend: Array<{
    month: string
    value: number
  }>
  topCategories: Array<{
    category: string
    count: number
    percentage: number
  }>
}

export interface FormField {
  id: string
  label: string
  type: 'text' | 'number' | 'email' | 'date' | 'select' | 'textarea' | 'checkbox' | 'radio'
  required: boolean
  placeholder?: string
  options?: Array<{ value: string; label: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}