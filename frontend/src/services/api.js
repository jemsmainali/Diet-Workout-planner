import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem('refresh_token');
        const res = await axios.post(`${BASE_URL}/token/refresh/`, { refresh });
        localStorage.setItem('access_token', res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/register/', data),
  login: (data) => api.post('/login/', data),
  logout: (refreshToken) => api.post('/logout/', { refresh: refreshToken }),
  getProfile: () => api.get('/profile/'),
  updateProfile: (data) => api.put('/profile/', data),
  calculateBMI: (data) => api.post('/bmi/', data),
};

export const workoutAPI = {
  getPlans: () => api.get('/workouts/'),
  createPlan: (data) => api.post('/workouts/create/', data),
  getPlan: (id) => api.get(`/workouts/${id}/`),
  updatePlan: (id, data) => api.put(`/workouts/${id}/`, data),
  deletePlan: (id) => api.delete(`/workouts/${id}/`),
  getExercises: (params) => api.get('/workouts/exercises/', { params }),
};

export const dietAPI = {
  getPlans: (params) => api.get('/diet/', { params }),
  addPlan: (data) => api.post('/diet/add/', data),
  getPlan: (id) => api.get(`/diet/${id}/`),
  deletePlan: (id) => api.delete(`/diet/${id}/`),
  getFoods: (params) => api.get('/diet/foods/', { params }),
  getDailySummary: (date) => api.get('/diet/summary/', { params: { date } }),
};

export const progressAPI = {
  getAll: () => api.get('/progress/'),
  add: (data) => api.post('/progress/add/', data),
  update: (id, data) => api.put(`/progress/${id}/`, data),
  delete: (id) => api.delete(`/progress/${id}/`),
  weeklyReport: () => api.get('/progress/weekly-report/'),
};

export const plansAPI = {
  generateWorkout: () => api.post('/plans/generate/workout/'),
  generateDiet: (date) => api.post('/plans/generate/diet/', { date }),
};

export default api;
