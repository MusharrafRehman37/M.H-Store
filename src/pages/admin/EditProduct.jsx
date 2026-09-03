
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Package,
  ArrowLeft,
  Save,
  Image as ImageIcon,
} from "lucide-react";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // LOAD PRODUCT
  // ==============================

  useEffect(() => {
    try {
      const savedProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );

      const product = savedProducts.find(
        (item) =>
          String(item.id || item._id) === String(id)
      );

      if (!product) {
        setError("Product not found.");
        setLoading(false);
        return;
      }

      setFormData({
        name: product.name || "",
        category: product.category || "",
        price: product.price ?? "",
        stock:
          product.stock ??
          product.quantity ??
          "",
        image: product.image || "",
        description: product.description || "",
      });

      setLoading(false);
    } catch (error) {
      console.error(
        "Load Product Error:",
        error
      );

      setError(
        "Something went wrong while loading the product."
      );

      setLoading(false);
    }
  }, [id]);

  // ==============================
  // HANDLE CHANGE
  // ==============================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // ==============================
  // UPDATE PRODUCT
  // ==============================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    const name = formData.name.trim();
    const category = formData.category.trim();
    const price = Number(formData.price);
    const stock = Number(formData.stock);
    const image = formData.image.trim();
    const description =
      formData.description.trim();

    if (
      !name ||
      !category ||
      formData.price === "" ||
      formData.stock === "" ||
      !image
    ) {
      setError(
        "Please fill in all required fields."
      );
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

    setSaving(true);

    try {
      const savedProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );

      const productExists = savedProducts.some(
        (product) =>
          String(
            product.id || product._id
          ) === String(id)
      );

      if (!productExists) {
        setError("Product not found.");
        setSaving(false);
        return;
      }

      const updatedProducts =
        savedProducts.map((product) => {
          const productId =
            product.id || product._id;

          if (String(productId) !== String(id)) {
            return product;
          }

          return {
            ...product,
            name,
            category,
            price,
            stock,
            image,
            description,
            updatedAt:
              new Date().toISOString(),
          };
        });

      localStorage.setItem(
        "products",
        JSON.stringify(updatedProducts)
      );

      navigate("/admin/products");
    } catch (error) {
      console.error(
        "Update Product Error:",
        error
      );

      setError(
        "Something went wrong while updating the product."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">
          Loading product...
        </div>
      </div>
    );
  }

  // ==============================
  // PRODUCT NOT FOUND
  // ==============================

  if (error && !formData.name) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 md:p-8">

        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">

          <Package
            size={50}
            className="mx-auto text-gray-300"
          />

          <h1 className="text-2xl font-bold text-gray-900 mt-5">
            Product Not Found
          </h1>

          <p className="text-gray-500 mt-2">
            The product you're trying to edit
            doesn't exist.
          </p>

          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Package size={25} />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit Product
            </h1>

            <p className="text-gray-500 mt-1">
              Update your product information.
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
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
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
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* PREVIEW */}

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
                    e.currentTarget.style.display =
                      "none";
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
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold transition"
            >
              <Save size={18} />

              {saving
                ? "Updating..."
                : "Update Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditProduct;

