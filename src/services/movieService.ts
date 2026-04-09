import api from './api';
import { Movie } from '../types';

export const movieService = {
  async getNowShowing(): Promise<Movie[]> {
    try {
      const { data } = await api.get<Movie[]>('/movies');
      return data.filter(m => m.status === 'now-showing');
    } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
    }
  },

  async getComingSoon(): Promise<Movie[]> {
    try {
      const { data } = await api.get<Movie[]>('/movies');
      return data.filter(m => m.status === 'coming-soon');
    } catch (error) {
      console.error('Error fetching coming soon movies:', error);
      return [];
    }
  },

  async getMovieById(id: string | number): Promise<Movie | null> {
    try {
      const { data } = await api.get<Movie[]>('/movies');
      const movie = data.find(m => m.id.toString() === id.toString());
      return movie || null;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  }
};
