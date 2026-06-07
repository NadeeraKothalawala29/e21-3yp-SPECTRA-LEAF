import axios from 'axios';

export const api = axios.create({
  // Removed "_BASE" so it matches AWS Amplify perfectly if needed, but keeping fallback chaining from upstream
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API error]', err.config?.url, err.response?.data?.message ?? err.message);
    return Promise.reject(err);
  }
);
