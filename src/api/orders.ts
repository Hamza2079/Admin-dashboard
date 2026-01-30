import api from "./axios";
import type { Order } from "../types/orders";

export const getOrders = async (): Promise<Order[]> => {
  const res = await api.get<Order[]>("/orders");
  return res.data;
};

export const getOrdersByUser = async (userId: string): Promise<Order[]> => {
  const res = await api.get<Order[]>("/orders", {
    params: { userId },
  });
  return res.data;
};

export const updateOrder = async (
  key: number,
  data: Partial<Order>
): Promise<Order> => {
  try {
    // Try using the key directly first (e.g. 1001)
    const res = await api.put<Order>(`/orders/${key}`, data);
    return res.data;
  } catch (err) {
    // If that fails, try assuming the ID is an auto-increment starting at 1
    // Data shows keys 1001-1030, likely mapping to IDs 1-30
    try {
      const heuristicId = key - 1000;
      console.log(`Direct update failed, trying heuristic ID: ${heuristicId}`);
      const res = await api.put<Order>(`/orders/${heuristicId}`, data);
      return res.data;
    } catch (retryErr) {
       console.error("Both direct key and heuristic ID updates failed", retryErr);
       throw retryErr;
    }
  }
};

export const createOrder = async (order: Order): Promise<Order> => {
  const res = await api.post<Order>("/orders", order);
  return res.data;
};
