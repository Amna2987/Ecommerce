import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, increaseItemQuantity,decreaseItemQuantity, removeFromCart, clearCart,cartTotal } = useContext(ProductContext);
  // console.log('cart sidebar', cartItems);
  // console.log('cart total', cartTotal);
  
  // Calculate totals
  // const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // const shipping = cartTotal > 50 ? 0 : 5.99;
  // const tax = cartTotal * 0.08; // 8% tax
  // const total = cartTotal + shipping + tax;
  // const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6" />
                <h2 className="text-xl font-bold">Your Cart</h2>
                <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
                  {cartItems.length} items
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-gray-600 mb-6">Add some products to get started</p>
                  <button
                    onClick={onClose}
                    className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.product._id} className="flex gap-4 pb-6 border-b border-gray-100">
                        {/* Product Image */}
                        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium mb-1">{item.product.name}</h4>
                              <p className="text-sm text-gray-600">{item.product.category}</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => decreaseItemQuantity(item.product._id)}
                                className="px-3 py-1 hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 py-1 w-12 text-center">{item.qty}</span>
                              <button
                                onClick={() => increaseItemQuantity(item.product._id)}
                                className="px-3 py-1 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {/* Price */}
                            <div className="text-right">
                              <div className="font-semibold">${(item.product.discountedPrice * item.qty).toFixed(2)}</div>
                              <div className="font-semibold">{item.qty}</div>
                              {item.product.discountedPrice && (
                                <div className="text-sm text-gray-500 line-through">
                                  {/* ${(item.product.price).toFixed(2)} */}
                                  ${(item.product.price * item.qty).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Clear Cart Button */}
                  <button
                    onClick={clearCart}
                    className="w-full mt-6 py-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Cart
                  </button>
                </>
              )}
            </div>

            {/* Footer with Totals */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 p-6">
                {/* Order Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    {/* <span>Subtotal</span> */}
                    {/* <span>${subtotal.toFixed(2)}</span> */}
                    {/* <span>${cartTotal}</span> */}
                  </div>
                  {/* <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div> */}
                  <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/cart"
                    onClick={onClose}
                    className="block bg-white border-2 border-black text-black py-3 rounded-lg font-medium hover:bg-black hover:text-white transition-colors text-center flex items-center justify-center gap-2"
                  >
                    View Cart Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/checkout"
                    onClick={onClose}
                    className="block bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors text-center"
                  >
                    Proceed to Checkout
                  </Link>
                  <button
                    onClick={onClose}
                    className="w-full py-3 text-gray-600 hover:text-black transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;