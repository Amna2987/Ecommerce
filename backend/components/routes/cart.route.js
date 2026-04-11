const express = require('express')
const asyncHandler = require('../middleware/async.handler')
const router = express.Router()
const {authenticate} = require('../middleware/auth')
const { addtocartController, delcartitemController, increaseQtyController, clearcartController, getCartController, decreaseQtyController } = require('../controllers/cart.controllers')


router.post('/addtocart/:id',authenticate, asyncHandler(addtocartController))
router.delete('/delcartitem/:id',authenticate, asyncHandler(delcartitemController))
router.post('/incartqty/:id',authenticate, asyncHandler(increaseQtyController))
router.post('/decartqty/:id',authenticate, asyncHandler(decreaseQtyController))
router.delete('/clearcart',authenticate, asyncHandler(clearcartController))
router.get('/getcart',authenticate, asyncHandler(getCartController))


module.exports = router