<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CheckCircle, QrCode, MapPin, Clock, Ticket, ChevronRight, Download, Mail, Share2 } from 'lucide-vue-next';
import { useBookingStore } from '../stores/booking';

const router = useRouter();
const bookingStore = useBookingStore();

const booking = computed(() => bookingStore.currentBooking);

onMounted(() => {
  if (!booking.value) {
    router.push({ name: 'home' });
  }
});

const goToAccount = () => {
  router.push({ name: 'account' });
};

const goToHome = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <div v-if="booking" class="container confirmation-screen">
    <!-- Success Header -->
    <div class="success-header">
      <div class="success-icon-container">
        <CheckCircle class="icon-check" />
      </div>
      <div class="success-text">
        <h1 class="success-title">ĐẶT VÉ THÀNH CÔNG!</h1>
        <p class="order-id">Mã đơn hàng: <span class="primary-text">{{ booking.id }}</span></p>
      </div>
      <p class="success-desc">Cảm ơn bạn đã tin tưởng CineStar. Thông tin vé đã được gửi đến email <span class="primary-text">{{ booking.customerInfo?.email }}</span></p>
    </div>

    <!-- Ticket Card -->
    <div class="ticket-card">
      <div class="ticket-grid">
        <!-- Movie Info -->
        <div class="ticket-main">
          <div class="movie-info-row">
            <div class="poster-mini">
              <img :src="booking.movie?.poster" class="poster-img" referrerPolicy="no-referrer" />
            </div>
            <div class="movie-text">
              <h2 class="movie-title">{{ booking.movie?.title }}</h2>
              <div class="movie-meta">
                <span class="classification-badge">{{ booking.movie?.classification }}</span>
                <span class="format-text">{{ booking.showtime?.format }} • {{ booking.showtime?.language }}</span>
              </div>
            </div>
          </div>

          <div class="details-grid">
            <div class="detail-item">
              <p class="detail-label">Rạp chiếu</p>
              <div class="detail-content">
                <MapPin class="icon-accent" />
                <p class="detail-value">{{ booking.cinema?.name }}</p>
              </div>
            </div>
            <div class="detail-item">
              <p class="detail-label">Suất chiếu</p>
              <div class="detail-content">
                <Clock class="icon-accent" />
                <p class="detail-value">{{ booking.showtime?.time }} • {{ booking.showtime?.date }}</p>
              </div>
            </div>
            <div class="detail-item">
              <p class="detail-label">Số ghế</p>
              <div class="detail-content">
                <Ticket class="icon-accent" />
                <p class="detail-value">{{ booking.seats.map(s => s.id).join(', ') }}</p>
              </div>
            </div>
            <div class="detail-item">
              <p class="detail-label">Tổng tiền</p>
              <p class="total-price">{{ booking.totalPrice?.toLocaleString() }}đ</p>
            </div>
          </div>

          <!-- Decorative Circles -->
          <div class="deco-circle top" />
          <div class="deco-circle bottom" />
        </div>

        <!-- QR Code Section -->
        <div class="ticket-qr-section">
          <div class="qr-container">
            <QrCode class="icon-qr" />
          </div>
          <p class="qr-instruction">Quét mã tại quầy vé để nhận vé giấy</p>
          <div class="qr-actions">
            <button class="action-btn">
              <Download class="icon-mini" />
            </button>
            <button class="action-btn">
              <Mail class="icon-mini" />
            </button>
            <button class="action-btn">
              <Share2 class="icon-mini" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="confirmation-actions">
      <button 
        @click="goToAccount"
        class="history-btn"
      >
        XEM LỊCH SỬ ĐẶT VÉ
      </button>
      <button 
        @click="goToHome"
        class="home-btn"
      >
        VỀ TRANG CHỦ
        <ChevronRight class="icon-mini" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.confirmation-screen {
  max-width: 60rem;
  padding-top: 5rem;
  padding-bottom: 5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.success-header {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: slideUp 0.7s ease-out;
}

.success-icon-container {
  width: 6rem;
  height: 6rem;
  background-color: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 20px 40px -10px rgba(34, 197, 94, 0.3);
}

.icon-check {
  width: 3rem;
  height: 3rem;
  color: var(--white);
}

.success-title {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--primary-color);
}

.order-id {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-medium);
}

.primary-text {
  color: var(--primary-color);
  font-weight: 900;
}

.success-desc {
  max-width: 28rem;
  margin: 0 auto;
  color: var(--gray-medium);
  font-weight: 500;
}

.ticket-card {
  background-color: var(--white);
  border-radius: 2.5rem;
  border: 1px solid var(--gray-light);
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
  animation: slideUp 1s ease-out 0.2s both;
}

.ticket-grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .ticket-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.ticket-main {
  padding: 2rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  border-bottom: 1px dashed var(--gray-light);
}

@media (min-width: 768px) {
  .ticket-main {
    padding: 3rem;
    border-bottom: none;
    border-right: 1px dashed var(--gray-light);
  }
}

.movie-info-row {
  display: flex;
  gap: 1.5rem;
}

.poster-mini {
  width: 6rem;
  aspect-ratio: 2/3;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  flex-shrink: 0;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary-color);
  line-height: 1.2;
}

.movie-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.classification-badge {
  background-color: var(--accent-color);
  color: var(--white);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 10px;
  font-weight: 900;
}

.format-text {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--gray-medium);
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.detail-label {
  font-size: 10px;
  font-weight: 900;
  color: var(--gray-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}

.detail-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-accent {
  width: 1rem;
  height: 1rem;
  color: var(--accent-color);
}

.detail-value {
  font-weight: 700;
  color: var(--primary-color);
  font-size: 0.875rem;
}

.total-price {
  font-weight: 900;
  color: var(--accent-color);
  font-size: 1.125rem;
}

.deco-circle {
  display: none;
  position: absolute;
  width: 2rem;
  height: 2rem;
  background-color: var(--bg-main);
  border-radius: 50%;
  border: 1px solid var(--gray-light);
  right: -1rem;
}

@media (min-width: 768px) {
  .deco-circle {
    display: block;
  }
}

.deco-circle.top { top: -1rem; }
.deco-circle.bottom { bottom: -1rem; }

.ticket-qr-section {
  padding: 3rem;
  background-color: rgba(244, 244, 249, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.qr-container {
  padding: 1rem;
  background-color: var(--white);
  border-radius: 1.5rem;
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--gray-light);
}

.icon-qr {
  width: 8rem;
  height: 8rem;
  color: var(--primary-color);
}

.qr-instruction {
  font-size: 10px;
  font-weight: 900;
  color: var(--gray-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
  max-width: 12rem;
}

.qr-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  width: 3rem;
  height: 3rem;
  background-color: var(--white);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-color);
  border: 1px solid var(--gray-light);
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
}

.action-btn:hover {
  background-color: var(--gray-light);
}

.icon-mini {
  width: 1.25rem;
  height: 1.25rem;
}

.confirmation-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  animation: slideUp 1s ease-out 0.5s both;
}

@media (min-width: 640px) {
  .confirmation-actions {
    flex-direction: row;
    justify-content: center;
  }
}

.history-btn {
  width: 100%;
  background-color: var(--primary-color);
  color: var(--white);
  padding: 1.25rem 2.5rem;
  border-radius: 1rem;
  font-weight: 900;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px -5px rgba(13, 59, 102, 0.2);
  border: none;
  cursor: pointer;
}

@media (min-width: 640px) {
  .history-btn {
    width: auto;
  }
}

.history-btn:hover {
  background-color: rgba(13, 59, 102, 0.9);
  transform: scale(1.05);
}

.home-btn {
  width: 100%;
  background-color: var(--white);
  color: var(--primary-color);
  padding: 1.25rem 2.5rem;
  border-radius: 1rem;
  font-weight: 900;
  border: 2px solid var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-lg);
  cursor: pointer;
}

@media (min-width: 640px) {
  .home-btn {
    width: auto;
  }
}

.home-btn:hover {
  background-color: var(--gray-light);
  transform: scale(1.05);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(2rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
