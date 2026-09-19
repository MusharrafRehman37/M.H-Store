import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
} from "lucide-react";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";

function Wishlist() {
  const {
    wishlistItems,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();

  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);

    const productId = product.id || product._id;

    // Remove from wishlist after adding to cart
    removeFromWishlist(productId);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center">

          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <Heart size={38} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mt-6">
            Your Wishlist is Empty
          </h1>

          <p className="text-gray-500 mt-3">
            Save products you love and find them here later.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-7 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Browse Products
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
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">

          <div>
            <p className="text-red-500 font-semibold text-sm uppercase">
              Favorites
            </p>

            <h1 className="text-3xl font-bold text-gray-900 mt-2">
              My Wishlist
            </h1>

            <p className="text-gray-500 mt-2">
              {wishlistItems.length} saved product
              {wishlistItems.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={clearWishlist}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-red-100 text-red-600 hover:bg-red-50 rounded-lg font-medium transition"
          >
            <Trash2 size={17} />
            Clear Wishlist
          </button>

        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {wishlistItems.map((product) => {
            const productId = product.id || product._id;
            const price = Number(product.price || 0);

            return (
              <div
                key={productId}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition"
              >

                {/* Image */}
                <div className="relative h-56 bg-gray-100">

                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />

                  <button
                    onClick={() =>
                      removeFromWishlist(productId)
                    }
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white flex items-center justify-center text-red-500 shadow hover:bg-red-50 transition"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

                {/* Info */}
                <div className="p-5">

                  {product.category && (
                    <p className="text-xs text-blue-600 font-semibold uppercase">
                      {product.category}
                    </p>
                  )}

                  <Link to={`/products/${productId}`}>
                    <h2 className="font-semibold text-gray-900 mt-1 hover:text-blue-600 transition truncate">
                      {product.name}
                    </h2>
                  </Link>

                  <p className="text-xl font-bold mt-3">
                    Rs.{price.toFixed(2)}
                  </p>

                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}

export default Wishlist;