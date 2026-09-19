import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart, Users, Banknote, Plus, ArrowRight, Clock, CheckCircle, Truck, XCircle, CalendarDays } from "lucide-react";
import { getAllLocalOrders } from "../../utils/orderStorage";
import { getAdminProducts } from "../../utils/productStorage";

const DATE_RANGES = [
  { value: "all", label: "All time" },
  { value: "28", label: "Last 28 days" },
  { value: "90", label: "Last 3 months" },
  { value: "180", label: "Last 6 months" },
  { value: "365", label: "Last year" },
];

const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;
const statusOf = (order) => String(order?.status || "Processing").toLowerCase();

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dateRange, setDateRange] = useState("all");

  const loadDashboardData = () => {
    try {
      setProducts(getAdminProducts());
      setUsers(JSON.parse(localStorage.getItem("users") || "[]"));
      setOrders(getAllLocalOrders());
    } catch (error) {
      console.error("Dashboard data error:", error);
      setProducts([]); setUsers([]); setOrders([]);
    }
  };

  useEffect(() => {
    loadDashboardData();
    ["productsUpdated", "usersUpdated", "ordersUpdated", "storage"].forEach((event) => window.addEventListener(event, loadDashboardData));
    return () => ["productsUpdated", "usersUpdated", "ordersUpdated", "storage"].forEach((event) => window.removeEventListener(event, loadDashboardData));
  }, []);

  const filteredOrders = useMemo(() => {
    if (dateRange === "all") return orders;
    const days = Number(dateRange);
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return orders.filter((order) => {
      const time = new Date(order.createdAt || 0).getTime();
      return Number.isFinite(time) && time >= cutoff;
    });
  }, [orders, dateRange]);

  const stats = useMemo(() => {
    const revenue = (status) => filteredOrders.filter((o) => statusOf(o) === status).reduce((sum, o) => sum + Number(o.total || 0), 0);
    const delivered = revenue("delivered");
    const processing = revenue("processing");
    const shipped = revenue("shipped");
    const cancelled = revenue("cancelled");
    const other = filteredOrders.filter((o) => !["delivered", "processing", "shipped", "cancelled"].includes(statusOf(o))).reduce((sum, o) => sum + Number(o.total || 0), 0);
    return {
      delivered, processing, shipped, cancelled, other,
      active: processing + shipped + other,
      processingCount: filteredOrders.filter((o) => statusOf(o) === "processing").length,
      shippedCount: filteredOrders.filter((o) => statusOf(o) === "shipped").length,
      deliveredCount: filteredOrders.filter((o) => statusOf(o) === "delivered").length,
      cancelledCount: filteredOrders.filter((o) => statusOf(o) === "cancelled").length,
    };
  }, [filteredOrders]);

  const recentOrders = [...filteredOrders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 5);
  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "N/A";
  const statusClass = (status) => ({ delivered: "bg-green-100 text-green-700", shipped: "bg-blue-100 text-blue-700", cancelled: "bg-red-100 text-red-700", processing: "bg-yellow-100 text-yellow-700" }[statusOf({ status })] || "bg-gray-100 text-gray-700");

  const revenueCards = [
    { title: "Delivered Revenue", value: stats.delivered, icon: CheckCircle, iconClass: "bg-green-100 text-green-600", note: `${stats.deliveredCount} delivered orders` },
    { title: "Processing Revenue", value: stats.processing, icon: Clock, iconClass: "bg-yellow-100 text-yellow-600", note: `${stats.processingCount} processing orders` },
    { title: "Shipped Revenue", value: stats.shipped, icon: Truck, iconClass: "bg-blue-100 text-blue-600", note: `${stats.shippedCount} shipped orders` },
    { title: "Cancelled Value", value: stats.cancelled, icon: XCircle, iconClass: "bg-red-100 text-red-600", note: `${stats.cancelledCount} cancelled orders` },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        <div><h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1><p className="text-gray-500 mt-1">Overview of your store performance.</p></div>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700"><CalendarDays size={17} /><select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="bg-transparent outline-none"><option value="all">All time</option><option value="28">Last 28 days</option><option value="90">Last 3 months</option><option value="180">Last 6 months</option><option value="365">Last year</option></select></label>
          <Link to="/admin/products/add" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold"><Plus size={18} />Add Product</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <StatCard title="Total Products" value={products.length} icon={Package} color="blue" link="/admin/products" linkText="Manage Products" />
        <StatCard title="Total Orders" value={filteredOrders.length} icon={ShoppingCart} color="orange" link="/admin/orders" linkText="Manage Orders" />
        <StatCard title="Total Users" value={users.length} icon={Users} color="purple" link="/admin/users" linkText="Manage Users" />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">Active Order Value</p><h2 className="text-2xl font-bold text-gray-900 mt-2">{money(stats.active)}</h2></div><div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><Banknote size={24} /></div></div><p className="text-sm text-gray-500 mt-5">Processing + shipped + other statuses</p></div>
      </div>

      <div className="mb-3"><h2 className="text-xl font-bold text-gray-900">Revenue Breakdown</h2><p className="text-sm text-gray-500 mt-1">Revenue is separated by order status for the selected date range.</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {revenueCards.map(({ title, value, icon: Icon, iconClass, note }) => <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">{title}</p><p className="text-2xl font-bold text-gray-900 mt-2">{money(value)}</p></div><div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}><Icon size={21} /></div></div><p className="text-xs text-gray-500 mt-4">{note}</p></div>)}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatusLink label="Processing" count={stats.processingCount} icon={Clock} color="yellow" to="/admin/orders?status=Processing" />
        <StatusLink label="Shipped" count={stats.shippedCount} icon={Truck} color="blue" to="/admin/orders?status=Shipped" />
        <StatusLink label="Delivered" count={stats.deliveredCount} icon={CheckCircle} color="green" to="/admin/orders?status=Delivered" />
        <StatusLink label="Cancelled" count={stats.cancelledCount} icon={XCircle} color="red" to="/admin/orders?status=Cancelled" />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6 border-b border-gray-100"><div><h2 className="text-xl font-bold text-gray-900">Recent Orders</h2><p className="text-sm text-gray-500 mt-1">Latest orders in the selected date range.</p></div><Link to="/admin/orders" className="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">View All <ArrowRight size={16} /></Link></div>
        {recentOrders.length === 0 ? <div className="p-12 text-center"><ShoppingCart size={45} className="mx-auto text-gray-300" /><h3 className="font-bold text-lg text-gray-900 mt-4">No Orders Yet</h3><p className="text-gray-500 mt-1">Customer orders will appear here.</p></div> : <div className="overflow-x-auto"><table className="w-full min-w-[750px]"><thead className="bg-gray-50"><tr><th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Order ID</th><th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Customer</th><th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th><th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Total</th><th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th></tr></thead><tbody className="divide-y divide-gray-100">{recentOrders.map((order) => { const id = order.orderNumber ?? order.id ?? order._id; return <tr key={id} className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">#{id}</td><td className="px-6 py-4"><p className="font-semibold text-gray-900">{order.customer?.fullName || "Customer"}</p><p className="text-sm text-gray-500">{order.customer?.email || "N/A"}</p></td><td className="px-6 py-4 text-gray-600">{formatDate(order.createdAt)}</td><td className="px-6 py-4 font-bold text-gray-900">{money(order.total)}</td><td className="px-6 py-4"><span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${statusClass(order.status)}`}>{order.status || "Processing"}</span></td></tr>; })}</tbody></table></div>}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, link, linkText }) {
  const classes = { blue: "bg-blue-100 text-blue-600", orange: "bg-orange-100 text-orange-600", purple: "bg-purple-100 text-purple-600" };
  return <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"><div className="flex items-center justify-between"><div><p className="text-sm text-gray-500">{title}</p><h2 className="text-3xl font-bold text-gray-900 mt-2">{value}</h2></div><div className={`w-12 h-12 rounded-xl flex items-center justify-center ${classes[color]}`}><Icon size={24} /></div></div><Link to={link} className="inline-flex items-center gap-1 text-sm text-blue-600 font-semibold mt-5">{linkText}<ArrowRight size={15} /></Link></div>;
}

function StatusLink({ label, count, icon: Icon, color, to }) {
  const classes = { yellow: "bg-yellow-100 text-yellow-600", blue: "bg-blue-100 text-blue-600", green: "bg-green-100 text-green-600", red: "bg-red-100 text-red-600" };
  return <Link to={to} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition"><div className={`w-10 h-10 rounded-xl flex items-center justify-center ${classes[color]}`}><Icon size={19} /></div><div><p className="text-sm text-gray-500">{label}</p><p className="text-xl font-bold text-gray-900">{count}</p></div></Link>;
}

export default Dashboard;
