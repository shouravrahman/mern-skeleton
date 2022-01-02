const router = require('express').Router()
const {
	register,
	activateEmail,
	login,
	logout,
	getAccessToken,
	forgotPassword,
	resetPassword,
	googleLogin,
	facebookLogin,
} = require('../controllers/auth-controller')
const { authCheck } = require('../middlewares/auth')
router.post('/register', register)
router.post('/activation', activateEmail)
router.post('/login', login)
router.post('/logout', logout)
router.get('/refresh_token', getAccessToken)
router.post('/forgot', forgotPassword)
router.post('/reset', authCheck, resetPassword)
// Social Login
router.post('/google_login', googleLogin)
router.post('/facebook_login', facebookLogin)

module.exports = router
