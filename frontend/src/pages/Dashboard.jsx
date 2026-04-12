import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ShoppingBag, Heart, Settings, LogOut, Package, CreditCard, MapPin, Bell, Camera, X, Save, Upload, Edit2 } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ProductContext } from '../context/ProductContext';
import { toast } from 'react-toastify';
import { AuthServices } from '../services/auth.service';

const Dashboard = () => {
  const { accessToken, userData, setUserData, updateUserProfile, logout } = useContext(AuthContext);
  const { cartItems, cartTotal, OrderDetail, getUserOrderData, userOrders, wishlistItems } = useContext(ProductContext);
  const navigate = useNavigate();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileImage, setProfileImage] = useState(userData?.profileImg || '');
  const [username, setUsername] = useState(userData?.username || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(userData?.profileImg || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null);

  const stats = [
    { label: 'Total Orders', value: userOrders.length, icon: <ShoppingBag className="w-6 h-6" /> },
    { label: 'Wishlist', value: wishlistItems.length, icon: <Heart className="w-6 h-6" /> },
  ];

  useEffect(() => {
    getUserOrderData();
  }, []);

  useEffect(() => {
    if (!accessToken) {
      navigate('/');
    }
  }, [accessToken, navigate]);

  // Update local state when userData changes
  useEffect(() => {
    console.log('USER DATA', userData);

    if (userData) {
      setProfileImage(userData.profileImg || '');
      setUsername(userData.username || '');
      setEmail(userData.email || '');
      setPhone(userData.phone || '');
      if (userData && !isEditingProfile) {
    setPreviewImage(
      userData.profileImg ||
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
    );
  }
      // setPreviewImage(userData.profileImg);
    }
  }, [userData, isEditingProfile]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size should be less than 5MB');
        return;
      }

      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }

      setPreviewImage(URL.createObjectURL(file))
      setSelectedFile({ image: file, user: userData._id });
    }
  };


  const handleImageClick = (e) => { ///opening select
    if (isEditingProfile) {
      fileInputRef.current.click();
    }
  };

  const handleSaveProfile = async () => { ///save image
    try {
      setIsUploading(true);

      const formData = new FormData()

      console.log('selected', selectedFile);

      formData.append('image', selectedFile.image)
      formData.append('userId', selectedFile.user)

      const updateProfileImg = await AuthServices.updateUserImg(formData)
      console.log('user img', updateProfileImg.data.data.profileImg)

      const newImage = updateProfileImg.data.data.profileImg

      updateUserProfile({
        profileImg: newImage
      });

      setPreviewImage(newImage);

      setIsEditingProfile(false);
      setSelectedFile(null);
      toast.success('Profile updated successfully!');

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setSelectedFile(null);
    setPreviewImage(userData?.profileImg || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400');
  };



  // const handleRemoveImage = () => {
  //   setSelectedFile(null);
  //   setPreviewImage('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400');
  //   setProfileImage('');
  // };

  const handleLogout = () => {
    console.log('Logout clicked');
    logout();
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {userData?.username || 'User'}!</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center space-x-4 mb-6">
                {/* Profile Image with Edit Overlay */}
                <div className="relative group">
                  <div
                    className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-100 cursor-pointer"
                    onClick={handleImageClick}
                  >
                    <img
                      src={previewImage}
                      alt={username}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400';
                      }}
                    />

                    {/* Edit Overlay */}
                    {isEditingProfile && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Camera Icon Badge */}
                  {isEditingProfile && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                      <Edit2 className="w-4 h-4" />
                    </div>
                  )}

                  {/* Remove Image Button */}
                  {/* {isEditingProfile && previewImage !== 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400' && (
                    <button
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )} */}
                </div>

                {/* Hidden File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />

                <div>
                  {/* {isEditingProfile ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Username"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Email"
                      />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Phone number"
                      />
                    </div>
                  ) : ( */}
                  <div>
                    <h3 className="text-xl font-semibold">{username || 'User'}</h3>
                    <p className="text-gray-600">{email || 'No email provided'}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Member since {userData?.createdAt ? formatDate(userData.createdAt) : 'N/A'}
                    </p>
                  </div>
                  {/* )} */}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                {isEditingProfile ? (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isUploading}
                      className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      <X className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    Edit Profile
                  </button>
                )}
              </div>

              {/* File Upload Instructions */}
              {isEditingProfile && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700 flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Click on your profile picture to upload a new image (Max 5MB)
                  </p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { icon: <Package className="w-5 h-5" />, label: 'My Orders', href: '#orders' },
                  { icon: <Heart className="w-5 h-5" />, label: 'Wishlist', href: '/wishlist' },
                  // { icon: <CreditCard className="w-5 h-5" />, label: 'Payment Methods', href: '#payments' },
                  // { icon: <Settings className="w-5 h-5" />, label: 'Account Settings', href: '#settings' },
                ].map((action, index) => (
                  <Link
                    key={index}
                    to={action.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 hover:text-black"
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Recent Orders */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm p-6 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-3 bg-black text-white rounded-full flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-gray-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {userOrders?.slice(0, 5).map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          {order.orderId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {formatDate(order.orderedOn)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">
                          ${order.orderSummary?.totalAmount?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.orderStatus === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : order.orderStatus === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : order.orderStatus === 'shipped'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            to={`/orders/${order._id}`}
                            className="text-black hover:text-gray-600 text-sm font-medium"
                          >
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}

                    {/* Show message if no orders */}
                    {userOrders?.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No orders yet. Start shopping!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {userOrders?.length > 0 && (
                <div className="p-6 border-t border-gray-200">
                  <Link
                    to="/orders"
                    className="text-black font-medium hover:text-gray-600 transition-colors"
                  >
                    View All Orders →
                  </Link>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Ready to leave?</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    You can always sign back in anytime.
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;