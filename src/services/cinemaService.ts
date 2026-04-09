import api from './api';
import { Cinema, Show, Snack, Screen, Seat } from '../types';

export const cinemaService = {
  async getCinemas(): Promise<Cinema[]> {
    try {
      const { data } = await api.get<Cinema[]>('/cinemas');
      return data;
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      return [];
    }
  },

  async getScreens(): Promise<Screen[]> {
    try {
      const { data } = await api.get<Screen[]>('/screens');
      return data;
    } catch (error) {
      console.error('Error fetching screens:', error);
      return [];
    }
  },

  async getShows(): Promise<Show[]> {
    try {
      const { data } = await api.get<Show[]>('/shows');
      return data;
    } catch (error) {
      console.error('Error fetching shows:', error);
      return [];
    }
  },

  async getSeatsByScreen(screenId: number): Promise<Seat[]> {
    try {
      const { data } = await api.get<Seat[]>('/seats');
      return data.filter(s => s.screen_id === screenId);
    } catch (error) {
      console.error('Error fetching seats:', error);
      return [];
    }
  },

  async getSnacks(): Promise<Snack[]> {
    try {
      const { data } = await api.get<Snack[]>('/snacks');
      return data;
    } catch (error) {
      console.error('Error fetching snacks:', error);
      return [];
    }
  }
};
