import axios, { AxiosInstance } from "axios";
import { getCookie, setCookie } from "../ultils/cookie";

const devURL = process.env.REACT_APP_URL_DEV;
const prodURL = process.env.REACT_APP_URL_PRO;
const accessKey = process.env.REACT_APP_ACCESS_KEY;
const environment = process.env.REACT_APP_ENVIRONMENT;

// Lựa chọn baseURL dựa trên ENVIRONMENT
const baseURL = environment === "development" ? devURL : prodURL;

const language = localStorage.getItem("language") || "vi";

const api: AxiosInstance = axios.create({
  baseURL: baseURL, // Thay URL này thành endpoint gốc (baseURL) của bạn
  timeout: 10000, // Thời gian chờ (timeout) cho mỗi request (ms)
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
    "X-Access-Key": accessKey,
    "Accept-Language": language,
  },
});

// Thêm Interceptors cho request (nếu cần)
api.interceptors.request.use(
  (config) => {
    const token = getCookie("accessToken");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function refreshToken() {
  const response = await axios.post('https://dev.api.volunteer-link.site/refresh-token');

  return response.data.data;
}

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry ) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }
      isRefreshing = true;
      try {
        const data = await refreshToken();
        const newAccessToken = data?.accessToken;
        setCookie("accessToken", newAccessToken);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
         window.location.href = '/unauthorized';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    if (error.response?.status === 404) {
      window.location.href = "/not-found"; // Chuyển trang khi lỗi 401
    }
    if (error.response?.status === 403) {
      window.location.href = "/forbidden"; // Chuyển trang khi lỗi 403
    }
    if (error.response?.status === 500) {
      window.location.href = "/server-error"; // Chuyển trang khi lỗi 500
    }
    return Promise.reject(error);
  }
);

export const setupInterceptors = (
  // setError?: (message: number) => void,
  setPageNumber?: (message: number) => void,
  setTotalItems?: (message: number) => void,
  setCheckPagination?: (message: number) => void
) => {
  api.interceptors.response.use(
    (response) => {
      if (response.data.data.pageNumber && response.data.data.totalItems) {
        setPageNumber?.(response.data.data.pageNumber);
        setTotalItems?.(response.data.data.totalItems);
      }
      setCheckPagination?.(response.data.data.totalItems);
      return response;
    },
    (error) => {
      // setError?.(error.response?.status || 500);
      // setError?.(error.response?.status || 401);
      // setError?.(error.response?.status || 403);
      return Promise.reject(error);
    }
  );
};

export default api;
