
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const products = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    category: "Electronics",
    price: 8999,
    oldPrice: 10999,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "2",
    name: "Smart Watch Series 5",
    category: "Electronics",
    price: 12999,
    oldPrice: 15999,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "4",
    name: "Running Sneakers",
    category: "Footwear",
    price: 6499,
    oldPrice: 7999,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "3",
    name: "Minimalist Backpack",
    category: "Fashion",
    price: 4499,
    oldPrice: 5999,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80",
  },
];

function FeaturedProducts() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">

          <div>
            <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">
              Our Collection
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Featured Products
            </h2>

            <p className="text-gray-500 mt-3">
              Explore some of our most popular products.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition"
          >
            View All Products
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition duration-300"
            >

              {/* Image */}
              <div className="relative h-64 overflow-hidden bg-gray-100">

                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />

                {/* Sale Badge */}
                <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  SALE
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5">

                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                  {product.category}
                </p>

                <h3 className="font-bold text-lg text-gray-900 mt-2">
                  {product.name}
                </h3>

                <div className="flex items-center gap-3 mt-3">

                  <span className="text-xl font-bold text-gray-900">
                    Rs. {product.price.toLocaleString("en-PK")}
                  </span>

                  <span className="text-sm text-gray-400 line-through">
                    Rs. {product.oldPrice.toLocaleString("en-PK")}
                  </span>

                </div>

                {/* FIXED PRODUCT DETAILS LINK */}
                <Link
                  to={`/products/${product.id}`}
                  className="block text-center mt-5 bg-gray-900 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition"
                >
                  View Product
                </Link>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;

