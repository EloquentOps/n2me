import { createRouter, createWebHistory } from 'vue-router'
import Main from './views/Main.vue'
import Categories from './views/Categories.vue'
import Items from './views/Items.vue'
import Settings from './views/Settings.vue'
import Ask from './views/Ask.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    },
    {
      path: '/categories',
      name: 'categories',
      component: Categories
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    
    {
      path: '/items',
      name: 'items',
      component: Items
    },
    {
      path: '/ask',
      name: 'ask',
      component: Ask
    }
  ]
})

export default router
