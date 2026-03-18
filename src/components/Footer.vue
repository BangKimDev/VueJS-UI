<script setup>
</script>

<template>
  <footer class="app-footer">
    <div class="container footer-content">
      <div class="footer-brand">
        <h2 class="logo-text">Cine<span class="highlight">Max</span></h2>
        <p class="tagline">Experience the magic of cinema in the highest quality, with the easiest booking system.</p>
      </div>
      <div class="footer-links">
        <div class="link-group">
          <h3>Explore</h3>
          <router-link to="/">Now Showing</router-link>
          <router-link to="/">Coming Soon</router-link>
          <router-link to="/">Cinemas</router-link>
        </div>
        <div class="link-group">
          <h3>Support</h3>
          <a href="#">Help Center</a>
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 CineMax. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--bg-dark);
  border-top: 1px solid var(--border-color);
  margin-top: 4rem;
  padding-top: 4rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 3rem;
}

.footer-brand {
  flex: 1;
  min-width: 300px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.highlight {
  color: var(--primary);
}

.tagline {
  color: var(--text-muted);
  max-width: 400px;
}

.footer-links {
  display: flex;
  gap: 4rem;
  flex-wrap: wrap;
}

.link-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.link-group h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  color: var(--text-main);
}

.link-group a {
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.link-group a:hover {
  color: var(--primary);
}

.footer-bottom {
  text-align: center;
  padding: 1.5rem 0;
  border-top: 1px solid var(--border-color);
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>