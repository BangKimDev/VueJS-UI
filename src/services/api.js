const MOCK_MOVIES = [
  {
    id: 1,
    title: 'Dune: Part Two',
    genre: 'Sci-Fi, Adventure',
    duration: '166 min',
    rating: '8.8/10',
    poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGqqUT1e.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vtec0oUuIv5v.jpg',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson'],
    featured: true
  },
  {
    id: 2,
    title: 'Kung Fu Panda 4',
    genre: 'Animation, Action',
    duration: '94 min',
    rating: '7.4/10',
    poster: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/mDeUmPe4MF35WWlAqj4QFX5UauJ.jpg',
    synopsis: 'Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior.',
    cast: ['Jack Black', 'Awkwafina', 'Viola Davis'],
    featured: false
  },
  {
    id: 3,
    title: 'Godzilla x Kong: The New Empire',
    genre: 'Action, Sci-Fi',
    duration: '115 min',
    rating: '6.5/10',
    poster: 'https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLvLuPEH53BRgeU.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/q8rwFm80o2K0vH6aB6OOhQjHqU9.jpg',
    synopsis: 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island\'s mysteries.',
    cast: ['Rebecca Hall', 'Brian Tyree Henry', 'Dan Stevens'],
    featured: true
  }
];

const MOCK_SHOWTIMES = [
  { id: 101, dateTime: '2026-03-20T10:00:00', theater: 'Galaxy Cinema VIP 1', price: 150000 },
  { id: 102, dateTime: '2026-03-20T14:30:00', theater: 'Galaxy Cinema Room 2', price: 90000 },
  { id: 103, dateTime: '2026-03-20T19:00:00', theater: 'Galaxy Cinema Room 3', price: 110000 }
];

export const mockApi = {
  getMovies() {
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_MOVIES), 800)
    })
  },
  
  getMovieById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const movie = MOCK_MOVIES.find(m => m.id === parseInt(id))
        if (movie) resolve(movie)
        else reject(new Error('Movie not found'))
      }, 500)
    })
  },

  getShowtimes(movieId) {
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_SHOWTIMES), 500)
    })
  },

  getSeatMap(showtimeId) {
    // Generate a 10x10 mock seat map
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    rows.forEach(row => {
      for (let i = 1; i <= 10; i++) {
        // Randomly set some seats as booked
        const isBooked = Math.random() > 0.8;
        const type = rows.indexOf(row) < 3 ? 'VIP' : (rows.indexOf(row) > 7 ? 'COUPLE' : 'STANDARD');
        let priceMod = type === 'VIP' ? 1.5 : (type === 'COUPLE' ? 2 : 1);
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          type,
          isBooked,
          priceMod
        });
      }
    });
    return new Promise(resolve => setTimeout(() => resolve(seats), 600));
  }
}
