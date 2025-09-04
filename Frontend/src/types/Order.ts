import { AddressFormData } from "./Address";
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  amount: number;
  imageUrl: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  shippingAddress: AddressFormData;
  totalPrice: number;
  isDelivered: boolean;
  createdAt: string;
}
