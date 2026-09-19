import apiClient from './client';

export const getJobs = async (params = {}) => {
  const res = await apiClient.get('/jobs', { params });
  return res.data;
};

export const getJobDetail = async (jobId) => {
  const res = await apiClient.get(`/jobs/${jobId}`);
  return res.data;
};

export const getJobCategories = async () => {
  const res = await apiClient.get('/jobs/categories');
  return res.data;
};
