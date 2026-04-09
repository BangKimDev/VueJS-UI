<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Ticket, Star, Clock, ChevronRight, MapPin } from 'lucide-vue-next';
import { Movie, Cinema } from '../types';
import { movieService } from '../services/movieService';
import { cinemaService } from '../services/cinemaService';
import { useBookingStore } from '../stores/booking';
import MovieCard from '../components/movie/MovieCard.vue';

const router = useRouter();
const bookingStore = useBookingStore();

const featuredMovies = ref<Movie[]>([]);
const nowShowing = ref<Movie[]>([]);
const cinemas = ref<Cinema[]>([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  const [movies, cinemasData] = await Promise.all([
    movieService.getNowShowing(),
    cinemaService.getCinemas()
  ]);
  nowShowing.value = movies;
  featuredMovies.value = movies.slice(0, 3);
  cinemas.value = cinemasData;
  loading.value = false;
});

const selectMovie = (movie: Movie) => {
  bookingStore.setMovie(movie);
  router.push({ name: 'detail', params: { id: movie.id } });
};

const startBooking = (movie: Movie) => {
  bookingStore.setMovie(movie);
  router.push({ name: 'showtime', params: { id: movie.id } });
};
</script>

<template>
  <div class="home-container">
    <!-- Hero Carousel -->
    <section v-if="featuredMovies.length > 0" class="hero-section">
      <div class="hero-bg">
        <img 
          :src="featuredMovies[0].backdrop" 
          class="hero-img" 
          referrerPolicy="no-referrer"
        />
        <div class="hero-gradient" />
      </div>
      <div class="hero-content container">
        <div class="genre-badges">
          <span v-for="g in featuredMovies[0].genre" :key="g" class="genre-badge">
            {{ g }}
          </span>
        </div>
        <h1 class="hero-title">
          {{ featuredMovies[0].title }}
        </h1>
        <div class="hero-meta">
          <div class="meta-item">
            <Star class="icon-star" />
            <span class="rating-text">{{ featuredMovies[0].rating }}</span>
          </div>
          <div class="meta-item">
            <Clock class="icon-clock" />
            <span>{{ featuredMovies[0].duration }} phút</span>
          </div>
          <span class="classification-badge">
            {{ featuredMovies[0].classification }}
          </span>
        </div>
        <button 
          @click="startBooking(featuredMovies[0])"
          class="hero-btn"
        >
          <Ticket class="icon-ticket" />
          ĐẶT VÉ NGAY
        </button>
      </div>
    </section>

    <!-- Now Showing -->
    <section class="now-showing-section container">
      <div class="section-header">
        <h2 class="section-title">PHIM ĐANG CHIẾU</h2>
        <router-link to="/movies" class="view-all-btn">
          Xem tất cả <ChevronRight class="icon-chevron" />
        </router-link>
      </div>
      
      <div v-if="loading" class="loading-state">
        Đang tải phim...
      </div>
      
      <div v-else class="movie-grid">
        <MovieCard 
          v-for="movie in nowShowing" 
          :key="movie.id" 
          :movie="movie" 
          @click="selectMovie(movie)" 
        />
      </div>
    </section>

    <!-- Cinemas & Promos -->
    <section class="cinemas-promos-section">
      <div class="container grid-layout">
        <div class="cinemas-column">
          <h2 class="section-title">HỆ THỐNG RẠP</h2>
          <div class="cinemas-grid">
            <div v-for="cinema in cinemas" :key="cinema.id" class="cinema-card">
              <div class="cinema-header">
                <h3 class="cinema-name">{{ cinema.name }}</h3>
                <span class="cinema-distance">{{ cinema.distance }}</span>
              </div>
              <p class="cinema-address">
                <MapPin class="icon-pin" />
                {{ cinema.address }}
              </p>
            </div>
          </div>
        </div>
        <div class="promos-column">
          <h2 class="section-title">ƯU ĐÃI</h2>
          <div class="promos-list">
            <div class="promo-card">
              <img src="https://picsum.photos/seed/promo1/400/300" class="promo-img" referrerPolicy="no-referrer" />
              <div class="promo-overlay">
                <span class="promo-tag">Thành viên</span>
                <h4 class="promo-title">Thứ 2 vui vẻ - Đồng giá 45k</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.hero-section {
  position: relative;
  height: 400px;
  overflow: hidden;
}

@media (min-width: 768px) {
  .hero-section {
    height: 600px;
  }
}

.hero-bg {
  position: absolute;
  inset: 0;
}

.hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--bg-main), rgba(248, 249, 250, 0.2), transparent);
}

.hero-content {
  position: absolute;
  bottom: 3rem;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.genre-badges {
  display: flex;
  gap: 0.5rem;
}

.genre-badge {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  color: var(--white);
  font-weight: 500;
}

.hero-title {
  font-size: 2.5rem;
  color: var(--white);
  font-weight: 900;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3.75rem;
  }
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon-star {
  width: 1rem;
  height: 1rem;
  color: #fbbf24;
  fill: #fbbf24;
}

.rating-text {
  font-weight: 700;
  color: var(--white);
}

.icon-clock {
  width: 1rem;
  height: 1rem;
}

.classification-badge {
  background-color: var(--accent-color);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--white);
}

.hero-btn {
  background-color: var(--accent-color);
  color: var(--white);
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.2s ease;
  width: fit-content;
  border: none;
  cursor: pointer;
}

.hero-btn:hover {
  transform: scale(1.05);
  background-color: rgba(229, 57, 53, 0.9);
}

.icon-ticket {
  width: 1.25rem;
  height: 1.25rem;
}

.now-showing-section {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 900;
}

.view-all-btn {
  color: var(--primary-color);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: gap 0.2s ease;
  text-decoration: none;
}

.view-all-btn:hover {
  gap: 0.5rem;
}

.icon-chevron {
  width: 1rem;
  height: 1rem;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .movie-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.loading-state {
  text-align: center;
  padding: 4rem 0;
  font-weight: 700;
  color: var(--gray-medium);
}

.cinemas-promos-section {
  background-color: rgba(13, 59, 102, 0.05);
  padding: 4rem 0;
}

.grid-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .grid-layout {
    grid-template-columns: 2fr 1fr;
  }
}

.cinemas-column, .promos-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.cinemas-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .cinemas-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.cinema-card {
  background: var(--white);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--gray-light);
  transition: border-color 0.3s ease;
  cursor: pointer;
}

.cinema-card:hover {
  border-color: rgba(13, 59, 102, 0.2);
}

.cinema-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.cinema-name {
  font-weight: 700;
  font-size: 1.125rem;
  transition: color 0.3s ease;
}

.cinema-card:hover .cinema-name {
  color: var(--primary-color);
}

.cinema-distance {
  font-size: 0.75rem;
  color: var(--gray-medium);
  background: var(--gray-light);
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.cinema-address {
  font-size: 0.875rem;
  color: var(--text-body);
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.icon-pin {
  width: 1rem;
  height: 1rem;
  color: var(--accent-color);
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.promo-card {
  aspect-ratio: 4/3;
  background-color: var(--accent-color);
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.promo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.promo-card:hover .promo-img {
  transform: scale(1.1);
}

.promo-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
}

.promo-tag {
  color: var(--accent-color);
  font-weight: 700;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}

.promo-title {
  color: var(--white);
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.2;
}
</style>
