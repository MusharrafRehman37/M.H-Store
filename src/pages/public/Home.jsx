import CategorySection from "../../components/home/CategorySection";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ArrowRight,
  Star,
} from "lucide-react";

import { Link } from "react-router-dom";

import HeroSlider from "../../components/home/HeroSliders";
import FeaturedProducts from "../../components/home/FeaturedProducts";

function Home() {
  return (
    <div className="bg-white">

      {/* =====================================================
          HERO / DISCOUNT SLIDER
      ===================================================== */}

      <HeroSlider />
<CategorySection />

      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      <FeaturedProducts />


      {/* =====================================================
          WHY CHOOSE US
      ===================================================== */}

      <section className="py-16 bg-gray-50 border-y border-gray-100">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Heading */}

          <div className="text-center max-w-2xl mx-auto mb-12">

            <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">
              Why Choose Us
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Shopping Made Simple
            </h2>

            <p className="text-gray-500 mt-3">
              We make your shopping experience easy,
              secure and convenient.
            </p>

          </div>


          {/* Features */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Free Shipping */}

            <div className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition">

              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <Truck size={26} />
              </div>

              <h3 className="font-bold text-lg text-gray-900 mt-5">
                Free Shipping
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed mt-2">
                Enjoy free shipping on qualifying
                orders above Rs.10,000.
              </p>

            </div>


            {/* Secure Shopping */}

            <div className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition">

              <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck size={26} />
              </div>

              <h3 className="font-bold text-lg text-gray-900 mt-5">
                Secure Shopping
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed mt-2">
                Your information and transactions
                are protected.
              </p>

            </div>


            {/* Easy Returns */}

            <div className="bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition">

              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <RotateCcw size={26} />
              </div>

              <h3 className="font-bold text-lg text-gray-900 mt-5">
                Easy Returns
              </h3>

              <p className="text-gray-500 text-sm leading-relaxed mt-2">
                Simple and convenient return options
                for your purchases.
              </p>

            </div>


            {/* Customer Support */}

            <a
            href="#footer"
            className="block bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-lg transition cursor-pointer"
>
  <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
    <Headphones size={26} />
  </div>

  <h3 className="font-bold text-lg text-gray-900 mt-5">
    Customer Support
  </h3>

  <p className="text-gray-500 text-sm leading-relaxed mt-2">
    Our support team is ready to help whenever you need us.
  </p>
</a>

          </div>

        </div>

      </section>


      {/* =====================================================
          CUSTOMER TRUST / REVIEW SECTION
      ===================================================== */}

      <section className="py-16 bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left */}

            <div>

              <span className="text-blue-600 text-sm font-bold uppercase tracking-wider">
                Trusted Shopping
              </span>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
                Quality Products.
                <br />
                Great Experience.
              </h2>

              <p className="text-gray-500 mt-5 leading-relaxed max-w-lg">
                From everyday essentials to the latest
                technology, we bring together products
                that make your life easier and better.
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-2 mt-7 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Start Shopping
                <ArrowRight size={18} />
              </Link>

            </div>


            {/* Right Review Card */}

            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">

              <div className="flex items-center gap-1 text-yellow-400">

                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />
                <Star size={20} fill="currentColor" />

              </div>

              <p className="text-xl md:text-2xl font-semibold text-gray-900 leading-relaxed mt-5">
                "A simple, modern and convenient
                shopping experience."
              </p>

              <div className="flex items-center gap-3 mt-7">

                <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  H
                </div>

                <div>

                  <p className="font-semibold text-gray-900">
                    Happy Customer
                  </p>

                  <p className="text-sm text-gray-500">
                    Verified Shopper
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          NEWSLETTER / CTA
      ===================================================== */}

      <section className="relative overflow-hidden bg-gray-950">

        {/* Decorative circles */}

        <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/30 rounded-full blur-3xl" />

        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />


        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          <div className="max-w-3xl mx-auto text-center text-white">

            <span className="text-blue-400 text-sm font-bold uppercase tracking-wider">
              Don't Miss Out
            </span>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Find Something You'll Love
            </h2>

            <p className="text-gray-400 mt-4">
              Explore our collection and discover
              products selected just for you.
            </p>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-bold mt-7 transition"
            >
              Explore Products
              <ArrowRight size={19} />
            </Link>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;