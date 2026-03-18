<script setup>
import { ref, onMounted, computed } from 'vue'
import { mockApi } from '../services/api'

const movies = ref([])
const loading = ref(true)

const featuredMovie = computed(() => {
  return movies.value.find(m => m.featured) || movies.value[0]
})

onMounted(async () => {
  try {
    movies.value = await mockApi.getMovies()
  } catch (error) {
    console.error('Failed to load movies:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="home">
    <section v-if="featuredMovie" class="hero" :style="{ backgroundImage: `linear-gradient(to top, var(--bg-dark) 0%, rgba(15, 23, 42, 0.4) 100%), url(${featuredMovie.backdrop})` }">
      <div class="container hero-content">
        <div class="hero-info glass-panel">
          <span class="badge">Trending Now</span>
          <h1 class="hero-title">{{ featuredMovie.title }}</h1>
          <div class="meta">
            <span>{{ featuredMovie.duration }}</span>
            <span class="dot">•</span>
            <span>{{ featuredMovie.genre }}</span>
            <span class="dot">•</span>
            <span class="rating">★ {{ featuredMovie.rating }}</span>
          </div>
          <p class="synopsis">{{ featuredMovie.synopsis }}</p>
          <div class="actions">
            <router-link :to="`/movie/${featuredMovie.id}`" class="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Book Tickets
            </router-link>
            <button class="btn-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
              Watch Trailer
            </button>
          </div>
        </div>
      </div>
    </section>

    <div class="container movies-section">
      <div class="section-header">
        <h2>Now Showing</h2>
        <a href="#" class="view-all">View All</a>
      </div>
      
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
      </div>

      <div v-else class="movies-grid">
        <router-link 
          v-for="movie in movies" 
          :key="movie.id" 
          :to="`/movie/${movie.id}`"
          class="movie-card"
        >
          <div class="poster-container">
            <img :src="movie.poster" :alt="movie.title" class="poster" loading="lazy">
            <div class="poster-overlay">
              <button class="btn-primary small">Get Tickets</button>
            </div>
          </div>
          <div class="movie-info">
            <h3 class="movie-title">{{ movie.title }}</h3>
            <p class="movie-genre">{{ movie.genre }}</p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  height: 80vh;
  min-height: 600px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding-bottom: 4rem;
  margin-top: -80px; /* Offset header */
  position: relative;
}

.hero-content {
  width: 100%;
}

.hero-info {
  max-width: 600px;
  padding: 2.5rem;
  animation: slideUp var(--transition-normal);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.badge {
  background: var(--primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: inline-block;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-muted);
  font-weight: 500;
  margin-bottom: 1.5rem;
}

.dot {
  font-size: 0.8rem;
}

.rating {
  color: #fbbf24;
  font-weight: 600;
}

.synopsis {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  color: var(--text-main);
  opacity: 0.9;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all var(--transition-fast);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

/* Movies Section */
.movies-section {
  padding: 4rem 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2.5rem;
}

.section-header h2 {
  font-size: 2rem;
  font-weight: 700;
}

.view-all {
  color: var(--primary);
  font-weight: 600;
  transition: color var(--transition-fast);
}

.view-all:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
}

.movie-card {
  display: flex;
  flex-direction: column;
  transition: transform var(--transition-fast);
}

.movie-card:hover {
  transform: translateY(-8px);
}

.poster-container {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  aspect-ratio: 2/3;
  margin-bottom: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.movie-card:hover .poster {
  transform: scale(1.05);
}

.poster-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity var(--transition-fast);
}

.movie-card:hover .poster-overlay {
  opacity: 1;
}

.movie-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.movie-genre {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.btn-primary.small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  .hero-info {
    padding: 1.5rem;
  }
}
</style>