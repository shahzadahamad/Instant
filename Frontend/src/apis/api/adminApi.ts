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

export const getSubscriptionPlans = async (page: number, search: string) => {
  return await adminApiClient.get(`/subscription`, {
    params: {
      page,
      search,
    },
  });
};

export const createSubcription = async (formData: { period: string, price: number, offer: number }) => {
  return await adminApiClient.post(`/subscription/create`, formData);
};

export const editSubcription = async (formData: { period: string, price: number, offer: number }, id: string) => {
  console.log(formData)
  return await adminApiClient.put(`/subscription/edit/${id}`, formData);
};

export const toggleListing = async (id: string, status: string) => {
  return await adminApiClient.patch(`/subscription/toggle-list/${id}/${status}`);
};
