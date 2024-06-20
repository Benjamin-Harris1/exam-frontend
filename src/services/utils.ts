import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

axiosInstance.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

axiosInstance.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});

export default axiosInstance;