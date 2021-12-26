const router = require('express').Router()
const uploadImage = require('../middlewares/uploadImage')
const uploadCtrl = require('../controllers/uploadImage-controller')
const { authCheck } = require('../middlewares/auth')
router.post('/upload_avatar', uploadImage, authCheck, uploadCtrl.uploadAvatar)

module.exports = router
