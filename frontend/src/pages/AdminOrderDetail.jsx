import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  ChevronRight,
  User,
  Mail,
  Phone,
  Edit,
  Save,
  X,
  AlertCircle,
  DollarSign,
  Box,
  Tag,
  Hash,
  CheckSquare
} from 'lucide-react';
import { toast } from 'react-toastify';
import { AdminServices } from '../services/admin.service';
import { useRef } from 'react';

const AdminOrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [orderStatus, setOrderStatus] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    province: '',
    zipCode: ''
  });

  const [statusOptions, setstatusOptions] = useState([])
  const [editData, setEditData] = useState({
    status: '',
    orderId: '',
  })

  const id = useParams()


  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);

        const response = await AdminServices.getOrderById(id.orderId)
        console.log('iddd', response);
        const orderData = response.data.data;

        setOrder(orderData);
        setOrderStatus(orderData.orderStatus);
        setShippingInfo(orderData.shippingInfo);

      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order:', err);
        // toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);


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


  const handleStatusUpdate = async () => {
    try {
      const res = await AdminServices.updateOrderStatus({ status: orderStatus, id })
      console.log('update', res.data);
      setOrderStatus(res.data.data.orderStatus)
      setIsEditing(false);
      toast.success(res.data.message);

    } catch (err) {
      console.error('Error updating order:', err);
      toast.error('Failed to update order');
    }
  };

  useEffect(() => {
    if (!orderStatus) return;

    if (orderStatus === 'pending') {
      setstatusOptions([
        { value: 'processing', label: 'Processing', icon: <Package className="w-4 h-4" /> },
        { value: 'shipped', label: 'Shipped', icon: <Truck className="w-4 h-4" /> },
        { value: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" /> },
        { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-4 h-4" /> }
      ])
    }
    else if (orderStatus === 'processing') {
      setstatusOptions([
        { value: 'shipped', label: 'Shipped', icon: <Truck className="w-4 h-4" /> },
        { value: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" /> },
        { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-4 h-4" /> }
      ])
    }
    else if (orderStatus === 'shipped') {
      setstatusOptions([
        { value: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" /> },
        { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-4 h-4" /> }
      ])
    }
  }, [orderStatus])
  // const statusOptions = [
  //   { value: 'pending', label: 'Pending', icon: <Clock className="w-4 h-4" /> },
  //   { value: 'processing', label: 'Processing', icon: <Package className="w-4 h-4" /> },
  //   { value: 'shipped', label: 'Shipped', icon: <Truck className="w-4 h-4" /> },
  //   { value: 'delivered', label: 'Delivered', icon: <CheckCircle className="w-4 h-4" /> },
  //   { value: 'cancelled', label: 'Cancelled', icon: <XCircle className="w-4 h-4" /> }
  // ];

  const handleShippingInfoChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (order) {
      setShippingInfo(order.shippingInfo);
    }
  };

  //   const handleEditing = async(id) => {
  //     setIsEditing(true)
  //     setEditData({...editData, status:orderStatus, orderId:id})

  //     const res = await AdminServices.updateOrderStatus(editData)
  //     console.log('update', res.data);

  //   }
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
            to="/admin"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(orderStatus);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <button
                  onClick={() => navigate('/admin')}
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </button>
              </div>
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold">Order Details</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${statusBadge.color}`}>
                  {statusBadge.icon}
                  {statusBadge.text}
                </span>
              </div>
              <div className="flex items-center gap-6 mt-2">
                <p className="text-gray-600">
                  Order #{order._id} • Placed on {new Date(order.orderedOn).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {/* <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                Invoice
              </button> */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Edit className="w-4 h-4" />
                {isEditing ? 'Cancel Edit' : 'Edit Order'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items & Summary */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Update Section */}
            {isEditing && (
              <div className="bg-white rounded-xl shadow-sm p-6 border-2 border-blue-200">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Edit className="w-5 h-5" />
                  Update Order Status
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Status: <span className={`px-2 py-1 rounded text-xs ${statusBadge.color}`}>
                        {statusBadge.text}
                      </span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setOrderStatus(option.value)}
                          className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all ${orderStatus === option.value
                            ? 'bg-black text-white border-black'
                            : 'border-gray-300 hover:border-black hover:bg-gray-50'
                            }`}
                        >
                          {option.icon}
                          <span className="mt-2 text-sm">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {orderStatus === 'shipped' && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tracking Number (Optional)
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Enter tracking number..."
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleStatusUpdate}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Order Items ({order.orderItems?.length || 0})</h2>
                <div className="text-sm text-gray-500">
                  <Box className="w-4 h-4 inline mr-1" />
                  Items Total: ${order.orderSummary?.subTotal?.toFixed(2) || '0.00'}
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {order.orderItems?.map((item, index) => (
                  <div key={item._id || index} className="p-6">
                    <div className="flex gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                            <div className="flex items-center gap-4 mb-2">
                              <span className="text-gray-600 text-sm">{item.product.category}</span>
                              {item.brand && (
                                <span className="text-gray-600 text-sm flex items-center gap-1">
                                  <Tag className="w-3 h-3" />
                                  {item.product.brand}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-sm text-gray-500">Qty: {item.qty}</div>
                              <div className="text-sm text-gray-500">
                                Price: ${item.product.discountedPrice ? item.product.discountedPrice : item.product.price} each
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold mb-1">
                              ${((item.product.discountedPrice ? item.product.discountedPrice.toFixed(2) : item.product.price.toFixed(2)) * (item.qty)).toFixed(2)}
                            </div>
                            {/* <div className="text-sm text-gray-500">
                              SKU: {item.sku || 'N/A'}
                            </div> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Order Summary
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${order.orderSummary?.subTotal?.toFixed(2) || '0.00'}</span>
                </div>
                {order.shippingMethod?.shippingCharges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>${order.shippingMethod?.shippingCharges?.toFixed(2) || '0.00'}</span>
                  </div>
                )}
                {/* {order.orderSummary?.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span>${order.orderSummary?.tax?.toFixed(2) || '0.00'}</span>
                  </div>
                )} */}
                {/* {order.orderSummary?.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-${order.orderSummary?.discount?.toFixed(2) || '0.00'}</span>
                  </div>
                )} */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${order.orderSummary?.totalAmount?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Information */}
          <div className="space-y-8">
            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Customer Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Customer ID
                  </div>
                  <div className="font-medium">{order?.userId || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Name
                  </div>
                  <div className="font-medium">{order.shippingInfo?.name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </div>
                  <div className="font-medium">{order.shippingInfo?.email || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Phone
                  </div>
                  <div className="font-medium">{order.shippingInfo?.phone || 'Not provided'}</div>
                </div>
                <Link
                  // to={`/admin/customers/${order.userId?._id}`}
                  className="w-full mt-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm text-center block"
                >
                  View Customer Profile
                </Link>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <Home className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Shipping Information</h2>
                {/* {isEditing && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Editing
                  </span>
                )} */}
              </div>

              {/* {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={shippingInfo.name}
                      onChange={handleShippingInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingInfoChange}
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                      <input
                        type="text"
                        name="province"
                        value={shippingInfo.province}
                        onChange={handleShippingInfoChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleShippingInfoChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>
              ) : ( */}
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Name</div>
                  <div className="font-medium">{order.shippingInfo?.name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Email</div>
                  <div className="font-medium">{order.shippingInfo?.email || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Address</div>
                  <div className="font-medium">
                    {order.shippingInfo?.address || 'N/A'}<br />
                    {order.shippingInfo?.city}, {order.shippingInfo?.province} {order.shippingInfo?.zipCode}
                  </div>
                </div>
              </div>
              {/* )} */}
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
                    <div className="font-medium">{order.paymentMethod || 'N/A'}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      <CheckSquare className="w-3 h-3 inline mr-1" />
                      Status: {order.paymentStatus || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Paid on {new Date(order.orderedOn).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Truck className="w-5 h-5" />
                    <h3 className="font-semibold">Shipping Method</h3>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="font-medium">{order.shippingMethod?.shippingType || 'Standard Delivery'}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      ${order.shippingMethod?.shippingCharges?.toFixed(2) || '0.00'}
                    </div>
                    {order.trackingNumber && (
                      <div className="text-sm text-gray-600 mt-2">
                        <Hash className="w-3 h-3 inline mr-1" />
                        Tracking: {order.trackingNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            {/* <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Admin Actions</h2>
              <div className="space-y-3"> */}
            <button

              //   onClick={() => handleEditing(order._id)}
              // onClick={() => setIsEditing(true)}
              className={`w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors ${orderStatus === 'delivered' || orderStatus === 'cancelled' ? 'hidden' : 'block'}`}
            >
              <Edit className="w-4 h-4" />
              Edit Order
            </button>

            {/* <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Send Invoice Email
                </button> */}

            {/* <button className="w-full border border-red-300 text-red-600 py-3 rounded-lg font-medium hover:bg-red-50 transition-colors">
                  Cancel Order
                </button> */}

            {/* <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                  Refund Payment
                </button> */}
            {/* </div>
            </div> */}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <div className="flex gap-4">
            {/* <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ShoppingBag className="w-4 h-4" />
              View Similar Products
            </button> */}
            {/* <button
              onClick={() => navigate(`/orders/${order._id}`)}
              className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              View Customer View
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;