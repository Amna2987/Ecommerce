import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Truck, 
  Home, 
  CreditCard, 
  Calendar, 
  MapPin, 
  ArrowLeft,
  Download,
  Printer,
  ShoppingBag,
  ChevronRight
} from 'lucide-react';
import { OrderServices } from '../services/order.service';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('param order', orderId);
  

  useEffect(() => {
  
      const fetchOrderDetails = async () => {
        try {
          setLoading(true)
          const res = await OrderServices.orderDetail(orderId)
          console.log('single order', res.data.data);
          setOrder(res.data.data)
  
        } catch (error) {
          console.log(error);
        }
        finally {
          setLoading(false)
        }
      }
      fetchOrderDetails()
    }, [])

  // Mock order data - Replace with API call
//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       try {
//         setLoading(true);
//         // Simulate API call
//         await new Promise(resolve => setTimeout(resolve, 1000));
        
//         // Mock data based on your schema
//         const mockOrder = {
//           orderId: orderId || 'ORD-001234',
//           userId: 'user_123456',
//           shippingInfo: {
//             name: 'John Doe',
//             email: 'john@example.com',
//             address: '123 Main Street',
//             city: 'New York',
//             province: 'NY',
//             zipCode: 10001
//           },
//           orderSummary: {
//             subTotal: 259.97,
//             totalAmount: 280.77
//           },
//           orderItems: [
//             {
//               _id: '1',
//               name: 'Wireless Bluetooth Headphones',
//               price: 149.99,
//               originalPrice: 199.99,
//               image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
//               quantity: 1,
//               category: 'Electronics'
//             },
//             {
//               _id: '2',
//               name: 'Minimalist Sneakers',
//               price: 69.99,
//               originalPrice: 89.99,
//               image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
//               quantity: 2,
//               category: 'Fashion'
//             }
//           ],
//           paymentMethod: 'Credit Card',
//           shippingMethod: {
//             shippingType: 'Standard Delivery',
//             shippingCharges: 5.99
//           },
//           orderStatus: 'processing', // pending, processing, shipped, delivered, cancelled
//           orderedOn: '2024-12-11'
//         };
        
//         setOrder(mockOrder);
//         setError(null);
//       } catch (err) {
//         setError('Failed to load order details');
//         console.error('Error fetching order:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrderDetails();
//   }, [orderId]);

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" />, text: 'Pending' },
      processing: { color: 'bg-blue-100 text-blue-800', icon: <Package className="w-4 h-4" />, text: 'Processing' },
      shipped: { color: 'bg-purple-100 text-purple-800', icon: <Truck className="w-4 h-4" />, text: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" />, text: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-4 h-4" />, text: 'Cancelled' }
    };
    
    return statusConfig[status] || statusConfig.pending;
  };

  // Get next status action
  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: 'processing',
      processing: 'shipped',
      shipped: 'delivered',
      delivered: null,
      cancelled: null
    };
    return statusFlow[currentStatus];
  };

  // Calculate estimated delivery
  const getEstimatedDelivery = (orderedDate, status) => {
    if (status === 'delivered' || status === 'cancelled') return null;
    
    const orderDate = new Date(orderedDate);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(orderDate.getDate() + (status === 'shipped' ? 2 : 7));
    
    return estimatedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
          <Link
            to="/dashboard"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(order.orderStatus);
  const estimatedDelivery = getEstimatedDelivery(order.orderedOn, order.orderStatus);
  const nextStatus = getNextStatus(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Orders
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold">Order Details</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${statusBadge.color}`}>
                  {statusBadge.icon}
                  {statusBadge.text}
                </span>
              </div>
              <p className="text-gray-600 mt-2">
                Order #{order.orderId} • Placed on {new Date(order.orderedOn).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Invoice
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items & Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Progress */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Order Progress</h2>
              <div className="flex justify-between items-center relative">
                {['ordered', 'processing', 'shipped', 'delivered'].map((step, index) => {
                  const isCompleted = 
                    (step === 'ordered') ||
                    (step === 'processing' && ['processing', 'shipped', 'delivered'].includes(order.orderStatus)) ||
                    (step === 'shipped' && ['shipped', 'delivered'].includes(order.orderStatus)) ||
                    (step === 'delivered' && order.orderStatus === 'delivered');
                  
                  const isCurrent = 
                    (step === 'ordered' && order.orderStatus === 'pending') ||
                    (step === 'processing' && order.orderStatus === 'processing') ||
                    (step === 'shipped' && order.orderStatus === 'shipped') ||
                    (step === 'delivered' && order.orderStatus === 'delivered');
                  
                  return (
                    <div key={step} className="flex flex-col items-center relative z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                        isCompleted ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : isCurrent ? (
                          <div className="w-6 h-6 border-2 border-black rounded-full" />
                        ) : (
                          <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                        )}
                      </div>
                      <div className="text-center">
                        <div className={`font-medium text-sm ${
                          isCurrent || isCompleted ? 'text-black' : 'text-gray-400'
                        }`}>
                          {step.charAt(0).toUpperCase() + step.slice(1)}
                        </div>
                        {step === 'ordered' && (
                          <div className="text-xs text-gray-500 mt-1">{order.orderedOn}</div>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {/* Progress line */}
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                  <div 
                    className="h-full bg-black transition-all duration-300"
                    style={{ 
                      width: order.orderStatus === 'delivered' ? '100%' :
                              order.orderStatus === 'shipped' ? '66%' :
                              order.orderStatus === 'processing' ? '33%' : '0%'
                    }}
                  />
                </div>
              </div>
              
              {estimatedDelivery && (
                <div className="mt-8 p-4 bg-blue-50 text-blue-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5" />
                    <div>
                      <div className="font-medium">Estimated Delivery</div>
                      <div>{estimatedDelivery}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Order Items</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {order?.orderItems?.map((item) => (
                  <div key={item._id} className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
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
                            <p className="text-gray-600 text-sm mb-2">{item.product.category}</p>
                            <div className="flex items-center gap-4">
                              <div className="text-sm text-gray-500">Qty: {item.qty}</div>
                              {item.product.price && (
                                <div className="text-sm text-gray-500 line-through">
                                  ${item.product.price?.toFixed(2)}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold mb-1">${(item.product.price * item.qty).toFixed(2)}</div>
                            <div className="text-sm text-gray-500">${item.product.price?.toFixed(2)} each</div>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex justify-end gap-4 mt-6">
                          <Link
                            to={`/product/${item.product._id}`}
                            className="text-black hover:text-gray-600 font-medium text-sm"
                          >
                            View Product
                          </Link>
                          <button className="text-black hover:text-gray-600 font-medium text-sm">
                            Buy Again
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.orderSummary.subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>${order.shippingMethod.shippingCharges.toFixed(2)}</span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${(order.orderSummary.totalAmount - order.orderSummary.subTotal - order.shippingMethod.shippingCharges).toFixed(2)}</span>
                </div> */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${order.orderSummary.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Information */}
          <div className="space-y-8">
            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Home className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Shipping Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="font-medium">{order.shippingInfo.name}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium">{order.shippingInfo.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Address</div>
                  <div className="font-medium">
                    {order.shippingInfo.address}<br />
                    {order.shippingInfo.city}, {order.shippingInfo.province} {order.shippingInfo.zipCode}
                  </div>
                </div>
                {/* <button className="w-full mt-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  Edit Shipping Address
                </button> */}
              </div>
            </div>

            {/* Payment & Shipping Methods */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-6">
                {/* Payment Method */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-5 h-5" />
                    <h3 className="font-semibold">Payment Method</h3>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium">{order.paymentMethod}</div>
                    <div className="text-sm text-gray-600 mt-1">Paid on {order.orderedOn}</div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Truck className="w-5 h-5" />
                    <h3 className="font-semibold">Shipping Method</h3>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium">{order.shippingMethod.shippingType}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      ${order.shippingMethod.shippingCharges.toFixed(2)} • {estimatedDelivery ? `Est. delivery: ${estimatedDelivery}` : 'Delivered'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            {/* <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Order Actions</h2>
              <div className="space-y-3"> */}
                {/* {nextStatus && (
                  <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors">
                    Mark as {nextStatus.charAt(0).toUpperCase() + nextStatus.slice(1)}
                  </button>
                )} */}
                
                {/* {order.orderStatus === 'processing' && (
                  <button className="w-full border border-red-300 text-red-600 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors">
                    Cancel Order
                  </button>
                )} */}
                
                {/* <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Contact Support
                </button>
                
                <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Return Items
                </button>
              </div>
            </div> */}

            {/* Help Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Need Help?</h2>
              <div className="space-y-3">
                <Link
                  to="/contact"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span>Contact Customer Support</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/help/returns"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span>Return Policy</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/help/shipping"
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span>Shipping Information</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Link>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingBag className="w-4 h-4" />
              Shop Similar Products
            </button>
            <button className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors">
              Track Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;