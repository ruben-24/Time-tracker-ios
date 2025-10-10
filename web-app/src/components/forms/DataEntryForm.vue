<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-dark-900 dark:text-dark-100 mb-2">
        Introducere Date
      </h1>
      <p class="text-dark-600 dark:text-dark-400">
        Adaugă și gestionează datele tale într-un mod modern și intuitiv
      </p>
    </div>

    <!-- Form Steps -->
    <div class="mb-8">
      <div class="flex items-center justify-center space-x-8">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="flex items-center"
        >
          <div 
            class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300"
            :class="{
              'bg-primary-500 text-white': currentStep >= index,
              'bg-dark-200 dark:bg-dark-700 text-dark-500 dark:text-dark-400': currentStep < index
            }"
          >
            {{ index + 1 }}
          </div>
          <div v-if="index < steps.length - 1" class="w-16 h-0.5 bg-dark-200 dark:bg-dark-700 ml-4"></div>
        </div>
      </div>
      <div class="flex justify-center mt-4">
        <p class="text-sm text-dark-600 dark:text-dark-400">
          Pasul {{ currentStep + 1 }} din {{ steps.length }}: {{ steps[currentStep] }}
        </p>
      </div>
    </div>

    <!-- Form Container -->
    <div class="card p-8">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Step 1: Basic Information -->
        <div v-if="currentStep === 0" class="space-y-6">
          <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-4">
            Informații de bază
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Titlu *
              </label>
              <input
                v-model="formData.title"
                type="text"
                required
                class="input-field"
                placeholder="Introduceți titlul"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Categorie *
              </label>
              <select
                v-model="formData.category"
                required
                class="input-field"
              >
                <option value="">Selectați categoria</option>
                <option 
                  v-for="category in categories" 
                  :key="category.id" 
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Descriere
            </label>
            <textarea
              v-model="formData.description"
              rows="4"
              class="input-field"
              placeholder="Descrieți datele introduse..."
            ></textarea>
          </div>
        </div>

        <!-- Step 2: Values and Details -->
        <div v-if="currentStep === 1" class="space-y-6">
          <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-4">
            Valori și detalii
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Valoare *
              </label>
              <input
                v-model.number="formData.value"
                type="number"
                step="0.01"
                required
                class="input-field"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                Data *
              </label>
              <input
                v-model="formData.date"
                type="date"
                required
                class="input-field"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Status
            </label>
            <div class="flex space-x-4">
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="active"
                  class="w-4 h-4 text-primary-600 border-dark-300 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-dark-700 dark:text-dark-300">Activ</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="inactive"
                  class="w-4 h-4 text-primary-600 border-dark-300 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-dark-700 dark:text-dark-300">Inactiv</span>
              </label>
              <label class="flex items-center">
                <input
                  v-model="formData.status"
                  type="radio"
                  value="pending"
                  class="w-4 h-4 text-primary-600 border-dark-300 focus:ring-primary-500"
                />
                <span class="ml-2 text-sm text-dark-700 dark:text-dark-300">În așteptare</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Step 3: Tags and Metadata -->
        <div v-if="currentStep === 2" class="space-y-6">
          <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-4">
            Etichete și metadate
          </h3>
          
          <div>
            <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Etichete
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                v-for="(tag, index) in formData.tags"
                :key="index"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200"
              >
                {{ tag }}
                <button
                  @click="removeTag(index)"
                  type="button"
                  class="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
                >
                  <X class="w-3 h-3" />
                </button>
              </span>
            </div>
            <div class="flex">
              <input
                v-model="newTag"
                type="text"
                class="input-field rounded-r-none"
                placeholder="Adaugă o etichetă..."
                @keyup.enter="addTag"
              />
              <button
                @click="addTag"
                type="button"
                class="btn-primary rounded-l-none px-4"
              >
                <Plus class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
              Metadate suplimentare (JSON)
            </label>
            <textarea
              v-model="metadataJson"
              rows="4"
              class="input-field font-mono text-sm"
              placeholder='{"key": "value", "note": "exemplu"}'
            ></textarea>
            <p class="text-xs text-dark-500 dark:text-dark-400 mt-1">
              Introduceți datele în format JSON valid
            </p>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex justify-between pt-6 border-t border-dark-200 dark:border-dark-700">
          <button
            v-if="currentStep > 0"
            @click="previousStep"
            type="button"
            class="btn-secondary"
          >
            <ChevronLeft class="w-4 h-4 mr-2" />
            Înapoi
          </button>
          <div v-else></div>
          
          <button
            v-if="currentStep < steps.length - 1"
            @click="nextStep"
            type="button"
            class="btn-primary"
          >
            Următorul
            <ChevronRight class="w-4 h-4 ml-2" />
          </button>
          <button
            v-else
            type="submit"
            class="btn-primary"
            :disabled="isSubmitting"
          >
            <Save v-if="!isSubmitting" class="w-4 h-4 mr-2" />
            <div v-else class="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ isSubmitting ? 'Se salvează...' : 'Salvează Datele' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTimeTrackingStore } from '@/stores/dataStore'
import { useUIStore } from '@/stores/uiStore'
import { ChevronLeft, ChevronRight, Save, Plus, X } from 'lucide-vue-next'
import type { DataEntry } from '@/types'

const timeStore = useTimeTrackingStore()
const uiStore = useUIStore()
const { addEntry } = dataStore
const { addNotification } = uiStore

const steps = ['Informații de bază', 'Valori și detalii', 'Etichete și metadate']
const currentStep = ref(0)
const isSubmitting = ref(false)
const newTag = ref('')
const metadataJson = ref('')

const formData = ref<Omit<DataEntry, 'id'>>({
  title: '',
  description: '',
  category: '',
  value: 0,
  date: new Date().toISOString().split('T')[0],
  tags: [],
  status: 'active',
  metadata: {}
})

const categories = computed(() => dataStore.categories)

const addTag = () => {
  if (newTag.value.trim() && !formData.value.tags.includes(newTag.value.trim())) {
    formData.value.tags.push(newTag.value.trim())
    newTag.value = ''
  }
}

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  isSubmitting.value = true
  
  try {
    // Parse metadata if provided
    if (metadataJson.value.trim()) {
      try {
        formData.value.metadata = JSON.parse(metadataJson.value)
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Eroare JSON',
          message: 'Metadatele nu sunt în format JSON valid'
        })
        isSubmitting.value = false
        return
      }
    }
    
    // Convert date string to Date object
    formData.value.date = new Date(formData.value.date)
    
    // Add entry to store
    const newEntry = addEntry(formData.value)
    
    addNotification({
      type: 'success',
      title: 'Succes!',
      message: 'Datele au fost salvate cu succes'
    })
    
    // Reset form
    formData.value = {
      title: '',
      description: '',
      category: '',
      value: 0,
      date: new Date().toISOString().split('T')[0],
      tags: [],
      status: 'active',
      metadata: {}
    }
    metadataJson.value = ''
    currentStep.value = 0
    
  } catch (error) {
    addNotification({
      type: 'error',
      title: 'Eroare',
      message: 'A apărut o eroare la salvarea datelor'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>