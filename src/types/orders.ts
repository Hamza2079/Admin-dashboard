export type OrderStatus = "pending" | "paid" | "shipped" | "cancelled";
export type PaymentMethod = "visa" | "cash";

export interface Order {
  key: number;
  userId: string;
  orderRef: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  totalPrice: number;
  createdAt: string;
}
