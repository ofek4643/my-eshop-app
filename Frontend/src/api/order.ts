import { api } from "./api";

export const getOrderApi = async (id: string) => {
  return await api.get(`/order/${id}`);
};

export const OrderUpdateDelivered = async (id: string) => {
  return await api.put(`/order/${id}`, {});
};

export const getAllOrderApi = async () => {
  return await api.get(`/order`);
};
