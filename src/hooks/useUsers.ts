import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUser } from "../api/users";
import type { User } from "../types/users";

// Query keys for cache management
export const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
};

/**
 * Hook to fetch all users with automatic caching
 * Users data changes less frequently, so we use a longer stale time
 */
export function useUsers() {
  return useQuery({
    queryKey: usersKeys.lists(),
    queryFn: getUsers,
    staleTime: 10 * 60 * 1000, // 10 minutes - users data changes infrequently
  });
}

/**
 * Hook to update a user with optimistic updates
 */
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: Partial<User> }) =>
      updateUser(userId, data),
    onMutate: async ({ userId, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: usersKeys.lists() });

      // Snapshot the previous value
      const previousUsers = queryClient.getQueryData<User[]>(
        usersKeys.lists()
      );

      // Optimistically update the cache
      queryClient.setQueryData<User[]>(usersKeys.lists(), (old) =>
        old?.map((user) =>
          user.id === userId ? { ...user, ...data } : user
        )
      );

      // Return context with previous value for rollback
      return { previousUsers };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousUsers) {
        queryClient.setQueryData(usersKeys.lists(), context.previousUsers);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: usersKeys.lists() });
    },
  });
}

