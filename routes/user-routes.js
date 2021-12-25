const router = require('express').Router()
const userCtrl = require('../controllers/user-controller')

router.post('/register', userCtrl.register)

module.exports = router
