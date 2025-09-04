import { AddressFormData } from "../types/Address";
import { api } from "./api";

// הנתונים הדרושים למערך של מוצרים
interface CartItemPayment {
  productId: string;
  name: string;
  price: number;
  amount: number;
  imageUrl: string;
}

// הנתונים הדרושים לתשלום
interface DataPayment {
  items: CartItemPayment[];
  totalPrice: string;
  address: AddressFormData;
}

// בקשת תשלום
export const paymentApi = async (data: DataPayment) => {
  return await api.post("/payment/capture-order", data);
};
