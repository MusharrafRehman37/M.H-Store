import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Home from "./pages/public/Home";
import Products from "./pages/public/Products";
import ProductDetails from "./pages/public/ProductDetails";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import TermsConditions from "./pages/public/TermsConditions";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgetPassword from "./pages/auth/ForgetPassword";

import Dashboard from "./pages/customer/Dashboard";
import Cart from "./pages/customer/Cart";
import Wishlist from "./pages/customer/Wishlist";
import Checkout from "./pages/customer/Checkout";
import MyOrders from "./pages/customer/MyOrders";

// Admin Layout & Pages
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminUsers from "./pages/admin/User";
import AdminOrders from "./pages/admin/Order";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col">

      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />

      <ScrollToTop />

      {/* Customer storefront UI should never appear behind the admin panel. */}
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />

          {/* ================= AUTH ROUTES ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/forgot-password"
            element={<ForgetPassword />}
          />

          {/* ================= CUSTOMER PROTECTED ROUTES ================= */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<MyOrders />} />
          </Route>

          {/* ================= ADMIN PROTECTED ROUTES ================= */}
          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>

              <Route
                path="dashboard"
                element={<AdminDashboard />}
              />

              <Route
                path="products"
                element={<AdminProducts />}
              />

              <Route
                path="products/add"
                element={<AddProduct />}
              />

              <Route
                path="products/edit/:id"
                element={<EditProduct />}
              />

              <Route
                path="users"
                element={<AdminUsers />}
              />

              <Route
                path="orders"
                element={<AdminOrders />}
              />

            </Route>
          </Route>

        </Routes>
      </main>

      {!isAdminRoute && <Footer />}

    </div>
  );
}

export default App;