import { createRouter, createWebHistory } from 'vue-router'
import Add from './views/Add.vue'
import Categories from './views/Categories.vue'
import Items from './views/Items.vue'
import Settings from './views/Settings.vue'
import Ask from './views/Ask.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Add',
      component: Add
    },
    {
      path: '/categories',
      name: 'Categories',
      component: Categories
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    
    {
      path: '/writings',
      name: 'Writings',
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
