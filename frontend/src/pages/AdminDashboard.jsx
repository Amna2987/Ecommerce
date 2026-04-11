import React, { useEffect, useState } from 'react';
import {
  Package,
  Users,
  BarChart3,
  DollarSign,
  LogOut,
  Eye,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingBag,
  CreditCard,
  Bell,
  Grid,
  List,
  RefreshCw,
  Edit2,
  Trash2,
  Shield,
  ShieldOff,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Check,
  X,
  Save,
  MoreVertical,
  Filter,
  Plus,
  Image,
  Tag,
  Star,
  Percent,
  Hash,
  Type,
  AlignLeft,
  Layers,
  Box,
  PlusCircle,
  MinusCircle,
  Upload,
  X as XIcon
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminServices } from '../services/admin.service';
import { toast } from 'react-toastify';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [customers, setCustomers] = useState([])
  const [editingCustomerId, setEditingCustomerId] = useState(null);
  const [editedCustomer, setEditedCustomer] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    category: '',
    brand: '',
    stock: '',
    image: '',
    images: [],
    // rating: '',
    // numReviews: '',
    isFeatured: false,
    tags: []
  });
  const [currentImage, setCurrentImage] = useState('');
  const [currentTag, setCurrentTag] = useState('');
  const [categories] = useState([
    'Electronics', 'Fashion', 'Beauty', 'Home', 'Sports',
  ]);
  const [brands] = useState([
    'AudioTech', 'Nike', 'Apple', 'Samsung', 'Sony',
    'LG', 'Adidas', 'Microsoft', 'Amazon', 'Google'
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const getAdminData = async () => {
      const data = await AdminServices.adminData()
      // console.log('admin active user', data.data.data.orders);
      setOrders(data.data.data.orders)
      setProducts(data.data.data.products)
      setCustomers(data.data.data.users);
    }
    getAdminData()
  }, [])

  // console.log('or', orders);
  const recentOrder = orders.slice(1, 7)

  const totalRevenue = orders.reduce((sum, ele) => sum + ele.orderSummary.totalAmount, 0)

  const [productStock, setProductStock] = useState('')


  const getStatusBadge = (status) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-3 h-3" /> },
      processing: { color: 'bg-blue-100 text-blue-800', icon: <Package className="w-3 h-3" /> },
      shipped: { color: 'bg-purple-100 text-purple-800', icon: <Package className="w-3 h-3" /> },
      delivered: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-3 h-3" /> },
      cancelled: { color: 'bg-red-100 text-red-800', icon: <XCircle className="w-3 h-3" /> },
      in_stock: { color: 'bg-green-100 text-green-800', text: 'In Stock' },
      low_stock: { color: 'bg-yellow-100 text-yellow-800', text: 'Low Stock' },
      out_of_stock: { color: 'bg-red-100 text-red-800', text: 'Out of Stock' },
      active: { color: 'bg-green-100 text-green-800', text: 'Active', icon: <UserCheck className="w-3 h-3" /> },
      blocked: { color: 'bg-red-100 text-red-800', text: 'Blocked', icon: <UserX className="w-3 h-3" /> },
      user: { color: 'bg-blue-100 text-blue-800', text: 'User', icon: <Users className="w-3 h-3" /> },
      admin: { color: 'bg-purple-100 text-purple-800', text: 'Admin', icon: <Shield className="w-3 h-3" /> }
    };
    return config[status] || config.pending;
  };


  // Customer Management Functions
  const handleEditCustomer = (customer) => {
    setEditingCustomerId(customer._id);
    setEditedCustomer({
      role: customer.role,
      status: customer.status,
      userId: customer._id
    });
  };

  const handleCancelEdit = () => {
    setEditingCustomerId(null);
    setEditedCustomer({});
  };

  const handleDeleteCustomer = async (id) => {
    console.log('del user id', id);
    const res = await AdminServices.delUser(id)
    console.log('del user', res.data.data);
    setCustomers(res.data.data)
  };

  // Filter customers based on search and filters
  let filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    const matchesRole = filterRole === 'all' || customer.role === filterRole;

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleSaveCustomer = async () => {
    const res = await AdminServices.updateUserStatus(editedCustomer)
    console.log('user edit', res.data.data);
    const user = res.data.data

    const updateUser = customers.map(ele => {
      if (ele._id === user._id) {
        return ele.stats = user.status
      }
    })
    filteredCustomers = updateUser
    console.log('edit customer', customers);
    setEditedCustomer({});
  };

  // Stats data
  const stats = [
    {
      title: 'Total Revenue',
      value: `$ ${totalRevenue.toFixed(2)}`,
      change: '+12.5%',
      isPositive: true,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Total Orders',
      value: orders.length,
      change: '+8.2%',
      isPositive: true,
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Active Users',
      value: filteredCustomers.length,
      change: '+5.7%',
      isPositive: true,
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Total Products',
      value: products.length,
      change: '+5.7%',
      isPositive: true,
      icon: <Package className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600'
    },
  ];
  const [singlePreview, setsinglePreview] = useState('')
  const [multiplePreview, setMultiplePreview] = useState([])


  // Product Form Functions
  const handleProductInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    console.log(newProduct);
  }

  const handleAddSingleImage = (e) => {

    setNewProduct(prev => ({
      ...prev,
      image: e.target.files[0]
    }));



    setsinglePreview(URL.createObjectURL(e.target.files[0]))
    console.log('single', e.target.files);

  };
  // const handleAddMultipleImages = (e) => {

  //   setNewProduct(prev => ({
  //     ...prev,
  //     images: [...e.target.files]
  //   }));

  //   console.log('multiple', e.target.files);

  //   let urls = e.target.files.map(img => URL.createObjectURL(img))
  //   setMultiplePreview(urls)
  // };

  const handleAddMultipleImages = (e) => {
  const files = Array.from(e.target.files); 

  setNewProduct(prev => ({
    ...prev,
    images: files
  }));

  console.log('multiple', files);

  const urls = files.map(file => URL.createObjectURL(file));
  setMultiplePreview(urls);
};

  const handleRemoveImage = (index) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !newProduct.tags.includes(currentTag.trim())) {
      setNewProduct(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (index) => {
    setNewProduct(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    // console.log('Adding new product:', newProduct);

    const formData = new FormData()

    formData.append('name', newProduct.name)
    formData.append('description', newProduct.description)
    formData.append('price', newProduct.price)
    formData.append('discountedPrice', newProduct.discountedPrice)
    formData.append('category', newProduct.category)
    formData.append('brand', newProduct.brand)
    formData.append('stock', newProduct.stock)
    formData.append('image', newProduct.image)
    formData.append('isFeatured', newProduct.isFeatured)
    formData.append('tags', newProduct.tags)
    newProduct.images.forEach(file => {
      formData.append('images', file);
    });

    const addProduct = await AdminServices.addProduct(formData)
    // const addProduct = await AdminServices.addProduct(newProduct)
    console.log('add product', addProduct.data);
    toast.success(addProduct.data.message)


    // // For now, just add to local state
    // const productToAdd = {
    //   ...newProduct,
    //   _id: Date.now().toString(),
    //   price: parseFloat(newProduct.price),
    //   discountedPrice: parseFloat(newProduct.discountedPrice) || null,
    //   stock: parseInt(newProduct.stock),
    //   rating: parseFloat(newProduct.rating) || 0,
    //   numReviews: parseInt(newProduct.numReviews) || 0,
    //   createdAt: new Date().toISOString()
    // };

    // setProducts(prev => [productToAdd, ...prev]);

    // Reset form
    setNewProduct({
      name: '',
      description: '',
      price: '',
      discountedPrice: '',
      category: '',
      brand: '',
      stock: '',
      image: '',
      images: [],
      isFeatured: false,
      tags: []
    });
    setShowProductForm(false);
  };

  const handleCancelProductForm = () => {
    setShowProductForm(false);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      discountedPrice: '',
      category: '',
      brand: '',
      stock: '',
      image: '',
      images: [],
      isFeatured: false,
      tags: []
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-gray-600">{stat.title}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Recent Orders</h2>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-black hover:text-gray-600 text-sm font-medium"
                  >
                    View All →
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentOrder.map((order) => {
                      const status = getStatusBadge(order.orderStatus);
                      return (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium">{order.orderId}</div>
                            <div className="text-sm text-gray-500">{order.payment}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{order.shippingInfo.name}</div>
                            <div className="text-sm text-gray-500">{order.shippingInfo.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{order.orderedOn}</td>
                          <td className="px-6 py-4 font-medium">$ {order.orderSummary.totalAmount}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.icon}
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Link to={`/admin/orders/${order._id}`} >
                              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm">
                                <Eye className="w-4 h-4" />
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case 'products':
        return (
          <div className="space-y-6">
            {/* Products Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Products Management</h2>
              <button
                onClick={() => setShowProductForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New Product
              </button>
            </div>

            {/* Add Product Form Modal */}
            {showProductForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold">Add New Product</h2>
                      <button
                        onClick={handleCancelProductForm}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmitProduct} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Type className="w-4 h-4" />
                              Product Name *
                            </div>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={newProduct.name}
                            onChange={handleProductInputChange}
                            // required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="Wireless Bluetooth Headphones"
                          />
                        </div>

                        {/* Category */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Layers className="w-4 h-4" />
                              Category *
                            </div>
                          </label>
                          <select
                            name="category"
                            value={newProduct.category}
                            onChange={handleProductInputChange}
                            // required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        {/* Brand */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              Brand
                            </div>
                          </label>
                          <select
                            name="brand"
                            value={newProduct.brand}
                            onChange={handleProductInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          >
                            <option value="">Select Brand</option>
                            {brands.map(brand => (
                              <option key={brand} value={brand}>{brand}</option>
                            ))}
                          </select>
                        </div>

                        {/* Stock */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Box className="w-4 h-4" />
                              Stock Quantity *
                            </div>
                          </label>
                          <input
                            type="number"
                            name="stock"
                            value={newProduct.stock}
                            onChange={handleProductInputChange}
                            // required
                            min="0"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="50"
                          />
                        </div>

                        {/* Price */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Price *
                            </div>
                          </label>
                          <input
                            type="number"
                            name="price"
                            value={newProduct.price}
                            onChange={handleProductInputChange}
                            // required
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="199.99"
                          />
                        </div>

                        {/* Discounted Price */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Percent className="w-4 h-4" />
                              Discounted Price
                            </div>
                          </label>
                          <input
                            type="number"
                            name="discountedPrice"
                            value={newProduct.discountedPrice}
                            onChange={handleProductInputChange}
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="149.99"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <AlignLeft className="w-4 h-4" />
                            Description *
                          </div>
                        </label>
                        <textarea
                          name="description"
                          value={newProduct.description}
                          onChange={handleProductInputChange}
                          // required
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality."
                        />
                      </div>

                      {/* Main Image */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            Main Image URL *
                          </div>
                        </label>
                        <input
                          type="file"
                          name="image"
                          onChange={handleAddSingleImage}
                          // required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
                        />
                        {newProduct.image && (
                          <div className="mt-2">
                            <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                              <img
                                src={singlePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Image+Error'}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Additional Images */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            Additional Images
                          </div>
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="file"
                            multiple
                            onChange={handleAddMultipleImages}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="https://images.unsplash.com/photo-1484704849700-f032a568e944"
                          />
                          {/* <button
                            type="button"
                            // onClick={handleAddImage}
                            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button> */}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newProduct.images &&
                            multiplePreview.map((img, index) => (
                              <div key={index} className="relative group">
                                <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-300">
                                  <img
                                    src={img}
                                    alt={`Product ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/150?text=Image+Error'}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(index)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                >
                                  <XIcon className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            Tags
                          </div>
                        </label>
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={currentTag}
                            onChange={(e) => setCurrentTag(e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                            placeholder="wireless, bluetooth, headphones"
                          />
                          <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {newProduct.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(index)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <XIcon className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Featured Checkbox */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          name="isFeatured"
                          id="isFeatured"
                          checked={newProduct.isFeatured}
                          onChange={handleProductInputChange}
                          className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                        />
                        <label htmlFor="isFeatured" className="ml-2 text-sm font-medium text-gray-700">
                          Mark as Featured Product
                        </label>
                      </div>

                      {/* Form Actions */}
                      <div className="flex gap-4 pt-6 border-t border-gray-200">
                        <button
                          type="submit"
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          Add Product
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelProductForm}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => {
                      const status = getStatusBadge(product.stock);
                      return (
                        <tr key={product._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 overflow-hidden bg-gray-200 rounded">
                                <img className='h-full w-full' src={product.image} alt="" />
                              </div>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-500">ID: PROD-{product._id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">{product.category}</td>
                          <td className="px-3 py-4 font-bold">$ {product.price}</td>
                          <td className="px-6 py-4">{product.stock}</td>
                          <td className="px-3 py-4">
                            <span className={`px-1 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {/* {
                                product.stock <51? setProductStock('low stock'):product.stock >51? set'in stock':'out of stock'
                              } */}
                              {
                                product.stock < 51 ? 'low stock' : product.stock > 51 ? 'in stock' : 'out of stock'
                              }

                            </span>
                          </td>
                          <td className="px-6 py-4">{product.brand}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6">
            {/* Orders Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Orders Management</h2>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Export Orders
              </button>
            </div>

            {/* Orders List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => {
                      const status = getStatusBadge(order.orderStatus);
                      return (
                        <tr key={order._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium">{order.orderId}</div>
                            <div className="text-sm text-gray-500">{order.payment}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{order.shippingInfo.name}</div>
                            <div className="text-sm text-gray-500">{order.shippingInfo.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{order.orderedOn}</td>
                          <td className="px-6 py-4 font-medium">$ {order.orderSummary.totalAmount}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                              {status.icon}
                              {order.orderStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Link to={`/admin/orders/${order._id}`} >
                              <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition-colors text-sm">
                                View Details
                              </button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'customers':
        return (
          <div className="space-y-6">
            {/* Customers Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Customers Management</h2>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search customers by name or email..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex gap-4">
                  <div>
                    <select
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </select>
                  </div>

                  {/* Role Filter */}
                  <div>
                    <select
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm text-gray-600">Total Customers</div>
                  <div className="text-2xl font-bold">{customers.length}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-sm text-green-600">Active</div>
                  <div className="text-2xl font-bold text-green-700">{customers.filter(c => c.status === 'active').length}</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-sm text-red-600">Blocked</div>
                  <div className="text-2xl font-bold text-red-700">{customers.filter(c => c.status === 'blocked').length}</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm text-blue-600">Admins</div>
                  <div className="text-2xl font-bold text-blue-700">{customers.filter(c => c.role === 'admin').length}</div>
                </div>
              </div>
            </div>

            {/* Customers List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Since</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredCustomers.map((customer) => {
                      const statusBadge = getStatusBadge(customer.status);
                      const roleBadge = getStatusBadge(customer.role);
                      const isEditing = editingCustomerId === customer._id;

                      return (
                        <tr key={customer._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                value={customer.username}
                              />
                            ) : (
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <UserCheck className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                  <div className="font-medium">{customer.username}</div>
                                  <div className="text-sm text-gray-500">ID: {customer._id.slice(-8)}</div>
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <input
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                value={customer.email}
                              />
                            ) : (
                              <div>
                                <div className="font-medium">{customer.email}</div>
                                <div className="text-sm text-gray-500">{customer.phone || 'No phone'}</div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                value={editedCustomer.role}
                                onChange={(e) => setEditedCustomer({ ...editedCustomer, role: e.target.value })}
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            ) : (
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${roleBadge.color}`}>
                                {roleBadge.icon}
                                {roleBadge.text}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {isEditing ? (
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                                value={editedCustomer.status}
                                onChange={(e) => setEditedCustomer({ ...editedCustomer, status: e.target.value })}
                              >
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                              </select>
                            ) : (
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                                {statusBadge.icon}
                                {statusBadge.text}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">
                                {new Date(customer.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {isEditing ? (
                                <>
                                  <button
                                    onClick={() => handleSaveCustomer(customer._id)}
                                    className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    title="Save"
                                  >
                                    <Save className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    title="Cancel"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => handleEditCustomer(customer)}
                                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(customer._id)}
                                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>

                            {/* Delete Confirmation Modal */}
                            {showDeleteConfirm === customer._id && (
                              <div className="absolute z-10 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                                <div className="text-sm font-medium mb-2">Delete this customer?</div>
                                <div className="text-xs text-gray-600 mb-3">
                                  This action cannot be undone. All customer data will be removed.
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleDeleteCustomer(customer._id)}
                                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="px-3 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Empty State */}
              {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
                  <p className="text-gray-500">
                    {searchTerm || filterStatus !== 'all' || filterRole !== 'all'
                      ? 'Try changing your filters or search term'
                      : 'No customers in the system'}
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="ml-3 text-2xl font-bold">Admin Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-black">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-lg shadow-sm p-4 space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-black text-white' : 'hover:bg-gray-50'
                  }`}
              >
                <BarChart3 className="w-5 h-5" />
                Overview
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-black text-white' : 'hover:bg-gray-50'
                  }`}
              >
                <Package className="w-5 h-5" />
                Products
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-50'
                  }`}
              >
                <ShoppingBag className="w-5 h-5" />
                Orders
                <span className="ml-auto bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('customers')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'customers' ? 'bg-black text-white' : 'hover:bg-gray-50'
                  }`}
              >
                <Users className="w-5 h-5" />
                Customers
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>

            {/* Quick Stats - Only show in overview */}
            {activeTab === 'overview' && (
              <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold text-lg mb-4">Store Health</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Order Completion</span>
                      <span className="font-medium">94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Inventory Level</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Customer Satisfaction</span>
                      <span className="font-medium">4.8/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Page Title */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold capitalize">
                  {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
                </h1>
                <p className="text-gray-600 mt-2">
                  {activeTab === 'overview' && 'Monitor your store performance'}
                  {activeTab === 'products' && 'Manage your product catalog'}
                  {activeTab === 'orders' && 'View and manage customer orders'}
                  {activeTab === 'customers' && 'Manage customer information'}
                </p>
              </div>

              {/* {activeTab === 'overview' && (
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors">
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              )} */}
            </div>

            {/* Content based on active tab */}
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;