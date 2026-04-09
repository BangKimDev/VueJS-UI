<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ChevronLeft, MapPin, Clock, Ticket, Star, QrCode, Download, Mail, Share2, Info, User, Phone, CreditCard } from 'lucide-vue-next';
import { useBookingStore } from '../stores/booking';

const route = useRoute();
const router = useRouter();
const bookingStore = useBookingStore();

const booking = computed(() => {
  const id = route.params.id as string;
  return bookingStore.bookingHistory.find(b => b.id === id);
});

onMounted(() => {
  if (!booking.value) {
    router.push({ name: 'account' });
  }
});

const goBack = () => {
  router.push({ name: 'account' });
};
</script>

<template>
  <div v-if="booking" class="container booking-detail-screen">
    <!-- Header -->
    <div class="detail-header">
      <button 
        @click="goBack"
        class="back-link"
      >
        <ChevronLeft class="icon-back" />
        QUAY LẠI
      </button>
      <h1 class="detail-title">CHI TIẾT VÉ</h1>
      <div class="header-spacer" />
    </div>

    <div class="detail-grid">
      <!-- Ticket Details -->
      <div class="detail-main">
        <div class="ticket-info-card">
          <div class="ticket-info-inner">
            <!-- Movie Header -->
            <div class="movie-header-row">
              <div class="poster-container">
                <img :src="booking.movie.poster" class="poster-img" referrerPolicy="no-referrer" />
              </div>
              <div class="movie-header-text">
                <div class="badge-row">
                  <span class="classification-badge">{{ booking.movie.classification }}</span>
                  <span class="status-badge">Đã thanh toán</span>
                </div>
                <h2 class="movie-title">{{ booking.movie.title }}</h2>
                <div class="movie-meta-row">
                  <div class="meta-item">
                    <Star class="icon-star" />
                    <span class="meta-value">{{ booking.movie.rating }}</span>
                  </div>
                  <div class="meta-item">
                    <Clock class="icon-mini" />
                    <span>{{ booking.movie.duration }} phút</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Booking Info Grid -->
            <div class="info-grid">
              <div class="info-item">
                <p class="info-label">Rạp chiếu</p>
                <div class="info-content">
                  <div class="icon-box">
                    <MapPin class="icon-accent" />
                  </div>
                  <div class="info-text">
                    <p class="info-value">{{ booking.cinema.name }}</p>
                    <p class="info-desc">{{ booking.cinema.address }}</p>
                  </div>
                </div>
              </div>
              <div class="info-item">
                <p class="info-label">Suất chiếu</p>
                <div class="info-content">
                  <div class="icon-box">
                    <Clock class="icon-accent" />
                  </div>
                  <div class="info-text">
                    <p class="info-value">{{ booking.showtime.time }} • {{ booking.showtime.date }}</p>
                    <p class="info-desc">{{ booking.showtime.format }} • {{ booking.showtime.language }}</p>
                  </div>
                </div>
              </div>
              <div class="info-item">
                <p class="info-label">Số ghế</p>
                <div class="info-content">
                  <div class="icon-box">
                    <Ticket class="icon-accent" />
                  </div>
                  <div class="info-text">
                    <p class="info-value">{{ booking.seats.map(s => s.id).join(', ') }}</p>
                    <p class="info-desc">{{ booking.seats.length }} ghế • {{ booking.seats[0].seat_type }}</p>
                  </div>
                </div>
              </div>
              <div class="info-item">
                <p class="info-label">Phương thức thanh toán</p>
                <div class="info-content">
                  <div class="icon-box">
                    <CreditCard class="icon-accent" />
                  </div>
                  <div class="info-text">
                    <p class="info-value uppercase">{{ booking.paymentMethod }}</p>
                    <p class="info-desc">Giao dịch thành công</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Breakdown -->
            <div class="price-breakdown">
              <h3 class="breakdown-title">Chi tiết giá</h3>
              <div class="breakdown-list">
                <div class="breakdown-item">
                  <span class="breakdown-label">Giá vé ({{ booking.seats.length }} ghế)</span>
                  <span class="breakdown-value">{{ booking.seats.reduce((sum, s) => sum + s.price, 0).toLocaleString() }}đ</span>
                </div>
                <div v-if="booking.combos.length > 0" class="breakdown-item">
                  <span class="breakdown-label">Dịch vụ ({{ booking.combos.length }} món)</span>
                  <span class="breakdown-value">{{ booking.combos.reduce((sum, c) => sum + (c.combo.price * c.quantity), 0).toLocaleString() }}đ</span>
                </div>
                <div class="breakdown-total">
                  <span class="total-label">Tổng cộng</span>
                  <span class="total-value">{{ booking.totalPrice.toLocaleString() }}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="instruction-card">
          <div class="instruction-icon-box">
            <Info class="icon-primary" />
          </div>
          <div class="instruction-text">
            <h4 class="instruction-title">Hướng dẫn nhận vé</h4>
            <p class="instruction-desc">Vui lòng xuất trình mã QR hoặc mã đơn hàng <span class="primary-bold">{{ booking.id }}</span> tại quầy vé hoặc máy in vé tự động để nhận vé giấy trước giờ chiếu 15 phút.</p>
          </div>
        </div>
      </div>

      <!-- QR & Actions Sidebar -->
      <div class="detail-sidebar">
        <div class="qr-card">
          <div class="qr-image-container">
            <QrCode class="icon-qr-lg" />
          </div>
          <div class="qr-text">
            <p class="qr-label">Mã vé của bạn</p>
            <p class="qr-id">{{ booking.id }}</p>
          </div>
          
          <div class="sidebar-actions">
            <button class="download-btn">
              <Download class="icon-mini" />
              TẢI VÉ VỀ MÁY
            </button>
            <div class="action-row">
              <button class="secondary-action-btn">
                <Mail class="icon-mini" />
                GỬI EMAIL
              </button>
              <button class="secondary-action-btn">
                <Share2 class="icon-mini" />
                CHIA SẺ
              </button>
            </div>
          </div>

          <div class="customer-info-section">
            <div class="customer-item">
              <div class="customer-icon-box">
                <User class="icon-mini" />
              </div>
              <div class="customer-text">
                <p class="customer-label">Khách hàng</p>
                <p class="customer-value">{{ booking.customerInfo.name }}</p>
              </div>
            </div>
            <div class="customer-item">
              <div class="customer-icon-box">
                <Phone class="icon-mini" />
              </div>
              <div class="customer-text">
                <p class="customer-label">Số điện thoại</p>
                <p class="customer-value">{{ booking.customerInfo.phone }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.booking-detail-screen {
  padding-top: 3rem;
  padding-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--primary-color);
  font-weight: 900;
  transition: gap 0.2s ease;
  background: none;
  border: none;
  cursor: pointer;
}

.back-link:hover {
  gap: 0.75rem;
}

.icon-back {
  width: 1.5rem;
  height: 1.5rem;
}

.detail-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary-color);
}

.header-spacer {
  width: 6rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .detail-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.ticket-info-card {
  background-color: var(--white);
  border-radius: 2.5rem;
  border: 1px solid var(--gray-light);
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
}

.ticket-info-inner {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

@media (min-width: 768px) {
  .ticket-info-inner {
    padding: 3rem;
  }
}

.movie-header-row {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: flex-start;
}

@media (min-width: 768px) {
  .movie-header-row {
    flex-direction: row;
    align-items: center;
  }
}

.poster-container {
  width: 8rem;
  aspect-ratio: 2/3;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--shadow-xl);
  flex-shrink: 0;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-header-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.badge-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.classification-badge {
  background-color: var(--accent-color);
  color: var(--white);
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 900;
}

.status-badge {
  background-color: rgba(13, 59, 102, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.movie-title {
  font-size: 1.75rem;
  font-weight: 900;
  color: var(--primary-color);
  line-height: 1.2;
}

@media (min-width: 768px) {
  .movie-title {
    font-size: 2rem;
  }
}

.movie-meta-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--gray-medium);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.icon-star {
  width: 1rem;
  height: 1rem;
  color: #fbbf24;
  fill: #fbbf24;
}

.meta-value {
  color: var(--primary-color);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding-top: 3rem;
  border-top: 1px dashed var(--gray-light);
}

@media (min-width: 640px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 10px;
  font-weight: 900;
  color: var(--gray-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.info-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.icon-box {
  width: 2.5rem;
  height: 2.5rem;
  background-color: rgba(13, 59, 102, 0.05);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-accent {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--accent-color);
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.info-value {
  font-weight: 900;
  color: var(--primary-color);
}

.info-desc {
  font-size: 0.75rem;
  color: var(--gray-medium);
  font-weight: 700;
  line-height: 1.4;
}

.price-breakdown {
  padding-top: 3rem;
  border-top: 1px dashed var(--gray-light);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.breakdown-title {
  font-size: 0.875rem;
  font-weight: 900;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.breakdown-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 700;
}

.breakdown-label {
  color: var(--gray-medium);
}

.breakdown-value {
  color: var(--primary-color);
}

.breakdown-total {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-light);
  font-size: 1.125rem;
  font-weight: 900;
}

.total-label {
  color: var(--primary-color);
}

.total-value {
  color: var(--accent-color);
}

.instruction-card {
  background-color: rgba(13, 59, 102, 0.05);
  padding: 2rem;
  border-radius: 2.5rem;
  border: 1px solid rgba(13, 59, 102, 0.1);
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.instruction-icon-box {
  width: 3rem;
  height: 3rem;
  background-color: var(--white);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-xl);
}

.icon-primary {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary-color);
}

.instruction-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.instruction-title {
  font-weight: 900;
  color: var(--primary-color);
}

.instruction-desc {
  font-size: 0.875rem;
  color: var(--gray-medium);
  font-weight: 700;
  line-height: 1.6;
}

.primary-bold {
  color: var(--primary-color);
  font-weight: 900;
}

.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.qr-card {
  background-color: var(--white);
  padding: 3rem;
  border-radius: 2.5rem;
  border: 1px solid var(--gray-light);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  position: sticky;
  top: 6rem;
}

.qr-image-container {
  padding: 1.5rem;
  background-color: var(--white);
  border-radius: 2.5rem;
  box-shadow: var(--shadow-2xl);
  border: 1px solid var(--gray-light);
  transition: transform 0.5s ease;
}

.qr-image-container:hover {
  transform: scale(1.05);
}

.icon-qr-lg {
  width: 12rem;
  height: 12rem;
  color: var(--primary-color);
}

.qr-text {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.qr-label {
  font-size: 10px;
  font-weight: 900;
  color: var(--gray-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.qr-id {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary-color);
  letter-spacing: 0.1em;
}

.sidebar-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.download-btn {
  width: 100%;
  background-color: var(--accent-color);
  color: var(--white);
  padding: 1rem;
  border-radius: 1rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px -5px rgba(255, 51, 102, 0.2);
  border: none;
  cursor: pointer;
}

.download-btn:hover {
  transform: scale(1.05);
}

.action-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.secondary-action-btn {
  background-color: var(--white);
  color: var(--primary-color);
  border: 2px solid var(--gray-light);
  padding: 1rem;
  border-radius: 1rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  cursor: pointer;
}

.secondary-action-btn:hover {
  background-color: var(--gray-light);
  transform: scale(1.05);
}

.customer-info-section {
  width: 100%;
  padding-top: 2rem;
  border-top: 1px solid var(--gray-light);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.customer-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.customer-icon-box {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--gray-light);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.customer-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.customer-label {
  font-size: 10px;
  font-weight: 900;
  color: var(--gray-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.customer-value {
  font-size: 0.875rem;
  font-weight: 900;
  color: var(--primary-color);
}

.icon-mini {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
