import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Summer Sale",
    subtitle: "Up to 40% Off",
    description:
      "Refresh your lifestyle with amazing products at special prices.",
    button: "Shop Now",
    
    image: " /public/BedSheet1.webp",
  },
  {
    id: 2,
    title: "Latest BedSheet Design",
    subtitle: "Pure Cotton",
    description:
      "Discover BedSheets, Comfertors, Bed Sets and more.",
    button: "Explore New Arrivals",
    image:
      " /public/BedsHeet.webp",
  },
  {
    id: 3,
    title: "New Arrivals",
    subtitle: "Fresh. Modern. Stylish.",
    description:
      "Check out our newest collection and find your next favorite product.",
    button: "View New Arrivals",
    image:
         " /public/ColBedsheet.webp",     
  },
  {
    id: 4,
    title: "Weekend Special",
    subtitle: "Limited Time Offer",
    description:
      "Grab your favorite products before these special offers disappear.",
    button: "Shop Deals",
    image:
      "/public/WBedsheet.webp",
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((previous) =>
        previous === slides.length - 1
          ? 0
          : previous + 1
      );
    }, 5000)

    return () => clearInterval(timer);
  }, [])

  const nextSlide = () => {
    setCurrent((previous) =>
      previous === slides.length - 1
        ? 0
        : previous + 1
    );
  };

  const previousSlide = () => {
    setCurrent((previous) =>
      previous === 0
        ? slides.length - 1
        : previous - 1
    );
  };

  const slide = slides[current];

  return (
    <section className="relative h-[550px] md:h-[500px] overflow-hidden">

      {/* Background Image */}
      <img
        src={slide.image}
        alt={slide.title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">

        <div className="max-w-2xl text-white">

          <span className="inline-block bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Limited Time Offer
          </span>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            {slide.title}
          </h1>

          <h2 className="text-3xl md:text-4xl font-bold text-blue-300 mt-3">
            {slide.subtitle}
          </h2>

          <p className="text-gray-200 text-lg md:text-xl mt-5 max-w-xl leading-relaxed">
            {slide.description}
          </p>

          <div className="flex flex-wrap gap-4 mt-8">

            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-7 py-3.5 rounded-xl font-bold transition"
            >
              {slide.button}
              <ArrowRight size={19} />
            </Link>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 px-7 py-3.5 rounded-xl font-bold transition"
            >
              Explore Products
            </Link>

          </div>

        </div>

      </div>

      {/* Previous */}
      <button
        onClick={previousSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center"
      >
        <ChevronLeft size={22} />
      </button>

      {/* Next */}
      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center"
      >
        <ChevronRight size={22} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex gap-2">

        {slides.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setCurrent(index)}
            className={`h-2.5 rounded-full transition-all ${
              current === index
                ? "w-8 bg-white"
                : "w-2.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}

      </div>

    </section>
  );
}

export default HeroSlider;