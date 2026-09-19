import apiClient from './client';

export const uploadResume = async (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await apiClient.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  });
  return res.data;
};

export const getResume = async (id) => {
  const res = await apiClient.get(`/resume/${id}`);
  return res.data;
};

export const getResumeHistory = async () => {
  const res = await apiClient.get('/resume/history');
  return res.data;
};

export const deleteResume = async (id) => {
  const res = await apiClient.delete(`/resume/${id}`);
  return res.data;
};
