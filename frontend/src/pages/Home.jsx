import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Truck, RefreshCw } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductServices } from '../services/product.service';
import { ProductContext } from '../context/ProductContext';


const Home = () => {

  const {getProducts, data,allProducts} = useContext(ProductContext)
  // const featuredProducts = [
  //   {
  //     id: 1,
  //     name: 'Minimal Watch',
  //     category: 'Accessories',
  //     price: 199.99,
  //     originalPrice: 249.99,
  //     rating: 4,
  //     image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800'
  //   },
  //   {
  //     id: 2,
  //     name: 'Wireless Headphones',
  //     category: 'Electronics',
  //     price: 299.99,
  //     rating: 5,
  //     image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'
  //   },
  //   {
  //     id: 3,
  //     name: 'Modern Chair',
  //     category: 'Furniture',
  //     price: 449.99,
  //     rating: 4,
  //     image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=800'
  //   },
  //   {
  //     id: 4,
  //     name: 'Leather Backpack',
  //     category: 'Fashion',
  //     price: 159.99,
  //     originalPrice: 199.99,
  //     rating: 5,
  //     image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'
  //   },
  // ];

  const categoryImg = [
    'https://plus.unsplash.com/premium_photo-1661404164814-9d3c137097aa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YmVhdXR5fGVufDB8fDB8fHww' ,
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800' ,
    'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800' ,
    'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800' ,
  ];
  // const categories = [
  //   { name: 'Electronics', count: 45, image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800' },
  //   { name: 'Fashion', count: 68, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800' },
  //   { name: 'Home & Living', count: 32, image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800' },
  //   { name: 'Sports', count: 27, image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800' },
  // ];

  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Free Shipping',
      description: 'On orders over $50'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Secure Payment',
      description: '100% secure transactions'
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
  ];

  const [categories , setCategories] = useState([])
  const [loader, setLoader] = useState(false)
  const [featuredProducts, setFeaturedProducts] = useState([])
 
// console.log('home data', allProducts);


  useEffect(() => {
  const fetchData =  () => {

    try {
      setLoader(true)
      const feature =  allProducts.filter(p => p.isFeatured)
       setFeaturedProducts(feature)
      setCategories(data?.categories)
                      
      
    } catch (error) {
      console.log('no products',error);
    }
    finally {
      setLoader(false)
    }
  }
  fetchData()
      
    }, [allProducts, data])
    // console.log('home feature', featuredProducts);
    
  return (
    <div className="animate-fade-in ">
      {/* Hero Banner */}
      <section className="relative flex flex-col justify-center items-center h-screen pt-16 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&auto=format&fit=crop"
            alt="Minimal Store"
            className="w-full h-full object-cover"
          />      
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              MINIMAL
              <br />
              <span className="text-gray-200">ESSENTIALS</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
              Discover premium products with clean aesthetics, exceptional quality, and timeless design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="bg-white text-black px-8 py-4 rounded-md font-medium hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg inline-flex items-center gap-3"
              >
                Shop Collection
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/about"
                className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-md font-medium hover:bg-white hover:text-black transition-all duration-300 text-lg"
              >
                Our Story
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loader?
            <p>loading...</p>:
            categories?.map((category, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg">
                <div className="aspect-square overflow-hidden bg-black">
                  <img
                    src={categoryImg[index]}
                    // alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{category}</h3>
                  {/* <p className="text-gray-300 mb-4">{category.count} products</p> */}
                  <Link
                    to={`/shop?category=${category.toString()}`}
                    className="inline-flex items-center gap-2 text-white font-medium hover:text-gray-300 transition-colors duration-300"
                  >
                    Shop Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="text-gray-600 mt-2">Curated selection of premium items</p>
            </div>
            <Link
              to="/shop"
              className="text-black font-medium hover:text-gray-600 transition-colors duration-300 flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 hover:bg-gray-50 rounded-lg transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-black text-white rounded-full flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;