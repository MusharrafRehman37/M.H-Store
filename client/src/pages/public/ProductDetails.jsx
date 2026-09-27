import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShoppingCart, Heart, ArrowLeft, Minus, Plus, Check } from "lucide-react";
import { getProductById } from "../../services/productService";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

function ProductDetails() {
  const { id } = useParams(); const navigate = useNavigate(); const { user } = useAuth();
  const { addToCart } = useCart(); const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(""); const [quantity, setQuantity] = useState(1); const [message, setMessage] = useState("");

  useEffect(() => { (async () => { try { setProduct(await getProductById(id)); } catch (e) { setError(e.message); } finally { setLoading(false); } })(); }, [id]);
  if (loading) return <div className="min-h-[70vh] flex items-center justify-center">Loading product...</div>;
  if (!product) return <div className="min-h-[70vh] flex items-center justify-center"><div className="text-center"><h1 className="text-3xl font-bold">Product Not Found</h1><p className="text-red-500 mt-2">{error}</p><Link to="/products" className="inline-block mt-5 text-blue-600">← Back to Products</Link></div></div>;

  const idValue = product._id || product.productCode; const favorite = isInWishlist(idValue);
  const showMessage = (text) => { setMessage(text); window.setTimeout(() => setMessage(""), 2500); };
  const handleAddToCart = async () => { if (!user) return navigate("/login"); const result = await addToCart(product, quantity); if (!result.success) return showMessage(result.message || "Unable to add to cart"); showMessage(`${quantity} item${quantity !== 1 ? "s" : ""} added to cart`); };
  const handleBuyNow = async () => { if (!user) return navigate("/login"); const result = await addToCart(product, quantity); if (!result.success) return showMessage(result.message || "Unable to add to cart"); navigate("/checkout"); };
  const handleWishlist = async () => { if (!user) return navigate("/login"); const result = await toggleWishlist(product); if (!result.success) return showMessage(result.message || "Unable to update wishlist"); showMessage(result.added ? "Added to wishlist" : "Removed from wishlist"); };

  return <div className="bg-gray-50 min-h-screen py-12 relative">{message && <div className="fixed top-24 right-5 z-[100] bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg font-semibold text-sm">✓ {message}</div>}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8"><ArrowLeft size={18}/>Back to Products</Link>
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"><div className="grid lg:grid-cols-2">
        <div className="bg-gray-100 min-h-[500px] flex items-center justify-center"><img src={product.image} alt={product.name} className="w-full h-full max-h-[600px] object-cover" /></div>
        <div className="p-8 lg:p-12"><span className="inline-block bg-blue-50 text-blue-600 text-sm font-semibold px-4 py-2 rounded-full">{product.category}</span><h1 className="text-4xl font-bold text-gray-900 mt-5">{product.name}</h1>
          <div className="flex text-yellow-400 mt-4">{"★".repeat(Math.round(Number(product.rating || 0)) || 5)}</div><div className="mt-6 text-4xl font-bold">Rs.{Number(product.price || 0).toFixed(2)}</div>
          <div className="mt-4">{Number(product.stock || 0) > 0 ? <span className="inline-flex items-center gap-2 text-green-600 font-medium"><Check size={18}/>{product.stock} items available</span> : <span className="text-red-500 font-medium">Out of Stock</span>}</div>
          <div className="mt-8"><h2 className="font-bold text-lg">Product Description</h2><p className="text-gray-600 leading-relaxed mt-3">{product.description}</p></div>
          <div className="mt-8"><p className="font-semibold mb-3">Quantity</p><div className="flex items-center gap-4"><button disabled={quantity <= 1} onClick={() => setQuantity(q => Math.max(1,q-1))} className="w-10 h-10 border rounded-lg flex items-center justify-center disabled:opacity-40"><Minus size={17}/></button><span className="font-bold text-lg w-8 text-center">{quantity}</span><button disabled={quantity >= Number(product.stock || 0)} onClick={() => setQuantity(q => Math.min(Number(product.stock || 0),q+1))} className="w-10 h-10 border rounded-lg flex items-center justify-center disabled:opacity-40"><Plus size={17}/></button></div></div>
          <div className="grid sm:grid-cols-2 gap-4 mt-8"><button disabled={!product.stock} onClick={handleAddToCart} className="flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3.5 rounded-xl font-bold disabled:opacity-50"><ShoppingCart size={19}/>Add to Cart</button><button disabled={!product.stock} onClick={handleBuyNow} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold disabled:opacity-50">Buy Now</button></div>
          <button onClick={handleWishlist} className={`mt-4 w-full py-3 rounded-xl border flex items-center justify-center gap-2 font-semibold ${favorite ? "border-red-300 text-red-600 bg-red-50" : "border-gray-200 text-gray-700"}`}><Heart size={18} fill={favorite ? "currentColor" : "none"}/>{favorite ? "Remove from Wishlist" : "Add to Wishlist"}</button>
        </div></div></div>
    </div></div>;
}
export default ProductDetails;
