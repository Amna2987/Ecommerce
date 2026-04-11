const express = require('express')
const asyncHandler = require('../middleware/async.handler')
const router = express.Router()
const {authenticate, authorize} = require('../middleware/auth')
const { getAdminDataController, getOrderByIdController, updateOrderController, updateUserController, delUserController, addProductController } = require('../controllers/admin.controllers')
const upload = require('../middleware/upload')

router.use(authenticate)
router.use(authorize('admin')) 

router.get('/admin-dashboard', asyncHandler(getAdminDataController))
router.post('/single-order/:id', asyncHandler(getOrderByIdController))
router.post('/update-status', asyncHandler(updateOrderController))
router.post('/update-user-status', asyncHandler(updateUserController))
router.post('/delete-user', asyncHandler(delUserController))
router.post('/add-product',  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'images', maxCount: 5 }
  ]),asyncHandler(addProductController))

module.exports = router