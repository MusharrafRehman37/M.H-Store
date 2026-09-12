
import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  Mail,
  Phone,
  MapPin,
  User,
  ShoppingBag,
  CheckCircle,
  CreditCard,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/orderService";
import { getShippingCharge } from "../../utils/shipping";

function Checkout() {
  const navigate = useNavigate();

  const { user, token } = useAuth();

  const {
    cartItems,
    totalAmount,
    totalItems,
    clearCart,
  } = useCart();

  const [paymentMethod, setPaymentMethod] =
    useState("cash-on-delivery");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] =
    useState(false);

  const [orderId, setOrderId] =
    useState("");

  const [formData, setFormData] = useState({
    fullName:
      user?.fullName ||
      user?.name ||
      "",

    email: user?.email || "",

    phone: "",

    address: "",

    city: "",

    postalCode: "",

    notes: "",
  });

  const shippingCharge = getShippingCharge(formData.city);
  const grandTotal = Number(totalAmount) + Number(shippingCharge);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleFormChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    setError("");

    if (!user || !token) {
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        customer: {
          fullName:
            formData.fullName.trim(),

          email:
            formData.email.trim(),

          phone:
            formData.phone.trim(),

          address:
            formData.address.trim(),

          city:
            formData.city.trim(),

          postalCode:
            formData.postalCode.trim(),

          notes:
            formData.notes.trim(),
        },

        products: cartItems.map((item) => ({
          productId:
            item.productId ||
            item._id ||
            item.id,

          name: item.name,

          price: Number(item.price),

          image: item.image || "",

          quantity:
            Number(item.quantity) || 1,
        })),

        subtotal: Number(totalAmount),

        shippingCharge: Number(shippingCharge),

        total: Number(grandTotal),

        totalItems: Number(totalItems),

        paymentMethod,
      };

      const data = await createOrder(
        orderData,
        token,
        user
      );

      setOrderId(
        data.order?._id || ""
      );

      clearCart();

      setSuccess(true);
    } catch (err) {
      console.error(
        "Place Order Error:",
        err
      );

      setError(
        err.message ||
          "Failed to place order. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGIN CHECK
  // ==========================================

  if (!user || !token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">

        <div className="text-center">

          <User
            size={60}
            className="mx-auto text-gray-300"
          />

          <h1 className="text-3xl font-bold mt-5">
            Login Required
          </h1>

          <p className="text-gray-500 mt-2">
            Please login before checkout.
          </p>

          <Link
            to="/login"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Login
          </Link>

        </div>

      </div>
    );
  }

  // ==========================================
  // EMPTY CART
  // ==========================================

  if (
    cartItems.length === 0 &&
    !success
  ) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">

        <div className="text-center">

          <ShoppingBag
            size={60}
            className="mx-auto text-gray-300"
          />

          <h1 className="text-3xl font-bold mt-5">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mt-2">
            Add some products before checkout.
          </p>

          <Link
            to="/products"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    );
  }

  // ==========================================
  // SUCCESS
  // ==========================================

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-lg text-center">

          <CheckCircle
            size={70}
            className="mx-auto text-green-500"
          />

          <h1 className="text-3xl font-bold mt-6">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-500 mt-3">
            Thank you for shopping with
            M.H Store. Your order has been
            received successfully.
          </p>

          {orderId && (
            <div className="mt-5 bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500">
                Order ID
              </p>

              <p className="font-bold text-gray-900 break-all">
                {orderId}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-7">

            <Link
              to="/orders"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition"
            >
              View My Orders
            </Link>

            <Link
              to="/products"
              className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold transition"
            >
              Continue Shopping
            </Link>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // CHECKOUT
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-50 py-10">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            Checkout
          </h1>

          <p className="text-gray-500 mt-1">
            Complete your details to place your order.
          </p>

        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">

          {/* =================================
              CUSTOMER INFORMATION
          ================================= */}

          <div className="lg:col-span-2">

            <form
              onSubmit={handlePlaceOrder}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8"
            >

              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Shipping Information
              </h2>

              <div className="grid md:grid-cols-2 gap-5">

                {/* NAME */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>

                  <div className="relative">

                    <User
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>
                </div>

                {/* EMAIL */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email *
                  </label>

                  <div className="relative">

                    <Mail
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>
                </div>

                {/* PHONE */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone *
                  </label>

                  <div className="relative">

                    <Phone
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                      placeholder="03XX-XXXXXXX"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    />

                  </div>
                </div>

                {/* CITY */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    City *
                  </label>

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    required
                    placeholder="Enter your city"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* ADDRESS */}

                <div className="md:col-span-2">

                  <label className="block text-sm font-medium mb-2">
                    Shipping Address *
                  </label>

                  <div className="relative">

                    <MapPin
                      size={18}
                      className="absolute left-3 top-4 text-gray-400"
                    />

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleFormChange}
                      required
                      rows="3"
                      placeholder="Enter your complete shipping address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />

                  </div>

                </div>

                {/* POSTAL */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Postal Code
                  </label>

                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleFormChange}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* NOTES */}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Order Notes
                  </label>

                  <input
                    type="text"
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    placeholder="Optional"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

              </div>

              {/* =================================
                  PAYMENT
              ================================= */}

              <div className="mt-8">

                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Payment Method
                </h2>

                <div className="grid md:grid-cols-2 gap-4">

                  <label className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition ${
                    paymentMethod === "cash-on-delivery"
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash-on-delivery"
                      checked={paymentMethod === "cash-on-delivery"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <CreditCard size={21} className="text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Cash on Delivery</p>
                      <p className="text-xs text-gray-500">Pay when your order arrives.</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition ${
                    paymentMethod === "advance-payment"
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 hover:border-blue-200"
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="advance-payment"
                      checked={paymentMethod === "advance-payment"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <CreditCard size={21} className="text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Advance Payment</p>
                      <p className="text-xs text-gray-500">Pay in advance for your order.</p>
                    </div>
                  </label>

                </div>

                {paymentMethod === "advance-payment" && (
                  <p className="mt-3 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg p-3">
                    Advance payment is currently recorded as the selected payment method. Connect a payment gateway later for real online payment collection.
                  </p>
                )}

              </div>

              {/* =================================
                  SUBMIT
              ================================= */}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition"
              >
                {loading
                  ? "Placing Order..."
                  : `Place Order    •   Rs. ${Number(
                      grandTotal
                    ).toFixed(2)}`}
              </button>

            </form>

          </div>

          {/* =================================
              ORDER SUMMARY
          ================================= */}

          <div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">

              <h2 className="text-xl font-bold">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">

                {cartItems.map((item) => {

                  const productId =
                    item.productId ||
                    item._id ||
                    item.id;

                  return (
                    <div
                      key={productId}
                      className="flex gap-3"
                    >

                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                      />

                      <div className="flex-1 min-w-0">

                        <p className="font-semibold text-sm truncate">
                          {item.name}
                        </p>

                        <p className="text-xs text-gray-500 mt-1">
                          Qty: {item.quantity || 1}
                        </p>

                      </div>

                      <p className="font-semibold text-sm">
                        Rs.
                        {(
                          Number(item.price) *
                          Number(
                            item.quantity || 1
                          )
                        ).toFixed(2)}
                      </p>

                    </div>
                  );
                })}

              </div>

              <div className="border-t border-gray-100 mt-6 pt-5 space-y-3">

                <div className="flex justify-between text-gray-500">
                  <span>Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs.{Number(totalAmount).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {formData.city.trim()
                      ? `Rs.${Number(shippingCharge).toFixed(2)}`
                      : "Enter city"}
                  </span>
                </div>

                <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>Rs.{Number(grandTotal).toFixed(2)}</span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Checkout;

