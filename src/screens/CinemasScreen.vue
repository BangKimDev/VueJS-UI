<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Cinema } from '../types';
import { cinemaService } from '../services/cinemaService';
import { MapPin, Phone, Film } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();
const cinemas = ref<Cinema[]>([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  cinemas.value = await cinemaService.getCinemas();
  loading.value = false;
});

const viewShowtimes = (cinemaId: string | number) => {
  router.push('/movies');
};
</script>

<template>
  <div class="cinemas-container container">
    <div class="header-section fade-in">
      <h1 class="page-title">Hệ Thống Rạp <span class="accent">CINESTAR</span></h1>
      <p class="subtitle">Trải nghiệm điện ảnh đỉnh cao với hệ thống rạp chiếu phim hiện đại trên toàn quốc.</p>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loader"></div>
      <p>Đang tải danh sách rạp...</p>
    </div>

    <div v-else class="cinemas-grid">
      <div v-for="(cinema, index) in cinemas" :key="cinema.id" class="cinema-card fade-in" :style="{ animationDelay: `${index * 0.1}s` }">
        <div class="cinema-image-wrapper">
          <img :src="cinema.logo_url" :alt="cinema.name" class="cinema-image" />
          <div class="distance-badge">
            <MapPin class="icon-small" />
            {{ cinema.distance }}
          </div>
        </div>
        <div class="cinema-info">
          <h2 class="cinema-name">{{ cinema.name }}</h2>
          <div class="info-row">
            <MapPin class="icon" />
            <span class="info-text">{{ cinema.address }}</span>
          </div>
          <div class="info-row">
            <Phone class="icon" />
            <span class="info-text">{{ cinema.phone_number }}</span>
          </div>
          <div class="info-row">
            <Film class="icon" />
            <span class="info-text">{{ cinema.number_of_screens }} Phòng chiếu hiện đại</span>
          </div>
          <button class="btn-action" @click="viewShowtimes(cinema.id)">Xem phim đang chiếu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cinemas-container {
  padding-top: 3rem;
  padding-bottom: 5rem;
}

.header-section {
  text-align: center;
  margin-bottom: 4rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  color: var(--text-dark);
}

.accent {
  color: var(--accent-color);
}

.subtitle {
  font-size: 1.1rem;
  color: var(--gray-medium);
  max-width: 600px;
  margin: 0 auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: var(--gray-medium);
  font-weight: 600;
}

.loader {
  border: 4px solid var(--gray-light);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cinemas-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .cinemas-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .cinemas-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.cinema-card {
  background-color: var(--white);
  border-radius: 1.25rem;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
  border: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.cinema-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.cinema-image-wrapper {
  position: relative;
  height: 220px;
  overflow: hidden;
  background-color: var(--gray-light);
}

.cinema-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.cinema-card:hover .cinema-image {
  transform: scale(1.05);
}

.distance-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  padding: 0.4rem 0.8rem;
  border-radius: 2rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  z-index: 2;
}

.icon-small {
  width: 14px;
  height: 14px;
}

.cinema-info {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.cinema-name {
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 1.25rem;
  color: var(--text-dark);
  transition: color 0.2s ease;
}

.cinema-card:hover .cinema-name {
  color: var(--primary-color);
}

.info-row {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
}

.icon {
  width: 18px;
  height: 18px;
  color: var(--accent-color);
  flex-shrink: 0;
  margin-top: 2px;
}

.info-text {
  font-size: 0.95rem;
  color: var(--text-body);
  line-height: 1.5;
}

.btn-action {
  margin-top: auto;
  width: 100%;
  background-color: var(--gray-light);
  color: var(--text-dark);
  border: none;
  border-radius: 0.75rem;
  padding: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
}

.cinema-card:hover .btn-action {
  background-color: var(--primary-color);
  color: var(--white);
  box-shadow: 0 4px 12px rgba(13, 59, 102, 0.3);
}
</style>
