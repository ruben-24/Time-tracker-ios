import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import views
import Dashboard from './views/Dashboard.vue'
import TimeTracker from './views/TimeTracker.vue'
import Timesheet from './views/Timesheet.vue'
import Reports from './views/Reports.vue'
import Settings from './views/Settings.vue'

// Router configuration
const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/time-tracker', name: 'TimeTracker', component: TimeTracker },
  { path: '/timesheet', name: 'Timesheet', component: Timesheet },
  { path: '/reports', name: 'Reports', component: Reports },
  { path: '/settings', name: 'Settings', component: Settings },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')

// Register PWA features
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  })
}