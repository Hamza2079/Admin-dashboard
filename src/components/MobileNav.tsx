import { Home, ShoppingCart, Users } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg md:hidden z-30">
      <div className="flex items-center justify-around h-16">
        <button
          onClick={() => navigate("/dashboard")}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isActive("/dashboard")
              ? "text-purple-600 bg-purple-50"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">Home</span>
        </button>

        <button
          onClick={() => navigate("/orders")}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isActive("/orders")
              ? "text-purple-600 bg-purple-50"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">Orders</span>
        </button>

        {isAdmin && (
          <button
            onClick={() => navigate("/users")}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              isActive("/users")
                ? "text-purple-600 bg-purple-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Users</span>
          </button>
        )}
      </div>
    </nav>
  );
}
