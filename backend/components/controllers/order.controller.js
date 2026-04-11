const orderServices = require("../services/order.service");
const { success } = require("../utils/response.utils");

exports.orderDataController = async (req, res) => {
    const data = req.body
    const {sub} = req.user
    // console.log('pro data', data.paymentMethod)

    const order = await orderServices.orderDataService(data, sub)
    // console.log('controller order', order);
    return success(res, "order placed",order, {}, 201);
    
}

exports.orderConfirmcontroller = async(req, res) => {
    
    console.log('session id', req.body)
    const { id } = req.body;
    
    const confirmation = await orderServices.orderConfirmService(id)
    // console.log('confimation', confirmation);
    
    return success(res, "order confirmation", confirmation, {}, 201);
}
exports.orderCodcontroller = async(req, res) => {
    
    console.log('session id', req.body)
    const { id } = req.body;
    
    const confirmation = await orderServices.orderCodService(id)
    // console.log('confimation', confirmation);
    
    return success(res, "cod order confirm", confirmation, {}, 201);
}


exports.getUserOrdercontroller = async(req, res) => {
    // console.log('UserOrdercontroller', req.user);
    
    const {sub} = req.user
    const userOrderData = await orderServices.getUserDataService(sub)
    return success(res, "user data", userOrderData, {}, 201);
}

exports.getOrderDetailController = async(req, res) => {
    //   console.log("order params", req.params);
    
      const { id } = req.params;
      const {sub} = req.user
    
      const order = await orderServices.getOrderDetailService(id, sub)
      return success(res, "single order detail", order, {}, 201);
}