<script setup lang="ts">
import { Smartphone } from 'lucide-vue-next';
</script>

<template>
  <footer class="footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <div class="footer-logo">
          CINE<span class="logo-accent">STAR</span>
        </div>
        <p class="footer-desc">
          Hệ thống rạp chiếu phim hiện đại với công nghệ âm thanh và hình ảnh hàng đầu Việt Nam.
        </p>
      </div>
      <div class="footer-links">
        <h4 class="footer-title">Liên kết</h4>
        <ul class="link-list">
          <li><button class="footer-link">Về chúng tôi</button></li>
          <li><button class="footer-link">Chính sách bảo mật</button></li>
          <li><button class="footer-link">Điều khoản sử dụng</button></li>
          <li><button class="footer-link">Liên hệ</button></li>
        </ul>
      </div>
      <div class="footer-social">
        <h4 class="footer-title">Theo dõi</h4>
        <div class="social-icons">
          <div class="social-icon">F</div>
          <div class="social-icon">I</div>
          <div class="social-icon">Y</div>
        </div>
      </div>
      <div class="footer-apps">
        <h4 class="footer-title">Tải ứng dụng</h4>
        <div class="app-buttons">
          <button class="app-btn">
            <Smartphone class="icon-phone" />
            <div class="app-btn-text">
              <div class="app-btn-label">Download on the</div>
              <div class="app-btn-name">App Store</div>
            </div>
          </button>
          <button class="app-btn">
            <Smartphone class="icon-phone" />
            <div class="app-btn-text">
              <div class="app-btn-label">Get it on</div>
              <div class="app-btn-name">Google Play</div>
            </div>
          </button>
        </div>
      </div>
    </div>
    <div class="container footer-bottom">
      © 2026 CINESTAR VIETNAM. All rights reserved.
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--primary-color);
  color: var(--white);
  padding: 3rem 0;
  margin-top: 3rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.footer-logo {
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  margin-bottom: 1rem;
}

.logo-accent {
  color: var(--accent-color);
}

.footer-desc {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  line-height: 1.5;
}

.footer-title {
  font-weight: 700;
  margin-bottom: 1rem;
}

.link-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  transition: color 0.2s ease;
  text-align: left;
}

.footer-link:hover {
  color: var(--white);
}

.social-icons {
  display: flex;
  gap: 1rem;
}

.social-icon {
  width: 2rem;
  height: 2rem;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.social-icon:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.app-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.app-btn {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background-color 0.2s ease;
  width: 100%;
}

.app-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.icon-phone {
  width: 1.25rem;
  height: 1.25rem;
}

.app-btn-text {
  text-align: left;
}

.app-btn-label {
  font-size: 10px;
  opacity: 0.6;
  text-transform: uppercase;
}

.app-btn-name {
  font-size: 0.875rem;
  font-weight: 700;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 3rem;
  padding-top: 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
}
</style>
