import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProductContext } from '../context/ProductContext';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart, addToWishlist, removeFromWishlist, wishlistItems, allProducts } = useProductContext();

  let isInWishlist = wishlistItems.some(ele => ele._id == product._id)


  const handleWishlistToggle = (id) => {
    
    const existing = wishlistItems.find((product, indx) => (
      product._id.toString() == id.toString()
    ))
    if (existing) {
      removeFromWishlist(id)
    }
    else{
      addToWishlist(id)
    }

  };

  const handleAddToCart = (id) => {
    addToCart(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-100 rounded-lg aspect-square mb-4">
        {product.isFeatured && (
          <div className='bg-black p-2 text-white absolute left-0 top-0 rounded text-xs font-medium'>
            Featured
          </div>
        )}
        <Link to={`/product/${product._id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={() => handleWishlistToggle(product._id)}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-black hover:text-white transition-all duration-300 z-10"
        // aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
          {/* <Heart className='' /> */}
        </button>

        {/* Add to Cart Button */}
        {/* <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 bg-black text-white py-3 font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors duration-300 z-10"
        >
          <ShoppingBag className="w-5 h-5" />
          Add to Cart
        </motion.button> */}
      </div>

      <div>
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-lg mb-1 group-hover:text-gray-600 transition-colors duration-300 line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-500 text-sm mb-2">{product.category}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="ml-2 text-gray-400 line-through text-sm">${product.originalPrice}</span>
            )}
          </div>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
        </div>
        <motion.button
          // initial={{ opacity: 0, y: 20 }}
          // animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          onClick={() => handleAddToCart(product._id)}
          className=" bg-black rounded-lg w-full text-white py-3 font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition-colors duration-300 z-10"
        >
          <ShoppingBag className="w-5 h-5" />
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;