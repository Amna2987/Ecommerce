
import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Home, Package, ArrowRight, Clock, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import ProductProvider, { ProductContext } from '../context/ProductContext';
import { useState } from 'react';
import { OrderServices } from '../services/order.service';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get("session_id");
  const orderid= params.get('orderId')

  // const orderId = location.state?.orderId || new URLSearchParams(location.search).get('orderId');
const{orderdetail} = useContext(ProductContext)

const [confirmData, setConfirmData] = useState({}) ///


  useEffect(() => {
    
    if (sessionId) {
  console.log('sessionId', sessionId);
  const orderConfirmation = async () => {
    const res = await OrderServices.handleOrderConfirm(sessionId)
    console.log('context confirm', res.data);
    setConfirmData(res.data.data)
  }
  orderConfirmation()
  // console.log('eff conf', confirmData);
  toast.success('Payment Successful! Your order has been placed.');
}
else{
      console.log('orderid', orderid);
      const codConfirmation = async () => {
        const res = await OrderServices.handleCodConfirm(orderid)
        console.log('cod confirm', res.data);
        setConfirmData(res.data.data)
        
      }
      codConfirmation()
    }
  }, []);


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {
              sessionId? 'Payment Successful!': 'Order Placed'
            }
            
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Thank you for your order. Your order has been processed successfully and your order is being prepared.
          </p>
      
          {/* <p className='text-lg mb-3'>Your order Id: {confirmData.orderId}</p>: */}
         

          {/* Order ID */}
          {confirmData.orderId && (
            <div className="inline-block bg-green-100 text-green-800 px-6 py-3 rounded-full mb-8">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5" />
                <span className="font-medium">Order ID: {confirmData.orderId}</span>
                <span className="font-medium">Total Amount: $ {confirmData.orderSummary.totalAmount}</span>
              </div>
            </div>
          )}

          {/* Order Timeline */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-center">What's Next?</h2>
            <div className="space-y-6 flex justify-between items-start ">

              <div className="flex items-center w-[30%] gap-4 flex-col mt-[24px]">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Order Confirmed</h3>
                  <p className="text-gray-600">We've received your order. It will be processed within 24 hours.</p>
                </div>
              </div>

              <div className="flex flex-col items-center w-[30%] gap-4">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Order Processing</h3>
                  <p className="text-gray-600">Your items are being prepared for shipment. We'll notify you when they're on the way.</p>
                </div>
              </div>

              <div className="flex flex-col items-center w-[30%] gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Delivery</h3>
                  {/* <p className="text-gray-600">Shipping type:{confirmData.shippingMethod.shippingType}</p> */}
              
                  <p className="text-gray-600">Expected delivery within 3-7 business days. You'll receive tracking information via email.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to={confirmData.orderId ? `/orders/${confirmData.orderId}` : '/dashboard'}
              className="inline-flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              View Order Details
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/shop"
              className="inline-flex items-center justify-center gap-3 border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>

          {/* Additional Info */}
          <div className="text-sm text-gray-500 space-y-2">
            <p>A confirmation email has been sent to your registered email address.</p>
            <p>For any questions about your order, please contact our support team.</p>
          </div>

          {/* Quick Actions */}
          {/* <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center gap-6">
              <button className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors">
                <Download className="w-4 h-4" />
                Download Invoice
              </button>
              <Link to="/contact" className="text-gray-600 hover:text-black transition-colors">
                Contact Support
              </Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-black transition-colors">
                Order History
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;