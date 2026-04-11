const mongoose = require('mongoose');
const Product = require('./components/models/product.model');
require("dotenv").config();
const connectDB = require("./components/config/db");

const MONGO_URI = process.env.MONGO_URI

const products = [
  // ========== ELECTRONICS ==========
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality.",
    price: 199.99,
    discountedPrice: 149.99,
    category: "Electronics",
    brand: "AudioTech",
    stock: 50,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    images: [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e" },
      { url: "https://images.unsplash.com/photo-1484704849700-f032a568e944" },
      { url: "https://images.unsplash.com/photo-1583394838336-acd977736f90" }
    ],
    rating: 4.5,
    numReviews: 128,
    isFeatured: true,
    tags: ["wireless", "bluetooth", "headphones", "audio", "tech"]
  },
  {
    name: "Smart Watch Pro",
    description: "Advanced smartwatch with health monitoring, GPS, and waterproof design. Track your fitness goals.",
    price: 299.99,
    discountedPrice: 249.99,
    category: "Electronics",
    brand: "TechWear",
    stock: 35,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49",
    images: [
      { url: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49" },
      { url: "https://images.unsplash.com/photo-1546868871-7041f2a55e12" },
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62" }
    ],
    rating: 4.7,
    numReviews: 89,
    isFeatured: true,
    tags: ["smartwatch", "fitness", "wearable", "tech", "health"]
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast charging wireless pad compatible with all Qi-enabled devices. Sleek and efficient design.",
    price: 49.99,
    discountedPrice: 39.99,
    category: "Electronics",
    brand: "PowerFlow",
    stock: 120,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12",
    images: [
      { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12" },
      { url: "https://images.unsplash.com/photo-1586950012036-b957f2c7cbf3" },
      { url: "https://images.unsplash.com/photo-1586953208448-b95a0a6d60e6" }
    ],
    rating: 4.3,
    numReviews: 56,
    isFeatured: false,
    tags: ["charger", "wireless", "accessories", "tech", "charging"]
  },
  {
    name: "Portable Bluetooth Speaker",
    description: "Waterproof portable speaker with 360° sound and 24-hour battery. Perfect for outdoor adventures.",
    price: 129.99,
    discountedPrice: 99.99,
    category: "Electronics",
    brand: "SoundWave",
    stock: 75,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
    images: [
      { url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b" },
      { url: "https://images.unsplash.com/photo-1545454675-3531b543be5d" },
      { url: "https://images.unsplash.com/photo-1545454675-3531b543be5d" }
    ],
    rating: 4.6,
    numReviews: 203,
    isFeatured: true,
    tags: ["speaker", "bluetooth", "portable", "audio", "outdoor"]
  },
  {
    name: "Tablet Pro 10.5\"",
    description: "High-performance tablet with stunning display, powerful processor, and all-day battery life.",
    price: 449.99,
    discountedPrice: 399.99,
    category: "Electronics",
    brand: "TechPro",
    stock: 25,
    image: "https://images.unsplash.com/photo-1546054451-aa7f40b22ec0",
    images: [
      { url: "https://images.unsplash.com/photo-1546054451-aa7f40b22ec0" },
      { url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0" },
      { url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0" }
    ],
    rating: 4.8,
    numReviews: 67,
    isFeatured: false,
    tags: ["tablet", "tech", "mobile", "gadget", "electronics"]
  },

  // ========== FASHION ==========
  {
    name: "Classic Leather Jacket",
    description: "Premium genuine leather jacket with modern fit and timeless design. Perfect for all seasons.",
    price: 249.99,
    discountedPrice: 199.99,
    category: "Fashion",
    brand: "UrbanStyle",
    stock: 40,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5",
    images: [
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5" },
      { url: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126" },
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5" }
    ],
    rating: 4.6,
    numReviews: 92,
    isFeatured: true,
    tags: ["jacket", "leather", "fashion", "outerwear", "men"]
  },
  {
    name: "Minimalist Sneakers",
    description: "Lightweight sneakers with premium comfort and minimalist design. Suitable for everyday wear.",
    price: 89.99,
    discountedPrice: 69.99,
    category: "Fashion",
    brand: "StepEasy",
    stock: 100,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    images: [
      { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772" },
      { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff" },
      { url: "https://images.unsplash.com/photo-1549298916-b41d501d3772" }
    ],
    rating: 4.4,
    numReviews: 156,
    isFeatured: false,
    tags: ["shoes", "sneakers", "footwear", "casual", "unisex"]
  },
  {
    name: "Silk Evening Dress",
    description: "Elegant silk dress with intricate detailing. Perfect for special occasions and evening events.",
    price: 189.99,
    discountedPrice: 159.99,
    category: "Fashion",
    brand: "Elegance",
    stock: 30,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
    images: [
      { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d" },
      { url: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956" },
      { url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d" }
    ],
    rating: 4.8,
    numReviews: 74,
    isFeatured: true,
    tags: ["dress", "evening", "women", "formal", "silk"]
  },
  {
    name: "Designer Handbag",
    description: "Luxury designer handbag with multiple compartments and premium leather finish.",
    price: 299.99,
    discountedPrice: 249.99,
    category: "Fashion",
    brand: "LuxeBags",
    stock: 20,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
    images: [
      { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3" },
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62" },
      { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3" }
    ],
    rating: 4.9,
    numReviews: 48,
    isFeatured: false,
    tags: ["handbag", "accessories", "luxury", "women", "leather"]
  },
  {
    name: "Casual Denim Jeans",
    description: "Comfortable stretch denim jeans with modern fit. Perfect for casual outings and daily wear.",
    price: 79.99,
    discountedPrice: 59.99,
    category: "Fashion",
    brand: "DenimCo",
    stock: 150,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d",
    images: [
      { url: "https://images.unsplash.com/photo-1542272604-787c3835535d" },
      { url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246" },
      { url: "https://images.unsplash.com/photo-1542272604-787c3835535d" }
    ],
    rating: 4.5,
    numReviews: 203,
    isFeatured: true,
    tags: ["jeans", "denim", "casual", "pants", "unisex"]
  },

  // ========== HOME ==========
  {
    name: "Modern Minimalist Sofa",
    description: "Contemporary sofa with clean lines and premium upholstery. Combines comfort with modern aesthetics.",
    price: 899.99,
    discountedPrice: 749.99,
    category: "Home",
    brand: "UrbanLiving",
    stock: 15,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    images: [
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc" },
      { url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e" },
      { url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc" }
    ],
    rating: 4.7,
    numReviews: 45,
    isFeatured: true,
    tags: ["sofa", "furniture", "living room", "modern", "home"]
  },
  {
    name: "Ceramic Dinner Set",
    description: "Elegant 16-piece ceramic dinner set with minimalist design. Dishwasher and microwave safe.",
    price: 129.99,
    discountedPrice: 99.99,
    category: "Home",
    brand: "TableArts",
    stock: 60,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136",
    images: [
      { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136" },
      { url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e" },
      { url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136" }
    ],
    rating: 4.6,
    numReviews: 89,
    isFeatured: false,
    tags: ["dinnerware", "kitchen", "ceramic", "tableware", "home"]
  },
  {
    name: "Smart LED Lighting Kit",
    description: "Smart home lighting system with customizable colors, voice control, and energy-efficient LEDs.",
    price: 149.99,
    discountedPrice: 119.99,
    category: "Home",
    brand: "LightSmart",
    stock: 80,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c",
    images: [
      { url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c" },
      { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64" },
      { url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c" }
    ],
    rating: 4.5,
    numReviews: 112,
    isFeatured: true,
    tags: ["lighting", "smart home", "LED", "decor", "tech"]
  },
  {
    name: "Memory Foam Mattress",
    description: "Premium memory foam mattress with cooling technology and optimal support for restful sleep.",
    price: 699.99,
    discountedPrice: 599.99,
    category: "Home",
    brand: "SleepWell",
    stock: 25,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
    images: [
      { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" },
      { url: "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8" },
      { url: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85" }
    ],
    rating: 4.8,
    numReviews: 67,
    isFeatured: false,
    tags: ["mattress", "bedroom", "sleep", "furniture", "home"]
  },
  {
    name: "Wall Art Canvas Set",
    description: "Set of 3 abstract art canvases. Modern decor pieces that add character to any room.",
    price: 149.99,
    discountedPrice: 119.99,
    category: "Home",
    brand: "ArtDecor",
    stock: 40,
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9",
    images: [
      { url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9" },
      { url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262" },
      { url: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9" }
    ],
    rating: 4.4,
    numReviews: 34,
    isFeatured: true,
    tags: ["art", "decor", "wall art", "home decor", "interior"]
  },

  // ========== BEAUTY ==========
  {
    name: "Vitamin C Serum",
    description: "Antioxidant-rich serum with Vitamin C to brighten skin and reduce signs of aging.",
    price: 49.99,
    discountedPrice: 39.99,
    category: "Beauty",
    brand: "SkinGlow",
    stock: 200,
    image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34",
    images: [
      { url: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34" },
      { url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348" },
      { url: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34" }
    ],
    rating: 4.7,
    numReviews: 189,
    isFeatured: true,
    tags: ["skincare", "serum", "vitamin c", "anti-aging", "beauty"]
  },
  {
    name: "Natural Bristle Hairbrush",
    description: "Premium natural boar bristle hairbrush that distributes natural oils and reduces frizz.",
    price: 34.99,
    discountedPrice: 29.99,
    category: "Beauty",
    brand: "HairCare",
    stock: 150,
    image: "https://images.unsplash.com/photo-1522338140262-f46f5913618a",
    images: [
      { url: "https://images.unsplash.com/photo-1522338140262-f46f5913618a" },
      { url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348" },
      { url: "https://images.unsplash.com/photo-1522338140262-f46f5913618a" }
    ],
    rating: 4.5,
    numReviews: 92,
    isFeatured: false,
    tags: ["haircare", "brush", "tools", "natural", "beauty"]
  },
  {
    name: "Matte Lipstick Set",
    description: "Set of 6 long-lasting matte lipsticks in trending shades. Vegan and cruelty-free formula.",
    price: 59.99,
    discountedPrice: 49.99,
    category: "Beauty",
    brand: "ColorPop",
    stock: 120,
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa",
    images: [
      { url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa" },
      { url: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d" },
      { url: "https://images.unsplash.com/photo-1586495777744-4413f21062fa" }
    ],
    rating: 4.8,
    numReviews: 156,
    isFeatured: true,
    tags: ["makeup", "lipstick", "cosmetics", "vegan", "beauty"]
  },
  {
    name: "Essential Oil Diffuser",
    description: "Ultrasonic aromatherapy diffuser with color-changing LED lights and auto-shutoff feature.",
    price: 39.99,
    discountedPrice: 34.99,
    category: "Beauty",
    brand: "AromaSense",
    stock: 90,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574",
    images: [
      { url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574" },
      { url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348" },
      { url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574" }
    ],
    rating: 4.6,
    numReviews: 78,
    isFeatured: false,
    tags: ["aromatherapy", "diffuser", "wellness", "relaxation", "beauty"]
  },
  {
    name: "Hydrating Face Mask Pack",
    description: "Set of 5 sheet masks with hyaluronic acid for deep hydration and glowing skin.",
    price: 24.99,
    discountedPrice: 19.99,
    category: "Beauty",
    brand: "SkinRevive",
    stock: 180,
    image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34",
    images: [
      { url: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34" },
      { url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348" },
      { url: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34" }
    ],
    rating: 4.4,
    numReviews: 134,
    isFeatured: true,
    tags: ["skincare", "face mask", "hydration", "sheet mask", "beauty"]
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB Connected");

    await Product.deleteMany({});
    console.log("Old products deleted");

    await Product.insertMany(products);
    console.log("New products inserted");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();