<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Calendar, MapPin, Info, Filter, Search } from 'lucide-vue-next';
import { Movie, Cinema, Show, Screen } from '../types';
import { cinemaService } from '../services/cinemaService';
import { movieService } from '../services/movieService';
import { useBookingStore } from '../stores/booking';

const props = defineProps<{
  id: string; // Movie ID from router
}>();

const router = useRouter();
const route = useRoute();
const bookingStore = useBookingStore();

const movie = ref<Movie | null>(bookingStore.selectedMovie);
const selectedDate = ref('2026-03-25');
const cinemas = ref<Cinema[]>([]);
const showtimesArr = ref<Show[]>([]);
const screens = ref<Screen[]>([]);
const loading = ref(true);

const dates = [
  { day: 'T4', date: '25', full: '2026-03-25' },
  { day: 'T5', date: '26', full: '2026-03-26' },
  { day: 'T6', date: '27', full: '2026-03-27' },
  { day: 'T7', date: '28', full: '2026-03-28' },
  { day: 'CN', date: '29', full: '2026-03-29' },
  { day: 'T2', date: '30', full: '2026-03-30' },
  { day: 'T3', date: '31', full: '2026-03-31' },
];

const filteredCinemas = computed(() => {
  if (!movie.value) return [];
  return cinemas.value.map(cinema => {
    // Lấy danh sách ID phòng chiếu thuộc về rạp hiện tại
    const cinemaScreenIds = screens.value
      .filter(sc => sc.cinema_id === cinema.id)
      .map(sc => sc.id);

    const showtimes = showtimesArr.value.filter(s => {
      // Hỗ trợ cả 2 schema (movie_id mới hoặc movieId cũ)
      const sMovieId = s.movie_id || s.movieId;
      
      // Suất chiếu thuộc rạp này nếu screen_id nằm trong danh sách phòng chiếu
      // Hoặc theo cách ánh xạ trực tiếp cũ (cinemaId)
      const belongsToCinema = cinemaScreenIds.includes(s.screen_id) || (s.cinemaId === cinema.id);

      return belongsToCinema && 
             sMovieId?.toString() === movie.value?.id.toString() && 
             s.date === selectedDate.value;
    });
    return { ...cinema, showtimes };
  }).filter(c => c.showtimes.length > 0);
});

onMounted(async () => {
  loading.value = true;
  
  // Load movie if not present
  if (!movie.value) {
    const movieData = await movieService.getMovieById(props.id);
    if (movieData) {
      movie.value = movieData;
      bookingStore.setMovie(movieData);
    } else {
      router.push({ name: 'home' });
      return;
    }
  }

  const [cinemasData, showtimesData, screensData] = await Promise.all([
    cinemaService.getCinemas(),
    cinemaService.getShows(),
    cinemaService.getScreens()
  ]);
  cinemas.value = cinemasData;
  showtimesArr.value = showtimesData;
  screens.value = screensData;
  loading.value = false;
});

const selectShowtime = (showtime: Show, cinema: Cinema) => {
  bookingStore.setShowtime(showtime);
  bookingStore.setCinema(cinema);
  router.push({ name: 'seats' });
};
</script>

<template>
  <div v-if="loading" class="loading-container container">
    <p>Đang tải lịch chiếu...</p>
  </div>
  <div v-else-if="movie" class="container showtime-screen">
    <!-- Header Section -->
    <div class="showtime-header">
      <div class="movie-info-compact">
        <div class="poster-mini">
          <img :src="movie.poster" class="poster-img" referrerPolicy="no-referrer" />
        </div>
        <div class="movie-text">
          <h1 class="movie-title">{{ movie.title }}</h1>
          <div class="movie-meta">
            <span class="badge-accent">{{ movie.classification }}</span>
            <span class="meta-item">{{ movie.duration }} phút</span>
            <span class="meta-item">{{ Array.isArray(movie.genre) ? movie.genre.join(', ') : movie.genre }}</span>
          </div>
        </div>
      </div>
      <div class="info-banner">
        <Info class="info-icon" />
        <p class="info-text">Chọn rạp và suất chiếu phù hợp với bạn</p>
      </div>
    </div>

    <!-- Date Selection -->
    <section class="date-section">
      <div class="section-header">
        <h2 class="section-title">
          <Calendar class="icon-accent" />
          CHỌN NGÀY CHIẾU
        </h2>
        <span class="current-month">Tháng 03/2026</span>
      </div>
      <div class="date-list">
        <button 
          v-for="d in dates" 
          :key="d.full"
          @click="selectedDate = d.full"
          :class="['date-btn', { active: selectedDate === d.full }]"
        >
          <span class="date-day">{{ d.day }}</span>
          <span class="date-num">{{ d.date }}</span>
        </button>
      </div>
    </section>

    <!-- Cinema & Showtime Selection -->
    <section class="cinema-section">
      <div class="section-header-row">
        <h2 class="section-title">
          <MapPin class="icon-accent" />
          DANH SÁCH RẠP
        </h2>
        <div class="filter-controls">
          <div class="search-box">
            <Search class="search-icon" />
            <input type="text" placeholder="Tìm rạp..." class="search-input" />
          </div>
          <button class="filter-btn">
            <Filter class="icon-filter" />
          </button>
        </div>
      </div>

      <div v-if="filteredCinemas.length > 0" class="cinema-list">
        <div v-for="cinema in filteredCinemas" :key="cinema.id" class="cinema-card">
          <div class="cinema-card-header">
            <div class="cinema-info">
              <h3 class="cinema-name">{{ cinema.name }}</h3>
              <p class="cinema-address">
                <MapPin class="icon-mini" />
                {{ cinema.address }}
              </p>
            </div>
            <span class="distance-badge">
              CÁCH BẠN {{ cinema.distance }}
            </span>
          </div>
          <div class="cinema-card-body">
            <div class="showtime-group">
              <div class="format-label">
                <span class="accent-line" />
                ĐỊNH DẠNG 2D
              </div>
              <div class="showtime-list">
                <button 
                  v-for="st in cinema.showtimes" 
                  :key="st.id"
                  @click="selectShowtime(st, cinema)"
                  class="showtime-btn"
                >
                  <div class="time-text">{{ st.time }}</div>
                  <div class="lang-text">{{ st.language }}</div>
                  <div class="price-tag">
                    {{ st.price.toLocaleString() }}đ
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <div class="empty-icon-container">
          <Calendar class="empty-icon" />
        </div>
        <h3 class="empty-title">Không có suất chiếu</h3>
        <p class="empty-desc">Vui lòng chọn ngày khác hoặc rạp khác</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.loading-container {
  padding: 5rem 0;
  text-align: center;
  font-weight: 700;
  color: var(--gray-medium);
}

.showtime-screen {
  padding-top: 3rem;
  padding-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.showtime-header {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  justify-content: space-between;
}

@media (min-width: 768px) {
  .showtime-header {
    flex-direction: row;
    align-items: center;
  }
}

.movie-info-compact {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.poster-mini {
  width: 6rem;
  aspect-ratio: 2/3;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  flex-shrink: 0;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-title {
  font-size: 1.875rem;
  font-weight: 900;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--gray-medium);
}

.badge-accent {
  background-color: var(--accent-color);
  color: var(--white);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
}

.info-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(13, 59, 102, 0.05);
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(13, 59, 102, 0.1);
}

.info-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary-color);
}

.info-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(13, 59, 102, 0.8);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-accent {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--accent-color);
}

.current-month {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--gray-medium);
}

.date-list {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scrollbar-width: none;
}

.date-list::-webkit-scrollbar {
  display: none;
}

.date-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 5rem;
  height: 6rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
  border: 2px solid var(--gray-light);
  background-color: var(--white);
  color: var(--gray-medium);
  cursor: pointer;
}

.date-btn:hover {
  border-color: rgba(13, 59, 102, 0.3);
}

.date-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--white);
  box-shadow: 0 10px 25px -5px rgba(13, 59, 102, 0.2);
  transform: scale(1.05);
}

.date-day {
  font-size: 0.75rem;
  font-weight: 700;
  opacity: 0.6;
  margin-bottom: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.date-num {
  font-size: 1.5rem;
  font-weight: 900;
}

.section-header-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .section-header-row {
    flex-direction: row;
    align-items: center;
  }
}

.filter-controls {
  display: flex;
  gap: 0.75rem;
  width: 100%;
}

@media (min-width: 768px) {
  .filter-controls {
    width: auto;
  }
}

.search-box {
  position: relative;
  flex: 1;
}

@media (min-width: 768px) {
  .search-box {
    width: 16rem;
  }
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-medium);
  width: 1rem;
  height: 1rem;
}

.search-input {
  width: 100%;
  background-color: var(--white);
  border: 1px solid var(--gray-light);
  border-radius: 0.75rem;
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s ease;
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(13, 59, 102, 0.1);
}

.filter-btn {
  padding: 0.625rem;
  background-color: var(--white);
  border: 1px solid var(--gray-light);
  border-radius: 0.75rem;
  transition: background-color 0.2s ease;
  cursor: pointer;
  border: 1px solid var(--gray-light);
}

.filter-btn:hover {
  background-color: var(--gray-light);
}

.icon-filter {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--primary-color);
}

.cinema-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cinema-card {
  background-color: var(--white);
  border-radius: 1.5rem;
  border: 1px solid var(--gray-light);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.3s ease;
}

.cinema-card:hover {
  box-shadow: var(--shadow-md);
}

.cinema-card-header {
  padding: 1.5rem;
  background-color: rgba(244, 244, 249, 0.3);
  border-bottom: 1px solid var(--gray-light);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
}

@media (min-width: 768px) {
  .cinema-card-header {
    flex-direction: row;
    align-items: center;
    padding: 2rem;
  }
}

.cinema-name {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.cinema-address {
  font-size: 0.875rem;
  color: var(--gray-medium);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-mini {
  width: 1rem;
  height: 1rem;
  color: var(--accent-color);
}

.distance-badge {
  background-color: var(--white);
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--primary-color);
  border: 1px solid var(--gray-light);
  box-shadow: var(--shadow-sm);
  width: fit-content;
}

.cinema-card-body {
  padding: 1.5rem;
}

@media (min-width: 768px) {
  .cinema-card-body {
    padding: 2rem;
  }
}

.showtime-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.format-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 900;
  color: var(--gray-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.accent-line {
  width: 2rem;
  height: 2px;
  background-color: var(--accent-color);
}

.showtime-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.showtime-btn {
  position: relative;
  background-color: var(--white);
  border: 2px solid var(--gray-light);
  padding: 1rem 2rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
}

.showtime-btn:hover {
  border-color: var(--primary-color);
  transform: scale(1.05);
}

.showtime-btn:active {
  transform: scale(0.95);
}

.time-text {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary-color);
}

.lang-text {
  font-size: 10px;
  font-weight: 700;
  color: var(--gray-medium);
  margin-top: 0.25rem;
  text-transform: uppercase;
  letter-spacing: -0.02em;
}

.price-tag {
  position: absolute;
  top: -0.5rem;
  right: -0.5rem;
  background-color: var(--accent-color);
  color: var(--white);
  font-size: 10px;
  font-weight: 900;
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  box-shadow: var(--shadow-lg);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.showtime-btn:hover .price-tag {
  opacity: 1;
}

.empty-state {
  text-align: center;
  padding: 5rem 0;
  background-color: rgba(244, 244, 249, 0.3);
  border-radius: 1.5rem;
  border: 2px dashed var(--gray-light);
}

.empty-icon-container {
  width: 5rem;
  height: 5rem;
  background-color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: var(--shadow-xl);
}

.empty-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--gray-medium);
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--primary-color);
}

.empty-desc {
  color: var(--gray-medium);
  margin-top: 0.5rem;
}
</style>
