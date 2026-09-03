
import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import logo from "../../assets/weblogo.jpg";

import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  UserCircle,
  LogOut,
  Package,
  ChevronDown,
} from "lucide-react";

import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const accountRef = useRef(null);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [searchOpen, setSearchOpen] =
    useState(false);

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { user, logout } = useAuth();

  // ==========================================
  // COUNTS
  // ==========================================

  const cartCount = cartItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 1),
    0
  );

  const wishlistCount =
    wishlistItems.length;

  // ==========================================
  // USER INFORMATION
  // ==========================================

  const userName =
    user?.fullName ||
    user?.name ||
    "My Account";

  const userEmail =
    user?.email || "";

  const userInitial =
    userName
      .trim()
      .charAt(0)
      .toUpperCase() || "U";

  const isAdmin =
    user?.role?.toLowerCase() === "admin";

  // ==========================================
  // NAVIGATION LINKS
  // ==========================================

  const allNavLinks = [
    {
      name: "HOME",
      path: "/",
      isProtected: false,
    },
    {
      name: "PRODUCTS",
      path: "/products",
      isProtected: false,
    },
    {
      name: "WISHLIST",
      path: "/wishlist",
      isProtected: true,
    },
    {
      name: "CART",
      path: "/cart",
      isProtected: true,
    },
    {
      name: "MY ORDERS",
      path: "/orders",
      isProtected: true,
    },
  ];

  const navLinks = allNavLinks.filter(
    (link) =>
      !link.isProtected || Boolean(user)
  );

  // ==========================================
  // CLOSE ACCOUNT MENU ON OUTSIDE CLICK
  // ==========================================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(
          event.target
        )
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================
  // CLOSE MENUS WHEN ROUTE CHANGES
  // ==========================================

  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = (e) => {
    e.preventDefault();

    const term = searchTerm.trim();

    if (!term) {
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(
        term
      )}`
    );

    setSearchTerm("");
    setSearchOpen(false);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    setAccountOpen(false);
    setMobileMenuOpen(false);

    logout();

    // Immediately take user to public home
    navigate("/", {
      replace: true,
    });
  };

  // ==========================================
  // ACCOUNT CLICK
  // ==========================================

  const handleAccountClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setAccountOpen((previous) => !previous);
  };

  return (
    <header className="w-full bg-white relative z-50">

      {/* ======================================
          TOP OFFER BAR
      ====================================== */}

      <div className="bg-gray-950 text-gray-300 h-8 flex items-center justify-center px-4">
        <p className="text-[11px] sm:text-xs tracking-wide">
          🎁 Free Delivery on Orders Over Rs. 10,000
        </p>
      </div>

      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="h-[74px] border-b border-gray-100 bg-white">

        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">

          <div className="h-full flex items-center justify-between">

            {/* ==================================
                LOGO
            ================================== */}

            <Link
              to="/"
              className="flex items-center gap-2.5 shrink-0"
            >
              <img
                src={logo}
                alt="M.H Store"
                className="h-10 w-auto object-contain"
              />

              <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
                M.H Store
              </h1>
            </Link>

            {/* ==================================
                DESKTOP NAV LINKS
            ================================== */}

            <div className="hidden lg:flex items-center h-full gap-8">

              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative h-full flex items-center text-[12px] font-semibold tracking-wide ${
                      isActive
                        ? "text-gray-950"
                        : "text-gray-500 hover:text-gray-950"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}

                      <span
                        className={`absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600 transition-transform ${
                          isActive
                            ? "scale-x-100"
                            : "scale-x-0"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}

            </div>

            {/* ==================================
                RIGHT SIDE
            ================================== */}

            <div className="hidden md:flex items-center gap-1">

              {/* SEARCH */}

              <button
                type="button"
                onClick={() =>
                  setSearchOpen(
                    (previous) => !previous
                  )
                }
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition"
                title="Search"
              >
                <Search size={19} />
              </button>

              {/* WISHLIST */}

              <Link
                to="/wishlist"
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-blue-600 relative transition"
                title="Wishlist"
              >
                <Heart size={19} />

                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {wishlistCount > 99
                      ? "99+"
                      : wishlistCount}
                  </span>
                )}
              </Link>

              {/* CART */}

              <Link
                to="/cart"
                className="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-blue-600 relative transition"
                title="Cart"
              >
                <ShoppingBag size={19} />

                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] px-1 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </span>
                )}
              </Link>

              {/* ==================================
                  ACCOUNT
              ================================== */}

              <div
                ref={accountRef}
                className="relative"
              >

                <button
                  type="button"
                  onClick={handleAccountClick}
                  className={`h-10 rounded-full flex items-center gap-2 px-2.5 transition ${
                    user
                      ? "hover:bg-gray-50"
                      : "w-10 justify-center hover:bg-gray-50"
                  } text-gray-600 hover:text-blue-600`}
                  title={
                    user
                      ? "Account"
                      : "Login"
                  }
                >

                  {user ? (
                    <>
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">
                        {userInitial}
                      </div>

                      <span className="hidden xl:block max-w-[100px] truncate text-sm font-semibold text-gray-700">
                        {userName}
                      </span>

                      <ChevronDown
                        size={15}
                        className={`hidden xl:block transition-transform ${
                          accountOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </>
                  ) : (
                    <User size={19} />
                  )}

                </button>

                {/* ACCOUNT DROPDOWN */}

                {user && accountOpen && (
                  <div className="absolute right-0 top-12 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">

                    {/* USER INFO */}

                    <div className="p-4 bg-gray-50 border-b border-gray-100">

                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                          {userInitial}
                        </div>

                        <div className="min-w-0">

                          <p className="font-bold text-gray-900 truncate">
                            {userName}
                          </p>

                          <p className="text-xs text-gray-500 truncate">
                            {userEmail}
                          </p>

                          <span className="inline-flex mt-1 text-[10px] font-semibold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {user?.role ||
                              "customer"}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* ACCOUNT LINKS */}

                    <div className="p-2">

                      <Link
                        to="/dashboard"
                        onClick={() =>
                          setAccountOpen(false)
                        }
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-gray-700 transition"
                      >
                        <UserCircle
                          size={19}
                          className="text-blue-600"
                        />

                        <div>
                          <p className="text-sm font-semibold">
                            My Profile
                          </p>

                          <p className="text-xs text-gray-500">
                            Account & overview
                          </p>
                        </div>
                      </Link>

                      <Link
                        to="/orders"
                        onClick={() =>
                          setAccountOpen(false)
                        }
                        className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-gray-700 transition"
                      >
                        <Package
                          size={19}
                          className="text-blue-600"
                        />

                        <div>
                          <p className="text-sm font-semibold">
                            My Orders
                          </p>

                          <p className="text-xs text-gray-500">
                            View your orders
                          </p>
                        </div>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() =>
                            setAccountOpen(false)
                          }
                          className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 text-gray-700 transition"
                        >
                          <UserCircle
                            size={19}
                            className="text-purple-600"
                          />

                          <div>
                            <p className="text-sm font-semibold">
                              Admin Dashboard
                            </p>

                            <p className="text-xs text-gray-500">
                              Manage your store
                            </p>
                          </div>
                        </Link>
                      )}

                    </div>

                    {/* LOGOUT */}

                    <div className="border-t border-gray-100 p-2">

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-red-50 text-red-600 transition"
                      >
                        <LogOut size={19} />

                        <span className="text-sm font-semibold">
                          Logout
                        </span>
                      </button>

                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* MOBILE MENU BUTTON */}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(
                  (previous) => !previous
                )
              }
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X size={24} />
              ) : (
                <Menu size={24} />
              )}
            </button>

          </div>

        </div>
      </nav>

      {/* ======================================
          SEARCH BAR
      ====================================== */}

      {searchOpen && (
        <div className="border-b bg-white shadow-sm">

          <form
            onSubmit={handleSearch}
            className="max-w-7xl mx-auto px-4 py-4"
          >

            <div className="flex gap-3">

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                placeholder="Search products..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-semibold transition"
              >
                Search
              </button>

            </div>

          </form>

        </div>
      )}

      {/* ======================================
          MOBILE MENU
      ====================================== */}

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 shadow-lg">

          <div className="px-5 py-4 space-y-1">

            {/* NAV LINKS */}

            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-lg text-sm font-semibold ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* ACCOUNT */}

            {user ? (
              <>

                <div className="border-t border-gray-100 mt-3 pt-3">

                  <div className="flex items-center gap-3 px-4 py-3">

                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      {userInitial}
                    </div>

                    <div className="min-w-0">

                      <p className="font-semibold text-gray-900 truncate">
                        {userName}
                      </p>

                      <p className="text-xs text-gray-500 truncate">
                        {userEmail}
                      </p>

                    </div>

                  </div>

                </div>

                <NavLink
                  to="/dashboard"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  <UserCircle size={19} />
                  My Profile
                </NavLink>

                <NavLink
                  to="/orders"
                  onClick={() =>
                    setMobileMenuOpen(false)
                  }
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  <Package size={19} />
                  My Orders
                </NavLink>

                {isAdmin && (
                  <NavLink
                    to="/admin/dashboard"
                    onClick={() =>
                      setMobileMenuOpen(false)
                    }
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-purple-600 hover:bg-purple-50"
                  >
                    <UserCircle size={19} />
                    Admin Dashboard
                  </NavLink>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-500 hover:bg-red-50"
                >
                  <LogOut size={19} />
                  Logout
                </button>

              </>
            ) : (
              <NavLink
                to="/login"
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                <UserCircle size={19} />
                Login
              </NavLink>
            )}

          </div>

        </div>
      )}

    </header>
  );
}

export default Navbar;

