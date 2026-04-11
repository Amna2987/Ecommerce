import api from '../api/axios'

const getProducts = (query) => api.get(`/shop/products?${query}`)
const getProduct = (id) => api.get(`/shop/product/${id}`)
const wishList = (id) => api.post(`/shop/wishlist/${id}`)
const delWishListItem = (id) => api.delete(`/shop/delWlItem/${id}`)
const clearWishList = () => api.delete('/shop/clearwishlist')
const myWishList = () => api.get('/shop/mywishlist')
const submitReview = (review) => api.post('/shop/addreview',review)
const getReview = (id) => api.post('/shop/reviews',{id})


export const ProductServices = {getProducts, getProduct, wishList, myWishList,delWishListItem, clearWishList, submitReview,getReview}