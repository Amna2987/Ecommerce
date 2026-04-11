import api from '../api/axios.js'


const getCustomerData = (orderData) => api.post("/order/checkout", orderData);
const handleOrderConfirm = (id) => api.post('/order/order-confirm',{id})
const handleCodConfirm = (id) => api.post('/order/order-cod-confirm',{id})
const getUserOrderData = () => api.post('/order/userorder')
const orderDetail = (id) => api.get(`/order/orderdetail/${id}`)

export const OrderServices = {getCustomerData,handleOrderConfirm,handleCodConfirm,getUserOrderData,orderDetail}