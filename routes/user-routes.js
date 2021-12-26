const router = require('express').Router()
const userCtrl = require('../controllers/user-controller')
const auth = require('../middlewares/auth')

router.post('/register', userCtrl.register)
router.post('/activation', userCtrl.activateEmail)
router.post('/login', userCtrl.login)
router.post('/refresh_token', userCtrl.getAccessToken)
router.post('/forgotPassword', userCtrl.forgotPassword)
router.post('/resetPassword', authCheck, userCtrl.resetPassword)

module.exports = router
