import { Link } from "react-router-dom";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Trash,
} from "lucide-react";

import { useCart } from "../../context/CartContext";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    totalAmount,
    totalItems,
  } = useCart();

  // Empty Cart
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={38} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mt-6">
            Your Cart is Empty
          </h1>

          <p className="text-gray-500 mt-3">
            Looks like you haven't added anything to your cart yet.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-7 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Start Shopping
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Shopping Cart
            </h1>

            <p className="text-gray-500 mt-2">
              {totalItems} item{totalItems !== 1 ? "s" : ""} in your cart
            </p>
          </div>

          <button
            onClick={clearCart}
            className="inline-flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 border border-red-100 px-4 py-2.5 rounded-lg font-medium transition"
          >
            <Trash size={17} />
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-8">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const productId = item.id || item._id;
              const price = Number(item.price || 0);
              const quantity = Number(item.quantity || 1);
              const itemTotal = price * quantity;

              return (
                <div
                  key={productId}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-100 shadow-sm"
                >
                  <div className="flex gap-4 sm:gap-5">

                    {/* Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">

                      <div className="flex justify-between gap-3">
                        <div className="min-w-0">
                          {item.category && (
                            <p className="text-xs text-blue-600 font-semibold uppercase">
                              {item.category}
                            </p>
                          )}

                          <h2 className="font-semibold text-gray-900 mt-1 truncate">
                            {item.name}
                          </h2>
                        </div>

                        <button
                          onClick={() => removeFromCart(productId)}
                          className="text-gray-400 hover:text-red-500 transition shrink-0"
                          title="Remove from cart"
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="font-bold text-lg mt-3">
                        Rs.{price.toFixed(2)}
                      </p>

                      {/* Bottom controls */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mt-4">

                        {/* Quantity */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => decreaseQuantity(productId)}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={15} />
                          </button>

                          <span className="font-semibold w-6 text-center">
                            {quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(productId)}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus size={15} />
                          </button>
                        </div>

                        {/* Item subtotal */}
                        <p className="font-semibold text-gray-900">
                          Rs.{itemTotal.toFixed(2)}
                        </p>

                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">

              <h2 className="text-xl font-bold text-gray-900">
                Order Summary
              </h2>

              <div className="border-t border-gray-100 my-5" />

              <div className="flex justify-between text-gray-600">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="flex justify-between text-gray-600 mt-4">
                <span>Subtotal</span>
                <span>Rs.{Number(totalAmount).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600 mt-4">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>

              <div className="border-t border-gray-100 my-5" />

              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Total</span>
                <span>Rs.{Number(totalAmount).toFixed(2)}</span>
              </div>

              <Link
                to="/checkout"
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition"
              >
                Proceed to Checkout
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/products"
                className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4"
              >
                Continue Shopping
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;