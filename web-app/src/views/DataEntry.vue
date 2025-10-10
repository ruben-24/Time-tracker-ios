<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-dark-900 dark:text-dark-100 mb-2">
          Introducere Date
        </h1>
        <p class="text-dark-600 dark:text-dark-400">
          Adaugă și gestionează datele tale cu ușurință
        </p>
      </div>
      <div class="flex space-x-3">
        <button 
          @click="toggleViewMode"
          class="btn-secondary"
        >
          <component :is="viewMode === 'form' ? 'List' : 'Plus'" class="w-4 h-4 mr-2" />
          {{ viewMode === 'form' ? 'Vezi Lista' : 'Formular Nou' }}
        </button>
      </div>
    </div>

    <!-- Form View -->
    <div v-if="viewMode === 'form'">
      <DataEntryForm />
    </div>

    <!-- List View -->
    <div v-else class="space-y-6">
      <!-- Filters and Search -->
      <div class="card p-6">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <!-- Search -->
          <div class="flex-1 max-w-md">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Caută în date..."
                class="w-full pl-10 pr-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                @input="handleSearch"
              />
            </div>
          </div>
          
          <!-- Filters -->
          <div class="flex space-x-3">
            <select
              v-model="selectedCategory"
              class="px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
            >
              <option value="">Toate categoriile</option>
              <option 
                v-for="category in categories" 
                :key="category.id" 
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
            
            <select
              v-model="selectedStatus"
              class="px-4 py-2 bg-dark-50 dark:bg-dark-700 border border-dark-200 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
            >
              <option value="">Toate statusurile</option>
              <option value="active">Activ</option>
              <option value="inactive">Inactiv</option>
              <option value="pending">În așteptare</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Entries List -->
      <div class="card">
        <div class="p-6 border-b border-dark-200 dark:border-dark-700">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-100">
              Toate Intrările ({{ filteredEntries.length }})
            </h3>
            <div class="flex items-center space-x-2">
              <button 
                @click="toggleSortOrder"
                class="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                :title="sortOrder === 'desc' ? 'Sortare crescătoare' : 'Sortare descrescătoare'"
              >
                <ArrowUpDown class="w-4 h-4 text-dark-600 dark:text-dark-400" />
              </button>
            </div>
          </div>
        </div>
        
        <div v-if="filteredEntries.length === 0" class="p-8 text-center">
          <FileText class="w-16 h-16 text-dark-400 dark:text-dark-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-dark-900 dark:text-dark-100 mb-2">
            Nu există intrări
          </h3>
          <p class="text-dark-500 dark:text-dark-400 mb-6">
            {{ searchQuery || selectedCategory || selectedStatus ? 'Nu s-au găsit rezultate pentru filtrele selectate' : 'Începe să adaugi datele tale' }}
          </p>
          <button 
            @click="viewMode = 'form'"
            class="btn-primary"
          >
            <Plus class="w-4 h-4 mr-2" />
            Adaugă Prima Intrare
          </button>
        </div>
        
        <div v-else class="divide-y divide-dark-200 dark:divide-dark-700">
          <div
            v-for="entry in paginatedEntries"
            :key="entry.id"
            class="p-6 hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors"
          >
            <div class="flex items-start justify-between">
              <div class="flex items-start space-x-4">
                <div 
                  class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                  :style="{ backgroundColor: getCategoryColor(entry.category) + '20' }"
                >
                  <component :is="getCategoryIcon(entry.category)" class="w-6 h-6" :style="{ color: getCategoryColor(entry.category) }" />
                </div>
                
                <div class="flex-1 min-w-0">
                  <div class="flex items-center space-x-2 mb-1">
                    <h4 class="text-lg font-semibold text-dark-900 dark:text-dark-100 truncate">
                      {{ entry.title }}
                    </h4>
                    <span 
                      class="px-2 py-1 text-xs font-medium rounded-full"
                      :class="getStatusClass(entry.status)"
                    >
                      {{ getStatusText(entry.status) }}
                    </span>
                  </div>
                  
                  <p class="text-dark-600 dark:text-dark-400 mb-2 line-clamp-2">
                    {{ entry.description || 'Fără descriere' }}
                  </p>
                  
                  <div class="flex items-center space-x-4 text-sm text-dark-500 dark:text-dark-400">
                    <span class="flex items-center">
                      <Calendar class="w-4 h-4 mr-1" />
                      {{ formatDate(entry.date) }}
                    </span>
                    <span class="flex items-center">
                      <Tag class="w-4 h-4 mr-1" />
                      {{ getCategoryName(entry.category) }}
                    </span>
                    <span class="flex items-center font-semibold text-dark-900 dark:text-dark-100">
                      <DollarSign class="w-4 h-4 mr-1" />
                      {{ entry.value.toLocaleString('ro-RO') }}
                    </span>
                  </div>
                  
                  <div v-if="entry.tags.length > 0" class="flex flex-wrap gap-1 mt-2">
                    <span
                      v-for="tag in entry.tags.slice(0, 3)"
                      :key="tag"
                      class="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                    >
                      {{ tag }}
                    </span>
                    <span v-if="entry.tags.length > 3" class="px-2 py-1 text-xs text-dark-500 dark:text-dark-400">
                      +{{ entry.tags.length - 3 }} mai multe
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2 ml-4">
                <button 
                  @click="editEntry(entry)"
                  class="p-2 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
                  title="Editează"
                >
                  <Edit class="w-4 h-4 text-dark-600 dark:text-dark-400" />
                </button>
                <button 
                  @click="deleteEntryConfirm(entry.id)"
                  class="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Șterge"
                >
                  <Trash2 class="w-4 h-4 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination -->
        <div v-if="totalPages > 1" class="p-6 border-t border-dark-200 dark:border-dark-700">
          <div class="flex items-center justify-between">
            <p class="text-sm text-dark-600 dark:text-dark-400">
              Afișând {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredEntries.length) }} din {{ filteredEntries.length }} intrări
            </p>
            <div class="flex space-x-2">
              <button 
                @click="currentPage = Math.max(1, currentPage - 1)"
                :disabled="currentPage === 1"
                class="px-3 py-2 text-sm bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-300 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <button 
                @click="currentPage = Math.min(totalPages, currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="px-3 py-2 text-sm bg-dark-100 dark:bg-dark-700 text-dark-700 dark:text-dark-300 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Următorul
              </button>
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
import { useUIStore } from '@/stores/uiStore'
import DataEntryForm from '@/components/forms/DataEntryForm.vue'
import { 
  Search, 
  Plus, 
  List, 
  FileText, 
  ArrowUpDown, 
  Calendar, 
  Tag, 
  DollarSign, 
  Edit, 
  Trash2,
  DollarSign as DollarIcon,
  User,
  Briefcase,
  Heart
} from 'lucide-vue-next'
import type { DataEntry } from '@/types'

const dataStore = useDataStore()
const uiStore = useUIStore()
const { entries, categories, deleteEntry, searchEntries } = dataStore
const { addNotification } = uiStore

const viewMode = ref<'form' | 'list'>('form')
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const sortOrder = ref<'asc' | 'desc'>('desc')
const currentPage = ref(1)
const itemsPerPage = 10

const filteredEntries = computed(() => {
  let filtered = [...entries]
  
  // Search filter
  if (searchQuery.value) {
    filtered = searchEntries(searchQuery.value)
  }
  
  // Category filter
  if (selectedCategory.value) {
    filtered = filtered.filter(entry => entry.category === selectedCategory.value)
  }
  
  // Status filter
  if (selectedStatus.value) {
    filtered = filtered.filter(entry => entry.status === selectedStatus.value)
  }
  
  // Sort
  filtered.sort((a, b) => {
    const comparison = a.date.getTime() - b.date.getTime()
    return sortOrder.value === 'desc' ? -comparison : comparison
  })
  
  return filtered
})

const totalPages = computed(() => Math.ceil(filteredEntries.value.length / itemsPerPage))

const paginatedEntries = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredEntries.value.slice(start, end)
})

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'form' ? 'list' : 'form'
}

const toggleSortOrder = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

const handleSearch = () => {
  currentPage.value = 1
}

const getCategoryIcon = (categoryId: string) => {
  const category = categories.find(cat => cat.id === categoryId)
  if (!category) return FileText
  
  const iconMap: Record<string, any> = {
    'Financiar': DollarIcon,
    'Personal': User,
    'Muncă': Briefcase,
    'Sănătate': Heart
  }
  
  return iconMap[category.name] || FileText
}

const getCategoryColor = (categoryId: string) => {
  const category = categories.find(cat => cat.id === categoryId)
  return category?.color || '#6b7280'
}

const getCategoryName = (categoryId: string) => {
  const category = categories.find(cat => cat.id === categoryId)
  return category?.name || 'Necunoscut'
}

const getStatusClass = (status: string) => {
  const classes = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    inactive: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
  }
  return classes[status as keyof typeof classes] || classes.inactive
}

const getStatusText = (status: string) => {
  const texts = {
    active: 'Activ',
    inactive: 'Inactiv',
    pending: 'În așteptare'
  }
  return texts[status as keyof typeof texts] || status
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('ro-RO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const editEntry = (entry: DataEntry) => {
  // TODO: Implement edit functionality
  addNotification({
    type: 'info',
    title: 'Funcționalitate în dezvoltare',
    message: 'Editarea intrărilor va fi disponibilă în curând'
  })
}

const deleteEntryConfirm = (id: string) => {
  deleteEntry(id)
  addNotification({
    type: 'success',
    title: 'Șters cu succes',
    message: 'Intrarea a fost ștearsă'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>