// src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000', // FastAPI backend'in URL'si
});

export const registerUser = (data) => API.post('/register', data);
export const loginUser = (data) => API.post('/login', data);
export const getProjects = () => API.get('/projects');
export const submitProject = (data) => API.post('/projects', data);
export const approveProject = (projectId, instructorId) =>
  API.post(`/projects/${projectId}/approve?instructor_id=${instructorId}`);
export const getInstructors = () => API.get('/instructors');
export const validateChain = () => API.get('/chain/validate');
