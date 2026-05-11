import api from './api';

export const taskService = {
  getTasks: () => api.get('/tasks'),
  getTask: (id) => api.get(`/tasks/${id}`),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  getTasksByProject: (projectId) => api.get(`/tasks?projectId=${projectId}`),
  getTasksByUser: (userId) => api.get(`/tasks?assignedTo=${userId}`),
};