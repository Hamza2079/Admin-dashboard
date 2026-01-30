import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getOrders, createOrder, updateOrder } from "../api/orders";
import type { Order, OrderStatus } from "../types/orders";

// Query keys for cache management
export const ordersKeys = {
  all: ["orders"] as const,
  lists: () => [...ordersKeys.all, "list"] as const,
  list: (filters?: string) => [...ordersKeys.lists(), { filters }] as const,
};

/**
 * Hook to fetch all orders with automatic caching and background refetching
 */
export function useOrders() {
  return useQuery({
    queryKey: ordersKeys.lists(),
    queryFn: getOrders,
    staleTime: 2 * 60 * 1000, // 2 minutes - orders data changes frequently
  });
}

/**
 * Hook to create a new order with automatic cache invalidation
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Invalidate and refetch orders after successful creation
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists() });
    },
  });
}

/**
 * Hook to update an order with optimistic updates
 */
export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, data }: { key: number; data: Partial<Order> }) =>
      updateOrder(key, data),
    onMutate: async ({ key, data }) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ordersKeys.lists() });

      // Snapshot the previous value
      const previousOrders = queryClient.getQueryData<Order[]>(
        ordersKeys.lists()
      );

      // Optimistically update the cache
      queryClient.setQueryData<Order[]>(ordersKeys.lists(), (old) =>
        old?.map((order) =>
          order.key === key ? { ...order, ...data } : order
        )
      );

      // Return context with previous value for rollback
      return { previousOrders };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousOrders) {
        queryClient.setQueryData(ordersKeys.lists(), context.previousOrders);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({ queryKey: ordersKeys.lists() });
    },
  });
}

/**
 * Hook to cancel an order (convenience wrapper for updateOrder)
 */
export function useCancelOrder() {
  const updateOrderMutation = useUpdateOrder();

  return {
    ...updateOrderMutation,
    mutate: (orderKey: number) =>
      updateOrderMutation.mutate({
        key: orderKey,
        data: { status: "cancelled" as OrderStatus },
      }),
    mutateAsync: (orderKey: number) =>
      updateOrderMutation.mutateAsync({
        key: orderKey,
        data: { status: "cancelled" as OrderStatus },
      }),
  };
}
