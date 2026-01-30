import api from "./axios";
import type { User } from "../types/users";

export const loginRequest = async (
  email: string,
  password: string
): Promise<User | null> => {
  const res = await api.get<User[]>("/users", {
    params: { email, password },
  });

  // Client-side filtering to ensure exact match
  const matchedUser = res.data.find(
    (user) => user.email === email && user.password === password
  );

  return matchedUser ?? null;
};

export const getUsers = async (): Promise<User[]> => {
  const res = await api.get<User[]>("/users");
  return res.data;
};

export const updateUser = async (
  userId: string,
  data: Partial<User>
): Promise<User> => {
  try {
    // Try using the userId directly first
    const res = await api.put<User>(`/users/${userId}`, data);
    return res.data;
  } catch (err) {
    // If that fails, try using numeric ID (similar to orders logic)
    try {
      const numericId = parseInt(userId);
      if (!isNaN(numericId)) {
        const res = await api.put<User>(`/users/${numericId}`, data);
        return res.data;
      }
      throw err;
    } catch (retryErr) {
      console.error("Failed to update user", retryErr);
      throw retryErr;
    }
  }
};
