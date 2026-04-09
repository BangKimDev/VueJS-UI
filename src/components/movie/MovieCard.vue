<script setup lang="ts">
import { Star, Play } from 'lucide-vue-next';
import { Movie } from '../../types';

defineProps<{
  movie: Movie;
}>();

defineEmits<{
  (e: 'click'): void;
}>();
</script>

<template>
  <div class="movie-card" @click="$emit('click')">
    <div class="poster-container">
      <img 
        :src="movie.poster" 
        class="poster-img" 
        referrerPolicy="no-referrer"
      />
      <div class="badges">
        <span class="badge badge-classification">
          {{ movie.classification }}
        </span>
        <span v-if="movie.status === 'coming-soon'" class="badge badge-status">
          SẮP CHIẾU
        </span>
      </div>
      <div class="overlay">
        <div class="play-btn">
          <Play class="play-icon" />
        </div>
      </div>
    </div>
    <h3 class="movie-title">{{ movie.title }}</h3>
    <div class="movie-footer">
      <span class="movie-meta">{{ movie.genre[0] }} • {{ movie.duration }}m</span>
      <div class="movie-rating">
        <Star class="star-icon" />
        <span class="rating-value">{{ movie.rating }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.movie-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-8px);
}

.poster-container {
  position: relative;
  aspect-ratio: 2/3;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  margin-bottom: 1rem;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.movie-card:hover .poster-img {
  transform: scale(1.1);
}

.badges {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge {
  font-size: 10px;
  font-weight: 900;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  box-shadow: var(--shadow-lg);
  color: var(--white);
}

.badge-classification {
  background-color: var(--accent-color);
}

.badge-status {
  background-color: var(--primary-color);
}

.overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.movie-card:hover .overlay {
  opacity: 1;
}

.play-btn {
  width: 3rem;
  height: 3rem;
  background-color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-xl);
}

.play-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary-color);
  fill: var(--primary-color);
  margin-left: 0.25rem;
}

.movie-title {
  font-weight: 700;
  font-size: 1.125rem;
  line-height: 1.2;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.movie-card:hover .movie-title {
  color: var(--primary-color);
}

.movie-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.movie-meta {
  font-size: 0.75rem;
  color: var(--gray-medium);
}

.movie-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.star-icon {
  width: 0.75rem;
  height: 0.75rem;
  color: #fbbf24;
  fill: #fbbf24;
}

.rating-value {
  font-size: 0.75rem;
  font-weight: 700;
}
</style>
