<script setup>
</script>

<template>
  <header class="app-header glass-panel">
    <div class="container header-container">
      <div class="logo">
        <router-link to="/">
          <span class="logo-text">Cine<span class="highlight">Max</span></span>
        </router-link>
      </div>
      
      <nav class="main-nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/movies" class="nav-link">Movies</router-link>
        <router-link to="/theaters" class="nav-link">Theaters</router-link>
      </nav>

      <div class="user-actions">
        <button class="btn-ghost">Log In</button>
        <button class="btn-primary">Sign Up</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  border-radius: 0;
  border-left: none;
  border-right: none;
  border-top: none;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
}

.logo-text {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.highlight {
  color: var(--primary);
}

.main-nav {
  display: flex;
  gap: 2rem;
}

.nav-link {
  font-weight: 500;
  color: var(--text-main);
  transition: color var(--transition-fast);
  position: relative;
}

.nav-link:hover,
.router-link-active {
  color: var(--primary);
}

/* Underline effect */
.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: var(--primary);
  transition: width var(--transition-normal);
}

.nav-link:hover::after,
.router-link-active::after {
  width: 100%;
}

.user-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-ghost {
  color: var(--text-main);
  font-weight: 600;
  padding: 0.5rem 1rem;
  transition: color var(--transition-fast);
}

.btn-ghost:hover {
  color: var(--primary);
}
</style>
