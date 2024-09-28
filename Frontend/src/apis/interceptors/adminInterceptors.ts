import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { adminApiClient } from "../apiClient";
import store from "../../redux/store/store";
import { adminLogout } from "@/redux/slice/admin/adminSlice";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const adminRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
};

export const adminResponseInterceptor = (response: AxiosResponse) => {
  return response;
};

export const adminErrorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as ExtendedAxiosRequestConfig;
  if (
    originalRequest &&
    error.response?.status === 401 &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;
    try {
      const response = await adminApiClient.get("/auth/refresh-token");
      const token = response.data.token;
      if (token) {
        localStorage.setItem("adminToken", token);
      }
      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
      }
      return adminApiClient(originalRequest);
    } catch (refreshError) {
      store.dispatch(adminLogout());
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
};
