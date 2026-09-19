
import { useEffect, useState } from "react";
import {
  Package,
  RefreshCw,
  Search,
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

function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  const loadOrders = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getAllOrders(token);

      setOrders(data || []);
    } catch (err) {
      console.error(
        "Admin Orders Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  const handleStatusChange = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingId(orderId);
      setError("");

      const data =
        await updateOrderStatus(
          orderId,
          status,
          token
        );

      setOrders((previous) =>
        previous.map((order) =>
          order._id === orderId
            ? data.order
            : order
        )
      );
    } catch (err) {
      console.error(
        "Status Update Error:",
        err
      );

      setError(
        err.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredOrders =
    orders.filter((order) => {
      const term =
        search.trim().toLowerCase();

      if (!term) {
        return true;
      }

      return (
        order._id
          ?.toLowerCase()
          .includes(term) ||
        order.customer?.fullName
          ?.toLowerCase()
          .includes(term) ||
        order.customer?.email
          ?.toLowerCase()
          .includes(term) ||
        order.customer?.phone
          ?.toLowerCase()
          .includes(term) ||
        order.status
          ?.toLowerCase()
          .includes(term)
      );
    });

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Shipped To Supplier":
        return "bg-blue-100 text-blue-700";

      case "Processing":
        return "bg-yellow-100 text-yellow-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ==========================================
  // STATUS ICON
  // ==========================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle size={16} />;

      case "Shipped To Supplier":
        return <Truck size={16} />;

      case "Processing":
        return <Clock size={16} />;

      case "Cancelled":
        return <XCircle size={16} />;

      default:
        return <Package size={16} />;
    }
  };

  // ==========================================
  // DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">

        <div className="text-center">

          <RefreshCw
            size={35}
            className="mx-auto text-blue-600 animate-spin"
          />

          <p className="text-gray-500 mt-4">
            Loading orders...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Package size={23} />
              </div>

              <div>

                <h1 className="text-3xl font-bold text-gray-900">
                  Orders
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage customer orders and delivery status.
                </p>

              </div>

            </div>

          </div>

          <button
            type="button"
            onClick={loadOrders}
            className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-semibold transition"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* ======================================
            SEARCH
        ====================================== */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">

          <div className="relative max-w-lg">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search order ID, customer, email..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        {/* ======================================
            STATS
        ====================================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="text-2xl font-bold mt-1">
              {orders.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="text-2xl font-bold mt-1 text-gray-700">
              {
                orders.filter(
                  (order) =>
                    order.status ===
                    "Pending"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Processing
            </p>

            <p className="text-2xl font-bold mt-1 text-yellow-600">
              {
                orders.filter(
                  (order) =>
                    order.status ===
                    "Processing"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <p className="text-2xl font-bold mt-1 text-green-600">
              {
                orders.filter(
                  (order) =>
                    order.status ===
                    "Delivered"
                ).length
              }
            </p>
          </div>

        </div>

        {/* ======================================
            EMPTY
        ====================================== */}

        {filteredOrders.length === 0 ? (

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

            <Package
              size={55}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-2xl font-bold mt-5 text-gray-900">
              {orders.length === 0
                ? "No Orders Yet"
                : "No Orders Found"}
            </h2>

            <p className="text-gray-500 mt-2">
              {orders.length === 0
                ? "Customer orders will appear here."
                : "Try a different search."}
            </p>

          </div>

        ) : (

          /* ====================================
             ORDER LIST
          ==================================== */

          <div className="space-y-5">

            {filteredOrders.map((order) => (

              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >

                {/* ORDER HEADER */}

                <div className="p-5 md:p-6 border-b border-gray-100">

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div>

                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Order ID
                      </p>

                      <h2 className="font-bold text-gray-900 mt-1 break-all">
                        {order._id}
                      </h2>

                      <p className="text-sm text-gray-500 mt-1">
                        {formatDate(
                          order.createdAt
                        )}
                      </p>

                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(
                          order.status
                        )}

                        {order.status ||
                          "Pending"}
                      </span>

                      <select
                        value={
                          order.status ||
                          "Pending"
                        }
                        disabled={
                          updatingId ===
                          order._id
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                        className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>

                      </select>

                    </div>

                  </div>

                </div>

                {/* CUSTOMER */}

                <div className="p-5 md:p-6">

                  <div className="grid lg:grid-cols-3 gap-6">

                    <div className="lg:col-span-1">

                      <h3 className="font-bold text-gray-900 mb-3">
                        Customer
                      </h3>

                      <div className="space-y-1.5 text-sm">

                        <p className="font-semibold">
                          {
                            order.customer
                              ?.fullName
                          }
                        </p>

                        <p className="text-gray-500">
                          {
                            order.customer
                              ?.email
                          }
                        </p>

                        <p className="text-gray-500">
                          {
                            order.customer
                              ?.phone
                          }
                        </p>

                      </div>

                    </div>

                    {/* DELIVERY */}

                    <div className="lg:col-span-1">

                      <h3 className="font-bold text-gray-900 mb-3">
                        Delivery
                      </h3>

                      <p className="text-sm text-gray-600">
                        {
                          order.customer
                            ?.address
                        }
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {
                          order.customer
                            ?.city
                        }

                        {order.customer
                          ?.postalCode &&
                          ` - ${order.customer.postalCode}`}
                      </p>

                    </div>

                    {/* PAYMENT */}

                    <div className="lg:col-span-1">

                      <h3 className="font-bold text-gray-900 mb-3">
                        Payment
                      </h3>

                      <p className="text-sm text-gray-600">
                        {order.paymentMethod ===
                        "cash-on-delivery"
                          ? "Cash on Delivery"
                          : "Card"}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {order.totalItems} item
                        {Number(
                          order.totalItems
                        ) !== 1
                          ? "s"
                          : ""}
                      </p>

                      <p className="text-xl font-bold text-gray-900 mt-2">
                        Rs.
                        {Number(
                          order.total || 0
                        ).toFixed(2)}
                      </p>

                    </div>

                  </div>

                </div>

                {/* PRODUCTS */}

                {order.products?.length >
                  0 && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5 md:p-6">

                    <h3 className="font-bold text-gray-900 mb-4">
                      Ordered Products
                    </h3>

                    <div className="space-y-3">

                      {order.products.map(
                        (item, index) => (

                          <div
                            key={
                              item.productId ||
                              index
                            }
                            className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-4"
                          >

                            {item.image ? (
                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                                className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center">
                                <Package
                                  size={20}
                                  className="text-gray-400"
                                />
                              </div>
                            )}

                            <div className="flex-1 min-w-0">

                              <p className="font-semibold text-gray-900 truncate">
                                {item.name}
                              </p>

                              <p className="text-sm text-gray-500">
                                Qty:{" "}
                                {item.quantity ||
                                  1}
                              </p>

                            </div>

                            <p className="font-semibold text-gray-900">
                              Rs.
                              {(
                                Number(
                                  item.price ||
                                    0
                                ) *
                                Number(
                                  item.quantity ||
                                    1
                                )
                              ).toFixed(2)}
                            </p>

                          </div>

                        )
                      )}

                    </div>

                  </div>
                )}

              </div>

            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminOrders;

