const router = require('express').Router()
const userCtrl = require('../controllers/user-controller')

router.post('/register', userCtrl.register)
router.post('/activation', userCtrl.activateEmail)
router.post('/login', userCtrl.login)

module.exports = router
