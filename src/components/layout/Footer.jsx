import logo from "../../assets/weblogo.jpg";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubscribed(true);
    setEmail("");

    // 4 seconds ke baad success message khud hi gayab ho jaye (optional)
    setTimeout(() => {
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">

      {/* Background Decorations */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-slate-700/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-stone-700/20 rounded-full blur-3xl" />

      <div className="relative">

        {/* ================= NEWSLETTER ================= */}

        <div className="border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              
              <div>
                <h2 className="text-2xl font-bold">
                  Stay Updated
                </h2>
                <p className="text-gray-400 mt-2">
                  Get the latest products, offers and
                  discounts directly in your inbox.
                </p>
              </div>

              <div className="w-full lg:w-auto">
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full sm:w-72 bg-slate-800 border border-gray-700 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white outline-none focus:border-slate-400 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 px-6 py-3.5 rounded-xl font-semibold transition"
                  >
                    Subscribe
                    <ArrowRight size={17} />
                  </button>
                </form>

                {/* Error & Success Messages */}
                {error && (
                  <p className="text-red-400 text-xs mt-2">{error}</p>
                )}
                {subscribed && (
                  <p className="text-green-400 text-xs mt-2 font-medium">
                    🎉 Subscribed successfully! Thank you for joining.
                  </p>
                )}
              </div>

            </div>
          </div>
        </div>


        {/* ================= MAIN FOOTER ================= */}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* BRAND */}
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-3"
              >
                <img
                  src={logo}
                  alt="M.H Store"
                  className="h-10 w-auto object-contain"
                />
                <div>
                  <span className="text-xl font-bold">
                    M.H Store
                  </span>
                  <p className="text-[9px] text-gray-500 uppercase tracking-[0.2em]">
                    Shop Smarter
                  </p>
                </div>
              </Link>

              <p className="text-gray-400 text-sm leading-relaxed mt-5 max-w-xs">
                Discover quality products at great prices.
                Shop smarter and live better with M.H Store.
              </p>
            </div>


            {/* SHOP */}
            <div>
              <h3 className="font-bold text-lg">
                Shop
              </h3>
              <div className="flex flex-col gap-3 mt-5 text-sm text-gray-400">
                <Link
                  to="/products"
                  className="hover:text-white transition"
                >
                  All Products
                </Link>
                <Link
                  to="/wishlist"
                  className="hover:text-white transition"
                >
                  Wishlist
                </Link>
                <Link
                  to="/cart"
                  className="hover:text-white transition"
                >
                  Shopping Cart
                </Link>
              </div>
            </div>


            {/* ACCOUNT */}
            <div>
              <h3 className="font-bold text-lg">
                Account
              </h3>
              <div className="flex flex-col gap-3 mt-5 text-sm text-gray-400">
                <Link
                  to="/login"
                  className="hover:text-white transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="hover:text-white transition"
                >
                  Create Account
                </Link>
                <Link
                  to="/orders"
                  className="hover:text-white transition"
                >
                  My Orders
                </Link>
              </div>
            </div>


            {/* CUSTOMER SERVICE */}
            <div>
              <h3 className="font-bold text-lg">
                Customer Service
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mt-5">
                Need help with your order? Our support
                team is ready to help.
              </p>

              {/* Email */}
              <div className="flex items-center gap-3 mt-5">
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Mail size={17} className="text-slate-300" />
                </div>
                <span className="text-sm text-gray-400">
                  mhstore@gmail.com
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 mt-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Phone size={17} className="text-slate-300" />
                </div>
                <span className="text-sm text-gray-400">
                  +92 308 1394044
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3 mt-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center">
                  <MapPin size={17} className="text-slate-300" />
                </div>
                <span className="text-sm text-gray-400">
                  Pakistan
                </span>
              </div>

            </div>

          </div>
        </div>


        {/* ================= BOTTOM BAR ================= */}

        <div className="border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm text-gray-500 text-center md:text-left">
                © 2026 M.H Store. All rights reserved.
              </p>

              <div className="flex items-center justify-center gap-5 text-sm text-gray-500">
                <Link
                  to="/privacy-policy"
                  className="hover:text-white transition"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms-conditions"
                  className="hover:text-white transition"
                >
                  Terms & Conditions
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;