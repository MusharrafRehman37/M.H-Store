import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ShoppingCart, Search, Eye, Trash2, X, RefreshCw } from "lucide-react";
import { getAllLocalOrders, updateLocalOrderStatus } from "../../utils/orderStorage";

const STATUSES = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

function Order() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get("status");
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState(STATUSES.includes(initialStatus) ? initialStatus : "All");

  const loadOrders = () => setOrders(getAllLocalOrders());

  useEffect(() => {
    loadOrders();
    window.addEventListener("ordersUpdated", loadOrders);
    window.addEventListener("storage", loadOrders);
    return () => {
      window.removeEventListener("ordersUpdated", loadOrders);
      window.removeEventListener("storage", loadOrders);
    };
  }, []);

  const changeFilter = (status) => {
    setStatusFilter(status);
    if (status === "All") setSearchParams({});
    else setSearchParams({ status });
  };

  const updateStatus = (orderId, newStatus) => {
    const updated = updateLocalOrderStatus(orderId, newStatus);
    if (updated) {
      setOrders(getAllLocalOrders());
      setSelectedOrder((current) => current && String(current.id ?? current._id) === String(orderId) ? updated : current);
    }
  };

  const handleDelete = (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    const updated = orders.filter((order) => String(order.id ?? order._id) !== String(orderId));
    localStorage.setItem("orders", JSON.stringify(updated));
    window.dispatchEvent(new Event("ordersUpdated"));
    setOrders(updated);
    setSelectedOrder(null);
  };

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    return orders.filter((order) => {
      const id = String(order.orderNumber ?? order.id ?? order._id ?? "");
      const status = order.status || "Processing";
      const matchesStatus = statusFilter === "All" || status.toLowerCase() === statusFilter.toLowerCase();
      const haystack = `${id} ${order.customer?.fullName || ""} ${order.customer?.email || ""} ${status}`.toLowerCase();
      return matchesStatus && (!term || haystack.includes(term));
    });
  }, [orders, search, statusFilter]);

  const count = (status) => orders.filter((order) => (order.status || "Processing").toLowerCase() === status.toLowerCase()).length;
  const money = (value) => `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;
  const formatDate = (date) => date ? new Date(date).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" }) : "N/A";
  const statusClass = (status) => ({ Delivered: "bg-green-100 text-green-700", Shipped: "bg-blue-100 text-blue-700", Cancelled: "bg-red-100 text-red-700", Processing: "bg-yellow-100 text-yellow-700" }[status] || "bg-gray-100 text-gray-700");

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div className="flex items-center gap-3"><div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center"><ShoppingCart size={25} /></div><div><h1 className="text-3xl font-bold text-gray-900">Orders</h1><p className="text-gray-500 mt-1">Manage orders and filter them by status.</p></div></div>
        <button onClick={loadOrders} className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl font-semibold text-gray-700"><RefreshCw size={17} />Refresh</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="relative max-w-md mb-5"><Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => <button key={status} onClick={() => changeFilter(status)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${statusFilter === status ? "bg-slate-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{status}{status !== "All" ? ` (${count(status)})` : ` (${orders.length})`}</button>)}
        </div>
      </div>

      <div className="mb-5 text-sm text-gray-500">Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> of <span className="font-semibold text-gray-900">{orders.length}</span> orders</div>

      {filteredOrders.length === 0 ? <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center"><ShoppingCart size={55} className="mx-auto text-gray-300" /><h2 className="text-2xl font-bold mt-5 text-gray-900">No Orders Found</h2><p className="text-gray-500 mt-2">Try another status or search term.</p></div> : <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"><div className="overflow-x-auto"><table className="w-full min-w-[950px]"><thead className="bg-gray-50 border-b border-gray-100"><tr><th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Order</th><th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Customer</th><th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Date</th><th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Total</th><th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Status</th><th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">
        {filteredOrders.map((order) => { const id = order.id ?? order._id; const status = order.status || "Processing"; return <tr key={id} className="hover:bg-gray-50"><td className="px-6 py-4"><p className="font-bold text-gray-900">#{order.orderNumber ?? id}</p><p className="text-xs text-gray-500 mt-1">{order.totalItems || order.products?.reduce((sum, item) => sum + Number(item.quantity || 1), 0) || 0} items</p></td><td className="px-6 py-4"><p className="font-semibold text-gray-900">{order.customer?.fullName || "Customer"}</p><p className="text-sm text-gray-500 mt-1">{order.customer?.email || "N/A"}</p></td><td className="px-6 py-4 text-gray-600">{formatDate(order.createdAt)}</td><td className="px-6 py-4 font-bold text-gray-900">{money(order.total)}</td><td className="px-6 py-4"><select value={status} onChange={(e) => updateStatus(id, e.target.value)} className={`px-3 py-2 rounded-lg text-sm font-semibold border-0 outline-none cursor-pointer ${statusClass(status)}`}><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></td><td className="px-6 py-4"><div className="flex justify-end gap-2"><button onClick={() => setSelectedOrder(order)} className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center" title="View"><Eye size={17} /></button><button onClick={() => handleDelete(id)} className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center" title="Delete"><Trash2 size={17} /></button></div></td></tr>; })}
      </tbody></table></div></div>}

      {selectedOrder && <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}><div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between mb-6"><div><p className="text-sm text-gray-500">Order ID</p><h2 className="text-2xl font-bold">#{selectedOrder.orderNumber ?? selectedOrder.id ?? selectedOrder._id}</h2></div><button onClick={() => setSelectedOrder(null)} className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center"><X size={18} /></button></div><div className="grid grid-cols-1 sm:grid-cols-2 gap-5"><div><p className="text-sm text-gray-400">Customer</p><p className="font-semibold">{selectedOrder.customer?.fullName || "Customer"}</p></div><div><p className="text-sm text-gray-400">Email</p><p className="font-semibold">{selectedOrder.customer?.email || "N/A"}</p></div><div><p className="text-sm text-gray-400">Date</p><p className="font-semibold">{formatDate(selectedOrder.createdAt)}</p></div><div><p className="text-sm text-gray-400">Status</p><span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${statusClass(selectedOrder.status)}`}>{selectedOrder.status || "Processing"}</span></div></div><div className="border-t mt-6 pt-5"><h3 className="font-bold mb-4">Order Items</h3>{selectedOrder.products?.map((item, index) => <div key={item.productId || index} className="flex items-center gap-3 py-2"><img src={item.image || "https://via.placeholder.com/80"} alt={item.name} className="w-12 h-12 rounded-lg object-cover" /><div className="flex-1"><p className="font-semibold">{item.name}</p><p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p></div><p className="font-semibold">{money(Number(item.price || 0) * Number(item.quantity || 1))}</p></div>)}</div><div className="border-t mt-6 pt-5 text-right"><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold">{money(selectedOrder.total)}</p></div></div></div>}
    </div>
  );
}
export default Order;
