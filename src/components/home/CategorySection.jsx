import { Link } from "react-router-dom";

const categories = [
  {
    name: "Fashion",
    category: "Fashion",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=80",
    description: "Modern styles for every occasion",
  },
  {
    name: "Footwear",
    category: "Footwear",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    description: "Step into comfort and style",
  },
  {
    name: "Bedding",
    category: "Bedding",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
    description: "Make your bedroom feel better",
  },
  {
    name: "Electronics",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80",
    description: "Smart gadgets and technology",
  },
  {
    name: "Accessories",
    category: "Accessories",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
    description: "Complete your everyday look",
  },
];

function CategorySection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
            Explore Collections
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Shop by Category
          </h2>

          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Find exactly what you're looking for from our carefully
            selected categories.
          </p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">

          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(
                category.category
              )}`}
              className="group relative h-72 rounded-2xl overflow-hidden shadow-md"
            >

              {/* Image */}
              <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-110"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">

                <h3 className="text-2xl font-bold text-white">
                  {category.name}
                </h3>

                <p className="text-white/80 text-sm mt-1">
                  {category.description}
                </p>

                <span className="text-white text-sm font-semibold mt-4">
                  Shop Now →
                </span>

              </div>

            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}

export default CategorySection;