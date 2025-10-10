import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DataEntry, Category, AnalyticsData } from '@/types'

export const useDataStore = defineStore('data', () => {
  // State
  const entries = ref<DataEntry[]>([])
  const categories = ref<Category[]>([
    {
      id: '1',
      name: 'Financiar',
      color: '#10b981',
      icon: 'DollarSign',
      description: 'Tranzacții și date financiare'
    },
    {
      id: '2',
      name: 'Personal',
      color: '#8b5cf6',
      icon: 'User',
      description: 'Informații personale'
    },
    {
      id: '3',
      name: 'Muncă',
      color: '#f59e0b',
      icon: 'Briefcase',
      description: 'Date legate de muncă'
    },
    {
      id: '4',
      name: 'Sănătate',
      color: '#ef4444',
      icon: 'Heart',
      description: 'Informații medicale'
    }
  ])

  // Getters
  const totalEntries = computed(() => entries.value.length)
  
  const entriesByCategory = computed(() => {
    const grouped: Record<string, DataEntry[]> = {}
    entries.value.forEach(entry => {
      if (!grouped[entry.category]) {
        grouped[entry.category] = []
      }
      grouped[entry.category].push(entry)
    })
    return grouped
  })

  const analyticsData = computed((): AnalyticsData => {
    const categoryCounts: Record<string, number> = {}
    entries.value.forEach(entry => {
      categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1
    })

    const monthlyTrend = entries.value.reduce((acc, entry) => {
      const month = entry.date.toLocaleDateString('ro-RO', { month: 'short' })
      const existing = acc.find(item => item.month === month)
      if (existing) {
        existing.value += entry.value
      } else {
        acc.push({ month, value: entry.value })
      }
      return acc
    }, [] as Array<{ month: string; value: number }>)

    const topCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({
        category,
        count,
        percentage: (count / totalEntries.value) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    return {
      totalEntries: totalEntries.value,
      categoriesCount: categoryCounts,
      monthlyTrend,
      topCategories
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

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }
    categories.value.push(newCategory)
    return newCategory
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

  return {
    // State
    entries,
    categories,
    
    // Getters
    totalEntries,
    entriesByCategory,
    analyticsData,
    
    // Actions
    addEntry,
    updateEntry,
    deleteEntry,
    addCategory,
    getEntriesByCategory,
    searchEntries
  }
})