const express = require('express')
const asyncHandler = require('../middleware/async.handler')
const { signupController, loginController, logoutController, refreshController, verifyEmailController, updateImgController } = require('../controllers/auth.controllers')
const router = express.Router()
const upload = require('../middleware/upload')

router.post('/signup', asyncHandler(signupController))
router.post('/login', asyncHandler(loginController))
router.post('/logout', asyncHandler(logoutController))
router.post('/refresh', asyncHandler(refreshController))
router.get("/verify/:token",asyncHandler(verifyEmailController));
router.post("/user-img", upload.single('image') ,asyncHandler(updateImgController));

module.exports = router