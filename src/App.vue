<script setup lang="ts">
import Header from './components/layout/Header.vue';
import Footer from './components/layout/Footer.vue';
</script>

<template>
  <div class="app-layout">
    <Header />

    <main class="app-main">
      <router-view v-slot="{ Component }">
        <Transition
          mode="out-in"
          name="screen-fade"
        >
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>

    <Footer />
  </div>
</template>

<style>
/* Global selection style */
::selection {
  background-color: rgba(13, 59, 102, 0.2);
  color: var(--primary-color);
}
</style>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-color: var(--bg-main);
  color: var(--text-body);
  font-family: var(--font-sans);
}

.app-main {
  min-height: calc(100vh - 200px);
}

/* Screen Transition */
.screen-fade-enter-active {
  transition: all 0.3s ease-out;
}

.screen-fade-leave-active {
  transition: all 0.2s ease-in;
}

.screen-fade-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}

.screen-fade-leave-to {
  opacity: 0;
  transform: translateY(-1rem);
}
</style>
