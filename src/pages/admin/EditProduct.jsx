import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Package, ArrowLeft, Save, Image as ImageIcon, Upload, X } from "lucide-react";
import { getAdminProducts, saveAdminProducts } from "../../utils/productStorage";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", category: "", price: "", stock: "", image: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageSource, setImageSource] = useState("url");

  useEffect(() => {
    const product = getAdminProducts().find((item) => String(item.id || item._id) === String(id));
    if (!product) {
      setError("Product not found.");
      setLoading(false);
      return;
    }
    setFormData({ name: product.name || "", category: product.category || "", price: product.price ?? "", stock: product.stock ?? "", image: product.image || "", description: product.description || "" });
    setImageSource(String(product.image || "").startsWith("data:") ? "upload" : "url");
    setLoading(false);
  }, [id]);

  const handleChange = (e) => {
    setFormData((previous) => ({ ...previous, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please select a valid image file.");
    if (file.size > 2 * 1024 * 1024) return setError("Image size must be 2 MB or less for local storage.");

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((previous) => ({ ...previous, image: String(reader.result) }));
      setImageSource("upload");
      setError("");
    };
    reader.onerror = () => setError("Unable to read the selected image.");
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const name = formData.name.trim();
    const category = formData.category.trim();
    const price = Number(formData.price);
    const stock = Number(formData.stock);
    const image = formData.image.trim();

    if (!name || !category || formData.price === "" || formData.stock === "" || !image) return setError("Please fill in all required fields and add a product image.");
    if (price < 0 || stock < 0) return setError("Price and stock cannot be negative.");

    setSaving(true);
    try {
      const products = getAdminProducts();
      const updated = products.map((product) => {
        if (String(product.id || product._id) !== String(id)) return product;
        return { ...product, name, category, price, stock, image, description: formData.description.trim(), updatedAt: new Date().toISOString() };
      });
      saveAdminProducts(updated);
      navigate("/admin/products");
    } catch (err) {
      console.error("Update Product Error:", err);
      setError("Something went wrong while updating the product.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center text-gray-500">Loading product...</div>;
  if (error && !formData.name) return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-center"><Package size={50} className="mx-auto text-gray-300" /><h1 className="text-2xl font-bold mt-5">Product Not Found</h1><p className="text-gray-500 mt-2">The product you're trying to edit doesn't exist.</p><Link to="/admin/products" className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"><ArrowLeft size={18} />Back to Products</Link></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3"><div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Package size={25} /></div><div><h1 className="text-3xl font-bold text-gray-900">Edit Product</h1><p className="text-gray-500 mt-1">Update your product information.</p></div></div>
        <Link to="/admin/products" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-semibold"><ArrowLeft size={18} />Back to Products</Link>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
        {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div><label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label><input name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required /></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label><input name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required /></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><div><label className="block text-sm font-semibold text-gray-700 mb-2">Price (PKR) *</label><input type="number" name="price" value={formData.price} onChange={handleChange} min="0" step="0.01" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required /></div><div><label className="block text-sm font-semibold text-gray-700 mb-2">Stock *</label><input type="number" name="stock" value={formData.stock} onChange={handleChange} min="0" step="1" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" required /></div></div>

          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Product Image *</label><div className="flex gap-2 mb-3"><button type="button" onClick={() => setImageSource("url")} className={`px-4 py-2 rounded-lg text-sm font-semibold ${imageSource === "url" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>Image Link</button><button type="button" onClick={() => setImageSource("upload")} className={`px-4 py-2 rounded-lg text-sm font-semibold ${imageSource === "upload" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"}`}>Upload Image</button></div>
            {imageSource === "url" ? <div className="relative"><ImageIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="url" name="image" value={formData.image.startsWith("data:") ? "" : formData.image} onChange={handleChange} placeholder="https://example.com/product-image.jpg" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" /></div> : <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition"><Upload size={28} className="text-gray-400" /><span className="mt-2 font-semibold text-gray-700">Choose product image</span><span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — maximum 2 MB</span><input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" /></label>}
            {formData.image && <div className="mt-4 relative w-fit"><img src={formData.image} alt="Product preview" className="w-44 h-44 object-cover rounded-xl border border-gray-200" /><button type="button" onClick={() => setFormData((p) => ({ ...p, image: "" }))} className="absolute -top-2 -right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center"><X size={16} /></button></div>}
          </div>

          <div><label className="block text-sm font-semibold text-gray-700 mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleChange} rows="5" className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-100"><Link to="/admin/products" className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-center font-semibold">Cancel</Link><button type="submit" disabled={saving} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold"><Save size={18} />{saving ? "Saving..." : "Update Product"}</button></div>
        </form>
      </div>
    </div>
  );
}
export default EditProduct;
