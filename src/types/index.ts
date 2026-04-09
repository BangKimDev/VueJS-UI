export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  password_hash: string;
  role: 'CUSTOMER' | 'ADMIN';
  created_at: string;
  updated_at?: string;
}

export interface Movie {
  id: string | number;
  title: string;
  duration_min: number; // Schema
  duration: number; // Compatibility
  genre: string | string[]; // Schema is string, UI uses array
  language: string;
  rating: string; // Schema: varchar(10), maps to G, PG, T13, T18
  classification: string; // Compatibility
  description: string;
  release_date: string;
  poster_url: string; // Schema
  poster: string; // Compatibility
  backdrop_url?: string; // Extension
  backdrop?: string; // Compatibility
  trailer_url: string; // Schema
  trailerUrl?: string; // Compatibility
  status: 'now-showing' | 'coming-soon';
  director?: string; // Extension
  cast?: string[]; // Extension
  created_at: string;
}

export interface Cinema {
  id: string | number;
  name: string;
  city: string;
  address: string;
  phone_number: string;
  logo_url: string;
  number_of_screens: number;
  distance?: string; // Extension for UI
  created_at: string;
}

export interface Screen {
  id: number;
  name: string;
  cinema_id: number;
  max_capacity: number;
  seat_layout_json: string;
  created_at: string;
}

export interface Show {
  id: number | string;
  movie_id: number;
  screen_id: number;
  start_time: string;
  end_time?: string;
  language: string;
  format: '2D' | '3D' | 'IMAX' | 'Dolby';
  price_per_seat: number; // Schema
  price: number; // Compatibility
  created_at: string;
  // Compatibility fields for UI filtering
  cinemaId?: string | number;
  movieId?: string | number;
  time?: string;
  date?: string;
}

export interface Seat {
  id: number | string;
  screen_id: number;
  row: string | number;
  column: number;
  seat_number: string;
  seat_type: 'STANDARD' | 'VIP' | 'COUPLE' | 'DISABLED'; // Schema
  type: 'standard' | 'vip' | 'couch'; // Compatibility
  status: 'AVAILABLE' | 'RESERVED' | 'BOOKED' | 'HOLD'; // Schema
  seat_status: 'available' | 'selected' | 'occupied' | 'unavailable'; // Compatibility
  price: number;
  created_at: string;
  // For UI pattern matching
  col?: number; 
}

export interface Snack {
  id: number | string;
  name: string;
  description: string;
  category: 'SNACK' | 'DRINK' | 'COMBO';
  price: number;
  image_url: string;
  image: string; // Compatibility
  created_at: string;
}

export type Combo = Snack; // Compatibility alias

export interface Booking {
  id: number | string;
  user_id: number;
  show_id: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  total_amount: number;
  booking_code: string;
  created_at: string;
  updated_at?: string;
  // UI extensions (required for frontend display)
  movie: Movie;
  cinema: Cinema;
  showtime: Show;
  seats: Seat[];
  combos: { combo: Snack; quantity: number }[];
  totalPrice: number;
  customerInfo: {
    name: string;
    phone: string;
    email: string;
  };
  paymentMethod: string;
}

export interface BookingSeat {
  id: number;
  booking_id: number;
  seat_id: number;
  status: 'SELECTED' | 'RESERVED' | 'BOOKED';
  price: number;
  created_at: string;
}

export interface BookingSnack {
  id: number;
  booking_id: number;
  snack_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  payment_method: 'CARD' | 'VNPAY' | 'MOMO' | 'ZALOPAY' | 'CASH';
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  transaction_id?: string;
  created_at: string;
}

export interface Promotion {
  id: number;
  code: string;
  discount_value: number;
  discount_type: 'PERCENT' | 'AMOUNT';
  max_discount?: number;
  min_order_value?: number;
  valid_from?: string;
  valid_to?: string;
  usage_limit?: number;
  used_count: number;
  created_at: string;
}
