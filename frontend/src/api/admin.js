import apiClient from './client';

export const getAdminStats = async () => {
  const res = await apiClient.get('/admin/stats');
  return res.data;
};

export const getAdminUsers = async () => {
  const res = await apiClient.get('/admin/users');
  return res.data;
};

export const createJob = async (jobData) => {
  const res = await apiClient.post('/admin/jobs', jobData);
  return res.data;
};

export const updateJob = async (jobId, jobData) => {
  const res = await apiClient.put(`/admin/jobs/${jobId}`, jobData);
  return res.data;
};

export const deleteJob = async (jobId) => {
  const res = await apiClient.delete(`/admin/jobs/${jobId}`);
  return res.data;
};
