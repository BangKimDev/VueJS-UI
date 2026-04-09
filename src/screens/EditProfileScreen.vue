<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { User, Mail, Phone, ChevronLeft, Save, ShieldCheck, Camera, Plus, Calendar } from 'lucide-vue-next';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();

const formData = ref({ ...userStore.user });

const handleSave = () => {
  userStore.updateProfile(formData.value);
  router.push({ name: 'account' });
};

const goBack = () => {
  router.push({ name: 'account' });
};
</script>

<template>
  <div class="container edit-profile-screen">
    <!-- Header -->
    <div class="edit-header">
      <button 
        @click="goBack"
        class="back-link"
      >
        <ChevronLeft class="icon-back" />
        QUAY LẠI
      </button>
      <h1 class="edit-title">CHỈNH SỬA HỒ SƠ</h1>
      <div class="header-spacer" />
    </div>

    <!-- Profile Picture -->
    <div class="profile-pic-section">
      <div class="pic-container group">
        <div class="pic-card">
          <div class="pic-inner">
            <User class="icon-user-lg" />
          </div>
        </div>
        <div class="pic-overlay">
          <Camera class="icon-white" />
        </div>
        <div class="pic-plus">
          <Plus class="icon-mini" />
        </div>
      </div>
      <p class="pic-instruction">Nhấn để thay đổi ảnh đại diện</p>
    </div>

    <!-- Form -->
    <div class="edit-form-card">
      <div class="form-groups">
        <div class="form-group">
          <label class="form-label">Họ và tên</label>
          <div class="input-wrapper">
            <User class="input-icon" />
            <input 
              v-model="formData.name"
              type="text" 
              class="form-input"
              placeholder="Nhập họ và tên"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-wrapper">
              <Mail class="input-icon" />
              <input 
                v-model="formData.email"
                type="email" 
                class="form-input"
                placeholder="Nhập email"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Số điện thoại</label>
            <div class="input-wrapper">
              <Phone class="input-icon" />
              <input 
                v-model="formData.phone"
                type="tel" 
                class="form-input"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Ngày sinh</label>
          <div class="input-wrapper">
            <Calendar class="input-icon" />
            <input 
              type="date" 
              class="form-input"
              value="1995-01-01"
            />
          </div>
        </div>
      </div>

      <div class="security-info">
        <ShieldCheck class="icon-primary" />
        <div class="security-text">
          <h4 class="security-title">Bảo mật thông tin</h4>
          <p class="security-desc">Thông tin cá nhân của bạn được bảo mật và chỉ sử dụng cho mục đích xác thực vé và nhận ưu đãi.</p>
        </div>
      </div>

      <div class="form-actions">
        <button 
          @click="handleSave"
          class="save-btn"
        >
          <Save class="icon-save" />
          LƯU THAY ĐỔI
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-profile-screen {
  max-width: 48rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.edit-header {
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

.edit-title {
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--primary-color);
}

.header-spacer {
  width: 6rem;
}

.profile-pic-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.pic-container {
  position: relative;
  cursor: pointer;
}

.pic-card {
  width: 8rem;
  height: 8rem;
  background-color: var(--white);
  border-radius: 2.5rem;
  padding: 0.5rem;
  box-shadow: var(--shadow-2xl);
}

@media (min-width: 768px) {
  .pic-card {
    width: 10rem;
    height: 10rem;
  }
}

.pic-inner {
  width: 100%;
  height: 100%;
  background-color: var(--gray-light);
  border-radius: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.icon-user-lg {
  width: 4rem;
  height: 4rem;
  color: var(--primary-color);
}

.pic-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 2.5rem;
  opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.pic-container:hover .pic-overlay {
  opacity: 1;
}

.icon-white {
  width: 2rem;
  height: 2rem;
  color: var(--white);
}

.pic-plus {
  position: absolute;
  bottom: -0.5rem;
  right: -0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--accent-color);
  color: var(--white);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-xl);
  border: 4px solid var(--white);
}

.icon-mini {
  width: 1.25rem;
  height: 1.25rem;
}

.pic-instruction {
  font-size: 10px;
  font-weight: 900;
  color: var(--gray-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.edit-form-card {
  background-color: var(--white);
  padding: 2rem;
  border-radius: 2.5rem;
  border: 1px solid var(--gray-light);
  box-shadow: var(--shadow-2xl);
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 768px) {
  .edit-form-card {
    padding: 3rem;
  }
}

.form-groups {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 10px;
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
  width: 1.25rem;
  height: 1.25rem;
}

.form-input {
  width: 100%;
  background-color: rgba(244, 244, 249, 0.5);
  border: 1px solid var(--gray-light);
  border-radius: 1rem;
  padding: 1rem 1rem 1rem 3rem;
  font-weight: 700;
  color: var(--primary-color);
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(13, 59, 102, 0.05);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .form-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

.security-info {
  background-color: rgba(13, 59, 102, 0.05);
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(13, 59, 102, 0.1);
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.icon-primary {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--primary-color);
  flex-shrink: 0;
}

.security-title {
  font-size: 0.875rem;
  font-weight: 900;
  color: var(--primary-color);
  margin-bottom: 0.25rem;
}

.security-desc {
  font-size: 0.75rem;
  color: var(--gray-medium);
  font-weight: 700;
  line-height: 1.5;
}

.form-actions {
  padding-top: 1rem;
}

.save-btn {
  width: 100%;
  background-color: var(--accent-color);
  color: var(--white);
  padding: 1.25rem;
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

.save-btn:hover {
  background-color: rgba(255, 51, 102, 0.9);
  transform: scale(1.02);
}

.icon-save {
  width: 1.5rem;
  height: 1.5rem;
}
</style>
