import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions for each entity
export const parentsApi = {
  getAll: () => api.get('/parents'),
  getById: (id: string) => api.get(`/parents/${id}`),
  create: (data: any) => api.post('/parents', data),
  update: (id: string, data: any) => api.put(`/parents/${id}`, data),
  delete: (id: string) => api.delete(`/parents/${id}`),
};

export const studentsApi = {
  getAll: () => api.get('/students'),
  getById: (id: string) => api.get(`/students/${id}`),
  create: (data: any) => api.post('/students', data),
  update: (id: string, data: any) => api.put(`/students/${id}`, data),
  delete: (id: string) => api.delete(`/students/${id}`),
};

export const classesApi = {
  getAll: (day?: string) => api.get('/classes', { params: day ? { day } : {} }),
  getById: (id: string) => api.get(`/classes/${id}`),
  create: (data: any) => api.post('/classes', data),
  update: (id: string, data: any) => api.put(`/classes/${id}`, data),
  delete: (id: string) => api.delete(`/classes/${id}`),
  register: (classId: string, studentId: string) => 
    api.post(`/classes/${classId}/register`, { student_id: studentId }),
  getWeeklySchedule: () => api.get('/classes/schedule/week'),
  
  // New: Get class with registered students
  getClassWithStudents: (id: string) => api.get(`/classes/${id}`)
};

export const subscriptionsApi = {
  getAll: (params?: { student_id?: string; status?: string }) => 
    api.get('/subscriptions', { params }),
  getById: (id: string) => api.get(`/subscriptions/${id}`),
  create: (data: any) => api.post('/subscriptions', data),
  update: (id: string, data: any) => api.put(`/subscriptions/${id}`, data),
  delete: (id: string) => api.delete(`/subscriptions/${id}`),
  useSession: (id: string) => api.patch(`/subscriptions/${id}/use`),
  getStatus: (id: string) => api.get(`/subscriptions/${id}/status`),
};

export default api; 