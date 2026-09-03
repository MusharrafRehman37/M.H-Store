
import { Link } from "react-router-dom";
import {
  Package,
  Heart,
  ShoppingBag,
  ArrowRight,
  ShoppingCart,
  User,
  CalendarDays,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function Dashboard() {
  const { user } = useAuth();

  const { cartItems, totalItems } =
    useCart();

  const { wishlistItems } =
    useWishlist();

  // ==========================================
  // LOAD ORDERS
  // ==========================================

  let savedOrders = [];

  try {
    savedOrders = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );

    if (!Array.isArray(savedOrders)) {
      savedOrders = [];
    }
  } catch (error) {
    console.error(
      "Error loading orders:",
      error
    );

    savedOrders = [];
  }

  // ==========================================
  // CURRENT USER ID
  // ==========================================

  const currentUserId = String(
    user?.id ||
      user?._id ||
      user?.uid ||
      user?.email ||
      ""
  );

  // ==========================================
  // USER ORDERS
  // ==========================================

  const userOrders = savedOrders.filter(
    (order) => {
      const orderUserId = String(
        order.userId ||
          order.user?._id ||
          order.user?.id ||
          order.customerId ||
          order.customer?.id ||
          order.customer?.email ||
          ""
      );

      const orderEmail = String(
        order.email ||
          order.customer?.email ||
          ""
      ).toLowerCase();

      const userEmail =
        String(
          user?.email || ""
        ).toLowerCase();

      return (
        orderUserId === currentUserId ||
        (userEmail &&
          orderEmail === userEmail)
      );
    }
  );

  // ==========================================
  // RECENT ORDERS
  // ==========================================

  const recentOrders = [
    ...userOrders,
  ]
    .sort(
      (a, b) =>
        new Date(
          b.createdAt ||
            b.date ||
            0
        ) -
        new Date(
          a.createdAt ||
            a.date ||
            0
        )
    )
    .slice(0, 3);

  // ==========================================
  // TOTAL SPENDING
  // ==========================================

  const totalSpent =
    userOrders.reduce(
      (total, order) => {
        if (
          order.status?.toLowerCase() ===
          "cancelled"
        ) {
          return total;
        }

        return (
          total +
          Number(order.total || 0)
        );
      },
      0
    );

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString(
      "en-PK",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // STATUS COLORS
  // ==========================================

  const getStatusClasses = (
    status
  ) => {
    switch (
      status?.toLowerCase()
    ) {
      case "delivered":
        return "bg-green-100 text-green-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "pending":
      case "processing":
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // ==========================================
  // USER INFO
  // ==========================================

  const userName =
    user?.fullName ||
    user?.name ||
    "Customer";

  const userEmail =
    user?.email ||
    "No email available";

  const userRole =
    user?.role ||
    "customer";

  const userInitial =
    userName
      .trim()
      .charAt(0)
      .toUpperCase() ||
    "U";

  return (
    <div className="min-h-screen bg-gray-50 py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ==================================
            PROFILE / WELCOME
        ================================== */}

        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-7 sm:p-10 text-white">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-7">

            <div className="flex items-center gap-5">

              {/* AVATAR */}

              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white text-blue-600 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-bold shrink-0">
                {userInitial}
              </div>

              <div className="min-w-0">

                <p className="text-blue-100 text-sm">
                  Welcome back
                </p>

                <h1 className="text-3xl sm:text-4xl font-bold mt-1 truncate">
                  {userName}!
                </h1>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 text-blue-100 text-sm">

                  <span className="flex items-center gap-2">
                    <Mail size={15} />
                    {userEmail}
                  </span>

                  <span className="flex items-center gap-2">
                    <ShieldCheck size={15} />
                    <span className="capitalize">
                      {userRole}
                    </span>
                  </span>

                </div>

              </div>

            </div>

            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-5 py-3 rounded-xl font-semibold transition"
            >
              View My Orders
              <ArrowRight size={18} />
            </Link>

          </div>

        </div>

        {/* ==================================
            PROFILE INFORMATION
        ================================== */}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mt-8">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <User size={20} />
            </div>

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                My Profile
              </h2>

              <p className="text-sm text-gray-500">
                Your account information
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500">
                Full Name
              </p>

              <p className="font-semibold text-gray-900 mt-1">
                {userName}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500">
                Email Address
              </p>

              <p className="font-semibold text-gray-900 mt-1 break-all">
                {userEmail}
              </p>

            </div>

            <div className="bg-gray-50 rounded-xl p-4">

              <p className="text-xs text-gray-500">
                Account Type
              </p>

              <p className="font-semibold text-gray-900 mt-1 capitalize">
                {userRole}
              </p>

            </div>

          </div>

        </div>

        {/* ==================================
            STATISTICS
        ================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">

          {/* ORDERS */}

          <Link
            to="/orders"
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  My Orders
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {userOrders.length}
                </h2>

              </div>

              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition">
                <Package size={24} />
              </div>

            </div>

            <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold mt-5">
              View Orders
              <ArrowRight size={16} />
            </div>

          </Link>

          {/* SPENT */}

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Total Spent
                </p>

                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  Rs.{" "}
                  {totalSpent.toLocaleString(
                    "en-PK"
                  )}
                </h2>

              </div>

              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                <ShoppingBag size={24} />
              </div>

            </div>

            <p className="text-sm text-gray-500 mt-5">
              Excluding cancelled orders
            </p>

          </div>

          {/* WISHLIST */}

          <Link
            to="/wishlist"
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Wishlist Items
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {wishlistItems.length}
                </h2>

              </div>

              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition">
                <Heart size={24} />
              </div>

            </div>

            <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold mt-5">
              View Wishlist
              <ArrowRight size={16} />
            </div>

          </Link>

          {/* CART */}

          <Link
            to="/cart"
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-gray-500 text-sm">
                  Cart Items
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mt-2">
                  {totalItems ||
                    cartItems.length}
                </h2>

              </div>

              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition">
                <ShoppingCart size={24} />
              </div>

            </div>

            <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold mt-5">
              View Cart
              <ArrowRight size={16} />
            </div>

          </Link>

        </div>

        {/* ==================================
            RECENT ORDERS
        ================================== */}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mt-8 overflow-hidden">

          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Recent Orders
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your latest purchases
              </p>

            </div>

            <Link
              to="/orders"
              className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
            >
              View All
            </Link>

          </div>

          {recentOrders.length === 0 ? (

            <div className="p-10 text-center">

              <div className="w-16 h-16 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Package size={30} />
              </div>

              <h3 className="font-bold text-gray-900 mt-4">
                No Orders Yet
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Your completed orders will appear here.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-5 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition"
              >
                Start Shopping
                <ArrowRight size={16} />
              </Link>

            </div>

          ) : (

            <div className="divide-y divide-gray-100">

              {recentOrders.map(
                (order, index) => {

                  const orderId =
                    order.id ||
                    order._id ||
                    `ORD-${index + 1}`;

                  const items =
                    order.items ||
                    order.products ||
                    [];

                  const itemCount =
                    Array.isArray(items)
                      ? items.reduce(
                          (
                            total,
                            item
                          ) =>
                            total +
                            Number(
                              item.quantity ||
                                1
                            ),
                          0
                        )
                      : Number(
                          order.totalItems ||
                            0
                        );

                  return (
                    <div
                      key={orderId}
                      className="p-6 hover:bg-gray-50 transition"
                    >

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                        {/* ORDER */}

                        <div>

                          <p className="text-xs text-gray-500">
                            Order ID
                          </p>

                          <h3 className="font-bold text-gray-900 mt-1">
                            #{orderId}
                          </h3>

                        </div>

                        {/* DATE */}

                        <div>

                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <CalendarDays size={14} />
                            Order Date
                          </p>

                          <p className="font-semibold text-gray-900 mt-1">
                            {formatDate(
                              order.createdAt ||
                                order.date
                            )}
                          </p>

                        </div>

                        {/* ITEMS */}

                        <div>

                          <p className="text-xs text-gray-500">
                            Items
                          </p>

                          <p className="font-semibold text-gray-900 mt-1">
                            {itemCount}
                          </p>

                        </div>

                        {/* TOTAL */}

                        <div>

                          <p className="text-xs text-gray-500">
                            Total
                          </p>

                          <p className="font-bold text-gray-900 mt-1">
                            Rs.{" "}
                            {Number(
                              order.total ||
                                0
                            ).toLocaleString(
                              "en-PK"
                            )}
                          </p>

                        </div>

                        {/* STATUS */}

                        <span
                          className={`inline-flex self-start lg:self-auto px-4 py-2 rounded-full text-xs font-semibold ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {order.status ||
                            "Processing"}
                        </span>

                      </div>

                      {/* PRODUCTS */}

                      {Array.isArray(
                        items
                      ) &&
                        items.length > 0 && (
                          <div className="mt-5 pt-5 border-t border-gray-100">

                            <p className="text-sm font-semibold text-gray-900 mb-3">
                              Products
                            </p>

                            <div className="flex flex-wrap gap-3">

                              {items
                                .slice(0, 4)
                                .map(
                                  (
                                    item,
                                    itemIndex
                                  ) => {

                                    const productId =
                                      item.id ||
                                      item._id ||
                                      `${orderId}-${itemIndex}`;

                                    return (
                                      <div
                                        key={
                                          productId
                                        }
                                        className="flex items-center gap-3 bg-gray-50 rounded-xl p-2.5 pr-4"
                                      >

                                        <img
                                          src={
                                            item.image ||
                                            "https://via.placeholder.com/60"
                                          }
                                          alt={
                                            item.name ||
                                            "Product"
                                          }
                                          className="w-12 h-12 object-cover rounded-lg"
                                        />

                                        <div className="max-w-[160px]">

                                          <p className="text-sm font-semibold text-gray-900 truncate">
                                            {item.name ||
                                              "Product"}
                                          </p>

                                          <p className="text-xs text-gray-500 mt-1">
                                            Qty:{" "}
                                            {item.quantity ||
                                              1}
                                          </p>

                                        </div>

                                      </div>
                                    );
                                  }
                                )}

                              {items.length >
                                4 && (
                                <div className="flex items-center px-4 bg-gray-100 rounded-xl text-xs font-semibold text-gray-600">
                                  +
                                  {items.length -
                                    4}{" "}
                                  more
                                </div>
                              )}

                            </div>

                          </div>
                        )}

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>

        {/* ==================================
            QUICK ACTIONS
        ================================== */}

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mt-8">

          <h2 className="text-xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <p className="text-sm text-gray-500 mt-1 mb-5">
            Quickly access your shopping options.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <Link
              to="/products"
              className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:bg-blue-50 transition"
            >

              <ShoppingBag
                className="text-blue-600"
                size={25}
              />

              <h3 className="font-semibold mt-4">
                Browse Products
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Discover our latest products.
              </p>

            </Link>

            <Link
              to="/orders"
              className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:bg-blue-50 transition"
            >

              <Package
                className="text-blue-600"
                size={25}
              />

              <h3 className="font-semibold mt-4">
                My Orders
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Track your previous orders.
              </p>

            </Link>

            <Link
              to="/wishlist"
              className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:bg-blue-50 transition"
            >

              <Heart
                className="text-red-500"
                size={25}
              />

              <h3 className="font-semibold mt-4">
                My Wishlist
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                View your saved products.
              </p>

            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;

