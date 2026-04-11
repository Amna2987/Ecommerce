import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, X, ShoppingBag, Eye, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductContext } from '../context/ProductContext';

const WishlistDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { 
    wishlistItems, 
    removeFromWishlist, 
    moveWishlistToCart, 
    moveAllWishlistToCart,
    clearWishlist,
    wishlistCount 
  } = useProductContext();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

 
  

  return (
    <div className="relative bg" ref={dropdownRef}>
      {/* Wishlist Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 mt-2 rounded-full transition-colors duration-300"
        aria-label="Wishlist"
      >
        <Heart className="w-5 h-5 text-black" />
        {wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {wishlistCount > 9 ? '9+' : wishlistCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b  border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <h3 className="font-semibold">Wishlist</h3>
                  <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                    {wishlistCount} items
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="max-h-96 overflow-y-auto">
              {wishlistItems.length === 0 ? (
                <div className="p-8 text-center">
                  <Heart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-600">Your wishlist is empty</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Save items you love for later
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {wishlistItems?.map((item) => (
                    <div  className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex gap-3">
                        {/* Product Image */}
                        <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="pr-2">
                              <h4 className="font-medium text-sm line-clamp-1">
                                {item.name}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1">
                                {item.category}
                              </p>
                            </div>
                            <button
                              onClick={() => removeFromWishlist(item._id)}
                              className="p-1 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-3 h-3 text-gray-400" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-3">
                            <div className="font-semibold">
                              ${item.price?.toFixed(2)}
                              {item.originalPrice && (
                                <span className="ml-2 text-xs text-gray-500 line-through">
                                  ${item.originalPrice?.toFixed(2)}
                                </span>
                              )}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Link
                                to={`/product/${item._id}`}
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                                title="View Product"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </Link>
                              <button
                                onClick={() => moveWishlistToCart(item._id)}
                                className="p-1.5 bg-black text-white hover:bg-gray-900 rounded transition-colors"
                                title="Add to Cart"
                              >
                                <ShoppingBag className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
              }
            </div>

            {/* Footer Actions */}
            {wishlistItems.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={moveAllWishlistToCart}
                    className="flex items-center justify-center gap-2 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors text-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Move All to Cart
                  </button>
                  <button
                    onClick={clearWishlist}
                    className="flex items-center justify-center gap-2 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </div>
                <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="block text-center mt-3 text-sm text-black hover:text-gray-600 transition-colors"
                >
                  View Full Wishlist →
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WishlistDropdown;