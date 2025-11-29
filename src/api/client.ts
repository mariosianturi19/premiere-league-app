import axios from 'axios';

// Menggunakan domain backend Next.js kamu
export const API_URL = 'https://premiere-league-api.vercel.app/api';

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});