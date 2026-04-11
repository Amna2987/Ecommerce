const adminServices = require("../services/admin.service");
const { success } = require("../utils/response.utils");


exports.getAdminDataController = async(req, res) => {
        
    const adminData = await adminServices.getAdminDataService()
    
    // console.log('admin', adminData);
    return success(res, "admin data",adminData, {}, 201);
}
exports.getOrderByIdController = async(req, res) => {

    const {id} = req.params
    // console.log('idsss', id);

    const orderData = await adminServices.getOrderByIdService(id)
    
    // console.log('admin', orderData);
    return success(res, "order data",orderData, {}, 201);
}

exports.updateOrderController = async(req, res) => {

    // const {id} = req.params
    // console.log('update', req.body);

    const updateData = req.body 


    const orderData = await adminServices.updateOrderService(updateData)
    
    // console.log('admin update', orderData);
    return success(res, "Order updated successfully",orderData, {}, 201);
}
exports.updateUserController = async(req, res) => {

    // const {id} = req.params
    console.log('updatesss user', req.body);

    const updateData = req.body


    const userData = await adminServices.updateUserService(updateData)
    
    console.log('admin update user', userData);
    return success(res, "User updated successfully",userData, {}, 201);
}
exports.delUserController = async(req, res) => {

    console.log('del user id', req.body);

    const {id} = req.body
    const userData = await adminServices.delUserService(id)
    
    console.log('admin del user', userData);
    return success(res, "User deleted successfully",userData, {}, 201);
}

exports.addProductController = async(req, res) => {

    console.log('new product req.body', req.body);
    console.log('new product req.file', req.files);


    const productData = req.body
    const {image, images} = req.files
    const newProduct = await adminServices.addProductService(productData,image, images)
    
    console.log('new product data', newProduct);
    return success(res, "Product added successfully",newProduct, {}, 201);
}