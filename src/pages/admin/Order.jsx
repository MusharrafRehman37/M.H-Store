
import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Search,
  Eye,
  Trash2,
  X,
} from "lucide-react";

function Order() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ==============================
  // LOAD ORDERS
  // ==============================

  useEffect(() => {
    try {
      const savedOrders = JSON.parse(
        localStorage.getItem("orders") || "[]"
      );

      setOrders(savedOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    }
  }, []);

  // ==============================
  // UPDATE STATUS
  // ==============================

  const updateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
        : order
    );

    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    if (selectedOrder?.id === orderId) {
      setSelectedOrder({
        ...selectedOrder,
        status: newStatus,
      });
    }
  };

  // ==============================
  // DELETE ORDER
  // ==============================

  const handleDelete = (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    const updatedOrders = orders.filter(
      (order) => order.id !== orderId
    );

    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );

    if (selectedOrder?.id === orderId) {
      setSelectedOrder(null);
    }
  };

  // ==============================
  // SEARCH
  // ==============================

  const filteredOrders = orders.filter((order) => {
    const searchText = search.toLowerCase();

    return (
      order.id
        ?.toLowerCase()
        .includes(searchText) ||
      order.customer?.fullName
        ?.toLowerCase()
        .includes(searchText) ||
      order.customer?.email
        ?.toLowerCase()
        .includes(searchText) ||
      order.status
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  // ==============================
  // STATUS CLASSES
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

  // ==============================
  // DATE FORMAT
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      {/* HEADER */}

      <div className="mb-8">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
            <ShoppingCart size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Orders
            </h1>

            <p className="text-gray-500 mt-1">
              Manage and track customer orders.
            </p>
          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">

        <div className="relative max-w-md">

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
            placeholder="Search orders..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* COUNT */}

      <div className="mb-5 text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {filteredOrders.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900">
          {orders.length}
        </span>{" "}
        orders
      </div>

      {/* EMPTY */}

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

          <ShoppingCart
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
              : "Try searching with a different keyword."}
          </p>

        </div>
      ) : (

        /* TABLE */

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px]">

              <thead className="bg-gray-50 border-b border-gray-100">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Order
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

                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition"
                  >

                    {/* ORDER */}

                    <td className="px-6 py-4">

                      <p className="font-bold text-gray-900">
                        {order.id}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {order.items?.length || 0}{" "}
                        products
                      </p>

                    </td>

                    {/* CUSTOMER */}

                    <td className="px-6 py-4">

                      <p className="font-semibold text-gray-900">
                        {order.customer?.fullName ||
                          "Customer"}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {order.customer?.email ||
                          "N/A"}
                      </p>

                    </td>

                    {/* DATE */}

                    <td className="px-6 py-4 text-gray-600">
                      {formatDate(
                        order.createdAt
                      )}
                    </td>

                    {/* TOTAL */}

                    <td className="px-6 py-4">

                      <p className="font-bold text-gray-900">
                        Rs.{" "}
                        {Number(
                          order.total || 0
                        ).toLocaleString(
                          "en-PK"
                        )}
                      </p>

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-4">

                      <select
                        value={
                          order.status ||
                          "Processing"
                        }
                        onChange={(e) =>
                          updateStatus(
                            order.id,
                            e.target.value
                          )
                        }
                        className={`px-3 py-2 rounded-lg text-sm font-semibold border-0 outline-none cursor-pointer ${getStatusClasses(
                          order.status
                        )}`}
                      >

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

                    </td>

                    {/* ACTIONS */}

                    <td className="px-6 py-4">

                      <div className="flex justify-end items-center gap-2">

                        <button
                          onClick={() =>
                            setSelectedOrder(
                              order
                            )
                          }
                          title="View order"
                          className="w-9 h-9 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center transition"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              order.id
                            )
                          }
                          title="Delete order"
                          className="w-9 h-9 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center transition"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>
      )}

      {/* ORDER DETAILS MODAL */}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between p-6 border-b border-gray-100">

              <div>
                <p className="text-sm text-gray-500">
                  Order Details
                </p>

                <h2 className="text-xl font-bold text-gray-900">
                  {selectedOrder.id}
                </h2>
              </div>

              <button
                onClick={() =>
                  setSelectedOrder(null)
                }
                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500"
              >
                <X size={20} />
              </button>

            </div>

            {/* DETAILS */}

            <div className="p-6 space-y-6">

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <p className="text-sm text-gray-500">
                    Customer
                  </p>

                  <p className="font-semibold mt-1">
                    {selectedOrder.customer
                      ?.fullName ||
                      "Customer"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>

                  <p className="font-semibold mt-1 break-all">
                    {selectedOrder.customer
                      ?.email || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Order Date
                  </p>

                  <p className="font-semibold mt-1">
                    {formatDate(
                      selectedOrder.createdAt
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Status
                  </p>

                  <span
                    className={`inline-flex mt-1 px-3 py-1 rounded-full text-sm font-semibold ${getStatusClasses(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status ||
                      "Processing"}
                  </span>
                </div>

              </div>

              {/* ITEMS */}

              <div>

                <h3 className="font-bold text-lg mb-4">
                  Order Items
                </h3>

                <div className="space-y-3">

                  {selectedOrder.items?.map(
                    (item, index) => {

                      const quantity =
                        Number(
                          item.quantity || 1
                        );

                      const price =
                        Number(
                          item.price || 0
                        );

                      return (
                        <div
                          key={
                            item.productId ||
                            index
                          }
                          className="flex items-center gap-4 bg-gray-50 rounded-xl p-3"
                        >

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />

                          <div className="flex-1">

                            <p className="font-semibold">
                              {item.name}
                            </p>

                            <p className="text-sm text-gray-500 mt-1">
                              Qty: {quantity}
                            </p>

                          </div>

                          <p className="font-bold">
                            Rs.{" "}
                            {(
                              price *
                              quantity
                            ).toLocaleString(
                              "en-PK"
                            )}
                          </p>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

              {/* TOTAL */}

              <div className="border-t border-gray-100 pt-5 flex items-center justify-between">

                <span className="text-lg font-bold">
                  Total
                </span>

                <span className="text-2xl font-bold">
                  Rs.{" "}
                  {Number(
                    selectedOrder.total || 0
                  ).toLocaleString(
                    "en-PK"
                  )}
                </span>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Order;

