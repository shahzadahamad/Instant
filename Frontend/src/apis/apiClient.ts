import axios, { AxiosInstance } from "axios";
import {
  errorInterceptor,
  requestInterceptor,
  responseInterceptor,
} from "./interceptors/interceptors";
import {
  adminErrorInterceptor,
  adminRequestInterceptor,
  adminResponseInterceptor,
} from "./interceptors/adminInterceptors";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

apiClient.interceptors.request.use(requestInterceptor);
apiClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export const adminApiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_BASE_URL,
  withCredentials: true,
});

adminApiClient.interceptors.request.use(adminRequestInterceptor);
adminApiClient.interceptors.response.use(
  adminResponseInterceptor,
  adminErrorInterceptor
);

export default apiClient;
