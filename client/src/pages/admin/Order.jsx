import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ShoppingCart,
  Search,
  Eye,
  Trash2,
  X,
  RefreshCw,
  Printer,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  User,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getAllOrders,
  updateOrderStatus,
} from "../../services/orderService";
import {
  getAllLocalOrders,
  updateLocalOrderStatus,
} from "../../utils/orderStorage";

const STATUSES = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const normalizeStatus = (status) => {
  const value = String(status || "Processing").trim().toLowerCase();
  if (value === "shipped to supplier" || value === "shipped") return "Shipped";
  if (value === "delivered") return "Delivered";
  if (value === "cancelled" || value === "canceled") return "Cancelled";
  return "Processing";
};

function Order() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get("status");

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState(
    STATUSES.includes(initialStatus) ? initialStatus : "All"
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const loadOrders = async (showLoader = false) => {
    if (showLoader) setRefreshing(true);
    setError("");

    try {
      // Use the same API/local fallback used by checkout and customer orders.
      const data = await getAllOrders(token);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Admin orders load error:", err);
      // Last fallback for demo/localStorage mode.
      setOrders(getAllLocalOrders());
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();

    const refresh = () => loadOrders();
    window.addEventListener("ordersUpdated", refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("ordersUpdated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [token]);

  useEffect(() => {
    const urlStatus = searchParams.get("status");
    if (STATUSES.includes(urlStatus)) setStatusFilter(urlStatus);
    else setStatusFilter("All");
  }, [searchParams]);

  const changeFilter = (status) => {
    setStatusFilter(status);
    if (status === "All") setSearchParams({});
    else setSearchParams({ status });
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(String(orderId));
      setError("");

      const result = await updateOrderStatus(orderId, newStatus, token);
      const updatedOrder = result?.order;

      if (updatedOrder) {
        setOrders((previous) =>
          previous.map((order) =>
            String(order.id ?? order._id ?? order.orderNumber) === String(orderId)
              ? updatedOrder
              : order
          )
        );
        setSelectedOrder((current) =>
          current &&
          String(current.id ?? current._id ?? current.orderNumber) === String(orderId)
            ? updatedOrder
            : current
        );
      } else {
        await loadOrders();
      }
    } catch (err) {
      console.error("Status update error:", err);
      // Keep local/demo orders working if there is no backend.
      const local = updateLocalOrderStatus(orderId, newStatus);
      if (local) {
        setOrders(getAllLocalOrders());
        setSelectedOrder(local);
      } else {
        setError(err.message || "Failed to update order status.");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    const updated = getAllLocalOrders().filter(
      (order) => String(order.id ?? order._id ?? order.orderNumber) !== String(orderId)
    );

    localStorage.setItem("orders", JSON.stringify(updated));
    window.dispatchEvent(new Event("ordersUpdated"));
    setOrders((current) =>
      current.filter(
        (order) => String(order.id ?? order._id ?? order.orderNumber) !== String(orderId)
      )
    );
    setSelectedOrder(null);
  };

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();

    return orders.filter((order) => {
      const id = String(order.orderNumber ?? order.id ?? order._id ?? "");
      const status = normalizeStatus(order.status);
      const customer = order.customer || {};
      const matchesStatus = statusFilter === "All" || status === statusFilter;
      const haystack = [
        id,
        customer.fullName,
        customer.email,
        customer.phone,
        customer.address,
        customer.city,
        status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesStatus && (!term || haystack.includes(term));
    });
  }, [orders, search, statusFilter]);

  const count = (status) =>
    orders.filter((order) => normalizeStatus(order.status) === status).length;

  const money = (value) =>
    `Rs. ${Number(value || 0).toLocaleString("en-PK")}`;

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("en-PK", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  const statusClass = (status) =>
    ({
      Delivered: "bg-green-100 text-green-700",
      Shipped: "bg-blue-100 text-blue-700",
      Cancelled: "bg-red-100 text-red-700",
      Processing: "bg-yellow-100 text-yellow-700",
    }[normalizeStatus(status)] || "bg-gray-100 text-gray-700");

  const statusIcon = (status) => {
    const normalized = normalizeStatus(status);
    if (normalized === "Delivered") return <CheckCircle size={15} />;
    if (normalized === "Shipped") return <Truck size={15} />;
    if (normalized === "Cancelled") return <XCircle size={15} />;
    return <Clock size={15} />;
  };

  const printOrder = () => {
    if (!selectedOrder) return;
    window.print();
  };

  const customerData = selectedOrder?.customer || {};
  const deliveryData = selectedOrder?.shippingAddress || selectedOrder?.deliveryAddress || {};
  const customerField = (key) => customerData[key] ?? selectedOrder?.[key] ?? deliveryData[key];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={35} className="mx-auto text-blue-600 animate-spin" />
          <p className="text-gray-500 mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 no-print">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
            <ShoppingCart size={25} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-500 mt-1">
              Manage orders, customer details and delivery status.
            </p>
          </div>
        </div>

        <button
          onClick={() => loadOrders(true)}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
        >
          <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
          {refreshing ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 no-print">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 no-print">
        <div className="relative max-w-md mb-5">
          <Search size={19} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, customer, phone, address..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => changeFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                statusFilter === status
                  ? "bg-slate-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {status} {status !== "All" ? `(${count(status)})` : `(${orders.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 text-sm text-gray-500 no-print">
        Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> of{" "}
        <span className="font-semibold text-gray-900">{orders.length}</span> orders
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center no-print">
          <ShoppingCart size={55} className="mx-auto text-gray-300" />
          <h2 className="text-2xl font-bold mt-5 text-gray-900">No Orders Found</h2>
          <p className="text-gray-500 mt-2">Try another status or search term.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden no-print">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    "Order",
                    "Customer",
                    "Date",
                    "Total",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className={`text-left px-6 py-4 text-sm font-semibold text-gray-600 ${
                        heading === "Actions" ? "text-right" : ""
                      }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => {
                  const id = order.id ?? order._id ?? order.orderNumber;
                  const status = normalizeStatus(order.status);
                  const customer = order.customer || {};
                  const itemCount =
                    order.totalItems ||
                    order.products?.reduce(
                      (sum, item) => sum + Number(item.quantity || 1),
                      0
                    ) || 0;

                  return (
                    <tr key={String(id)} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">#{order.orderNumber ?? id}</p>
                        <p className="text-xs text-gray-500 mt-1">{itemCount} items</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">
                          {customer.fullName || "Customer"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{customer.email || "N/A"}</p>
                        <p className="text-xs text-gray-400 mt-1">{customer.phone || "No phone"}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4 font-bold text-gray-900">{money(order.total)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold ${statusClass(status)}`}>
                            {statusIcon(status)}
                            {status}
                          </span>
                          <select
                            value={status}
                            disabled={updatingId === String(id)}
                            onChange={(e) => updateStatus(id, e.target.value)}
                            className="border border-gray-200 rounded-lg px-2 py-2 text-sm bg-white disabled:opacity-50"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100"
                            title="View full order"
                          >
                            <Eye size={17} />
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
                            className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
                            title="Delete local order"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-3 sm:p-5 no-print-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[94vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white border-b px-5 sm:px-7 py-4 flex items-center justify-between no-print">
              <div>
                <p className="text-sm text-gray-500">Complete Order Details</p>
                <h2 className="text-2xl font-bold text-gray-900">
                  Order #{selectedOrder.orderNumber ?? selectedOrder.id ?? selectedOrder._id}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={printOrder}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-800"
                >
                  <Printer size={17} /> Print
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            <div className="print-order p-5 sm:p-7">
              <div className="hidden print:block mb-6 border-b pb-4">
                <h1 className="text-2xl font-bold">M.H Store</h1>
                <p className="text-sm text-gray-600">Customer Order Invoice</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="border rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <User size={19} className="text-blue-600" />
                    <h3 className="font-bold text-gray-900">Customer Information</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <Detail label="Full Name" value={customerField("fullName") || customerField("name")} />
                    <Detail label="Email" value={customerField("email")} />
                    <Detail label="Phone" value={customerField("phone")} />
                  </div>
                </section>

                <section className="border rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin size={19} className="text-blue-600" />
                    <h3 className="font-bold text-gray-900">Delivery Information</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <Detail label="Address" value={customerField("address")} />
                    <Detail label="City" value={customerField("city")} />
                    <Detail label="Postal Code" value={customerField("postalCode") || customerField("zipCode") || customerField("zip")} />
                    <Detail label="Delivery Notes" value={customerField("notes")} />
                  </div>
                </section>
              </div>

              <section className="border rounded-2xl p-5 mt-6">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Package size={19} className="text-blue-600" />
                    <h3 className="font-bold text-gray-900">Order Items</h3>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${statusClass(selectedOrder.status)}`}>
                    {statusIcon(selectedOrder.status)} {normalizeStatus(selectedOrder.status)}
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {(selectedOrder.products || []).map((item, index) => (
                    <div key={item.productId || index} className="flex items-center gap-4 py-4">
                      <img
                        src={item.image || "https://via.placeholder.com/80"}
                        alt={item.name || "Product"}
                        className="w-16 h-16 rounded-xl object-cover border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{item.name || "Product"}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Quantity: {item.quantity || 1} × {money(item.price)}
                        </p>
                      </div>
                      <p className="font-bold text-gray-900">
                        {money(Number(item.price || 0) * Number(item.quantity || 1))}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="border rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CreditCard size={19} className="text-blue-600" />
                    <h3 className="font-bold text-gray-900">Payment & Order</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <Detail label="Order ID" value={`#${selectedOrder.orderNumber ?? selectedOrder.id ?? selectedOrder._id}`} />
                    <Detail label="Order Date" value={formatDate(selectedOrder.createdAt)} />
                    <Detail label="Payment Method" value={selectedOrder.paymentMethod || "Not specified"} />
                    <Detail label="Payment Status" value={selectedOrder.paymentStatus || "Not specified"} />
                  </div>
                </div>

                <div className="border rounded-2xl p-5">
                  <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3 text-sm">
                    <SummaryRow label="Subtotal" value={money(selectedOrder.subtotal)} />
                    <SummaryRow label="Shipping" value={money(selectedOrder.shippingCharge)} />
                    <div className="border-t pt-3 flex items-center justify-between">
                      <span className="font-bold text-gray-900">Grand Total</span>
                      <span className="text-xl font-bold text-gray-900">{money(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
              </section>

              <div className="hidden print:block mt-8 pt-4 border-t text-sm text-gray-500">
                <p>Thank you for shopping with M.H Store.</p>
                <p>Printed on {new Date().toLocaleString("en-PK")}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">{label}</p>
      <p className="font-medium text-gray-800 mt-1 break-words">{value || "Not provided"}</p>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

export default Order;
