
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  ArrowLeft,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* MOBILE HEADER */}

      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-40">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
            <LayoutDashboard size={21} />
          </div>

          <div>
            <h1 className="font-bold text-gray-900">
              Admin Panel
            </h1>

            <p className="text-xs text-gray-500">
              Management
            </p>
          </div>

        </div>

        <button
          onClick={() =>
            setSidebarOpen(!sidebarOpen)
          }
          className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-700"
        >
          {sidebarOpen ? (
            <X size={22} />
          ) : (
            <Menu size={22} />
          )}
        </button>

      </div>

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64 bg-white border-r border-gray-200
          flex flex-col
          transition-transform duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* LOGO */}

        <div className="h-20 px-5 flex items-center gap-3 border-b border-gray-100">

          <div className="w-11 h-11 bg-blue-600 text-white rounded-xl flex items-center justify-center">
            <LayoutDashboard size={23} />
          </div>

          <div>
            <h1 className="font-bold text-gray-900 text-lg">
              Admin Panel
            </h1>

            <p className="text-xs text-gray-500">
              Store Management
            </p>
          </div>

        </div>

        {/* USER */}

        <div className="px-4 py-5 border-b border-gray-100">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              {user?.fullName
                ? user.fullName
                    .charAt(0)
                    .toUpperCase()
                : "A"}
            </div>

            <div className="min-w-0">

              <p className="font-semibold text-gray-900 truncate">
                {user?.fullName ||
                  "Administrator"}
              </p>

              <p className="text-xs text-gray-500 truncate">
                {user?.email || ""}
              </p>

            </div>

          </div>

        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">

          <p className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Management
          </p>

          {navItems.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={({ isActive }) =>
                  `
                  flex items-center gap-3
                  px-4 py-3 rounded-xl
                  font-medium transition
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                  `
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}

        </nav>

        {/* BOTTOM ACTIONS */}

        <div className="p-3 border-t border-gray-100 space-y-1">

          <button
            onClick={() => {
              navigate("/");
              setSidebarOpen(false);
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition font-medium"
          >
            <ArrowLeft size={20} />
            Back to Store
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="lg:ml-64 min-h-screen">

        <Outlet />

      </main>

    </div>
  );
}

export default AdminLayout;

