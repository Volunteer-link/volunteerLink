
import axios, { AxiosInstance } from 'axios';
 

const devURL = process.env.REACT_APP_URL_DEV;
const prodURL = process.env.REACT_APP_URL_PRO;
const accessKey = process.env.REACT_APP_ACCESS_KEY;
const environment = process.env.REACT_APP_ENVIRONMENT;

// Lựa chọn baseURL dựa trên ENVIRONMENT
const baseURL = environment === 'development' ? devURL : prodURL;

const api: AxiosInstance = axios.create({
  baseURL: baseURL, // Thay URL này thành endpoint gốc (baseURL) của bạn
  timeout: 10000, // Thời gian chờ (timeout) cho mỗi request (ms)
  headers: {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Access-Key': accessKey
  },
});

// Thêm Interceptors cho request (nếu cần)
api.interceptors.request.use(
  (config) => {
    // Chèn token, hoặc chỉnh sửa config trước khi request được gửi đi
    // Ví dụ: 
    // const token = localStorage.getItem('token');
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm Interceptors cho response (nếu cần)
api.interceptors.response.use(
  (response) => {
    // Bạn có thể xử lý dữ liệu trả về ở đây trước khi component nhận
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
