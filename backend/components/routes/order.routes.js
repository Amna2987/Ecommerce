const express = require('express')
const asyncHandler = require('../middleware/async.handler')
const router = express.Router()
const {authenticate} = require('../middleware/auth')
const { orderDataController, getUserOrdercontroller, getOrderDetailController, orderConfirmcontroller, orderCodcontroller } = require('../controllers/order.controller')


router.post('/checkout',authenticate, asyncHandler(orderDataController))
router.post('/order-confirm',authenticate, asyncHandler(orderConfirmcontroller))
router.post('/order-cod-confirm',authenticate, asyncHandler(orderCodcontroller))
router.post('/userorder',authenticate, asyncHandler(getUserOrdercontroller))
router.get('/orderdetail/:id',authenticate, asyncHandler(getOrderDetailController))

module.exports = router