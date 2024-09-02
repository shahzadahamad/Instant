import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import store from "../../redux/store/store";
import apiClient from "../apiClient";
import { logout } from "../../redux/slice/userSlice";

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
    error.response?.data === "Unauthorized" &&
    !originalRequest._retry
  ) {
    originalRequest._retry = true;
    try {
      const response = await apiClient.get("/auth/refresh-token");
      const token = response.data.token;
      if (response.data.token) {
        localStorage.setItem("token", token);
      }
      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
      }
      console.log("inininininininin");
      return apiClient(originalRequest);
    } catch (refreshError) {
      console.log("out out out");
      store.dispatch(logout());
      return Promise.reject(refreshError);
    }
  }
  return Promise.reject(error);
};
