<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CreditCard, Smartphone, Wallet, ChevronRight, Info, User, Phone, Mail, ShieldCheck } from 'lucide-vue-next';
import { Booking } from '../types';
import { useBookingStore } from '../stores/booking';
import { useUserStore } from '../stores/user';

const router = useRouter();
const bookingStore = useBookingStore();
const userStore = useUserStore();

const movie = computed(() => bookingStore.selectedMovie);
const cinema = computed(() => bookingStore.selectedCinema);
const showtime = computed(() => bookingStore.selectedShowtime);
const seats = computed(() => bookingStore.selectedSeats);
const snacks = computed(() => bookingStore.selectedSnacks);
const userProfile = computed(() => userStore.user);

const paymentMethod = ref('vnpay');
const customerInfo = ref({ ...userStore.user });

const totalPrice = computed(() => bookingStore.totalAmount);

onMounted(() => {
  if (!movie.value || !cinema.value || !showtime.value || seats.value.length === 0) {
    router.push({ name: 'home' });
  }
});

const handleComplete = () => {
  if (!movie.value || !cinema.value || !showtime.value) return;
  
  const booking: Booking = {
    id: `BK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    user_id: 1, // Mock user ID
    show_id: Number(showtime.value.id),
    movie: movie.value,
    cinema: cinema.value,
    showtime: showtime.value,
    seats: seats.value,
    combos: snacks.value.map(s => ({ combo: s.snack, quantity: s.quantity })),
    total_amount: totalPrice.value,
    totalPrice: totalPrice.value,
    booking_code: `BK${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
    customerInfo: customerInfo.value,
    paymentMethod: paymentMethod.value,
    status: 'CONFIRMED',
    created_at: new Date().toISOString()
  };
  
  bookingStore.completeBooking(booking);
  router.push({ name: 'confirmation' });
};
</script>

<template>
  <div v-if="movie && cinema && showtime" class="container checkout-grid">
    <!-- Main Content -->
    <div class="checkout-main">
      <h1 class="checkout-title">THANH TOÁN</h1>

      <!-- Customer Info -->
      <section class="checkout-section">
        <h2 class="section-title">
          <User class="icon-accent" />
          THÔNG TIN KHÁCH HÀNG
        </h2>
        <div class="info-card">
          <div class="info-grid">
            <div class="input-group">
              <label class="input-label">Họ và tên</label>
              <div class="input-wrapper">
                <User class="input-icon" />
                <input 
                  v-model="customerInfo.name"
                  type="text" 
                  class="input-field"
                />
              </div>
            </div>
            <div class="input-group">
              <label class="input-label">Số điện thoại</label>
              <div class="input-wrapper">
                <Phone class="input-icon" />
                <input 
                  v-model="customerInfo.phone"
                  type="tel" 
                  class="input-field"
                />
              </div>
            </div>
          </div>
          <div class="input-group">
            <label class="input-label">Email</label>
            <div class="input-wrapper">
              <Mail class="input-icon" />
              <input 
                v-model="customerInfo.email"
                type="email" 
                class="input-field"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Payment Methods -->
      <section class="checkout-section">
        <h2 class="section-title">
          <CreditCard class="icon-accent" />
          PHƯƠNG THỨC THANH TOÁN
        </h2>
        <div class="payment-grid">
          <button 
            v-for="method in [
              { id: 'vnpay', name: 'VNPAY', icon: Smartphone, desc: 'Ví điện tử, Thẻ nội địa, QR' },
              { id: 'momo', name: 'MoMo', icon: Wallet, desc: 'Thanh toán qua ví MoMo' },
              { id: 'card', name: 'Thẻ Quốc Tế', icon: CreditCard, desc: 'Visa, Mastercard, JCB' },
              { id: 'shopeepay', name: 'ShopeePay', icon: Smartphone, desc: 'Thanh toán qua ShopeePay' }
            ]"
            :key="method.id"
            @click="paymentMethod = method.id"
            :class="['payment-btn', { active: paymentMethod === method.id }]"
          >
            <div :class="['method-icon-container', { active: paymentMethod === method.id }]">
              <component :is="method.icon" class="icon-method" />
            </div>
            <div class="method-info">
              <h3 class="method-name">{{ method.name }}</h3>
              <p class="method-desc">{{ method.desc }}</p>
            </div>
            <div v-if="paymentMethod === method.id" class="active-indicator">
              <div class="indicator-dot" />
            </div>
          </button>
        </div>
      </section>

      <div class="security-banner">
        <ShieldCheck class="icon-security" />
        <div class="security-text">
          <h4 class="security-title">Thanh toán an toàn</h4>
          <p class="security-desc">Thông tin thanh toán của bạn được mã hóa và bảo mật tuyệt đối theo tiêu chuẩn quốc tế PCI DSS.</p>
        </div>
      </div>
    </div>

    <!-- Order Summary Sidebar -->
    <div class="checkout-sidebar">
      <div class="summary-card">
        <h3 class="summary-title">TỔNG KẾT ĐƠN HÀNG</h3>
        
        <div class="summary-content">
          <div class="movie-mini-card">
            <div class="poster-mini">
              <img :src="movie.poster" class="poster-img" referrerPolicy="no-referrer" />
            </div>
            <div class="movie-mini-info">
              <h4 class="movie-mini-title">{{ movie.title }}</h4>
              <p class="movie-mini-meta">{{ showtime.format }} • {{ showtime.language }}</p>
              <span class="classification-badge">{{ movie.classification }}</span>
            </div>
          </div>

          <div class="details-list">
            <div class="detail-row">
              <span class="detail-label">Rạp:</span>
              <span class="detail-value">{{ cinema.name }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Suất chiếu:</span>
              <span class="detail-value">{{ showtime.time }} • {{ showtime.date }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Ghế:</span>
              <span class="detail-value">{{ seats.map(s => s.id).join(', ') }}</span>
            </div>
          </div>

          <div class="price-list">
            <div class="price-row">
              <span class="price-label">Giá vé:</span>
              <span class="price-value">{{ seats.reduce((sum, s) => sum + s.price, 0).toLocaleString() }}đ</span>
            </div>
            <div v-if="snacks.length > 0" class="price-row">
              <span class="price-label">Dịch vụ:</span>
              <span class="price-value">{{ snacks.reduce((sum, c) => sum + (c.snack.price * c.quantity), 0).toLocaleString() }}đ</span>
            </div>
            <div class="price-row">
              <span class="price-label">Phí giao dịch:</span>
              <span class="price-value">0đ</span>
            </div>
          </div>
        </div>

        <div class="summary-footer">
          <div class="total-row">
            <span class="total-label">Tổng cộng</span>
            <span class="total-value">{{ totalPrice.toLocaleString() }}đ</span>
          </div>
          <button 
            @click="handleComplete"
            class="confirm-btn"
          >
            XÁC NHẬN THANH TOÁN
            <ChevronRight class="icon-chevron" />
          </button>
          <div class="terms-info">
            <Info class="icon-info" />
            Bằng việc nhấn thanh toán, bạn đồng ý với điều khoản của chúng tôi
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkout-grid {
  padding-top: 3rem;
  padding-bottom: 3rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .checkout-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.checkout-main {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.checkout-title {
  font-size: 1.875rem;
  font-weight: 900;
  color: var(--primary-color);
}

.checkout-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-accent {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--accent-color);
}

.info-card {
  background-color: var(--white);
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid var(--gray-light);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-label {
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--gray-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--gray-medium);
  width: 1rem;
  height: 1rem;
}

.input-field {
  width: 100%;
  background-color: rgba(244, 244, 249, 0.5);
  border: 1px solid var(--gray-light);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem 0.75rem 3rem;
  font-weight: 700;
  outline: none;
  transition: all 0.2s ease;
}

.input-field:focus {
  box-shadow: 0 0 0 2px rgba(13, 59, 102, 0.1);
}

.payment-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .payment-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.payment-btn {
  padding: 1.5rem;
  background-color: var(--white);
  border-radius: 1.5rem;
  border: 2px solid var(--gray-light);
  transition: all 0.3s ease;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  text-align: left;
  position: relative;
  cursor: pointer;
}

.payment-btn.active {
  background-color: rgba(13, 59, 102, 0.05);
  border-color: var(--primary-color);
  box-shadow: 0 10px 20px -5px rgba(13, 59, 102, 0.05);
}

.payment-btn:hover:not(.active) {
  border-color: rgba(13, 59, 102, 0.2);
}

.method-icon-container {
  padding: 0.75rem;
  border-radius: 1rem;
  transition: all 0.2s ease;
}

.method-icon-container.active {
  background-color: var(--primary-color);
  color: var(--white);
}

.method-icon-container:not(.active) {
  background-color: var(--gray-light);
  color: var(--primary-color);
}

.icon-method {
  width: 1.5rem;
  height: 1.5rem;
}

.method-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.method-name {
  font-weight: 900;
  color: var(--primary-color);
}

.method-desc {
  font-size: 0.75rem;
  color: var(--gray-medium);
  font-weight: 700;
}

.active-indicator {
  margin-left: auto;
  width: 1.5rem;
  height: 1.5rem;
  background-color: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.indicator-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--white);
  border-radius: 50%;
}

.security-banner {
  background-color: rgba(13, 59, 102, 0.05);
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(13, 59, 102, 0.1);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.icon-security {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.security-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.security-title {
  font-weight: 900;
  color: var(--primary-color);
  font-size: 0.875rem;
}

.security-desc {
  font-size: 0.75rem;
  color: var(--gray-medium);
  font-weight: 700;
  line-height: 1.5;
}

.checkout-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.summary-card {
  background-color: var(--white);
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid var(--gray-light);
  box-shadow: var(--shadow-xl);
  position: sticky;
  top: 6rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--primary-color);
  border-bottom: 1px solid var(--gray-light);
  padding-bottom: 1rem;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.movie-mini-card {
  display: flex;
  gap: 1rem;
}

.poster-mini {
  width: 5rem;
  aspect-ratio: 2/3;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
}

.poster-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.movie-mini-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.movie-mini-title {
  font-weight: 900;
  color: var(--primary-color);
  line-height: 1.2;
}

.movie-mini-meta {
  font-size: 0.75rem;
  color: var(--gray-medium);
  font-weight: 700;
}

.classification-badge {
  background-color: var(--accent-color);
  color: var(--white);
  padding: 0.125rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 10px;
  font-weight: 900;
  width: fit-content;
  margin-top: 0.25rem;
}

.details-list, .price-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--gray-light);
}

.detail-row, .price-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 700;
}

.detail-label, .price-label {
  color: var(--gray-medium);
}

.detail-value, .price-value {
  color: var(--primary-color);
  text-align: right;
}

.summary-footer {
  border-top: 1px solid var(--gray-light);
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.total-label {
  font-size: 0.875rem;
  font-weight: 900;
  color: var(--gray-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.total-value {
  font-size: 1.875rem;
  font-weight: 900;
  color: var(--accent-color);
}

.confirm-btn {
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

.confirm-btn:hover {
  background-color: rgba(255, 51, 102, 0.9);
  transform: scale(1.05);
}

.confirm-btn:active {
  transform: scale(0.95);
}

.terms-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 10px;
  font-weight: 900;
  color: var(--gray-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

.icon-info {
  width: 0.75rem;
  height: 0.75rem;
}

.icon-chevron {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
