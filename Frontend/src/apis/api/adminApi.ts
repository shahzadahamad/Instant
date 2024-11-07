import { adminApiClient } from "../apiClient";

export const getAdminDataApi = async () => {
  const response = await adminApiClient.get(`/data`);
  return response.data;
};

export const editProfile = async (formData: FormData) => {
  const response = await adminApiClient.post(`/edit`, formData);
  return response.data;
};

export const changePasswordApi = async (currentPassword: string, newPassword: string) => {
  const response = await adminApiClient.post(`/edit/password`, { currentPassword, newPassword });
  return response.data.message;
};
