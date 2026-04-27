import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const getStudyLogs = (date) =>
  api.get('/study-logs', { params: { date } }).then(r => r.data);

export const upsertStudyLog = (data) =>
  api.post('/study-logs', data).then(r => r.data);

export const getWeeklyLogs = (weekStart) =>
  api.get('/study-logs/weekly', { params: { weekStart } }).then(r => r.data);

export const getRangeLogs = (start, end) =>
  api.get('/study-logs/range', { params: { start, end } }).then(r => r.data);

export const getSessions = (date) =>
  api.get('/sessions', { params: { date } }).then(r => r.data);

export const addSession = (data) =>
  api.post('/sessions', data).then(r => r.data);

export const deleteSession = (id) =>
  api.delete(`/sessions/${id}`).then(r => r.data);

export const getMood = (date) =>
  api.get('/mood', { params: { date } }).then(r => r.data);

export const setMood = (data) =>
  api.post('/mood', data).then(r => r.data);

export const getStats = () =>
  api.get('/stats').then(r => r.data);

export const getMonthlyStats = (month) =>
  api.get('/stats/monthly', { params: { month } }).then(r => r.data);
