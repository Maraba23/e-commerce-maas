import axios from 'axios';

const DEBUG = true;

const axiosInstance = axios.create({
  baseURL: DEBUG ? 'http://localhost:8000/api/v1/' : '<API_URL>',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      window.location.href = "/unauthorized";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;