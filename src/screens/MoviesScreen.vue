<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Movie } from '../types';
import { movieService } from '../services/movieService';
import { useBookingStore } from '../stores/booking';
import MovieCard from '../components/movie/MovieCard.vue';

const router = useRouter();
const bookingStore = useBookingStore();

const tab = ref<'now' | 'soon'>('now');
const movies = ref<Movie[]>([]);
const loading = ref(true);

onMounted(async () => {
  loading.value = true;
  const now = await movieService.getNowShowing();
  const soon = await movieService.getComingSoon();
  movies.value = [...now, ...soon];
  loading.value = false;
});

const filteredMovies = computed(() => 
  movies.value.filter(m => tab.value === 'now' ? m.status === 'now-showing' : m.status === 'coming-soon')
);

const selectMovie = (movie: Movie) => {
  bookingStore.setMovie(movie);
  router.push({ name: 'detail', params: { id: movie.id } });
};
</script>

<template>
  <div class="movies-container container">
    <div class="filters-header">
      <div class="tabs-container">
        <button 
          @click="tab = 'now'"
          :class="['tab-btn', { active: tab === 'now' }]"
        >
          Đang chiếu
        </button>
        <button 
          @click="tab = 'soon'"
          :class="['tab-btn', { active: tab === 'soon' }]"
        >
          Sắp chiếu
        </button>
      </div>
      <div class="select-filters">
        <select class="filter-select">
          <option>Tất cả thể loại</option>
          <option>Hành động</option>
          <option>Hoạt hình</option>
          <option>Khoa học viễn tưởng</option>
        </select>
        <select class="filter-select">
          <option>Sắp xếp: Mới nhất</option>
          <option>Phổ biến nhất</option>
          <option>Đánh giá cao</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      Đang tải danh sách phim...
    </div>

    <div v-else class="movies-grid">
      <MovieCard 
        v-for="movie in filteredMovies" 
        :key="movie.id" 
        :movie="movie" 
        @click="selectMovie(movie)" 
      />
    </div>
  </div>
</template>

<style scoped>
.movies-container {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.filters-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 3rem;
}

@media (min-width: 768px) {
  .filters-header {
    flex-direction: row;
    align-items: center;
  }
}

.tabs-container {
  display: flex;
  background-color: var(--gray-light);
  padding: 0.25rem;
  border-radius: 0.75rem;
  width: fit-content;
}

.tab-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 0.875rem;
  transition: var(--transition-all);
  color: var(--gray-medium);
  background: none;
  border: none;
  cursor: pointer;
}

.tab-btn:hover {
  color: var(--primary-color);
}

.tab-btn.active {
  background-color: var(--white);
  color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.select-filters {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .select-filters {
    padding-bottom: 0;
  }
}

.filter-select {
  background-color: var(--white);
  border: 1px solid var(--gray-light);
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  border-color: rgba(13, 59, 102, 0.2);
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

@media (min-width: 768px) {
  .movies-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1024px) {
  .movies-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.loading-state {
  text-align: center;
  padding: 4rem 0;
  font-weight: 700;
  color: var(--gray-medium);
}
</style>
