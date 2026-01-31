import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../components/ui/button";
import {
  LogOut,
  Users as UsersIcon,
  Shield,
  User as UserIcon,
  CheckCircle,
  XCircle,
  Menu,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUsers, useUpdateUser } from "../hooks/useUsers";
import type { Role, UserStatus } from "../types/users";
import MobileMenu from "../components/MobileMenu";

// Super admin email constant
const SUPER_ADMIN_EMAIL = "sadmin@gmail.com";

export default function Users() {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // React Query hooks
  const { data: users = [], isLoading, error, isFetching } = useUsers();
  const updateUserMutation = useUpdateUser();

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Check if current user is super admin
  const isSuperAdmin = currentUser?.email === SUPER_ADMIN_EMAIL;

  // Check if a user can be edited by the current admin
  const canEditUser = (targetUser: (typeof users)[0]) => {
    if (!currentUser) return false;

    // Nobody can edit themselves (including super admin)
    if (targetUser.id === currentUser.id) return false;

    // Super admin can edit everyone except themselves
    if (isSuperAdmin) return true;

    // Regular admins cannot edit other admins
    if (targetUser.role === "admin") return false;

    // Regular admins can edit regular users
    return true;
  };

  const handleRoleChange = (userId: string, newRole: Role) => {
    updateUserMutation.mutate({
      userId,
      data: { role: newRole },
    });
  };

  const handleStatusChange = (userId: string, newStatus: UserStatus) => {
    updateUserMutation.mutate({
      userId,
      data: { status: newStatus },
    });
  };

  const getRoleBadgeColor = (role: Role) => {
    return role === "admin"
      ? "bg-purple-100 text-purple-800 border-purple-300"
      : "bg-blue-100 text-blue-800 border-blue-300";
  };

  const getStatusBadgeColor = (status: UserStatus) => {
    return status === "active"
      ? "bg-green-100 text-green-800 border-green-300"
      : "bg-red-100 text-red-800 border-red-300";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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

              <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <UsersIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                  Users Management
                </h1>
                <p className="text-xs md:text-sm text-gray-500 hidden sm:block">
                  Welcome, {currentUser?.name}{" "}
                  {isSuperAdmin && (
                    <span className="text-purple-600 font-semibold">
                      (Super Admin)
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="hidden md:flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Button>
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
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800 font-medium">
              Failed to load users. Please try again.
            </p>
          </div>
        )}

        {/* Users table */}
        {!isLoading && !error && (
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                All Users ({users.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => {
                    const isCurrentUser = user.id === currentUser?.id;
                    const isSuperAdminUser = user.email === SUPER_ADMIN_EMAIL;
                    const canEdit = canEditUser(user);

                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-gray-50 transition-colors ${
                          isCurrentUser ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">
                              {user.name}
                            </span>
                            {isCurrentUser && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                You
                              </span>
                            )}
                            {isSuperAdminUser && (
                              <Shield className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {canEdit ? (
                            <select
                              value={user.role}
                              onChange={(e) =>
                                handleRoleChange(
                                  user.id,
                                  e.target.value as Role,
                                )
                              }
                              disabled={updateUserMutation.isPending}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${getRoleBadgeColor(
                                user.role,
                              )} ${
                                updateUserMutation.isPending
                                  ? "opacity-50 cursor-wait"
                                  : ""
                              }`}
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(
                                user.role,
                              )}`}
                            >
                              {user.role === "admin" ? (
                                <Shield className="w-3 h-3" />
                              ) : (
                                <UserIcon className="w-3 h-3" />
                              )}
                              {user.role.charAt(0).toUpperCase() +
                                user.role.slice(1)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {canEdit ? (
                            <select
                              value={user.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  user.id,
                                  e.target.value as UserStatus,
                                )
                              }
                              disabled={updateUserMutation.isPending}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${getStatusBadgeColor(
                                user.status,
                              )} ${
                                updateUserMutation.isPending
                                  ? "opacity-50 cursor-wait"
                                  : ""
                              }`}
                            >
                              <option value="active">Active</option>
                              <option value="blocked">Blocked</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                                user.status,
                              )}`}
                            >
                              {user.status === "active" ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <XCircle className="w-3 h-3" />
                              )}
                              {user.status.charAt(0).toUpperCase() +
                                user.status.slice(1)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Permission Info Card */}
        {!isLoading && !error && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900">
                  Permission Information
                </h3>
                <p className="text-sm text-blue-800 mt-1">
                  {isSuperAdmin ? (
                    <>
                      As <strong>Super Admin</strong>, you can edit all users
                      including other admins, but you cannot edit yourself.
                    </>
                  ) : (
                    <>
                      As a <strong>Regular Admin</strong>, you can only edit
                      regular users. You cannot edit other admins or yourself.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
