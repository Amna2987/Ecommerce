import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, Shield, Truck, Lock } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';

const CartPage = () => {

  const { cartItems, increaseItemQuantity,decreaseItemQuantity, removeFromCart, clearCart,cartTotal } = useContext(ProductContext);
  

  // Calculate totals
  const shipping = cartTotal > 50 ? 0 : 5.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  // const updateQuantity = (id, newQuantity) => {
  //   if (newQuantity < 1) {
  //     removeFromCart(id);
  //     return;
  //   }
  //   setCartItems(cartItems.map(item => 
  //     item.id === id ? { ...item, quantity: newQuantity } : item
  //   ));
  // };

  // const removeFromCart = (id) => {
  //   setCartItems(cartItems.filter(item => item.id !== id));
  // };

  // const clearCart = () => {
  //   setCartItems([]);
  // };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <p className="text-gray-600 mt-2">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items in your cart
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

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingBag className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Cart Items */}
            <div className="lg:col-span-2">
              {/* Cart Items List */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Cart
                  </button>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
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
                              <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                              <p className="text-gray-600 text-sm mb-2">{item.product.brand}</p>
                              <p className="text-gray-500 text-sm">{item.product.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold mb-1">${(item.product.price * item.qty).toFixed(2)}</div>
                              {item.product.price && (
                                <div className="text-sm text-gray-500 line-through">
                                  ${(item.product.price * item.qty).toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-6">
                            {/* Category & Quantity Controls */}
                            <div className="flex items-center gap-6">
                              <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                {item.product.category}
                              </span>
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() => decreaseItemQuantity(item.product._id)}
                                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 w-16 text-center font-medium">{item.qty}</span>
                                <button
                                  onClick={() => increaseItemQuantity(item.product._id)}
                                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            
                            {/* Remove Button */}
                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Features */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-black text-white rounded-full flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Free Shipping</h4>
                  <p className="text-sm text-gray-600">On orders over $50</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-black text-white rounded-full flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Secure Checkout</h4>
                  <p className="text-sm text-gray-600">100% secure payment</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-black text-white rounded-full flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold mb-2">Easy Returns</h4>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
                
                {/* Summary Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  className="block w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors text-center mb-4"
                >
                  Proceed to Checkout
                </Link>

                {/* Continue Shopping */}
                <Link
                  to="/shop"
                  className="block w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
                >
                  Continue Shopping
                </Link>

                {/* Help Text */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600 text-center">
                    Need help?{' '}
                    <Link to="/contact" className="text-black hover:underline">
                      Contact our support team
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;