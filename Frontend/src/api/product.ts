import { api } from "./api";
import { Product } from "../types/Product";

// משיכת המוצרים מהשרת
export const fetchProducts = async (): Promise<Product[]> => {
  const res = await api.get<Product[]>(`/product`);
  return res.data;
};

// משיכת מוצר על פי ID
export const fetchProductById = async (id: string): Promise<Product> => {
  const res = await api.get<Product>(`/product/${id}`);
  return res.data;
};
