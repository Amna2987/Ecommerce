import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, AlertCircle, CreditCard, RefreshCw, ShoppingBag } from 'lucide-react';

const PaymentCancelled = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <XCircle className="w-16 h-16 text-red-600" />
          </div>

          {/* Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your payment was not completed. Your order has been saved and you can complete the payment when you're ready.
          </p>

          {/* Alert Box */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <h3 className="font-bold text-red-800 mb-2">What happened?</h3>
                <ul className="text-red-700 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>Payment was cancelled or failed to process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>No charges were made to your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>Your cart items are saved for 24 hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>You can try again with a different payment method</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Common Reasons */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Common Reasons</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <CreditCard className="w-10 h-10 text-gray-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Payment Method Issues</h3>
                <p className="text-gray-600">Insufficient funds, expired card, or payment gateway issues.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <AlertCircle className="w-10 h-10 text-gray-600 mb-4" />
                <h3 className="font-bold text-lg mb-2">Security Checks</h3>
                <p className="text-gray-600">Your bank may have declined the transaction for security reasons.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => navigate('/checkout')}
              className="inline-flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Try Payment Again
            </button>

            <Link
              to="/cart"
              className="inline-flex items-center justify-center gap-3 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Cart
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>

          {/* Support Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 mb-6">
              Need help with your payment? Contact our support team for assistance.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                to="/contact"
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Contact Support
              </Link>
              <a
                href="tel:+11234567890"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Call Support: +1 (123) 456-7890
              </a>
              <Link
                to="/help/payment"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Payment FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;