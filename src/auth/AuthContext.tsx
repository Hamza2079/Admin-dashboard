import { getUsers, loginRequest } from "@/api/users";
import type { User } from "@/types/users";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  users: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userFromApi = await loginRequest(email, password);

      console.log("USER FROM API 👉", userFromApi);

      if (!userFromApi) {
        toast.error("Email or password is wrong");
        return;
      }

      // Check if user is blocked
      if (userFromApi.status === "blocked") {
        alert(
          "Your account has been blocked. Please contact an administrator.",
        );
        return;
      }

      setUser(userFromApi);
      localStorage.setItem("user", JSON.stringify(userFromApi));
      toast.success(`Welcome back, ${userFromApi.name}!`);
    } finally {
      setIsLoading(false);
    }
  };

  const [users, setUsers] = useState<User[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const users = await getUsers();
      setUsers(users);
    };
    fetchUsers();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isLoading,
        users,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
