import axios, { AxiosResponse } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const ANALYTICS_URL = process.env.REACT_APP_ANALYTICS_URL || 'http://localhost:8000';

const analyticsApi = axios.create({
  baseURL: ANALYTICS_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to analytics requests
analyticsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface AnalyticsData {
  total_tasks: number;
  tasks_by_status: Record<string, number>;
  tasks_by_priority: Record<string, number>;
  completion_percentage: number;
}

export const authService = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  getCurrentUser: () => api.get('/auth/me'),
};

export const taskService = {
  getTasks: () => api.get('/tasks'),
  createTask: (title: string, description: string, priority: string, status: string, dueDate?: string) =>
    api.post('/tasks', { title, description, priority, status, dueDate }),
  getTask: (id: string) => api.get(`/tasks/${id}`),
  updateTask: (id: string, data: any) => api.put(`/tasks/${id}`, data),
  deleteTask: (id: string) => api.delete(`/tasks/${id}`),
};

export const analyticsService = {
  getAnalytics: (): Promise<AxiosResponse<AnalyticsData>> =>
    analyticsApi.get<AnalyticsData>('/analytics/tasks'),
};

export default api;
