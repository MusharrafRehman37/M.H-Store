import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import { getAllProducts } from "../../utils/productStorage";

function Products() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search") || "";
  const [products, setProducts] = useState(getAllProducts);

  useEffect(() => {
    const refreshProducts = () => setProducts(getAllProducts());
    window.addEventListener("productsUpdated", refreshProducts);
    window.addEventListener("storage", refreshProducts);
    refreshProducts();
    return () => {
      window.removeEventListener("productsUpdated", refreshProducts);
      window.removeEventListener("storage", refreshProducts);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();
    return products.filter((product) => {
      const productCategory = String(product.category || "");
      const productName = String(product.name || "");
      const description = String(product.description || "");
      const matchesCategory = category
        ? productCategory.toLowerCase() === category.toLowerCase()
        : true;
      const matchesSearch =
        !searchTerm ||
        productName.toLowerCase().includes(searchTerm) ||
        productCategory.toLowerCase().includes(searchTerm) ||
        description.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  const pageTitle = search
    ? `Search Results for "${search}"`
    : category
    ? category
    : "All Products";

  const pageDescription = search
    ? `Showing products matching "${search}".`
    : category
    ? `Explore our ${category.toLowerCase()} collection.`
    : "Discover our complete collection of products.";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Collection</p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{pageTitle}</h1>
          <p className="text-gray-500 mt-2">{pageDescription}</p>
          <p className="text-sm text-gray-400 mt-3">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id || product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900">No Products Found</h2>
            <p className="text-gray-500 mt-2">{search ? `We couldn't find any products matching "${search}".` : "There are no products in this category yet."}</p>
            <Link to="/products" className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition">View All Products</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
