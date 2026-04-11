import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { useProductContext } from '../context/ProductContext';

const WishlistPage = () => {
  const { 
    wishlistItems, 
    removeFromWishlist, 
    moveWishlistToCart,
    moveAllWishlistToCart,
    clearWishlist,
    addToCart 
  } = useProductContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <p className="text-gray-600 mt-2">
                {wishlistItems.length} saved items
              </p>
            </div>
            <Link
              to="/shop"
              className="flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {wishlistItems.length === 0 ? (
          // Empty Wishlist
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save items you love for later. Click the heart icon on any product.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            {/* Action Bar */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={moveAllWishlistToCart}
                    className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Move All to Cart
                  </button>
                  <button
                    onClick={clearWishlist}
                    className="flex items-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    Clear All
                  </button>
                </div>
                <div className="text-gray-600">
                  Showing {wishlistItems.length} items
                </div>
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Quick Actions Overlay */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => removeFromWishlist(item._id)}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <Link
                        to={`/product/${item._id}`}
                        className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </Link>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-2 line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold">
                          ${item.price?.toFixed(2)}
                        </span>
                        {item.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${item.originalPrice?.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          addToCart(item);
                          removeFromWishlist(item._id);
                        }}
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-900 transition-colors text-sm"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;