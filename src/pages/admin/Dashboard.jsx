
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  Truck,
} from "lucide-react";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // ==============================
  // LOAD ADMIN DATA
  // ==============================

  useEffect(() => {
    try {
      const savedProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );

      const savedUsers = JSON.parse(
        localStorage.getItem("users") || "[]"
      );

      const savedOrders = JSON.parse(
        localStorage.getItem("orders") || "[]"
      );

      setProducts(savedProducts);
      setUsers(savedUsers);
      setOrders(savedOrders);
    } catch (error) {
      console.error("Dashboard data error:", error);
    }
  }, []);

  // ==============================
  // TOTAL REVENUE
  // ==============================

  const totalRevenue = orders
    .filter(
      (order) =>
        order.status?.toLowerCase() !== "cancelled"
    )
    .reduce(
      (total, order) =>
        total + Number(order.total || 0),
      0
    );

  // ==============================
  // ORDER STATUS COUNTS
  // ==============================

  const processingOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "processing"
  ).length;

  const shippedOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "shipped"
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      order.status?.toLowerCase() === "delivered"
  ).length;

  // ==============================
  // RECENT ORDERS
  // ==============================

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0) -
        new Date(a.createdAt || 0)
    )
    .slice(0, 5);

  // ==============================
  // FORMAT DATE
  // ==============================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-PK",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==============================
  // STATUS STYLE
  // ==============================

  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "processing":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Overview of your store performance.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          <Plus size={18} />
          Add Product
        </Link>

      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        {/* PRODUCTS */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Products
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {products.length}
              </h2>
            </div>

            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Package size={24} />
            </div>

          </div>

          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-semibold mt-5"
          >
            Manage Products
            <ArrowRight size={15} />
          </Link>

        </div>

        {/* ORDERS */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Orders
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {orders.length}
              </h2>
            </div>

            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
              <ShoppingCart size={24} />
            </div>

          </div>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 font-semibold mt-5"
          >
            Manage Orders
            <ArrowRight size={15} />
          </Link>

        </div>

        {/* USERS */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <h2 className="text-3xl font-bold text-gray-900 mt-2">
                {users.length}
              </h2>
            </div>

            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <Users size={24} />
            </div>

          </div>

          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700 font-semibold mt-5"
          >
            Manage Users
            <ArrowRight size={15} />
          </Link>

        </div>

        {/* REVENUE */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Revenue
              </p>

              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                Rs.{" "}
                {totalRevenue.toLocaleString(
                  "en-PK"
                )}
              </h2>
            </div>

            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <DollarSign size={24} />
            </div>

          </div>

          <p className="text-sm text-gray-500 mt-5">
            From completed orders
          </p>

        </div>

      </div>

      {/* ORDER STATUS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">

          <div className="w-11 h-11 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center">
            <Clock size={21} />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Processing
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {processingOrders}
            </p>
          </div>

        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">

          <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Truck size={21} />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Shipped
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {shippedOrders}
            </p>
          </div>

        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">

          <div className="w-11 h-11 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
            <CheckCircle size={21} />
          </div>

          <div>
            <p className="text-sm text-gray-500">
              Delivered
            </p>

            <p className="text-2xl font-bold text-gray-900">
              {deliveredOrders}
            </p>
          </div>

        </div>

      </div>

      {/* RECENT ORDERS */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6 border-b border-gray-100">

          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Recent Orders
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Latest customer orders.
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm"
          >
            View All
            <ArrowRight size={16} />
          </Link>

        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">

            <ShoppingCart
              size={45}
              className="mx-auto text-gray-300"
            />

            <h3 className="font-bold text-lg text-gray-900 mt-4">
              No Orders Yet
            </h3>

            <p className="text-gray-500 mt-1">
              Customer orders will appear here.
            </p>

          </div>
        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[750px]">

              <thead className="bg-gray-50">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Order ID
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Customer
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Date
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Total
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {recentOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition"
                  >

                    <td className="px-6 py-4 font-bold text-gray-900">
                      {order.id}
                    </td>

                    <td className="px-6 py-4">

                      <p className="font-semibold text-gray-900">
                        {order.customer?.fullName ||
                          "Customer"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {order.customer?.email ||
                          "N/A"}
                      </p>

                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(
                        order.createdAt
                      )}
                    </td>

                    <td className="px-6 py-4 font-bold text-gray-900">
                      Rs.{" "}
                      {Number(
                        order.total || 0
                      ).toLocaleString(
                        "en-PK"
                      )}
                    </td>

                    <td className="px-6 py-4">

                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getStatusClasses(
                          order.status
                        )}`}
                      >
                        {order.status ||
                          "Processing"}
                      </span>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;

