import React, { createContext, useContext, useEffect, useState } from 'react'
import { ProductServices } from '../services/product.service'
import { toast } from 'react-toastify'
import { CartServices } from '../services/cart.service'
import { AuthContext } from './AuthContext';
import { OrderServices } from '../services/order.service';
import { useNavigate } from 'react-router-dom';

export const ProductContext = createContext()

export default function ProductProvider({ children }) {
  const [allProducts, setallProducts] = useState([])
  const [data, setData] = useState([])
  const [categories, setCategories] = useState([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [pageno, setpageno] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [userOrders, setUserOrders] = useState([])

  //// use context
  const { accessToken, logout } = useContext(AuthContext)

  // Cart state
  const [cartItems, setCartItems] = useState([])

  // Wishlist state
  const [wishlistItems, setWishlistItems] = useState([])

  const navigate = useNavigate()
  // Fetch products with query support
  const getProducts = async (query) => {
    setLoading(true)
    setError(null)
    try {
      let res = await ProductServices.getProducts(query)
      let data = res.data.data
      setallProducts(data?.products || [])
      // console.log('context res', data);
      setData(data)

      setTotalProducts(data?.pagination.totalProducts)
      setpageno(data?.pagination.totalPage)
      return data
    } catch (error) {
      console.log('no products', error);
      setError(error.message || 'Failed to fetch products')
      return null
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getCategories = async (query) => {
      let res = await ProductServices.getProducts(query)
      setCategories(res.data.data.categories)
      // console.log('cate context', res.data.data.categories);
    }
    getCategories()
  }, [])

  // Get featured products (isFeatured: true)
  const getFeaturedProducts = () => {
    return allProducts.filter(product => product.isFeatured)
  }

  // Get products by category
  const getProductsByCategory = async (category) => {
    console.log('categry', category);
    
    try {
      let res = await ProductServices.getProducts({ category })
      const rProducts = await res.data.data.products.filter(product =>
        product.category === category
      )
      setRelatedProducts(rProducts.slice(2, 4))
      console.log('rpro2', rProducts);
    } catch (error) {
      console.log(error);
    }
  }

  // add review

  const addReview = async (review) => {
    const res = await ProductServices.submitReview(review)
    // console.log('review', res.data);

  }

  // Get single product by ID
  const getProductById = (id) => {
    return allProducts.find(product => product._id === id)
  }
  const [cartTotal, setcartTotal] = useState(0)
  // ========== CART FUNCTIONS ==========
  const addToCart = async (id) => {
    // console.log('cart', id);

    const addcartItems = await CartServices.addToCart(id)
    setcartTotal(addcartItems.data.data.totalCartPrice)
    // console.log('cart items', addcartItems);
    const { cartItems } = addcartItems.data.data
    // console.log('cart items 2', cartItems);
    setCartItems(cartItems)
    toast.success(addcartItems.data.message)
  }

  const getCartItems = async () => {
    try {
      const getMyCart = await CartServices.getMyCart()
      // console.log('get cart items', getMyCart);
      setcartTotal(getMyCart.data.data.totalCartPrice)
      const { cartItems } = getMyCart.data.data
      setCartItems(cartItems)
    } catch (error) {
      console.log(error);
    }
  }

  const removeFromCart = async (id) => {

    const newCart = await CartServices.delCartItem(id)
    console.log('newcart', newCart);

    const { cartItems } = newCart.data.data
    setcartTotal(newCart.data.data.totalCartPrice)
    console.log('cart items 2', data);
    setCartItems(cartItems)
    toast.warn(newCart.data.message)
  }

  const increaseItemQuantity = async (id) => {

    const cartQty = await CartServices.increaseQty(id)
    console.log('qty', cartQty);

    const { cartItems } = cartQty.data.data
    setCartItems(cartItems)
    setcartTotal(cartQty.data.data.totalCartPrice)

  }
  const decreaseItemQuantity = async (id) => {

    const decreasecartQty = await CartServices.decreaseQty(id)
    console.log('qty', decreasecartQty);

    const { cartItems } = decreasecartQty.data.data
    setCartItems(cartItems)
    setcartTotal(decreasecartQty.data.data.totalCartPrice)
  }

  const clearCart = async () => {

    const clearCartItems = await CartServices.clearCart()
    console.log(clearCartItems);

    const { cartItems } = clearCartItems.data.data
    console.log('cart items 2', data);
    setCartItems(cartItems)
    toast.warn(clearCartItems.data.message)
  }

  const getCartItemCount = () => {
    // return cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    return cartItems.length
  }

  const getCartTotals = () => {
    const subtotal = cartItems.reduce((sum, item) =>
      sum + ((item.price || 0) * (item.quantity || 0)), 0
    );
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return {
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      itemCount: getCartItemCount()
    };
  }


  // ========== ORDER FUNCTIONS ==========


  const OrderDetail = async (orderData) => {
    const orderDetails = await OrderServices.getCustomerData(orderData)
    clearCart()
    toast.info(orderDetails.data.message)
    console.log('od', orderDetails.data.data.orderId);
    
    if (orderData.paymentMethod === "cash on delivery") {
      navigate(`/payment-success?orderId=${orderDetails.data.data.orderId}`)
      // setOrderdetail(orderDetails.data)
    }
    else {

      window.location.href = orderDetails.data.data.url;
    }
  }

  const getUserOrderData = async () => {
    const userOrders = await OrderServices.getUserOrderData()
    console.log('user orders', userOrders);
    setUserOrders(userOrders.data.data)
  }

  // const getOrderDtail = async(id) => {
  //   // const orderDetail = await OrderServices.orderDetail(id) 

  // }//////////////////////

  // ========== WISHLIST FUNCTIONS ==========
  const addToWishlist = async (id) => {

    try {

      const existingItem = wishlistItems.find(ele => ele._id.toString() == id.toString())
      console.log('existing', existingItem);
      if (existingItem) {
        return wishlistItems
      }
      const userWishlist = await ProductServices.wishList(id)
      const { data } = userWishlist.data
      // console.log('wishlist', userWishlist.data);
      toast.success(userWishlist.data.message)
      setWishlistItems(data)

    } catch (error) {
      console.log(error);

    }

  }

  const getWishlist = async () => {

    const myWishList = await ProductServices.myWishList()
    console.log('mywishlist', myWishList.data.data);
    setWishlistItems(myWishList.data.data)

  }

  const getWishlistCount = () => {
    return wishlistItems.length;
  }

  const removeFromWishlist = async (id) => {

    try {
      // console.log('remove id', id );
      const removeItem = await ProductServices.delWishListItem(id)
      const { data } = removeItem.data
      // console.log('remove', removeItem);
      setWishlistItems(data)
      toast.info(removeItem.data.message)
    } catch (error) {
      console.log(error);
    }
  }

  const clearWishlist = async () => {

    const clearWishListItem = await ProductServices.clearWishList()
    const { data } = clearWishListItem.data
    setWishlistItems(data.wishList);
    toast.info(clearWishListItem.data.message)
  }


  const moveWishlistToCart = (productId) => {
    const product = wishlistItems.find(item => item._id === productId);
    if (product) {
      addToCart(product);
      removeFromWishlist(productId);
    }
  }

  const moveAllWishlistToCart = () => {
    wishlistItems.forEach(item => {
      addToCart(item);
    });
    clearWishlist();
  }

  // ========== ADMIN FUNCTIONS ==========

  

  // ========== USE EFFECTS ==========
  useEffect(() => {

    getProducts();
    // getWishlist()
    // getCartItems()
    // getUserOrderData()
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setWishlistItems([])
      setCartItems([])
    }
    else{

      getWishlist();
      getCartItems();
      getUserOrderData();
    }

  }, [accessToken]);
  // useEffect(() => {
  //   if (!accessToken) return;

  //   getWishlist();
  //   getCartItems();
  //   getUserOrderData();
  // }, [accessToken]);



  // Context value
  const contextValue = {
    // Product fetching
    getProducts,
    data,
    allProducts,
    categories,
    setCategories,
    totalProducts, setTotalProducts,
    pageno, setpageno,
    loading,
    error,
    addReview,

    /// order functionality
    OrderDetail,
    // orderConfirmation,
    // orderdetail,
    // confirmData,

    // Product utilities
    getFeaturedProducts,
    getProductsByCategory,
    relatedProducts,
    setRelatedProducts,
    getProductById,
    getUserOrderData,
    userOrders,

    // Cart functionality
    cartItems,
    setCartItems,
    addToCart,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    // getCartItemCount,
    // getCartTotals,
    cartItemCount: getCartItemCount(),
    // cartTotal: getCartTotals().total,
    // cartSubtotal: getCartTotals().subtotal,

    // Wishlist functionality
    wishlistItems,
    setWishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    getWishlistCount,
    // moveWishlistToCart,
    // moveAllWishlistToCart,
    wishlistCount: getWishlistCount()
  }

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  )
}

// Custom hook for using product context
export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
}