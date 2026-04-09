import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Movie, Cinema, Show, Seat, Snack, Booking } from '../types';

export const useBookingStore = defineStore('booking', () => {
  const selectedMovie = ref<Movie | null>(null);
  const selectedCinema = ref<Cinema | null>(null);
  const selectedShowtime = ref<Show | null>(null);
  const selectedSeats = ref<Seat[]>([]);
  const selectedSnacks = ref<{ snack: Snack; quantity: number }[]>([]);
  const currentBooking = ref<Booking | null>(null);
  const bookingHistory = ref<Booking[]>([]);

  const totalAmount = computed(() => {
    const seatPrice = selectedShowtime.value?.price || 0;
    const seatsTotal = selectedSeats.value.length * seatPrice;
    const snacksTotal = selectedSnacks.value.reduce((total, item) => {
      return total + (item.snack.price * item.quantity);
    }, 0);
    return seatsTotal + snacksTotal;
  });

  function setMovie(movie: Movie | null) {
    selectedMovie.value = movie;
    // Clear subsequent selections when movie changes
    selectedCinema.value = null;
    selectedShowtime.value = null;
    selectedSeats.value = [];
    selectedSnacks.value = [];
  }

  function setCinema(cinema: Cinema | null) {
    selectedCinema.value = cinema;
  }

  function setShowtime(showtime: Show | null) {
    selectedShowtime.value = showtime;
  }

  function setSeats(seats: Seat[]) {
    selectedSeats.value = seats;
  }

  function setSnacks(snacks: { snack: Snack; quantity: number }[]) {
    selectedSnacks.value = snacks;
  }

  function completeBooking(booking: Booking) {
    currentBooking.value = booking;
    bookingHistory.value = [booking, ...bookingHistory.value];
    
    // Reset selection after booking
    selectedMovie.value = null;
    selectedCinema.value = null;
    selectedShowtime.value = null;
    selectedSeats.value = [];
    selectedSnacks.value = [];
  }

  function resetSelection() {
    selectedMovie.value = null;
    selectedCinema.value = null;
    selectedShowtime.value = null;
    selectedSeats.value = [];
    selectedSnacks.value = [];
    currentBooking.value = null;
  }

  return {
    selectedMovie,
    selectedCinema,
    selectedShowtime,
    selectedSeats,
    selectedSnacks,
    currentBooking,
    bookingHistory,
    totalAmount,
    setMovie,
    setCinema,
    setShowtime,
    setSeats,
    setSnacks,
    completeBooking,
    resetSelection
  };
});
