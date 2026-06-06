import axios from 'axios';

export const api = axios.create({
  // 🟢 Removed "_BASE" so it matches AWS Amplify perfectly
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// No auth token required — backend has no authentication layer.
// All requests go through as-is.

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API error]', err.config?.url, err.response?.data?.message ?? err.message);
    return Promise.reject(err);
  }
);
