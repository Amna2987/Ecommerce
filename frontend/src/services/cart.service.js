import api from '../api/axios.js'

const addToCart = (id) => api.post(`/cart/addtocart/${id}`)
const delCartItem = (id) => api.delete(`/cart/delcartitem/${id}`)

const increaseQty = (id) => api.post(`/cart/incartqty/${id}`)
const decreaseQty = (id) => api.post(`/cart/decartqty/${id}`)

const clearCart = () => api.delete('/cart/clearcart')
const getMyCart = () => api.get('/cart/getcart')

export const CartServices = {addToCart, delCartItem, increaseQty, clearCart, getMyCart, decreaseQty}