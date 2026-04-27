import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
});

export const saveProfile = async ({ token, role, ...profile }) => {
  return api.post(
    '/api/profile',
    { role, ...profile },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export default api;