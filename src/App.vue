<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
</script>


<template>
  <Header />
  <main class="main-content">
    <RouterView />
  </main>
  <Footer />
</template>

<style scoped>
.main-content {
  min-height: calc(100vh - 80px - 200px); /* rough calc for footer/header */
}
</style>
