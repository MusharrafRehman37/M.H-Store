
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function ProductCard({
  product,
}) {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { addToCart } =
    useCart();

  const {
    toggleWishlist,
    isInWishlist,
  } = useWishlist();

  const productId =
    product?.id ||
    product?._id;

  const price = Number(
    product?.price || 0
  );

  const wishlisted =
    user &&
    isInWishlist(productId);

  // ==========================================
  // LOGIN CHECK
  // ==========================================

  const requireLogin = () => {
    navigate("/login");
  };

  // ==========================================
  // ADD TO CART
  // ==========================================

  const handleAddToCart = () => {
    if (!user) {
      requireLogin();
      return;
    }

    addToCart(product);
  };

  // ==========================================
  // WISHLIST
  // ==========================================

  const handleWishlist = () => {
    if (!user) {
      requireLogin();
      return;
    }

    toggleWishlist(product);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition group">

      {/* =====================================
          IMAGE
      ===================================== */}

      <div className="relative h-64 bg-gray-100 overflow-hidden">

        <Link
          to={`/products/${productId}`}
        >
          <img
            src={
              product?.image ||
              "https://via.placeholder.com/500"
            }
            alt={
              product?.name ||
              "Product"
            }
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        </Link>

        {/* WISHLIST */}

        <button
          type="button"
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center shadow transition ${
            wishlisted
              ? "bg-red-500 text-white"
              : "bg-white text-gray-600 hover:text-red-500"
          }`}
          title={
            user
              ? wishlisted
                ? "Remove from wishlist"
                : "Add to wishlist"
              : "Login to use wishlist"
          }
        >
          <Heart
            size={19}
            fill={
              wishlisted
                ? "currentColor"
                : "none"
            }
          />
        </button>

        {/* CATEGORY */}

        {product?.category && (
          <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-700">
            {product.category}
          </span>
        )}

      </div>

      {/* =====================================
          PRODUCT INFO
      ===================================== */}

      <div className="p-5">

        <Link
          to={`/products/${productId}`}
        >
          <h2 className="font-semibold text-gray-900 text-lg hover:text-blue-600 transition line-clamp-2">
            {product?.name ||
              "Product"}
          </h2>
        </Link>

        {product?.description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* PRICE */}

        <div className="flex items-center justify-between mt-4">

          <p className="text-xl font-bold text-gray-900">
            Rs.{" "}
            {price.toLocaleString(
              "en-PK"
            )}
          </p>

          {product?.oldPrice && (
            <p className="text-sm text-gray-400 line-through">
              Rs.{" "}
              {Number(
                product.oldPrice
              ).toLocaleString(
                "en-PK"
              )}
            </p>
          )}

        </div>

        {/* ADD TO CART */}

        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition"
        >
          <ShoppingCart size={18} />

          {user
            ? "Add to Cart"
            : "Login to Add"}
        </button>

      </div>
    </div>
  );
}

export default ProductCard;

