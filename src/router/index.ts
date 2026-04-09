import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeScreen from '../screens/HomeScreen.vue';
import MoviesScreen from '../screens/MoviesScreen.vue';
import DetailScreen from '../screens/DetailScreen.vue';
import ShowtimeScreen from '../screens/ShowtimeScreen.vue';
import SeatSelectionScreen from '../screens/SeatSelectionScreen.vue';
import CheckoutScreen from '../screens/CheckoutScreen.vue';
import ConfirmationScreen from '../screens/ConfirmationScreen.vue';
import AccountScreen from '../screens/AccountScreen.vue';
import EditProfileScreen from '../screens/EditProfileScreen.vue';
import BookingDetailScreen from '../screens/BookingDetailScreen.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeScreen
  },
  {
    path: '/movies',
    name: 'movies',
    component: MoviesScreen
  },
  {
    path: '/movie/:id',
    name: 'detail',
    component: DetailScreen,
    props: true
  },
  {
    path: '/showtime/:id',
    name: 'showtime',
    component: ShowtimeScreen,
    props: true
  },
  {
    path: '/booking/seats',
    name: 'seats',
    component: SeatSelectionScreen
  },
  {
    path: '/booking/checkout',
    name: 'checkout',
    component: CheckoutScreen
  },
  {
    path: '/booking/confirmation',
    name: 'confirmation',
    component: ConfirmationScreen
  },
  {
    path: '/profile',
    name: 'account',
    component: AccountScreen
  },
  {
    path: '/profile/edit',
    name: 'edit-profile',
    component: EditProfileScreen
  },
  {
    path: '/profile/booking/:id',
    name: 'booking-detail',
    component: BookingDetailScreen,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
