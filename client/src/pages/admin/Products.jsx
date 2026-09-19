
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";

import {
  getProducts,
  deleteProduct,
} from "../../services/productService";

import { useAuth } from "../../hooks/useAuth";
import { getAdminProducts, saveAdminProducts } from "../../utils/productStorage";

function Products() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  const loadProducts = () => {
    try {
      setLoading(true);
      setError("");
      setProducts(getAdminProducts());
    } catch (err) {
      console.error("Products Error:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) {
      return products;
    }

    return products.filter((product) =>
      `${product.name || ""} ${
        product.category || ""
      }`
        .toLowerCase()
        .includes(term)
    );
  }, [products, search]);

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id) => {
    if (!token) {
      navigate("/login");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const updated = products.filter(
        (product) => String(product._id || product.id) !== String(id)
      );

      saveAdminProducts(updated);
      setProducts(updated);
    } catch (err) {
      console.error(
        "Delete Product Error:",
        err
      );

      alert(
        err.message ||
          "Failed to delete product"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-500">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Package size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Products
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage your store products.
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/admin/products/add"
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          <Plus size={19} />
          Add Product
        </Link>

      </div>

      {/* ERROR */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* SEARCH */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

        <div className="relative max-w-md">

          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

      </div>

      {/* COUNT */}

      <div className="text-sm text-gray-500">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {filteredProducts.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900">
          {products.length}
        </span>{" "}
        products
      </div>

      {/* EMPTY */}

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

          <Package
            size={55}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-2xl font-bold mt-5 text-gray-900">
            {products.length === 0
              ? "No Products Yet"
              : "No Products Found"}
          </h2>

          <p className="text-gray-500 mt-2">
            {products.length === 0
              ? "Add your first product to get started."
              : "Try searching with a different keyword."}
          </p>

          {products.length === 0 && (
            <Link
              to="/admin/products/add"
              className="inline-flex items-center gap-2 mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
            >
              <Plus size={18} />
              Add Product
            </Link>
          )}

        </div>
      ) : (

        /* PRODUCT TABLE */

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead className="bg-gray-50 border-b border-gray-100">

                <tr>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Product
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Category
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Price
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                    Stock
                  </th>

                  <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredProducts.map((product) => {

                  const productId =
                    product._id || product.id;

                  return (
                    <tr
                      key={productId}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* PRODUCT */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 rounded-xl object-cover bg-gray-100"
                          />

                          <div className="min-w-0">

                            <p className="font-semibold text-gray-900 truncate max-w-[250px]">
                              {product.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              ID: {productId}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* CATEGORY */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {product.category || "-"}
                      </td>

                      {/* PRICE */}

                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ${Number(
                          product.price || 0
                        ).toFixed(2)}
                      </td>

                      {/* STOCK */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            Number(product.stock || 0) > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {Number(
                            product.stock || 0
                          ) > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-6 py-4">

                        <div className="flex justify-end gap-2">

                          <Link
                            to={`/products/${productId}`}
                            title="View product"
                            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center transition"
                          >
                            <Eye size={17} />
                          </Link>

                          <Link
                            to={`/admin/products/edit/${productId}`}
                            title="Edit product"
                            className="w-9 h-9 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 flex items-center justify-center transition"
                          >
                            <Pencil size={17} />
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(productId)
                            }
                            title="Delete product"
                            className="w-9 h-9 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center transition"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  );
}

export default Products;

