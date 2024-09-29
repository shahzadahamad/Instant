import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import apiClient from "../apiClient";
import { logout } from "../../redux/slice/userSlice";
import store from "../../redux/store/store";
import toast from "react-hot-toast";

interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
};

export const responseInterceptor = (response: AxiosResponse) => {
  return response;
};

export const errorInterceptor = async (error: AxiosError) => {
  const originalRequest = error.config as ExtendedAxiosRequestConfig;
  if (
    originalRequest &&
    error.response?.status === 401 &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;
    try {
      const response = await apiClient.get("/auth/refresh-token");
      const token = response.data.token;
      if (token) {
        localStorage.setItem("token", token);
      }
      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
      }
      return apiClient(originalRequest);
    } catch (refreshError) {
      store.dispatch(logout());
      return Promise.reject(refreshError);
    }
  } else if (
    originalRequest &&
    error.response?.status === 403 &&
    !originalRequest._retry
  ) {
    toast.error("Your account has been blocked");
    store.dispatch(logout());
  }
  return Promise.reject(error);
};
