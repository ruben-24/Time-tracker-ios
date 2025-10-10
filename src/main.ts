import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Import views
import Dashboard from './views/Dashboard.vue'
import DataEntry from './views/DataEntry.vue'
import Analytics from './views/Analytics.vue'
import Settings from './views/Settings.vue'

// Router configuration
const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/data-entry', name: 'DataEntry', component: DataEntry },
  { path: '/analytics', name: 'Analytics', component: Analytics },
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