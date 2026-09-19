import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { getAllProducts, getAdminProducts } from "../../utils/productStorage";
import { useEffect, useState } from "react";

function FeaturedProducts() {
  const getFeaturedProducts = () => {
    const allProducts = getAllProducts();
    const adminProducts = getAdminProducts();
    const adminIds = new Set(adminProducts.map((product) => String(product.id || product._id)));

    return [
      ...adminProducts,
      ...allProducts.filter((product) => !adminIds.has(String(product.id || product._id))),
    ].slice(0, 8);
  };

  const [products, setProducts] = useState(getFeaturedProducts);

  useEffect(() => {
    const refresh = () => setProducts(getFeaturedProducts());
    window.addEventListener("productsUpdated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("productsUpdated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <div>
            <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">Our Collection</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Featured Products</h2>
            <p className="text-gray-500 mt-3">Explore some of our most popular products.</p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition">
            View All Products <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;
