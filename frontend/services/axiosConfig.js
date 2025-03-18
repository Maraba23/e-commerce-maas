import axios from 'axios';

const DEBUG = false;

const axiosInstance = axios.create({
  baseURL: DEBUG ? 'http://localhost:8000/api/v1/' : 'http://10.0.129.164:8001/api/v1/',
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