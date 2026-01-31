import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import type { OrderStatus, PaymentMethod, Order } from "../types/orders";
import {
  LogOut,
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  Banknote,
  Plus,
  Menu,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useOrders, useCreateOrder, useUpdateOrder } from "../hooks/useOrders";
import MobileMenu from "../components/MobileMenu";

// Super admin email constant
const SUPER_ADMIN_EMAIL = "sadmin@gmail.com";

export default function Orders() {
  const { user, logout, isAdmin, users } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // React Query hooks
  const { data: orders = [], isLoading, error, isFetching } = useOrders();
  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newOrder, setNewOrder] = useState<{
    totalPrice: string;
    paymentMethod: PaymentMethod;
    status: OrderStatus;
  }>({
    totalPrice: "",
    paymentMethod: "visa",
    status: "pending",
  });

  // Filter orders based on role
  const visibleOrders = isAdmin
    ? orders
    : orders.filter((o) => o.userId === user?.id);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getUserName = (userId: string) => {
    const foundUser = users.find((u) => u.id === userId);
    // If user found, return name. If not, return the stored value (custom name)
    return foundUser?.name || userId;
  };

  const handleStatusChange = async (
    orderKey: number,
    newStatus: OrderStatus,
  ) => {
    updateOrderMutation.mutate({
      key: orderKey,
      data: { status: newStatus },
    });
  };

  const handleCreateOrder = async () => {
    if (!newOrder.totalPrice) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!user?.id) {
      toast.error("User not identified");
      return;
    }

    const maxKey = Math.max(...orders.map((o) => o.key), 1000);
    const nextKey = maxKey + 1;

    const orderToCreate: Order = {
      key: nextKey,
      userId: user.id, // Auto-assign logged in user ID
      totalPrice: Number(newOrder.totalPrice),
      paymentMethod: newOrder.paymentMethod,
      status: newOrder.status,
      createdAt: new Date().toISOString().split("T")[0],
      orderRef: `Order #${nextKey}`,
    };

    createOrderMutation.mutate(orderToCreate, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewOrder({
          totalPrice: "",
          paymentMethod: "visa",
          status: "pending",
        });
      },
      onError: (error) => {
        console.error("Failed to create order:", error);
        toast.error("Failed to create order");
      },
    });
  };

  const handleCancelOrder = async (orderKey: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    await handleStatusChange(orderKey, "cancelled");
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "paid":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "shipped":
        return <Package className="w-4 h-4 text-blue-600" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "paid":
        return "bg-green-100 text-green-800 border-green-300";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
    }
  };

  const getPaymentIcon = (method: string) => {
    return method === "visa" ? (
      <CreditCard className="w-4 h-4" />
    ) : (
      <Banknote className="w-4 h-4" />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
            <div className="flex items-center gap-2 md:gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-700" />
              </button>

              <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                  Orders
                </h1>
                <p className="text-xs md:text-sm text-gray-500 hidden sm:block">
                  Welcome, {user?.name}{" "}
                  {!isAdmin && <span className="text-purple-600">(User)</span>}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              {!isAdmin && (
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm md:text-base px-3 md:px-4"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Order</span>
                  <span className="sm:hidden">New</span>
                </Button>
              )}
              {isAdmin && (
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  className="hidden md:flex items-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Button>
              )}
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
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mb-4"></div>
            <p className="text-gray-600 font-medium">Loading orders...</p>
          </div>
        )}

        {/* Refetching Indicator */}
        {!isLoading && isFetching && (
          <div className="fixed top-20 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-30">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm font-medium">Updating...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800 font-medium">
              Failed to load orders. Please try again.
            </p>
          </div>
        )}

        {/* Stats */}
        {!isLoading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">
                      {isAdmin ? "Revenue" : "Total Orders"}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {isAdmin
                        ? formatCurrency(
                            visibleOrders
                              .filter(
                                (o) =>
                                  o.status === "shipped" || o.status === "paid",
                              )
                              .reduce((sum, o) => sum + o.totalPrice, 0),
                          )
                        : visibleOrders.length}
                    </p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    {isAdmin ? (
                      <Banknote className="w-5 h-5 text-purple-600" />
                    ) : (
                      <ShoppingCart className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {isAdmin
                        ? formatCurrency(
                            visibleOrders
                              .filter((o) => o.status === "pending")
                              .reduce((sum, o) => sum + o.totalPrice, 0),
                          )
                        : visibleOrders.filter((o) => o.status === "pending")
                            .length}
                    </p>
                  </div>
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">
                      Paid
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {visibleOrders.filter((o) => o.status === "paid").length}
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">
                      Shipped
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {
                        visibleOrders.filter((o) => o.status === "shipped")
                          .length
                      }
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">
                      Cancelled
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {
                        visibleOrders.filter((o) => o.status === "cancelled")
                          .length
                      }
                    </p>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Card View - Show on mobile only */}
            <div className="md:hidden space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 px-1">
                {isAdmin ? "All Orders" : "My Orders"}
              </h2>
              {visibleOrders.map((order) => (
                <div
                  key={order.key}
                  className="bg-white rounded-xl shadow-sm border p-4 space-y-3"
                >
                  {/* Order Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {order.orderRef}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getUserName(order.userId)}
                      </p>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(order.totalPrice)}
                    </span>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Date</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Payment</p>
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getPaymentIcon(order.paymentMethod)}
                        {order.paymentMethod.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="pt-2 border-t">
                    <p className="text-gray-500 text-xs mb-2">Status</p>
                    {isAdmin ? (
                      order.status !== "cancelled" ||
                      user?.email == SUPER_ADMIN_EMAIL ? (
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(
                              order.key,
                              e.target.value as OrderStatus,
                            )
                          }
                          disabled={updateOrderMutation.isPending}
                          className={`w-full px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(
                            order.status,
                          )} ${
                            updateOrderMutation.isPending ? "opacity-50" : ""
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      )
                    ) : (
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border flex-1 ${getStatusColor(
                            order.status,
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        {order.status === "pending" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelOrder(order.key)}
                            disabled={updateOrderMutation.isPending}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View - Show on desktop only */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isAdmin ? "All Orders" : "My Orders"}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Ref
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {visibleOrders.map((order) => (
                      <tr
                        key={order.key}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderRef}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {getUserName(order.userId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {formatCurrency(order.totalPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {getPaymentIcon(order.paymentMethod)}
                            {order.paymentMethod.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isAdmin ? (
                            // Super admin can edit all orders including cancelled
                            // Regular admins cannot edit cancelled orders
                            order.status !== "cancelled" ||
                            user?.email == SUPER_ADMIN_EMAIL ? (
                              <select
                                value={order.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    order.key,
                                    e.target.value as OrderStatus,
                                  )
                                }
                                disabled={updateOrderMutation.isPending}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${getStatusColor(
                                  order.status,
                                )} ${
                                  updateOrderMutation.isPending
                                    ? "opacity-50 cursor-wait"
                                    : ""
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="paid">Paid</option>
                                <option value="shipped">Shipped</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  order.status,
                                )}`}
                              >
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                            )
                          ) : (
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                  order.status,
                                )}`}
                              >
                                {getStatusIcon(order.status)}
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                              {order.status === "pending" && (
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="h-6 text-xs px-2"
                                  onClick={() => handleCancelOrder(order.key)}
                                  disabled={updateOrderMutation.isPending}
                                >
                                  Cancel
                                </Button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="total" className="text-sm font-medium">
                Total Amount ($)
              </label>
              <Input
                id="total"
                type="number"
                placeholder="0.00"
                value={newOrder.totalPrice}
                onChange={(e) =>
                  setNewOrder({ ...newOrder, totalPrice: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="payment" className="text-sm font-medium">
                Payment Method
              </label>
              <select
                id="payment"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={newOrder.paymentMethod}
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    paymentMethod: e.target.value as PaymentMethod,
                  })
                }
              >
                <option value="visa">Visa</option>
                <option value="cash">Cash</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="status"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={newOrder.status}
                onChange={(e) =>
                  setNewOrder({
                    ...newOrder,
                    status: e.target.value as OrderStatus,
                  })
                }
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="shipped">Shipped</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrder} disabled={!newOrder.totalPrice}>
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
