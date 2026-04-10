<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ChevronRight, ShoppingCart, Plus, Minus } from 'lucide-vue-next';
import { Movie, Cinema, Show, Seat, Snack } from '../types';
import { cinemaService } from '../services/cinemaService';
import { useBookingStore } from '../stores/booking';

const router = useRouter();
const bookingStore = useBookingStore();

const movie = computed(() => bookingStore.selectedMovie);
const cinema = computed(() => bookingStore.selectedCinema);
const showtime = computed(() => bookingStore.selectedShowtime);

const selectedSeats = ref<Seat[]>([]);
const selectedSnacks = ref<{ snack: Snack; quantity: number }[]>([]);
const snacks = ref<Snack[]>([]);
const loading = ref(true);

const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const getSeatType = (row: string): 'standard' | 'vip' | 'couch' => {
  if (row === 'J') return 'couch';
  if (['E', 'F', 'G', 'H'].includes(row)) return 'vip';
  return 'standard';
};

const getSeatPrice = (type: 'standard' | 'vip' | 'couch'): number => {
  if (type === 'couch') return 250000;
  if (type === 'vip') return 120000;
  return 95000;
};

const toggleSeat = (row: string, col: number) => {
  const seatId = `${row}${col}`;
  const index = selectedSeats.value.findIndex(s => s.id === seatId);
  
  if (index > -1) {
    selectedSeats.value.splice(index, 1);
  } else {
    if (selectedSeats.value.length >= 8) return;
    const type = getSeatType(row);
    selectedSeats.value.push({
      id: seatId,
      screen_id: showtime.value?.screen_id || 0,
      row,
      column: col,
      seat_number: seatId,
      seat_type: type.toUpperCase() as any,
      type,
      status: 'AVAILABLE',
      seat_status: 'selected',
      price: getSeatPrice(type),
      created_at: new Date().toISOString()
    });
  }
};

const updateSnack = (snack: Snack, delta: number) => {
  const index = selectedSnacks.value.findIndex(c => c.snack.id === snack.id);
  if (index > -1) {
    const newQty = selectedSnacks.value[index].quantity + delta;
    if (newQty <= 0) {
      selectedSnacks.value.splice(index, 1);
    } else {
      selectedSnacks.value[index].quantity = newQty;
    }
  } else if (delta > 0) {
    selectedSnacks.value.push({ snack, quantity: 1 });
  }
};

const totalPrice = computed(() => {
  const seatsTotal = selectedSeats.value.reduce((sum, s) => sum + s.price, 0);
  const snacksTotal = selectedSnacks.value.reduce((sum, c) => sum + (c.snack.price * c.quantity), 0);
  return seatsTotal + snacksTotal;
});

onMounted(async () => {
  if (!movie.value || !cinema.value || !showtime.value) {
    router.push({ name: 'home' });
    return;
  }
  
  loading.value = true;
  const snacksData = await cinemaService.getSnacks();
  snacks.value = snacksData;
  loading.value = false;
});

const confirmSeats = () => {
  bookingStore.setSeats(selectedSeats.value);
  bookingStore.setSnacks(selectedSnacks.value);
  router.push({ name: 'checkout' });
};
</script>

<template>
  <div v-if="movie && cinema && showtime" class="container seat-selection-grid">
    <!-- Seat Map Section -->
    <div class="seat-map-section">
      <div class="selection-header">
        <h1 class="selection-title">CHỌN GHẾ</h1>
        <div class="selection-meta">
          <span>{{ cinema.name }}</span>
          <span class="dot">•</span>
          <span>{{ showtime.time }}</span>
          <span class="dot">•</span>
          <span>{{ showtime.format }}</span>
        </div>
      </div>

      <!-- Screen -->
      <div class="screen-container">
        <div class="screen-curve" />
        <div class="screen-label">MÀN HÌNH</div>
      </div>

      <!-- Grid -->
      <div class="seat-grid-container">
        <div v-for="row in rows" :key="row" class="seat-row">
          <span class="row-label">{{ row }}</span>
          <div class="seat-row-inner">
            <button 
              v-for="col in cols" 
              :key="col"
              @click="toggleSeat(row, col)"
              :class="['seat-btn', getSeatType(row), { selected: selectedSeats.some(s => s.id === `${row}${col}`) }]"
            >
              {{ col }}
            </button>
          </div>
          <span class="row-label">{{ row }}</span>
        </div>
      </div>

      <!-- Legend -->
      <div class="legend-container">
        <div class="legend-item">
          <div class="legend-box standard" />
          <span class="legend-text">Thường</span>
        </div>
        <div class="legend-item">
          <div class="legend-box vip" />
          <span class="legend-text">VIP</span>
        </div>
        <div class="legend-item">
          <div class="legend-box couch" />
          <span class="legend-text">Couch</span>
        </div>
        <div class="legend-item">
          <div class="legend-box selected" />
          <span class="legend-text">Đang chọn</span>
        </div>
        <div class="legend-item disabled">
          <div class="legend-box booked" />
          <span class="legend-text">Đã đặt</span>
        </div>
      </div>

      <!-- Combos Section -->
      <div class="snacks-section">
        <h2 class="snacks-title">
          <ShoppingCart class="icon-accent" />
          DỊCH VỤ ĐI KÈM
        </h2>
        <div class="snacks-grid">
          <div v-for="snack in snacks" :key="snack.id" class="combo-card">
            <div class="combo-img-container">
              <img :src="snack.image" class="combo-img" referrerPolicy="no-referrer" />
            </div>
            <div class="combo-info">
              <h3 class="combo-name">{{ snack.name }}</h3>
              <p class="combo-desc">{{ snack.description }}</p>
              <p class="combo-price">{{ snack.price.toLocaleString() }}đ</p>
            </div>
            <div class="combo-counter">
              <button 
                @click="updateSnack(snack, -1)"
                class="counter-btn"
              >
                <Minus class="icon-mini" />
              </button>
              <span class="counter-val">
                {{ selectedSnacks.find(c => c.snack.id === snack.id)?.quantity || 0 }}
              </span>
              <button 
                @click="updateSnack(snack, 1)"
                class="counter-btn"
              >
                <Plus class="icon-mini" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Sidebar -->
    <div class="summary-sidebar">
      <div class="summary-card">
        <div class="summary-header">
          <h3 class="summary-title">TỔNG CỘNG</h3>
          <div class="movie-summary">
            <div class="movie-summary-top">
              <div class="movie-summary-text">
                <p class="movie-summary-name">{{ movie.title }}</p>
                <p class="movie-summary-meta">{{ showtime.format }} • {{ showtime.language }}</p>
              </div>
              <span class="classification-badge">{{ movie.classification }}</span>
            </div>
            <div class="movie-summary-details">
              <div class="summary-row">
                <span class="summary-label">Rạp:</span>
                <span class="summary-value">{{ cinema.name }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Suất chiếu:</span>
                <span class="summary-value">{{ showtime.time }} • {{ showtime.date }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="selection-summary">
          <div v-if="selectedSeats.length > 0" class="summary-group">
            <p class="group-label">Ghế đã chọn</p>
            <div class="selected-items">
              <span v-for="s in selectedSeats" :key="s.id" class="item-badge">
                {{ s.id }}
              </span>
            </div>
          </div>
          <div v-if="selectedSnacks.length > 0" class="summary-group">
            <p class="group-label">Dịch vụ</p>
            <div class="combo-summary-list">
              <div v-for="c in selectedSnacks" :key="c.snack.id" class="combo-summary-item">
                <span class="combo-summary-name">{{ c.snack.name }} x{{ c.quantity }}</span>
                <span class="combo-summary-price">{{ (c.snack.price * c.quantity).toLocaleString() }}đ</span>
              </div>
            </div>
          </div>
        </div>

        <div class="summary-footer">
          <div class="total-row">
            <span class="total-label">Thành tiền</span>
            <span class="total-value">{{ totalPrice.toLocaleString() }}đ</span>
          </div>
          <button 
            @click="confirmSeats"
            :disabled="selectedSeats.length === 0"
            class="confirm-btn"
          >
            TIẾP TỤC
            <ChevronRight class="icon-chevron" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.seat-selection-grid {
  padding-top: 3rem;
  padding-bottom: 3rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .seat-selection-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.seat-map-section {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.selection-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.selection-title {
  font-size: 1.875rem;
  font-weight: 900;
  color: var(--primary-color);
}

.selection-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--gray-medium);
}

.dot {
  opacity: 0.5;
}

.screen-container {
  position: relative;
  width: 100%;
  max-width: 40rem;
  margin: 0 auto;
  padding-top: 3rem;
  padding-bottom: 5rem;
}

.screen-curve {
  width: 100%;
  height: 0.5rem;
  background-color: var(--primary-color);
  border-radius: 9999px;
  box-shadow: 0 10px 30px rgba(13, 59, 102, 0.4);
}

.screen-label {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  font-weight: 900;
  color: rgba(13, 59, 102, 0.4);
  letter-spacing: 1em;
  text-transform: uppercase;
}

.seat-grid-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  overflow-x: auto;
  padding-bottom: 2rem;
  scrollbar-width: none;
}

.seat-grid-container::-webkit-scrollbar {
  display: none;
}

.seat-row {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.row-label {
  width: 1.5rem;
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--gray-medium);
  text-align: center;
}

.seat-row-inner {
  display: flex;
  gap: 0.5rem;
}

.seat-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 900;
  border: 2px solid transparent;
  cursor: pointer;
}

.seat-btn.standard {
  background-color: var(--gray-light);
  color: var(--gray-medium);
}

.seat-btn.vip {
  background-color: rgba(250, 204, 21, 0.2);
  border-color: rgba(250, 204, 21, 0.4);
  color: #a16207;
}

.seat-btn.couch {
  background-color: rgba(255, 51, 102, 0.2);
  border-color: rgba(255, 51, 102, 0.4);
  color: var(--accent-color);
}

.seat-btn:hover {
  transform: scale(1.1);
  border-color: rgba(13, 59, 102, 0.2);
}

.seat-btn.selected {
  background-color: var(--primary-color) !important;
  color: var(--white) !important;
  border-color: var(--primary-color) !important;
  box-shadow: var(--shadow-lg);
  transform: scale(1.1);
}

.legend-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  background-color: rgba(244, 244, 249, 0.3);
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid var(--gray-light);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-item.disabled {
  opacity: 0.4;
}

.legend-box {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
}

.legend-box.standard { background-color: var(--gray-light); }
.legend-box.vip { background-color: rgba(250, 204, 21, 0.2); border: 2px solid rgba(250, 204, 21, 0.4); }
.legend-box.couch { background-color: rgba(255, 51, 102, 0.2); border: 2px solid rgba(255, 51, 102, 0.4); }
.legend-box.selected { background-color: var(--primary-color); }
.legend-box.booked { background-color: var(--gray-medium); }

.legend-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gray-medium);
}

.snacks-section {
  padding-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.snacks-title {
  font-size: 1.5rem;
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

.snacks-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .snacks-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.combo-card {
  background-color: var(--white);
  padding: 1rem;
  border-radius: 1.5rem;
  border: 1px solid var(--gray-light);
  display: flex;
  gap: 1rem;
  align-items: center;
  transition: all 0.3s ease;
}

.combo-card:hover {
  border-color: rgba(13, 59, 102, 0.2);
}

.combo-img-container {
  width: 6rem;
  height: 6rem;
  background-color: var(--gray-light);
  border-radius: 1rem;
  overflow: hidden;
  flex-shrink: 0;
}

.combo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.combo-card:hover .combo-img {
  transform: scale(1.1);
}

.combo-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.combo-name {
  font-weight: 700;
  color: var(--primary-color);
}

.combo-desc {
  font-size: 0.75rem;
  color: var(--gray-medium);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.combo-price {
  font-weight: 900;
  color: var(--accent-color);
}

.combo-counter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--gray-light);
  border-radius: 0.75rem;
  padding: 0.25rem;
}

.counter-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--white);
  border-radius: 0.5rem;
  transition: color 0.2s ease;
  cursor: pointer;
  border: none;
}

.counter-btn:hover {
  color: var(--primary-color);
}

.icon-mini {
  width: 1rem;
  height: 1rem;
}

.counter-val {
  width: 1rem;
  text-align: center;
  font-weight: 900;
  font-size: 0.875rem;
}

.summary-sidebar {
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
  margin-bottom: 1rem;
}

.movie-summary-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.movie-summary-name {
  font-weight: 900;
  font-size: 1.125rem;
  line-height: 1.2;
}

.movie-summary-meta {
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
}

.movie-summary-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 700;
}

.summary-label {
  color: var(--gray-medium);
}

.summary-value {
  color: var(--primary-color);
}

.summary-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.group-label {
  font-size: 0.75rem;
  font-weight: 900;
  color: var(--gray-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.item-badge {
  background-color: rgba(13, 59, 102, 0.1);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 900;
  border: 1px solid rgba(13, 59, 102, 0.2);
}

.combo-summary-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.combo-summary-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  font-weight: 700;
}

.combo-summary-name {
  color: var(--gray-medium);
}

.combo-summary-price {
  color: var(--primary-color);
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

.confirm-btn:hover:not(:disabled) {
  background-color: rgba(255, 51, 102, 0.9);
  transform: scale(1.05);
}

.confirm-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.confirm-btn:disabled {
  background-color: var(--gray-medium);
  cursor: not-allowed;
  box-shadow: none;
}

.icon-chevron {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
