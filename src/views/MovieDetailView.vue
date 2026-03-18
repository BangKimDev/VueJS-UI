<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { mockApi } from '../services/api'

const route = useRoute()
const movie = ref(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const movieId = route.params.id
    movie.value = await mockApi.getMovieById(movieId)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="movie-detail" v-if="movie">
    <!-- Backdrop & Hero Area -->
    <div class="backdrop-wrapper">
      <div 
        class="backdrop-img" 
        :style="{ backgroundImage: `linear-gradient(to top, var(--bg-dark) 0%, rgba(15, 23, 42, 0.6) 100%), url(${movie.backdrop})` }"
      ></div>
      
      <div class="container detail-hero">
        <div class="poster-card">
          <img :src="movie.poster" :alt="movie.title" class="poster-img">
        </div>
        
        <div class="info-hero">
          <h1 class="title">{{ movie.title }}</h1>
          
          <div class="meta-tags">
            <span class="tag">{{ movie.genre }}</span>
            <span class="tag">{{ movie.duration }}</span>
            <span class="tag rating-tag">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              {{ movie.rating }}
            </span>
          </div>

          <div class="main-actions">
            <!-- Book Tickets leads to the BookingView for this movie -->
            <router-link :to="`/booking/${movie.id}`" class="btn-primary large">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M7 4v16"></path><path d="M17 4v16"></path></svg>
              Book Tickets
            </router-link>
            <button class="btn-trailer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Trailer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Details Content Area -->
    <div class="container content-section">
      <div class="main-col">
        <section class="synopsis-section">
          <h2>Synopsis</h2>
          <p class="synopsis-text">{{ movie.synopsis }}</p>
        </section>

        <section class="cast-section">
          <h2>Top Cast</h2>
          <div class="cast-list">
            <div class="cast-item glass-panel" v-for="(actor, index) in movie.cast" :key="index">
              <div class="actor-avatar">
                {{ actor.charAt(0) }}
              </div>
              <span class="actor-name">{{ actor }}</span>
            </div>
          </div>
        </section>
      </div>
      
      <aside class="sidebar-col">
        <div class="info-card glass-panel">
          <h3>Movie Info</h3>
          <div class="info-row">
            <span class="label">Release Date</span>
            <span class="value">March 2026</span>
          </div>
          <div class="info-row">
            <span class="label">Running Time</span>
            <span class="value">{{ movie.duration }}</span>
          </div>
          <div class="info-row">
            <span class="label">Format</span>
            <span class="value">2D, 3D, IMAX</span>
          </div>
          <div class="info-row">
            <span class="label">Language</span>
            <span class="value">English, Vietnamese Sub</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
  
  <div v-else-if="loading" class="loading-state">
    <div class="spinner"></div>
  </div>
  
  <div v-else class="error-state">
    <p>Movie not found.</p>
    <router-link to="/" class="btn-primary">Back to Home</router-link>
  </div>
</template>

<style scoped>
.movie-detail {
  padding-bottom: 4rem;
}

.backdrop-wrapper {
  position: relative;
  margin-top: -80px; /* pull up behind transparent header */
  padding-top: 120px; /* space for header content */
  min-height: 500px;
  display: flex;
  align-items: flex-end;
  padding-bottom: 2rem;
}

.backdrop-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center 20%;
  z-index: -1;
}

.detail-hero {
  display: flex;
  gap: 3rem;
  align-items: flex-end;
  width: 100%;
}

.poster-card {
  width: 260px;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
  transform: translateY(4rem); /* Hang down into next section */
}

.poster-img {
  width: 100%;
  display: block;
}

.info-hero {
  flex: 1;
  padding-bottom: 1rem;
}

.title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.meta-tags {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.tag {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(4px);
  padding: 0.4rem 1rem;
  border-radius: 100px;
  font-size: 0.9rem;
  font-weight: 500;
  border: 1px solid rgba(255,255,255,0.1);
}

.rating-tag {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
  border-color: rgba(251, 191, 36, 0.2);
}

.main-actions {
  display: flex;
  gap: 1.5rem;
}

.btn-primary.large {
  padding: 1rem 2rem;
  font-size: 1.1rem;
}

.btn-trailer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1.1rem;
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  transition: all var(--transition-fast);
}

.btn-trailer:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.02);
}

.content-section {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 4rem;
  margin-top: 5rem;
}

.synopsis-section, .cast-section {
  margin-bottom: 3rem;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.synopsis-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--text-muted);
}

.cast-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.cast-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
}

.actor-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
}

.actor-name {
  font-weight: 500;
}

.info-card {
  padding: 1.5rem;
}

.info-card h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.info-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.info-row .label {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.info-row .value {
  font-weight: 500;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .detail-hero {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
  }
  .poster-card {
    transform: translateY(0);
    width: 200px;
  }
  .meta-tags, .main-actions {
    justify-content: center;
  }
  .content-section {
    grid-template-columns: 1fr;
    margin-top: 3rem;
  }
}
</style>
