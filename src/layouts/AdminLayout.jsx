import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Users, ShoppingCart, ArrowLeft, LogOut, Menu, X, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  ];

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center"><LayoutDashboard size={21} /></div><div><h1 className="font-bold text-gray-900">Admin Panel</h1><p className="text-xs text-gray-500">Management</p></div></div>
        <button onClick={() => setSidebarOpen((v) => !v)} className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-700">{sidebarOpen ? <X size={22} /> : <Menu size={22} />}</button>
      </div>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-40 md:hidden" />}

      <aside className={`fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${collapsed ? "w-20" : "w-64"} md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <div className={`h-20 px-4 flex items-center border-b border-gray-100 ${collapsed ? "justify-center" : "gap-3"}`}>
          <div className="w-11 h-11 shrink-0 bg-blue-600 text-white rounded-xl flex items-center justify-center"><LayoutDashboard size={23} /></div>
          {!collapsed && <div className="min-w-0"><h1 className="font-bold text-gray-900 text-lg">Admin Panel</h1><p className="text-xs text-gray-500">Store Management</p></div>}
          <button onClick={() => setCollapsed((v) => !v)} className={`hidden md:flex w-9 h-9 rounded-lg hover:bg-gray-100 text-gray-500 items-center justify-center ${collapsed ? "ml-0" : "ml-auto"}`} title={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}</button>
        </div>

        <div className={`py-5 border-b border-gray-100 ${collapsed ? "px-2" : "px-4"}`}>
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`} title={collapsed ? user?.fullName || "Administrator" : undefined}>
            <div className="w-11 h-11 shrink-0 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">{user?.fullName ? user.fullName.charAt(0).toUpperCase() : "A"}</div>
            {!collapsed && <div className="min-w-0"><p className="font-semibold text-gray-900 truncate">{user?.fullName || "Administrator"}</p><p className="text-xs text-gray-500 truncate">{user?.email || ""}</p></div>}
          </div>
        </div>

        <nav className={`flex-1 px-3 py-5 space-y-1 overflow-y-auto`}>
          {!collapsed && <p className="px-3 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</p>}
          {navItems.map(({ name, path, icon: Icon }) => <NavLink key={path} to={path} onClick={() => setSidebarOpen(false)} title={collapsed ? name : undefined} className={({ isActive }) => `flex items-center ${collapsed ? "justify-center" : "gap-3"} px-3 py-3 rounded-xl font-medium transition ${isActive ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}><Icon size={20} />{!collapsed && <span>{name}</span>}</NavLink>)}
        </nav>

        <div className={`p-3 border-t border-gray-100 space-y-1`}>
          <button onClick={() => { navigate("/"); setSidebarOpen(false); }} title={collapsed ? "Back to Store" : undefined} className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-3"} px-3 py-3 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition font-medium`}><ArrowLeft size={20} />{!collapsed && "Back to Store"}</button>
          <button onClick={handleLogout} title={collapsed ? "Logout" : undefined} className={`w-full flex items-center ${collapsed ? "justify-center" : "gap-3"} px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition font-medium`}><LogOut size={20} />{!collapsed && "Logout"}</button>
        </div>
      </aside>

      <main className={`min-h-screen transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"}`}><Outlet /></main>
    </div>
  );
}
export default AdminLayout;
