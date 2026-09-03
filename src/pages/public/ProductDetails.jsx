import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Zap,
  ArrowLeft,
  Minus,
  Plus,
  Check,
} from "lucide-react";

import products from "../../data/product";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const product = products.find(
    (item) => item.id === id
  );

  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">

          <h1 className="text-3xl font-bold text-gray-900">
            Product Not Found
          </h1>

          <Link
            to="/products"
            className="inline-block mt-5 text-blue-600"
          >
            ← Back to Products
          </Link>

        </div>
      </div>
    );
  }

  const favorite = isInWishlist(product.id);

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  const handleBuyNow = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    navigate("/checkout");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        {/* Product */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="grid lg:grid-cols-2">

            {/* IMAGE */}
            <div className="bg-gray-100 min-h-[500px] flex items-center justify-center">

              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full max-h-[600px] object-cover"
              />

            </div>

            {/* INFORMATION */}
            <div className="p-8 lg:p-12">

              {/* Category */}
              <span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full">
                {product.category}
              </span>

              {/* Name */}
              <h1 className="text-4xl font-bold text-gray-900 mt-5">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-4">

                <div className="flex text-yellow-400">
                  ★★★★★
                </div>

                <span className="text-sm text-gray-500">
                  4.8 (120 reviews)
                </span>

              </div>

              {/* Price */}
              <div className="mt-6">

                <span className="text-4xl font-bold text-gray-900">
                  Rs.{product.price.toFixed(2)}
                </span>

              </div>

              {/* Stock */}
              <div className="mt-4">

                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-2 text-green-600 font-medium">
                    <Check size={18} />
                    {product.stock} items available
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">
                    Out of Stock
                  </span>
                )}

              </div>

              {/* Description */}
              <div className="mt-8">

                <h2 className="font-bold text-lg">
                  Product Description
                </h2>

                <p className="text-gray-600 leading-relaxed mt-3">
                  {product.description}
                </p>

              </div>

              {/* Quantity */}
              <div className="mt-8">

                <p className="font-semibold mb-3">
                  Quantity
                </p>

                <div className="flex items-center gap-4">

                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus size={17} />
                  </button>

                  <span className="font-bold text-lg w-8 text-center">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 border rounded-lg flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus size={17} />
                  </button>

                </div>

              </div>

              {/* Buttons */}
              <div className="grid sm:grid-cols-2 gap-4 mt-8">

                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3.5 rounded-xl font-bold transition"
                >
                  <ShoppingCart size={19} />
                  Add to Cart
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold transition"
                >
                  <Zap size={19} />
                  Buy Now
                </button>

              </div>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold border transition ${
                  favorite
                    ? "border-red-500 text-red-500 bg-red-50"
                    : "border-gray-300 text-gray-700 hover:border-red-400 hover:text-red-500"
                }`}
              >

                <Heart
                  size={19}
                  fill={favorite ? "currentColor" : "none"}
                />

                {favorite
                  ? "Remove from Wishlist"
                  : "Add to Wishlist"}

              </button>

              {/* Extra information */}
              <div className="grid grid-cols-3 gap-3 mt-8 pt-8 border-t">

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Category
                  </p>
                  <p className="font-semibold text-sm mt-1">
                    {product.category}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Stock
                  </p>
                  <p className="font-semibold text-sm mt-1">
                    {product.stock}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Delivery
                  </p>
                  <p className="font-semibold text-sm mt-1">
                    3-7 Working Days
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;