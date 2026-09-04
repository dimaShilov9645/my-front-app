import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/order/:id',
      name: 'order',
      component: () => import('@/views/OrderView.vue'),
    },
  ],
})

export default router
