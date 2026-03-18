import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/movie/:id',
      name: 'movie-detail',
      component: () => import('../views/MovieDetailView.vue')
    },
    {
      path: '/booking/:id',
      name: 'booking',
      component: () => import('../views/BookingView.vue')
    },
    {
      // Catch-all route to redirect undefined paths back to home
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
