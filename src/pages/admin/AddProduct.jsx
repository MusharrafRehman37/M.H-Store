
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  PackagePlus,
  ArrowLeft,
  Save,
  Image as ImageIcon,
} from "lucide-react";

function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    const name = formData.name.trim();
    const category = formData.category.trim();
    const price = Number(formData.price);
    const stock = Number(formData.stock);
    const image = formData.image.trim();
    const description = formData.description.trim();

    if (!name || !category || !formData.price || !formData.stock || !image) {
      setError("Please fill in all required fields.");
      return;
    }

    if (price < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (stock < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    setLoading(true);

    try {
      const savedProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );

      const newProduct = {
        id:
          Math.random().toString(36).slice(2) +
          Math.random().toString(36).slice(2),
        name,
        category,
        price,
        stock,
        image,
        description,
        createdAt: new Date().toISOString(),
      };

      const updatedProducts = [
        ...savedProducts,
        newProduct,
      ];

      localStorage.setItem(
        "products",
        JSON.stringify(updatedProducts)
      );

      navigate("/admin/products");
    } catch (error) {
      console.error("Add Product Error:", error);
      setError("Something went wrong while adding the product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <PackagePlus size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Add Product
            </h1>

            <p className="text-gray-500 mt-1">
              Add a new product to your store.
            </p>
          </div>

        </div>

        <Link
          to="/admin/products"
          className="inline-flex items-center justify-center gap-2 text-gray-600 hover:text-blue-600 font-semibold transition"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>

      </div>

      {/* FORM */}

      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* NAME + CATEGORY */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>

              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Electronics"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

          </div>

          {/* PRICE + STOCK */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (PKR) *
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stock *
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                min="0"
                step="1"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

          </div>

          {/* IMAGE */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Image URL *
            </label>

            <div className="relative">

              <ImageIcon
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/product-image.jpg"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* IMAGE PREVIEW */}

            {formData.image && (
              <div className="mt-4">

                <p className="text-sm font-medium text-gray-600 mb-2">
                  Image Preview
                </p>

                <img
                  src={formData.image}
                  alt="Product preview"
                  className="w-40 h-40 object-cover rounded-xl border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />

              </div>
            )}

          </div>

          {/* DESCRIPTION */}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description..."
              rows="5"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* BUTTONS */}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4 border-t border-gray-100">

            <Link
              to="/admin/products"
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-center font-semibold transition"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold transition"
            >
              <Save size={18} />

              {loading
                ? "Saving..."
                : "Save Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddProduct;

