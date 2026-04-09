<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Star, Clock, Play, Ticket, Info, Calendar, User } from 'lucide-vue-next';
import { Movie } from '../types';
import { movieService } from '../services/movieService';
import { useBookingStore } from '../stores/booking';

const props = defineProps<{
  id: string; // From router params
}>();

const router = useRouter();
const route = useRoute();
const bookingStore = useBookingStore();

const movie = ref<Movie | null>(bookingStore.selectedMovie);
const loading = ref(!movie.value);
const activeTab = ref<'info' | 'cast' | 'trailer'>('info');

onMounted(async () => {
  if (!movie.value) {
    loading.value = true;
    const movieData = await movieService.getMovieById(props.id);
    if (movieData) {
      movie.value = movieData;
      bookingStore.setMovie(movieData);
    } else {
      router.push({ name: 'home' });
    }
    loading.value = false;
  }
});

const startBooking = () => {
  if (movie.value) {
    bookingStore.setMovie(movie.value);
    router.push({ name: 'showtime', params: { id: movie.value.id } });
  }
};
</script>

<template>
  <div v-if="loading" class="loading-container container">
    <p>Đang tải thông tin phim...</p>
  </div>
  <div v-else-if="movie" class="detail-container">
    <!-- Backdrop Section -->
    <div class="backdrop-section">
      <img 
        :src="movie.backdrop" 
        class="backdrop-img" 
        referrerPolicy="no-referrer"
      />
      <div class="backdrop-gradient" />
      <div class="backdrop-overlay" />
      
      <!-- Content Overlay -->
      <div class="content-overlay">
        <div class="container overlay-flex">
          <div class="poster-sidebar">
            <img :src="movie.poster" class="poster-img" referrerPolicy="no-referrer" />
          </div>
          <div class="movie-main-info">
            <div class="genre-badges">
              <span v-for="g in movie.genre" :key="g" class="genre-badge">
                {{ g }}
              </span>
            </div>
            <h1 class="movie-title">{{ movie.title }}</h1>
            <div class="movie-meta">
              <div class="meta-item">
                <Star class="icon-star" />
                <span class="rating-text">{{ movie.rating }}</span>
              </div>
              <div class="meta-item">
                <Clock class="icon-clock" />
                <span>{{ movie.duration }} phút</span>
              </div>
              <span class="classification-badge">
                {{ movie.classification }}
              </span>
            </div>
          </div>
          <div class="action-buttons">
            <button 
              @click="startBooking"
              class="book-now-btn"
            >
              <Ticket class="icon-ticket" />
              ĐẶT VÉ NGAY
            </button>
            <button class="play-trailer-btn">
              <Play class="icon-play" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Section -->
    <div class="container details-grid">
      <div class="main-content">
        <!-- Tabs -->
        <div class="tabs-header">
          <button 
            v-for="t in ['info', 'cast', 'trailer']" 
            :key="t"
            @click="activeTab = t as any"
            :class="['tab-btn', { active: activeTab === t }]"
          >
            {{ t === 'info' ? 'Thông tin' : t === 'cast' ? 'Diễn viên' : 'Trailer' }}
            <div v-if="activeTab === t" class="tab-indicator" />
          </button>
        </div>

        <div class="tab-content">
          <div v-if="activeTab === 'info'" class="info-tab">
            <p class="description">{{ movie.description }}</p>
            <div class="info-cards">
              <div class="info-card">
                <div class="info-label">
                  <User class="icon-label" /> Đạo diễn
                </div>
                <p class="info-value">{{ movie.director }}</p>
              </div>
              <div class="info-card">
                <div class="info-label">
                  <Calendar class="icon-label" /> Khởi chiếu
                </div>
                <p class="info-value">25/03/2026</p>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'cast'" class="cast-tab">
            <div v-for="actor in movie.cast" :key="actor" class="actor-card">
              <div class="actor-img-container">
                <img :src="`https://picsum.photos/seed/${actor}/200/200`" class="actor-img" referrerPolicy="no-referrer" />
              </div>
              <p class="actor-name">{{ actor }}</p>
            </div>
          </div>

          <div v-if="activeTab === 'trailer'" class="trailer-tab">
            <iframe 
              :src="movie.trailerUrl" 
              class="trailer-iframe" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            />
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
        <div class="notes-card">
          <h3 class="notes-title">
            <Info class="icon-info" />
            Lưu ý
          </h3>
          <div class="notes-list">
            <p>• Vui lòng có mặt trước giờ chiếu 15 phút để nhận vé.</p>
            <p>• Mang theo giấy tờ tùy thân để xác minh độ tuổi ({{ movie.classification }}).</p>
            <p>• Không mang thức ăn, nước uống từ bên ngoài vào rạp.</p>
          </div>
        </div>
        
        <div class="related-movies">
          <h3 class="sidebar-title">Phim liên quan</h3>
          <div class="related-list">
            <div v-for="i in 2" :key="i" class="related-item">
              <div class="related-img-container">
                <img :src="`https://picsum.photos/seed/related${i}/200/300`" class="related-img" referrerPolicy="no-referrer" />
              </div>
              <div class="related-info">
                <h4 class="related-title">Phim đề xuất {{ i }}</h4>
                <p class="related-meta">Hành động • 120m</p>
                <div class="related-rating">
                  <Star class="icon-star-sm" />
                  <span class="rating-val">4.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading-container {
  padding: 5rem 0;
  text-align: center;
  font-weight: 700;
  color: var(--gray-medium);
}

.detail-container {
  padding-bottom: 5rem;
}

.backdrop-section {
  position: relative;
  height: 300px;
  overflow: hidden;
}

@media (min-width: 768px) {
  .backdrop-section {
    height: 500px;
  }
}

.backdrop-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.backdrop-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--bg-main), rgba(248, 249, 250, 0.4), transparent);
}

.backdrop-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.2);
}

.content-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
}

@media (min-width: 768px) {
  .content-overlay {
    padding: 3rem;
  }
}

.overlay-flex {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-end;
}

@media (min-width: 768px) {
  .overlay-flex {
    flex-direction: row;
  }
}

.poster-sidebar {
  display: none;
  width: 16rem;
  aspect-ratio: 2/3;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  border: 4px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
  transform: translateY(-3rem);
}

@media (min-width: 768px) {
  .poster-sidebar {
    display: block;
  }
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-main-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 1rem;
}

.genre-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.genre-badge {
  background: rgba(13, 59, 102, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  color: var(--white);
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.movie-title {
  font-size: 1.875rem;
  color: var(--white);
  font-weight: 900;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

@media (min-width: 768px) {
  .movie-title {
    font-size: 3rem;
  }
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.icon-star {
  width: 1.25rem;
  height: 1.25rem;
  color: #fbbf24;
  fill: #fbbf24;
}

.rating-text {
  font-weight: 900;
  font-size: 1.125rem;
}

.icon-clock {
  width: 1.25rem;
  height: 1.25rem;
}

.classification-badge {
  background-color: var(--accent-color);
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--white);
  box-shadow: var(--shadow-lg);
}

.action-buttons {
  width: 100%;
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;
}

@media (min-width: 768px) {
  .action-buttons {
    width: auto;
  }
}

.book-now-btn {
  flex: 1;
  background-color: var(--accent-color);
  color: var(--white);
  padding: 1rem 2rem;
  border-radius: 9999px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: var(--transition-all);
  box-shadow: 0 10px 20px rgba(229, 57, 53, 0.2);
  border: none;
  cursor: pointer;
}

@media (min-width: 768px) {
  .book-now-btn {
    flex: none;
  }
}

.book-now-btn:hover {
  transform: scale(1.05);
  background-color: rgba(229, 57, 53, 0.9);
}

.icon-ticket {
  width: 1.25rem;
  height: 1.25rem;
}

.play-trailer-btn {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 9999px;
  color: var(--white);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: var(--transition-all);
  cursor: pointer;
}

.play-trailer-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.icon-play {
  width: 1.5rem;
  height: 1.5rem;
  fill: var(--white);
}

.details-grid {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .details-grid {
    margin-top: 4rem;
    grid-template-columns: 2fr 1fr;
  }
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid var(--gray-light);
}

.tab-btn {
  padding: 1rem 2rem;
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--gray-medium);
  position: relative;
  transition: var(--transition-all);
  background: none;
  border: none;
  cursor: pointer;
}

.tab-btn:hover {
  color: var(--primary-color);
}

.tab-btn.active {
  color: var(--primary-color);
}

.tab-indicator {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background-color: var(--primary-color);
  border-radius: 2px 2px 0 0;
}

.tab-content {
  margin-top: 2rem;
}

.description {
  color: var(--text-body);
  line-height: 1.6;
  font-size: 1.125rem;
}

.info-cards {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .info-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

.info-card {
  background-color: rgba(102, 102, 102, 0.05);
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-medium);
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.icon-label {
  width: 1rem;
  height: 1rem;
}

.info-value {
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--primary-color);
}

.cast-tab {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .cast-tab {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) {
  .cast-tab {
    grid-template-columns: repeat(4, 1fr);
  }
}

.actor-card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  cursor: pointer;
}

.actor-img-container {
  aspect-ratio: 1/1;
  background-color: var(--gray-light);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-md);
}

.actor-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.actor-card:hover .actor-img {
  transform: scale(1.1);
}

.actor-name {
  font-weight: 700;
  text-align: center;
  transition: color 0.3s ease;
}

.actor-card:hover .actor-name {
  color: var(--primary-color);
}

.trailer-tab {
  aspect-ratio: 16/9;
  border-radius: 1.5rem;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
}

.trailer-iframe {
  width: 100%;
  height: 100%;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.notes-card {
  background-color: var(--primary-color);
  color: var(--white);
  padding: 2rem;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 10px 20px rgba(13, 59, 102, 0.2);
}

.notes-title {
  font-size: 1.25rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--white);
}

.icon-info {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--accent-color);
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.sidebar-title {
  font-weight: 900;
  font-size: 1.125rem;
  margin-bottom: 1rem;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.related-item {
  display: flex;
  gap: 1rem;
  cursor: pointer;
}

.related-img-container {
  width: 5rem;
  aspect-ratio: 2/3;
  border-radius: 0.75rem;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: var(--shadow-md);
}

.related-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.related-item:hover .related-img {
  transform: scale(1.1);
}

.related-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.related-title {
  font-weight: 700;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-item:hover .related-title {
  color: var(--primary-color);
}

.related-meta {
  font-size: 0.75rem;
  color: var(--gray-medium);
}

.related-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.icon-star-sm {
  width: 0.75rem;
  height: 0.75rem;
  color: #fbbf24;
  fill: #fbbf24;
}

.rating-val {
  font-size: 0.75rem;
  font-weight: 700;
}
</style>
