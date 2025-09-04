import { api } from "./api";

// הנתונים להוספה לעגלה
interface DataAddToCart {
  productId: string;
  amount: number;
}

// הנתונים לשינוי כמות המוצר
interface DataUpdateItem {
  productId: string;
}

interface DataItems {
  productId: string;
  amount: number;
}
interface DataSyncCart {
  items: DataItems[];
}

// משיכת העגלה
export const fetchCart = async () => {
  const res = await api.get("/cart");
  return res.data;
};

// הוספה לעגלה
export const addToCartApi = async (data: DataAddToCart) => {
  const res = await api.post(`/cart/addItem`, data);
  return res.data;
};

// הוספת כמות מוצר אחד לעגלה
export const addOneItemCart = async (data: DataUpdateItem) => {
  const res = await api.put(`/cart/addOneItem`, data);
  return res.data;
};

// הסרת כמות מוצר אחד לעגלה
export const removeOneItemCart = async (data: DataUpdateItem) => {
  const res = await api.put(`/cart/removeOneItem`, data);
  return res.data;
};

// הסרת מוצר מהעגלה
export const removeItemCart = async (data: DataUpdateItem) => {
  const res = await api.delete(`/cart/removeItem`, { data });
  return res.data;
};
export const syncCart = async (data: DataSyncCart) => {
  await api.post(`/cart/sync`, data);
};

export const clearCartApi = async () => {
  await api.delete(`/cart/clear`);
};
