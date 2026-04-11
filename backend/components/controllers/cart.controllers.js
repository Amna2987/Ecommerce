const {success} = require('../utils/response.utils')
const cartServices = require('../services/cart.service')

exports.addtocartController = async(req, res) => {
    const {id} = req.params
    const user = req.user

    // console.log('cart user', user);
    // console.log('cart param', id); 

    const addtocart = await cartServices.addtocartService(user, id)
return success(res, 'item added to cart', addtocart , {}, 201) 
}
exports.delcartitemController = async(req, res) => {
    const {id} = req.params
    const user = req.user 

    const newcart = await cartServices.delcartitemService(id, user)
    return success(res, 'item removed from cart', newcart , {}, 201) 
}


exports.increaseQtyController = async(req, res) => {
    const {id} = req.params
    const user = req.user 
    
    const increaseItemQty = await cartServices.increaseqtyService(id, user)
    return success(res, 'increase item qty', increaseItemQty , {}, 201) 
}
exports.decreaseQtyController = async(req, res) => {
    const {id} = req.params
    const user = req.user 
    
    const increaseItemQty = await cartServices.decreaseqtyService(id, user)
    return success(res, 'decrease item qty', increaseItemQty , {}, 201) 
}


exports.clearcartController = async(req, res) => {
    const user = req.user 

    const clearCart = await cartServices.clearcartService(user)
    return success(res, 'cart clear', clearCart , {}, 201) 
}
exports.getCartController = async(req, res) => {
    console.log('get cart');
    
    const user = req.user
    const getMyCartItems = await cartServices.getCartService(user)
    return success(res, 'cart', getMyCartItems , {}, 201)
}