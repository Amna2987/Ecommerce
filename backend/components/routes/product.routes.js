const express = require('express')
const asyncHandler = require('../middleware/async.handler')
const { getProductsController, getProductController, userWishListController, getMyWishListController, delWishListItemController, clearWishListController, addReviewController, getReviewsController } = require('../controllers/product.controller')
const router = express.Router()
const {authenticate} = require('../middleware/auth')

router.get('/products', asyncHandler(getProductsController))
router.get('/product/:id', asyncHandler(getProductController))
router.post('/wishlist/:id',authenticate, asyncHandler(userWishListController))
router.delete('/delWlItem/:id',authenticate, asyncHandler(delWishListItemController))
router.delete('/clearwishlist',authenticate, asyncHandler(clearWishListController))
router.get('/mywishlist',authenticate, asyncHandler(getMyWishListController))
router.post('/addreview',authenticate, asyncHandler(addReviewController))
router.post('/reviews',authenticate, asyncHandler(getReviewsController))

module.exports = router