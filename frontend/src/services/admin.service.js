import api from '../api/axios'

const adminData = () => api.get('/admin/admin-dashboard')
const getOrderById = (id) => api.post(`/admin/single-order/${id}`)
const updateOrderStatus = (editData) => api.post('/admin/update-status',editData)
const updateUserStatus = (editData) => api.post('/admin/update-user-status',editData)
const delUser = (id) => api.post('/admin/delete-user',{id})
const addProduct = (productData) => api.post('/admin/add-product',productData)



export const AdminServices = {addProduct,adminData,getOrderById,updateOrderStatus,updateUserStatus,delUser}