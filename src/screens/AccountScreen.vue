<script setup lang="ts">
import { useRouter } from 'vue-router';
import { User, Settings, LogOut, Ticket, ChevronRight, MapPin, Clock, Star, Edit3, ShieldCheck, Mail, Phone } from 'lucide-vue-next';
import { useBookingStore } from '../stores/booking';
import { useUserStore } from '../stores/user';
import { Booking } from '../types';

const router = useRouter();
const bookingStore = useBookingStore();
const userStore = useUserStore();

const user = userStore.user;
const bookingHistory = bookingStore.bookingHistory;

const navigateToEditProfile = () => {
  router.push({ name: 'edit-profile' });
};

const navigateToBookingDetail = (booking: Booking) => {
  router.push({ name: 'booking-detail', params: { id: booking.id } });
};

const goToHome = () => {
  router.push({ name: 'home' });
};
</script>

<template>
  <div class="container account-screen">
    <!-- Profile Header -->
    <section class="profile-header">
      <div class="header-bg-deco top-right" />
      <div class="header-bg-deco bottom-left" />
      
      <div class="profile-content">
        <div class="avatar-container">
          <div class="avatar-inner">
            <User class="icon-avatar" />
          </div>
        </div>
        <div class="profile-info">
          <div class="profile-text">
            <h1 class="user-name">{{ user.name }}</h1>
            <p class="user-rank">Thành viên hạng Vàng</p>
          </div>
          <div class="contact-badges">
            <div class="contact-badge">
              <Mail class="icon-accent" />
              {{ user.email }}
            </div>
            <div class="contact-badge">
              <Phone class="icon-accent" />
              {{ user.phone }}
            </div>
          </div>
        </div>
        <div class="profile-actions">
          <button 
            @click="navigateToEditProfile"
            class="edit-btn"
          >
            <Edit3 class="icon-mini" />
            SỬA HỒ SƠ
          </button>
          <button class="settings-btn">
            <Settings class="icon-method" />
          </button>
        </div>
      </div>
    </section>

    <div class="account-grid">
      <!-- Sidebar Info -->
      <div class="account-sidebar">
        <div class="sidebar-card">
          <h3 class="sidebar-title">
            <ShieldCheck class="icon-accent" />
            TÀI KHOẢN
          </h3>
          <div class="sidebar-menu">
            <div class="menu-item">
              <div class="menu-item-left">
                <div class="menu-icon-container">
                  <Star class="icon-mini" />
                </div>
                <div class="menu-text">
                  <p class="menu-label">Điểm tích lũy</p>
                  <p class="menu-value">1,250 điểm</p>
                </div>
              </div>
              <ChevronRight class="icon-chevron" />
            </div>
            <div class="menu-item">
              <div class="menu-item-left">
                <div class="menu-icon-container">
                  <Ticket class="icon-mini" />
                </div>
                <div class="menu-text">
                  <p class="menu-label">Voucher của tôi</p>
                  <p class="menu-value">3 mã chưa dùng</p>
                </div>
              </div>
              <ChevronRight class="icon-chevron" />
            </div>
          </div>
          <button class="logout-btn">
            <LogOut class="icon-mini" />
            ĐĂNG XUẤT
          </button>
        </div>

        <div class="promo-card">
          <h4 class="promo-title">Ưu đãi đặc biệt</h4>
          <p class="promo-desc">Nâng cấp lên hạng Kim Cương để nhận ngay 1 bắp + 1 nước miễn phí mỗi tháng.</p>
          <button class="promo-btn">NÂNG CẤP NGAY</button>
        </div>
      </div>

      <!-- Booking History -->
      <div class="history-section">
        <div class="history-header">
          <h2 class="history-title">
            <Ticket class="icon-accent-lg" />
            LỊCH SỬ ĐẶT VÉ
          </h2>
          <div class="history-filters">
            <button class="filter-btn active">Tất cả</button>
            <button class="filter-btn">Sắp tới</button>
          </div>
        </div>

        <div v-if="bookingHistory.length > 0" class="history-list">
          <div 
            v-for="booking in bookingHistory" 
            :key="booking.id"
            @click="navigateToBookingDetail(booking)"
            class="booking-card"
          >
            <div class="booking-card-inner">
              <div class="booking-poster-container">
                <img :src="booking.movie.poster" class="booking-poster" referrerPolicy="no-referrer" />
              </div>
              <div class="booking-info">
                <div class="booking-top">
                  <div class="booking-movie-text">
                    <h3 class="booking-movie-title">{{ booking.movie.title }}</h3>
                    <p class="booking-movie-meta">{{ booking.showtime.format }} • {{ booking.showtime.language }}</p>
                  </div>
                  <span class="status-badge">Đã thanh toán</span>
                </div>
                <div class="booking-details">
                  <div class="booking-detail-item">
                    <MapPin class="icon-accent" />
                    {{ booking.cinema.name }}
                  </div>
                  <div class="booking-detail-item">
                    <Clock class="icon-accent" />
                    {{ booking.showtime.time }} • {{ booking.showtime.date }}
                  </div>
                </div>
                <div class="booking-footer">
                  <div class="booking-id-group">
                    <p class="id-label">Mã đơn hàng</p>
                    <p class="id-value">{{ booking.id }}</p>
                  </div>
                  <button class="detail-link">
                    Chi tiết <ChevronRight class="icon-mini" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empty-history">
          <div class="empty-icon-container">
            <Ticket class="icon-empty" />
          </div>
          <h3 class="empty-title">Chưa có lịch sử đặt vé</h3>
          <p class="empty-desc">Hãy bắt đầu hành trình điện ảnh của bạn ngay hôm nay!</p>
          <button 
            @click="goToHome"
            class="book-now-btn"
          >
            ĐẶT VÉ NGAY
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-screen {
  padding-top: 3rem;
  padding-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.profile-header {
  position: relative;
  background-color: var(--primary-color);
  border-radius: 2.5rem;
  padding: 2rem;
  overflow: hidden;
  box-shadow: 0 20px 40px -10px rgba(13, 59, 102, 0.2);
}

@media (min-width: 768px) {
  .profile-header {
    padding: 3rem;
  }
}

.header-bg-deco {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
}

.header-bg-deco.top-right {
  top: 0;
  right: 0;
  width: 16rem;
  height: 16rem;
  background-color: rgba(255, 51, 102, 0.2);
  transform: translate(50%, -50%);
}

.header-bg-deco.bottom-left {
  bottom: 0;
  left: 0;
  width: 12rem;
  height: 12rem;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translate(-50%, 50%);
}

.profile-content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 768px) {
  .profile-content {
    flex-direction: row;
    align-items: flex-end;
  }
}

.avatar-container {
  width: 8rem;
  height: 8rem;
  background-color: var(--white);
  border-radius: 2.5rem;
  padding: 0.5rem;
  box-shadow: var(--shadow-2xl);
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .avatar-container {
    width: 10rem;
    height: 10rem;
  }
}

.avatar-inner {
  width: 100%;
  height: 100%;
  background-color: var(--gray-light);
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.icon-avatar {
  width: 4rem;
  height: 4rem;
  color: var(--primary-color);
}

.profile-info {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .profile-info {
    text-align: left;
    padding-bottom: 1rem;
  }
}

.user-name {
  font-size: 2rem;
  color: var(--white);
  font-weight: 900;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .user-name {
    font-size: 3rem;
  }
}

.user-rank {
  color: rgba(255, 255, 255, 0.6);
  font-weight: 700;
  font-size: 1.125rem;
}

.contact-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

@media (min-width: 768px) {
  .contact-badges {
    justify-content: flex-start;
  }
}

.contact-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  color: var(--white);
  font-size: 0.875rem;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.profile-actions {
  display: flex;
  gap: 1rem;
  padding-bottom: 1rem;
}

.edit-btn {
  background-color: var(--white);
  color: var(--primary-color);
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-xl);
  border: none;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: var(--gray-light);
  transform: scale(1.05);
}

.settings-btn {
  padding: 0.75rem;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  color: var(--white);
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}

.settings-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.account-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .account-grid {
    grid-template-columns: 1fr 2fr;
  }
}

.sidebar-card {
  background-color: var(--white);
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid var(--gray-light);
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: rgba(244, 244, 249, 0.5);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(13, 59, 102, 0.05);
}

.menu-item-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.menu-icon-container {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--white);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.menu-item:hover .menu-icon-container {
  background-color: var(--primary-color);
  color: var(--white);
}

.menu-label {
  font-size: 0.875rem;
  font-weight: 900;
  color: var(--primary-color);
}

.menu-value {
  font-size: 0.75rem;
  color: var(--gray-medium);
  font-weight: 700;
}

.icon-chevron {
  width: 1rem;
  height: 1rem;
  color: var(--gray-medium);
  transition: color 0.2s ease;
}

.menu-item:hover .icon-chevron {
  color: var(--primary-color);
}

.logout-btn {
  width: 100%;
  padding: 1rem;
  color: #ef4444;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 1rem;
  transition: background-color 0.2s ease;
  border: none;
  background: none;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #fef2f2;
}

.promo-card {
  background-color: var(--accent-color);
  color: var(--white);
  padding: 2rem;
  border-radius: 1.5rem;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 20px 40px -10px rgba(255, 51, 102, 0.3);
}

.promo-title {
  font-size: 1.125rem;
  font-weight: 900;
}

.promo-desc {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  font-weight: 500;
}

.promo-btn {
  background-color: var(--white);
  color: var(--accent-color);
  padding: 0.5rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 900;
  font-size: 0.875rem;
  width: fit-content;
  transition: transform 0.2s ease;
  border: none;
  cursor: pointer;
}

.promo-btn:hover {
  transform: scale(1.05);
}

.history-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-title {
  font-size: 1.5rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon-accent-lg {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--accent-color);
}

.history-filters {
  display: flex;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 900;
  transition: all 0.2s ease;
  cursor: pointer;
}

.filter-btn.active {
  background-color: var(--primary-color);
  color: var(--white);
  box-shadow: 0 10px 20px -5px rgba(13, 59, 102, 0.2);
  border: none;
}

.filter-btn:not(.active) {
  background-color: var(--white);
  color: var(--gray-medium);
  border: 1px solid var(--gray-light);
}

.filter-btn:not(.active):hover {
  color: var(--primary-color);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.booking-card {
  background-color: var(--white);
  border-radius: 1.5rem;
  border: 1px solid var(--gray-light);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s ease;
}

.booking-card:hover {
  box-shadow: var(--shadow-xl);
  border-color: rgba(13, 59, 102, 0.2);
}

.booking-card-inner {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .booking-card-inner {
    flex-direction: row;
  }
}

.booking-poster-container {
  width: 100%;
  aspect-ratio: 2/3;
  overflow: hidden;
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .booking-poster-container {
    width: 12rem;
    aspect-ratio: auto;
  }
}

.booking-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.booking-card:hover .booking-poster {
  transform: scale(1.1);
}

.booking-info {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .booking-info {
    padding: 2rem;
  }
}

.booking-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.booking-movie-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--primary-color);
  transition: color 0.2s ease;
}

.booking-card:hover .booking-movie-title {
  color: var(--accent-color);
}

.booking-movie-meta {
  font-size: 0.75rem;
  color: var(--gray-medium);
  font-weight: 700;
}

.status-badge {
  background-color: #f0fdf4;
  color: #16a34a;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.booking-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.booking-detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--gray-medium);
}

.booking-footer {
  padding-top: 1.5rem;
  border-top: 1px solid var(--gray-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.id-label {
  font-size: 10px;
  font-weight: 900;
  color: var(--gray-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.id-value {
  font-weight: 900;
  color: var(--primary-color);
}

.detail-link {
  color: var(--primary-color);
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: gap 0.2s ease;
  border: none;
  background: none;
  cursor: pointer;
}

.booking-card:hover .detail-link {
  gap: 0.5rem;
}

.empty-history {
  text-align: center;
  padding: 5rem 0;
  background-color: rgba(244, 244, 249, 0.3);
  border-radius: 2.5rem;
  border: 2px dashed var(--gray-light);
}

.empty-icon-container {
  width: 5rem;
  height: 5rem;
  background-color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: var(--shadow-xl);
}

.icon-empty {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--gray-medium);
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--primary-color);
}

.empty-desc {
  color: var(--gray-medium);
  margin-top: 0.5rem;
  font-weight: 500;
}

.book-now-btn {
  margin-top: 2rem;
  background-color: var(--accent-color);
  color: var(--white);
  padding: 0.75rem 2rem;
  border-radius: 1rem;
  font-weight: 900;
  transition: transform 0.2s ease;
  box-shadow: 0 10px 20px -5px rgba(255, 51, 102, 0.2);
  border: none;
  cursor: pointer;
}

.book-now-btn:hover {
  transform: scale(1.05);
}
</style>
