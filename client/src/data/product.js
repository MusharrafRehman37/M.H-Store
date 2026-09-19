

const products = [
  // ================= ELECTRONICS =================
  // {
  //   id: "1",
  //   name: "Premium Wireless Headphones",
  //   category: "Electronics",
  //   price: 8999,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Premium wireless headphones with high-quality sound and comfortable ear cushions.",
  //   stock: 25,
  // },

  // {
  //   id: "2",
  //   name: "Smart Watch Series 5",
  //   category: "Electronics",
  //   price: 12999,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Modern smartwatch with fitness tracking, notifications and stylish design.",
  //   stock: 18,
  // },

  // {
  //   id: "8",
  //   name: "Portable Bluetooth Speaker",
  //   category: "Electronics",
  //   price: 5499,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Portable Bluetooth speaker with powerful sound and long battery life.",
  //   stock: 28,
  // },

  // // ================= FASHION =================

  // {
  //   id: "3",
  //   name: "Minimalist Backpack",
  //   category: "Fashion",
  //   price: 4499,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Durable and stylish backpack perfect for university, work and travel.",
  //   stock: 32,
  // },

  // // ================= FOOTWEAR =================

  // {
  //   id: "4",
  //   name: "Running Sneakers",
  //   category: "Footwear",
  //   price: 6499,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Comfortable running sneakers designed for everyday activities and workouts.",
  //   stock: 20,
  // },

  // // ================= ACCESSORIES =================

  // {
  //   id: "5",
  //   name: "Modern Sunglasses",
  //   category: "Accessories",
  //   price: 2499,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Classic modern sunglasses with a lightweight frame and stylish appearance.",
  //   stock: 40,
  // },

  // {
  //   id: "13",
  //   name: "Genuine Leather Wallet",
  //   category: "Accessories",
  //   price: 1499,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Classic men's leather wallet with multiple card and cash compartments.",
  //   stock: 35,
  // },

  // // ================= GAMING =================

  // {
  //   id: "6",
  //   name: "Mechanical Gaming Keyboard",
  //   category: "Gaming",
  //   price: 8999,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Mechanical keyboard with responsive keys designed for gaming and productivity.",
  //   stock: 15,
  // },

  // // ================= HOME =================

  // {
  //   id: "7",
  //   name: "Premium Coffee Maker",
  //   category: "Home",
  //   price: 15999,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Modern coffee maker for preparing delicious coffee at home.",
  //   stock: 12,
  // },

  // // ================= BEDDING =================

  // {
  //   id: "15",
  //   name: "Premium Cotton Bedsheet Set",
  //   category: "Bedding",
  //   price: 3499,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Soft and comfortable premium cotton bedsheet set for a stylish and relaxing bedroom.",
  //   stock: 20,
  // },

  // {
  //   id: "16",
  //   name: "Luxury Comforter Set",
  //   category: "Bedding",
  //   price: 5999,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Warm and comfortable comforter set designed for a cozy bedroom.",
  //   stock: 15,
  // },

  // {
  //   id: "17",
  //   name: "Soft Pillow Pair",
  //   category: "Bedding",
  //   price: 1799,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Soft and comfortable pillows suitable for everyday sleeping and relaxation.",
  //   stock: 30,
  // },

  // // ================= PAKISTANI FASHION =================

  // {
  //   id: "9",
  //   name: "Men's Cotton Shalwar Kameez",
  //   category: "Fashion",
  //   price: 4999,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Comfortable traditional Pakistani shalwar kameez made from premium cotton fabric.",
  //   stock: 20,
  // },

  // {
  //   id: "11",
  //   name: "Women's Unstitched Lawn Suit",
  //   category: "Fashion",
  //   price: 3499,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Elegant unstitched lawn suit suitable for everyday wear and summer occasions.",
  //   stock: 25,
  // },

  // {
  //   id: "14",
  //   name: "Pakistani Embroidered Shawl",
  //   category: "Fashion",
  //   price: 3999,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1601924928377-5a6e8b7f5c1b?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Beautiful embroidered shawl inspired by traditional Pakistani fashion.",
  //   stock: 18,
  // },

  // // ================= PAKISTANI FOOTWEAR =================

  // {
  //   id: "10",
  //   name: "Traditional Pakistani Khussa",
  //   category: "Footwear",
  //   price: 2499,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Traditional handcrafted-style khussa perfect for weddings and cultural occasions.",
  //   stock: 15,
  // },

  // // ================= FRAGRANCES =================

  // {
  //   id: "12",
  //   name: "Men's Premium Perfume",
  //   category: "Fragrances",
  //   price: 2999,
  //   currency: "PKR",
  //   image:
  //     "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
  //   description:
  //     "Long-lasting men's fragrance with a sophisticated and modern scent.",
  //   stock: 30,
  // },
];

export default products;