
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getMyOrders } from "../../services/orderService";

function MyOrders() {
  const { user, token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  const loadOrders = async () => {
    if (!token) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getMyOrders(token, user);

      setOrders(data || []);
    } catch (err) {
      console.error(
        "My Orders Error:",
        err
      );

      setError(
        err.message ||
          "Failed to load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [token]);

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";

      case "Shipped":
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
  // LOGIN CHECK
  // ==========================================

  if (!user || !token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">

        <div className="text-center">

          <Package
            size={60}
            className="mx-auto text-gray-300"
          />

          <h1 className="text-3xl font-bold text-gray-900 mt-5">
            Login Required
          </h1>

          <p className="text-gray-500 mt-2">
            Please login to view your orders.
          </p>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Login
            <ArrowRight size={18} />
          </Link>

        </div>

      </div>
    );
  }

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
            Loading your orders...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Package size={25} />
            </div>

            <div>

              <h1 className="text-3xl font-bold text-gray-900">
                My Orders
              </h1>

              <p className="text-gray-500 mt-1">
                View and track all your orders.
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={loadOrders}
            className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl font-semibold transition"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>

        {/* =====================================
            ERROR
        ===================================== */}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <span>
              {error}
            </span>

            <button
              type="button"
              onClick={loadOrders}
              className="font-semibold underline"
            >
              Try Again
            </button>

          </div>
        )}

        {/* =====================================
            NO ORDERS
        ===================================== */}

        {orders.length === 0 ? (

          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">

            <ShoppingBag
              size={55}
              className="mx-auto text-blue-600"
            />

            <h2 className="text-2xl font-bold mt-5 text-gray-900">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't placed any orders yet.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
            >
              Start Shopping
              <ArrowRight size={18} />
            </Link>

          </div>

        ) : (

          /* ===================================
             ORDERS
          =================================== */

          <div className="space-y-5">

            {orders.map((order) => {

              const orderId =
                order._id || order.id;

              return (
                <div
                  key={orderId}
                  className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm"
                >

                  {/* TOP */}

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div>

                      <p className="text-sm text-gray-500">
                        Order ID
                      </p>

                      <h2 className="font-bold text-lg text-gray-900 break-all">
                        {orderId}
                      </h2>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Order Date
                      </p>

                      <p className="font-semibold text-gray-900">
                        {formatDate(
                          order.createdAt
                        )}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Items
                      </p>

                      <p className="font-semibold text-gray-900">
                        {order.totalItems ||
                          order.products?.reduce(
                            (total, item) =>
                              total +
                              Number(
                                item.quantity || 1
                              ),
                            0
                          ) ||
                          0}
                      </p>

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Total Amount
                      </p>

                      <p className="font-bold text-lg text-gray-900">
                        Rs.{Number(
                          order.total || 0
                        ).toFixed(2)}
                      </p>

                    </div>

                    <div>

                      <span
                        className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status ||
                          "Pending"}
                      </span>

                    </div>

                  </div>

                  {/* PRODUCTS */}

                  {order.products?.length >
                    0 && (
                    <div className="border-t border-gray-100 mt-6 pt-5">

                      <p className="text-sm font-semibold text-gray-700 mb-4">
                        Order Items
                      </p>

                      <div className="space-y-3">

                        {order.products.map(
                          (item, index) => {

                            const itemId =
                              item.productId ||
                              item._id ||
                              index;

                            return (
                              <div
                                key={itemId}
                                className="flex items-center gap-3"
                              >

                                {item.image ? (
                                  <img
                                    src={
                                      item.image
                                    }
                                    alt={
                                      item.name
                                    }
                                    className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                                  />
                                ) : (
                                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center">
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
                            );
                          }
                        )}

                      </div>

                    </div>
                  )}

                  {/* CUSTOMER */}

                  {order.customer && (
                    <div className="border-t border-gray-100 mt-6 pt-5">

                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Delivery Information
                      </p>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">

                        <div>
                          <p className="text-gray-400">
                            Name
                          </p>

                          <p className="font-medium text-gray-800">
                            {
                              order.customer
                                .fullName
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400">
                            Phone
                          </p>

                          <p className="font-medium text-gray-800">
                            {
                              order.customer
                                .phone
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400">
                            City
                          </p>

                          <p className="font-medium text-gray-800">
                            {
                              order.customer
                                .city
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-400">
                            Payment
                          </p>

                          <p className="font-medium text-gray-800">
                            {order.paymentMethod ===
                            "cash-on-delivery"
                              ? "Cash on Delivery"
                              : "Card"}
                          </p>
                        </div>

                      </div>

                      <div className="mt-3">

                        <p className="text-gray-400 text-sm">
                          Address
                        </p>

                        <p className="font-medium text-gray-800 text-sm">
                          {
                            order.customer
                              .address
                          }
                        </p>

                      </div>

                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
}

export default MyOrders;

