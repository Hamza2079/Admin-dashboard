import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/ui/button";
import { LogOut, Users, ShoppingCart, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import { useUsers } from "../hooks/useUsers";
import MobileMenu from "../components/MobileMenu";
import MobileNav from "../components/MobileNav";

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // React Query hooks
  const { data: orders = [] } = useOrders();
  const { data: users = [] } = useUsers();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                    Dashboard
                  </h1>
                  <p className="text-xs md:text-sm text-gray-500 hidden sm:block">
                    Welcome back, {user?.name}
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="hidden md:flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Stats Grid - 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {/* Total Users Card */}
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-2 md:mb-0">
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Total Users
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                  {users.length}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg self-start md:self-auto">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Orders Card */}
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-2 md:mb-0">
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Total Orders
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                  {orders.length}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-purple-100 rounded-lg self-start md:self-auto">
                <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Pending Orders Card */}
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-2 md:mb-0">
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Pending
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                  {orders.filter((order) => order.status === "pending").length}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-yellow-100 rounded-lg self-start md:self-auto">
                <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Shipped Orders Card */}
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-2 md:mb-0">
                <p className="text-xs md:text-sm font-medium text-gray-600">
                  Shipped
                </p>
                <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-1 md:mt-2">
                  {orders.filter((order) => order.status === "shipped").length}
                </p>
              </div>
              <div className="p-2 md:p-3 bg-green-100 rounded-lg self-start md:self-auto">
                <ShoppingCart className="w-6 h-6 md:w-8 md:h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 md:mt-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {isAdmin && (
              <Button
                onClick={() => navigate("/users")}
                className="h-auto py-4 md:py-4 justify-start bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-left"
              >
                <Users className="w-5 h-5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-semibold">Manage Users</div>
                  <div className="text-xs opacity-90">
                    View and edit user accounts
                  </div>
                </div>
              </Button>
            )}

            <Button
              onClick={() => navigate("/orders")}
              className="h-auto py-4 md:py-4 justify-start bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-left"
            >
              <ShoppingCart className="w-5 h-5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <div className="font-semibold">View Orders</div>
                <div className="text-xs opacity-90">
                  Track and manage orders
                </div>
              </div>
            </Button>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
