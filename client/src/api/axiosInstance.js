import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1/`,
  withCredentials: true, // Enable sending cookies
});

export default axiosInstance;
