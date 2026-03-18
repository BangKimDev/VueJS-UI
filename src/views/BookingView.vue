<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { mockApi } from '../services/api'

const route = useRoute()
const movie = ref(null)
const currentStep = ref(1)

// Step 1 State
const showtimes = ref([])
const loadingShowtimes = ref(true)
const selectedDate = ref('2026-03-20')
const selectedShowtime = ref(null)

// Step 2 State
const seats = ref([])
const loadingSeats = ref(false)
const selectedSeats = ref([])

// Generate some mock dates based on current day
const dates = [
  { val: '2026-03-20', month: 'Mar', day: '20' },
  { val: '2026-03-21', month: 'Mar', day: '21' },
  { val: '2026-03-22', month: 'Mar', day: '22' },
  { val: '2026-03-23', month: 'Mar', day: '23' },
  { val: '2026-03-24', month: 'Mar', day: '24' },
]

onMounted(async () => {
  try {
    movie.value = await mockApi.getMovieById(route.params.id)
    loadShowtimes()
  } catch (e) {
    console.error(e)
  }
})

watch(selectedDate, () => {
  selectedShowtime.value = null
  loadShowtimes()
})

async function loadShowtimes() {
  loadingShowtimes.value = true
  showtimes.value = []
  try {
    showtimes.value = await mockApi.getShowtimes(movie.value.id)
  } catch(e) {}
  loadingShowtimes.value = false
}

const groupedShowtimes = computed(() => {
  return showtimes.value.reduce((acc, curr) => {
    if (!acc[curr.theater]) acc[curr.theater] = []
    acc[curr.theater].push(curr)
    return acc
  }, {})
})

function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

// Seat logic
async function loadSeats() {
  loadingSeats.value = true
  seats.value = []
  try {
    seats.value = await mockApi.getSeatMap(selectedShowtime.value.id)
  } catch (e) {}
  loadingSeats.value = false
}

const groupedSeats = computed(() => {
  return seats.value.reduce((acc, seat) => {
    const lastRow = acc[acc.length - 1];
    if (!lastRow || lastRow[0].row !== seat.row) {
      acc.push([seat]);
    } else {
      lastRow.push(seat);
    }
    return acc;
  }, [])
})

function isSeatSelected(seat) {
  return selectedSeats.value.some(s => s.id === seat.id)
}

function toggleSeat(seat) {
  if (seat.isBooked) return;
  const index = selectedSeats.value.findIndex(s => s.id === seat.id)
  if (index >= 0) {
    selectedSeats.value.splice(index, 1)
  } else {
    // Limit to 8 seats max
    if (selectedSeats.value.length < 8) {
      selectedSeats.value.push(seat)
    }
  }
}

const totalPrice = computed(() => {
  if (!selectedShowtime.value) return 0
  const basePrice = selectedShowtime.value.price
  return selectedSeats.value.reduce((total, seat) => {
    return total + (basePrice * seat.priceMod)
  }, 0)
})

function goToStep2() {
  if (selectedShowtime.value) {
    currentStep.value = 2;
    // reset seats if different showtime
    selectedSeats.value = [];
    loadSeats();
  }
}

function goToStep3() {
  if (selectedSeats.value.length > 0) {
    currentStep.value = 3;
  }
}

const bookingInProgress = ref(false)
import { useRouter } from 'vue-router'
const router = useRouter()

async function confirmBooking() {
  bookingInProgress.value = true;
  // Simulate API call for booking confirmation
  await new Promise(resolve => setTimeout(resolve, 1500));
  bookingInProgress.value = false;
  
  // Show success and redirect (In a real app, go to a success page)
  alert('Booking Confirmed Successfully!');
  router.push('/');
}
</script>

<template>
  <div class="booking-page container" v-if="movie">
    
    <!-- Steps Header -->
    <div class="booking-header">
      <div class="movie-mini-info">
        <img :src="movie.poster" class="mini-poster" />
        <div>
          <h1 class="movie-title">{{ movie.title }}</h1>
          <p class="movie-meta">{{ movie.genre }} | {{ movie.duration }}</p>
        </div>
      </div>
      
      <div class="steps-indicator">
        <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
          <span class="step-num">1</span>
          <span class="step-label">Showtime</span>
        </div>
        <div class="step-line"></div>
        <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
          <span class="step-num">2</span>
          <span class="step-label">Seats</span>
        </div>
        <div class="step-line"></div>
        <div class="step" :class="{ active: currentStep === 3 }">
          <span class="step-num">3</span>
          <span class="step-label">Payment</span>
        </div>
      </div>
    </div>

    <!-- Step 1: Showtime Selection -->
    <div class="step-content glass-panel" v-if="currentStep === 1">
      <h2>Select Date & Showtime</h2>
      
      <div class="date-selector">
        <button 
          v-for="date in dates" 
          :key="date.val"
          class="date-btn"
          :class="{ active: selectedDate === date.val }"
          @click="selectedDate = date.val"
        >
          <span class="month">{{ date.month }}</span>
          <span class="day">{{ date.day }}</span>
        </button>
      </div>

      <div class="theaters-list" v-if="showtimes.length">
        <div class="theater-card" v-for="(group, theaterName) in groupedShowtimes" :key="theaterName">
          <h3 class="theater-name">{{ theaterName }}</h3>
          <div class="times-grid">
            <button 
              v-for="st in group" 
              :key="st.id" 
              class="time-btn"
              :class="{ selected: selectedShowtime?.id === st.id }"
              @click="selectedShowtime = st"
            >
              {{ formatTime(st.dateTime) }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="loading-state" v-else-if="loadingShowtimes">
        <div class="spinner"></div>
      </div>
      
      <div class="step-actions">
        <button class="btn-ghost" @click="$router.push(`/movie/${movie.id}`)">Cancel</button>
        <button class="btn-primary" :disabled="!selectedShowtime" @click="goToStep2">Continue</button>
      </div>
    </div>

    <!-- Step 2: Seat Selection -->
    <div class="step-content glass-panel" v-if="currentStep === 2">
      <div class="step-header">
        <h2>Select Seats</h2>
        <div class="time-callout">
          <span>{{ selectedShowtime?.theater }}</span>
          <span class="dot">•</span>
          <span>{{ formatTime(selectedShowtime?.dateTime) }}</span>
        </div>
      </div>
      
      <div class="screen-container">
        <div class="screen"></div>
        <div class="screen-label">Screen</div>
      </div>

      <div class="loading-state" v-if="loadingSeats">
        <div class="spinner"></div>
      </div>
      
      <div class="seat-map" v-else>
        <!-- Render seats row by row -->
        <div class="seat-row" v-for="(rowSeats, rowIndex) in groupedSeats" :key="rowIndex">
          <div class="row-label">{{ rowSeats[0].row }}</div>
          <div class="row-seats">
            <button 
              v-for="seat in rowSeats" 
              :key="seat.id"
              class="seat"
              :class="[
                seat.type.toLowerCase(),
                { booked: seat.isBooked, selected: isSeatSelected(seat) }
              ]"
              :disabled="seat.isBooked"
              @click="toggleSeat(seat)"
              :title="seat.isBooked ? 'Booked' : `${seat.type} Seat - ${formatCurrency(selectedShowtime.price * seat.priceMod)}`"
            >
              {{ seat.id }}
            </button>
          </div>
          <div class="row-label right">{{ rowSeats[0].row }}</div>
        </div>
      </div>

      <div class="legend">
        <div class="legend-item"><span class="seat-color standard"></span> Standard</div>
        <div class="legend-item"><span class="seat-color vip"></span> VIP</div>
        <div class="legend-item"><span class="seat-color couple"></span> Couple</div>
        <div class="legend-item"><span class="seat-color booked"></span> Booked</div>
        <div class="legend-item"><span class="seat-color selected"></span> Selected</div>
      </div>

      <div class="step-actions split">
        <div class="selection-summary" v-if="selectedSeats.length">
          <p class="selection-count">{{ selectedSeats.length }} Tickets</p>
          <p class="selection-total">{{ formatCurrency(totalPrice) }}</p>
        </div>
        <div class="action-buttons">
          <button class="btn-ghost" @click="currentStep = 1">Back</button>
          <button class="btn-primary" :disabled="selectedSeats.length === 0" @click="goToStep3">Continue to Payment</button>
        </div>
      </div>
    </div>

    <!-- Step 3: Checkout -->
    <div class="step-content glass-panel" v-if="currentStep === 3">
      <h2>Checkout & Confirmation</h2>
      
      <div class="checkout-grid">
        <div class="ticket-summary">
          <h3>Booking Summary</h3>
          <div class="summary-details">
            <div class="movie-info-summary">
              <img :src="movie.poster" class="summary-poster">
              <div>
                <h4>{{ movie.title }}</h4>
                <p class="summary-meta">{{ movie.genre }} | {{ movie.duration }}</p>
                <p class="summary-rating">★ {{ movie.rating }}</p>
              </div>
            </div>
            
            <hr class="divider">
            
            <div class="summary-row">
              <span class="label">Date & Time</span>
              <span class="value">{{ selectedDate }} - {{ formatTime(selectedShowtime.dateTime) }}</span>
            </div>
            <div class="summary-row">
              <span class="label">Theater</span>
              <span class="value">{{ selectedShowtime.theater }}</span>
            </div>
            <div class="summary-row">
              <span class="label">Seats ({{ selectedSeats.length }})</span>
              <span class="value seats-list">{{ selectedSeats.map(s => s.id).join(', ') }}</span>
            </div>
            
            <hr class="divider">
            
            <div class="summary-row total">
              <span class="label">Total Amount</span>
              <span class="value">{{ formatCurrency(totalPrice) }}</span>
            </div>
          </div>
        </div>

        <div class="payment-methods">
          <h3>Payment Method</h3>
          
          <div class="method-options">
            <label class="method-label">
              <input type="radio" name="payment" value="credit" checked>
              <div class="method-card">
                <span class="method-icon">💳</span>
                <span>Credit / Debit Card</span>
              </div>
            </label>
            <label class="method-label">
              <input type="radio" name="payment" value="ewallet">
              <div class="method-card">
                <span class="method-icon">📱</span>
                <span>E-Wallet (Momo, ZaloPay)</span>
              </div>
            </label>
            <label class="method-label">
              <input type="radio" name="payment" value="bank">
              <div class="method-card">
                <span class="method-icon">🏦</span>
                <span>Bank Transfer</span>
              </div>
            </label>
          </div>

          <div class="booking-notice">
            <p>By clicking "Confirm Booking", you agree to our Terms and Conditions.</p>
          </div>
        </div>
      </div>

       <div class="step-actions split">
        <button class="btn-ghost" @click="currentStep = 2" :disabled="bookingInProgress">Back to Seats</button>
        <button class="btn-primary large" @click="confirmBooking" :disabled="bookingInProgress">
          <span v-if="bookingInProgress" class="btn-spinner"></span>
          <span v-else>Confirm Booking</span>
        </button>
      </div>
    </div>

  </div>
  <div v-else class="loading-state">
    <div class="spinner"></div>
  </div>
</template>

<style scoped>
.booking-page {
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 2rem;
}

.movie-mini-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mini-poster {
  width: 60px;
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.movie-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.movie-meta {
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* Steps Indicator */
.steps-indicator {
  display: flex;
  align-items: center;
  background: var(--bg-card);
  padding: 1rem 2rem;
  border-radius: 100px;
  border: 1px solid var(--border-color);
}

.step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.5;
  transition: opacity var(--transition-fast);
}

.step.active, .step.completed {
  opacity: 1;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: bold;
}

.step.active .step-num {
  background: var(--primary);
  color: white;
}

.step.completed .step-num {
  background: var(--seat-selected);
  color: white;
}

.step-label {
  font-weight: 600;
  font-size: 0.95rem;
}

.step-line {
  width: 40px;
  height: 2px;
  background: var(--border-color);
  margin: 0 1rem;
}

.step-content {
  padding: 2.5rem;
  min-height: 400px;
  animation: fadeIn var(--transition-normal);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-content h2 {
  margin-bottom: 2rem;
  font-size: 1.75rem;
}

/* Date Selector */
.date-selector {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.date-selector::-webkit-scrollbar {
  height: 4px;
}
.date-selector::-webkit-scrollbar-track {
  background: var(--bg-dark); 
}
.date-selector::-webkit-scrollbar-thumb {
  background: var(--border-color); 
  border-radius: 4px;
}

.date-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 90px;
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-main);
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.date-btn:hover {
  background: rgba(255,255,255,0.1);
}

.date-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 63, 94, 0.3);
}

.date-btn .month {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.25rem;
  opacity: 0.8;
}

.date-btn .day {
  font-size: 1.5rem;
  font-weight: 700;
}

/* Theaters List */
.theater-card {
  margin-bottom: 2rem;
  background: rgba(0,0,0,0.2);
  padding: 1.5rem;
  border-radius: var(--radius-md);
}

.theater-name {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #e2e8f0;
}

.times-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.time-btn {
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 1.1rem;
  transition: all var(--transition-fast);
}

.time-btn:hover {
  background: rgba(255,255,255,0.1);
  border-color: var(--text-muted);
}

.time-btn.selected {
  background: var(--seat-selected);
  border-color: var(--seat-selected);
  color: white;
}

/* Actions */
.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.btn-primary:disabled {
  background: var(--border-color);
  color: var(--text-muted);
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

/* Step 2: Seats Map */
.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.time-callout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.05);
  padding: 0.5rem 1rem;
  border-radius: 100px;
  font-weight: 500;
}

.dot { font-size: 0.8rem; opacity: 0.5; }

.screen-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
}

.screen {
  width: 80%;
  height: 60px;
  background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
  border-top: 2px solid rgba(255,255,255,0.3);
  border-radius: 50% / 10px 10px 0 0;
  box-shadow: 0 -15px 40px -10px rgba(255, 255, 255, 0.1);
}

.screen-label {
  margin-top: 0.5rem;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 4px;
  color: var(--text-muted);
}

.seat-map {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 3rem;
  overflow-x: auto;
  padding: 1rem 0;
}

.seat-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.row-label {
  width: 20px;
  text-align: center;
  font-weight: bold;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.row-seats {
  display: flex;
  gap: 0.5rem;
}

.seat {
  width: 35px;
  height: 35px;
  border-radius: 8px 8px 4px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  transition: all var(--transition-fast);
  color: transparent; /* hide id */
  border: 1px solid rgba(255,255,255,0.1);
}

.seat:hover:not(:disabled) {
  color: white;
  transform: scale(1.1);
  box-shadow: 0 0 10px currentcolor;
}

.seat.selected {
  color: white;
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.4);
}

/* Seat Types Colors */
.seat.standard { 
  background-color: var(--seat-standard); 
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
}
.seat.vip { 
  background-color: var(--seat-vip); 
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
}
.seat.couple { 
  width: 78px; /* 2 seats wide + gap */
  background-color: var(--seat-couple); 
  background-image: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
}
.seat.booked { background-color: var(--seat-booked); opacity: 0.5; cursor: not-allowed; }
.seat.selected { background-color: var(--seat-selected); }

.legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(0,0,0,0.2);
  border-radius: var(--radius-md);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.seat-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}
.seat-color.standard { background-color: var(--seat-standard); }
.seat-color.vip { background-color: var(--seat-vip); }
.seat-color.couple { background-color: var(--seat-couple); }
.seat-color.booked { background-color: var(--seat-booked); }
.seat-color.selected { background-color: var(--seat-selected); }

.step-actions.split {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selection-summary {
  display: flex;
  flex-direction: column;
}

.selection-count {
  font-size: 0.9rem;
  color: var(--text-muted);
}

.selection-total {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--seat-selected);
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

/* Step 3: Checkout */
.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2rem;
}

.ticket-summary {
  background: rgba(0,0,0,0.2);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.ticket-summary h3, .payment-methods h3 {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.movie-info-summary {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.summary-poster {
  width: 80px;
  border-radius: var(--radius-sm);
  box-shadow: 0 4px 6px rgba(0,0,0,0.3);
}

.summary-meta {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin-top: 0.25rem;
  margin-bottom: 0.5rem;
}

.summary-rating {
  color: #fbbf24;
  font-size: 0.9rem;
  font-weight: 600;
}

.divider {
  border: none;
  border-top: 1px dashed var(--border-color);
  margin: 1.5rem 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.summary-row .label {
  color: var(--text-muted);
}

.summary-row .value {
  font-weight: 600;
  text-align: right;
}

.seats-list {
  max-width: 60%;
  color: var(--seat-selected);
}

.summary-row.total {
  font-size: 1.25rem;
}

.summary-row.total .value {
  color: var(--primary);
  font-size: 1.5rem;
}

/* Payment Methods */
.method-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.method-label {
  cursor: pointer;
}

.method-label input {
  display: none;
}

.method-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: rgba(255,255,255,0.02);
  transition: all var(--transition-fast);
}

.method-label input:checked + .method-card {
  border-color: var(--primary);
  background: rgba(244, 63, 94, 0.1);
}

.method-icon {
  font-size: 1.5rem;
}

.booking-notice {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: center;
  margin-top: 2rem;
}

.btn-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s infinite linear;
}

@media (max-width: 900px) {
  .checkout-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .steps-indicator {
    width: 100%;
    justify-content: space-between;
    padding: 1rem;
  }
  .step-line {
    width: auto;
    flex: 1;
    margin: 0 0.5rem;
  }
  .step-content {
    padding: 1.5rem;
  }
}
</style>
