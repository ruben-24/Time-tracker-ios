<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-dark-900 dark:text-dark-100 mb-2">
        Setări
      </h1>
      <p class="text-dark-600 dark:text-dark-400">
        Personalizează aplicația conform preferințelor tale
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Settings Navigation -->
      <div class="lg:col-span-1">
        <div class="card p-6">
          <nav class="space-y-2">
            <button
              v-for="section in settingsSections"
              :key="section.id"
              @click="activeSection = section.id"
              class="w-full text-left px-4 py-3 rounded-lg transition-colors"
              :class="{
                'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300': activeSection === section.id,
                'text-dark-600 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700': activeSection !== section.id
              }"
            >
              <div class="flex items-center space-x-3">
                <component :is="section.icon" class="w-5 h-5" />
                <span class="font-medium">{{ section.name }}</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-2">
        <!-- General Settings -->
        <div v-if="activeSection === 'general'" class="space-y-6">
          <div class="card p-6">
            <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-6">
              Setări Generale
            </h3>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Tema Aplicației
                </label>
                <div class="grid grid-cols-3 gap-3">
                  <button
                    v-for="theme in themes"
                    :key="theme.value"
                    @click="setTheme(theme.value)"
                    class="p-4 border-2 rounded-lg transition-all duration-300"
                    :class="{
                      'border-primary-500 bg-primary-50 dark:bg-primary-900/20': currentTheme === theme.value,
                      'border-dark-200 dark:border-dark-700 hover:border-dark-300 dark:hover:border-dark-600': currentTheme !== theme.value
                    }"
                  >
                    <component :is="theme.icon" class="w-6 h-6 mx-auto mb-2" />
                    <div class="text-sm font-medium text-dark-900 dark:text-dark-100">
                      {{ theme.name }}
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Limba Interfaței
                </label>
                <select
                  v-model="selectedLanguage"
                  class="input-field max-w-xs"
                >
                  <option value="ro">Română</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                  Format Data
                </label>
                <select
                  v-model="dateFormat"
                  class="input-field max-w-xs"
                >
                  <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                  <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                  <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Settings -->
        <div v-if="activeSection === 'data'" class="space-y-6">
          <div class="card p-6">
            <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-6">
              Gestionare Date
            </h3>
            
            <div class="space-y-6">
              <div>
                <h4 class="text-lg font-medium text-dark-900 dark:text-dark-100 mb-4">
                  Export Date
                </h4>
                <div class="flex space-x-3">
                  <button class="btn-secondary">
                    <Download class="w-4 h-4 mr-2" />
                    Exportă JSON
                  </button>
                  <button class="btn-secondary">
                    <FileSpreadsheet class="w-4 h-4 mr-2" />
                    Exportă CSV
                  </button>
                  <button class="btn-secondary">
                    <FileText class="w-4 h-4 mr-2" />
                    Exportă PDF
                  </button>
                </div>
              </div>

              <div>
                <h4 class="text-lg font-medium text-dark-900 dark:text-dark-100 mb-4">
                  Import Date
                </h4>
                <div class="border-2 border-dashed border-dark-300 dark:border-dark-600 rounded-lg p-6 text-center">
                  <Upload class="w-12 h-12 text-dark-400 dark:text-dark-500 mx-auto mb-4" />
                  <p class="text-dark-600 dark:text-dark-400 mb-4">
                    Trage fișierele aici sau click pentru a selecta
                  </p>
                  <button class="btn-primary">
                    <Upload class="w-4 h-4 mr-2" />
                    Selectează Fișiere
                  </button>
                </div>
              </div>

              <div>
                <h4 class="text-lg font-medium text-dark-900 dark:text-dark-100 mb-4">
                  Backup Automat
                </h4>
                <div class="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-700/50 rounded-lg">
                  <div>
                    <p class="font-medium text-dark-900 dark:text-dark-100">Backup zilnic</p>
                    <p class="text-sm text-dark-600 dark:text-dark-400">Creează backup automat în fiecare zi</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="autoBackup"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-dark-200 dark:bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-dark-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications Settings -->
        <div v-if="activeSection === 'notifications'" class="space-y-6">
          <div class="card p-6">
            <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-6">
              Notificări
            </h3>
            
            <div class="space-y-6">
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-700/50 rounded-lg">
                  <div>
                    <p class="font-medium text-dark-900 dark:text-dark-100">Notificări email</p>
                    <p class="text-sm text-dark-600 dark:text-dark-400">Primește notificări pe email</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="emailNotifications"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-dark-200 dark:bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-dark-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-700/50 rounded-lg">
                  <div>
                    <p class="font-medium text-dark-900 dark:text-dark-100">Notificări push</p>
                    <p class="text-sm text-dark-600 dark:text-dark-400">Primește notificări în browser</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="pushNotifications"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-dark-200 dark:bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-dark-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-700/50 rounded-lg">
                  <div>
                    <p class="font-medium text-dark-900 dark:text-dark-100">Raport săptămânal</p>
                    <p class="text-sm text-dark-600 dark:text-dark-400">Primește un raport săptămânal cu statistici</p>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input
                      v-model="weeklyReport"
                      type="checkbox"
                      class="sr-only peer"
                    />
                    <div class="w-11 h-6 bg-dark-200 dark:bg-dark-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-dark-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-dark-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeSection === 'security'" class="space-y-6">
          <div class="card p-6">
            <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-6">
              Securitate
            </h3>
            
            <div class="space-y-6">
              <div>
                <h4 class="text-lg font-medium text-dark-900 dark:text-dark-100 mb-4">
                  Schimbă Parola
                </h4>
                <div class="space-y-4 max-w-md">
                  <div>
                    <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Parola Curentă
                    </label>
                    <input
                      v-model="currentPassword"
                      type="password"
                      class="input-field"
                      placeholder="Introduceți parola curentă"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Parola Nouă
                    </label>
                    <input
                      v-model="newPassword"
                      type="password"
                      class="input-field"
                      placeholder="Introduceți parola nouă"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-dark-700 dark:text-dark-300 mb-2">
                      Confirmă Parola
                    </label>
                    <input
                      v-model="confirmPassword"
                      type="password"
                      class="input-field"
                      placeholder="Confirmați parola nouă"
                    />
                  </div>
                  <button class="btn-primary">
                    <Shield class="w-4 h-4 mr-2" />
                    Schimbă Parola
                  </button>
                </div>
              </div>

              <div>
                <h4 class="text-lg font-medium text-dark-900 dark:text-dark-100 mb-4">
                  Sesiuni Active
                </h4>
                <div class="space-y-3">
                  <div class="flex items-center justify-between p-4 bg-dark-50 dark:bg-dark-700/50 rounded-lg">
                    <div class="flex items-center space-x-3">
                      <Monitor class="w-5 h-5 text-dark-600 dark:text-dark-400" />
                      <div>
                        <p class="font-medium text-dark-900 dark:text-dark-100">Sesiunea Curentă</p>
                        <p class="text-sm text-dark-600 dark:text-dark-400">Chrome pe Windows</p>
                      </div>
                    </div>
                    <span class="text-sm text-green-600 dark:text-green-400 font-medium">Activă</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- About -->
        <div v-if="activeSection === 'about'" class="space-y-6">
          <div class="card p-6">
            <h3 class="text-xl font-semibold text-dark-900 dark:text-dark-100 mb-6">
              Despre Aplicație
            </h3>
            
            <div class="space-y-6">
              <div class="text-center">
                <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Database class="w-10 h-10 text-white" />
                </div>
                <h4 class="text-2xl font-bold text-dark-900 dark:text-dark-100 mb-2">
                  Modern Data Manager
                </h4>
                <p class="text-dark-600 dark:text-dark-400 mb-4">
                  Versiunea 1.0.0
                </p>
                <p class="text-sm text-dark-500 dark:text-dark-500 max-w-md mx-auto">
                  Aplicație modernă pentru gestionarea datelor cu interface intuitivă și funcționalități avansate.
                </p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-dark-50 dark:bg-dark-700/50 rounded-lg">
                  <div class="text-2xl font-bold text-dark-900 dark:text-dark-100">Vue 3</div>
                  <div class="text-sm text-dark-600 dark:text-dark-400">Framework</div>
                </div>
                <div class="text-center p-4 bg-dark-50 dark:bg-dark-700/50 rounded-lg">
                  <div class="text-2xl font-bold text-dark-900 dark:text-dark-100">TypeScript</div>
                  <div class="text-sm text-dark-600 dark:text-dark-400">Limbaj</div>
                </div>
              </div>

              <div class="flex justify-center space-x-4">
                <button class="btn-secondary">
                  <Github class="w-4 h-4 mr-2" />
                  GitHub
                </button>
                <button class="btn-secondary">
                  <HelpCircle class="w-4 h-4 mr-2" />
                  Ajutor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUIStore } from '@/stores/uiStore'
import { 
  Settings as SettingsIcon, 
  Palette, 
  Database, 
  Bell, 
  Shield, 
  Info,
  Sun,
  Moon,
  Monitor,
  Download,
  FileSpreadsheet,
  FileText,
  Upload,
  Github,
  HelpCircle
} from 'lucide-vue-next'

const uiStore = useUIStore()
const { theme, setTheme } = uiStore

const activeSection = ref('general')
const selectedLanguage = ref('ro')
const dateFormat = ref('dd/mm/yyyy')
const autoBackup = ref(true)
const emailNotifications = ref(true)
const pushNotifications = ref(false)
const weeklyReport = ref(true)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const currentTheme = computed(() => theme)

const settingsSections = [
  { id: 'general', name: 'Generale', icon: SettingsIcon },
  { id: 'data', name: 'Date', icon: Database },
  { id: 'notifications', name: 'Notificări', icon: Bell },
  { id: 'security', name: 'Securitate', icon: Shield },
  { id: 'about', name: 'Despre', icon: Info }
]

const themes = [
  { value: 'light', name: 'Luminos', icon: Sun },
  { value: 'dark', name: 'Întunecat', icon: Moon },
  { value: 'auto', name: 'Automat', icon: Monitor }
]
</script>