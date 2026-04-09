<script setup lang="ts">
import { ref } from 'vue';
import { Search, User, Menu, X } from 'lucide-vue-next';
import { useRoute } from 'vue-router';

const route = useRoute();
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<template>
  <header class="header">
    <div class="container header-inner">
      <div class="header-left">
        <router-link 
          to="/"
          class="logo"
        >
          CINE<span class="logo-accent">STAR</span>
        </router-link>
        <nav class="desktop-nav">
          <router-link to="/" :class="['nav-link', { active: route.name === 'home' }]">Trang chủ</router-link>
          <router-link to="/movies" :class="['nav-link', { active: route.name === 'movies' }]">Phim</router-link>
          <button class="nav-link">Rạp</button>
          <button class="nav-link">Khuyến mãi</button>
        </nav>
      </div>
      <div class="header-right">
        <div class="search-container">
          <Search class="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm phim, rạp..." 
            class="search-input"
          />
        </div>
        <router-link 
          to="/profile"
          class="user-btn"
          :class="{ active: route.path.startsWith('/profile') }"
        >
          <User class="icon-user" />
        </router-link>
        <button 
          class="menu-toggle-btn"
          @click="toggleMenu"
        >
          <X v-if="isMenuOpen" />
          <Menu v-else />
        </button>
      </div>
    </div>
    
    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div v-if="isMenuOpen" class="mobile-menu">
        <nav class="mobile-nav">
          <router-link to="/" class="mobile-nav-link" @click="isMenuOpen = false">Trang chủ</router-link>
          <router-link to="/movies" class="mobile-nav-link" @click="isMenuOpen = false">Phim</router-link>
          <button class="mobile-nav-link">Rạp</button>
          <button class="mobile-nav-link">Khuyến mãi</button>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-light);
  padding: 0.75rem 0;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo {
  color: var(--primary-color);
  font-weight: 900;
  font-size: 1.5rem;
  cursor: pointer;
  letter-spacing: -0.05em;
  text-decoration: none;
}

.logo-accent {
  color: var(--accent-color);
}

.desktop-nav {
  display: none;
  align-items: center;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .desktop-nav {
    display: flex;
  }
}

.nav-link {
  font-weight: 700;
  font-size: 0.875rem;
  transition: color 0.2s ease;
  color: var(--text-body);
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link.active {
  color: var(--primary-color);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-container {
  position: relative;
  display: none;
}

@media (min-width: 640px) {
  .search-container {
    display: block;
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
  background-color: var(--gray-light);
  border-radius: 9999px;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  font-size: 0.875rem;
  border: none;
  outline: none;
  width: 12rem;
  transition: width 0.3s ease;
}

@media (min-width: 1024px) {
  .search-input {
    width: 16rem;
  }
}

.search-input:focus {
  box-shadow: 0 0 0 2px rgba(13, 59, 102, 0.1);
}

.user-btn {
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-btn:hover {
  background-color: var(--gray-light);
}

.user-btn.active {
  background-color: var(--gray-light);
}

.icon-user {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary-color);
}

.menu-toggle-btn {
  display: block;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

@media (min-width: 768px) {
  .menu-toggle-btn {
    display: none;
  }
}

.menu-toggle-btn:hover {
  background-color: var(--gray-light);
}

.mobile-menu {
  background-color: var(--white);
  border-top: 1px solid var(--gray-light);
  margin-top: 0.75rem;
  overflow: hidden;
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
}

.mobile-nav-link {
  text-align: left;
  padding: 0.5rem 0;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  color: var(--text-body);
}

/* Mobile Menu Transition */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
