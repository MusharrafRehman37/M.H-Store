import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../product/ProductCard";
import { getProducts } from "../../services/productService";
import { useEffect, useState } from "react";

function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  useEffect(() => { getProducts().then((items) => setProducts(items.slice(0, 8))).catch((error) => console.error("Featured products:", error)); }, []);
  return <section className="py-16 bg-white"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10"><div><span className="text-blue-600 text-sm font-bold uppercase tracking-wider">Our Collection</span><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Featured Products</h2><p className="text-gray-500 mt-3">Explore some of our most popular products.</p></div><Link to="/products" className="inline-flex items-center gap-2 text-blue-600 font-semibold">View All Products <ArrowRight size={18}/></Link></div><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">{products.map((product) => <ProductCard key={product._id || product.productCode} product={product}/>)}</div></div></section>;
}
export default FeaturedProducts;
