const router = require('express').Router()
const userCtrl = require('../controllers/user-controller')
const { authCheck, adminCheck } = require('../middlewares/auth')

router.post('/register', userCtrl.register)
router.post('/activation', userCtrl.activateEmail)
router.post('/login', userCtrl.login)
router.post('/logout', userCtrl.logout)
router.post('/refresh_token', userCtrl.getAccessToken)
router.post('/forgotPassword', userCtrl.forgotPassword)
router.post('/resetPassword', authCheck, userCtrl.resetPassword)
router.post('/info', authCheck, userCtrl.getUserInfo)
router.post('/info/all', authCheck, adminCheck, userCtrl.getUserInfo)
router.put('/update', authCheck, userCtrl.updateUserInfo)
router.put('/update_role/:id', authCheck, adminCheck, userCtrl.updateUserRole)
router.delete('/delete/:id', authCheck, adminCheck, userCtrl.deleteUser)

module.exports = router
