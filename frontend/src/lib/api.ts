import axios from 'axios';
import type { Candidate, CandidatesResponse, StatsResponse, AuthResponse, User } from '../types';

// ── Axios instance ────────────────────────────────────────────
const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('rf_token');
      localStorage.removeItem('rf_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  getMe: () =>
    api.get<{ success: boolean; user: User }>('/auth/me').then((r) => r.data),

  updateMe: (data: Partial<Pick<User, 'name' | 'avatar'>>) =>
    api.patch<{ success: boolean; user: User }>('/auth/me', data).then((r) => r.data),
};

// ── Candidates ────────────────────────────────────────────────
export const candidatesApi = {
  getAll: (params?: {
    status?: string;
    skill?: string;
    minScore?: number;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get<CandidatesResponse>('/candidates', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<{ success: boolean; candidate: Candidate }>(`/candidates/${id}`).then((r) => r.data),

  create: (formData: FormData) =>
    api
      .post<{ success: boolean; candidate: Candidate }>('/candidates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  update: (id: string, data: Partial<Candidate>) =>
    api
      .patch<{ success: boolean; candidate: Candidate }>(`/candidates/${id}`, data)
      .then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    api
      .patch<{ success: boolean; candidate: Candidate }>(`/candidates/${id}`, { status })
      .then((r) => r.data),

  delete: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/candidates/${id}`).then((r) => r.data),

  getStats: () => api.get<StatsResponse>('/candidates/stats').then((r) => r.data),

  reScreen: (id: string) =>
    api
      .post<{ success: boolean; candidate: Candidate }>(`/candidates/${id}/rescreen`)
      .then((r) => r.data),
};

export default api;
