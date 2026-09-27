import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import { getProducts } from "../../services/productService";

function Products() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try { setLoading(true); setError(""); const data = await getProducts(); if (active) setProducts(data); }
      catch (err) { if (active) setError(err.message || "Failed to load products"); }
      finally { if (active) setLoading(false); }
    })();
    return () => { active = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    const term = search.toLowerCase().trim();
    return products.filter((product) => {
      const matchesCategory = category ? String(product.category || "").toLowerCase() === category.toLowerCase() : true;
      const text = `${product.name || ""} ${product.category || ""} ${product.description || ""}`.toLowerCase();
      return matchesCategory && (!term || text.includes(term));
    });
  }, [products, category, search]);

  const pageTitle = search ? `Search Results for "${search}"` : category || "All Products";
  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-500">Loading products...</div>;

  return <div className="min-h-screen bg-gray-50">
    <div className="bg-white border-b"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Collection</p>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{pageTitle}</h1>
      <p className="text-gray-500 mt-2">Discover our complete collection of products.</p>
      <p className="text-sm text-gray-400 mt-3">{filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available</p>
    </div></div>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">{error}</div>}
      {filteredProducts.length > 0 ? <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{filteredProducts.map((product) => <ProductCard key={product._id || product.productCode} product={product} />)}</div> : <div className="text-center py-20"><h2 className="text-2xl font-bold">No Products Found</h2><Link to="/products" className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">View All Products</Link></div>}
    </div>
  </div>;
}
export default Products;
