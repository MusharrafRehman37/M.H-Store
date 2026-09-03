import { useSearchParams, Link } from "react-router-dom";
import products from "../../data/product";
import ProductCard from "../../components/product/ProductCard";

function Products() {
  const [searchParams] = useSearchParams();

  // Get category from URL
  const category = searchParams.get("category");

  // Get search term from URL
  const search = searchParams.get("search") || "";

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Category filter
    const matchesCategory = category
      ? product.category.toLowerCase() === category.toLowerCase()
      : true;

    // Search filter
    const searchTerm = search.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm) ||
      (product.description &&
        product.description.toLowerCase().includes(searchTerm));

    return matchesCategory && matchesSearch;
  });

  // Page heading
  const pageTitle = search
    ? `Search Results for "${search}"`
    : category
    ? category
    : "All Products";

  // Page description
  const pageDescription = search
    ? `Showing products matching "${search}".`
    : category
    ? `Explore our ${category.toLowerCase()} collection.`
    : "Discover our complete collection of products.";

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Our Collection
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            {pageTitle}
          </h1>

          <p className="text-gray-500 mt-2">
            {pageDescription}
          </p>

          {/* Search result count */}
          {search && (
            <p className="text-sm text-gray-400 mt-3">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          )}

        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {filteredProducts.length > 0 ? (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}

          </div>

        ) : (

          <div className="text-center py-20">

            <h2 className="text-2xl font-bold text-gray-900">
              No Products Found
            </h2>

            <p className="text-gray-500 mt-2">
              {search
                ? `We couldn't find any products matching "${search}".`
                : "There are no products in this category yet."}
            </p>

            <Link
              to="/products"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              View All Products
            </Link>

          </div>

        )}

      </div>

    </div>
  );
}

export default Products;