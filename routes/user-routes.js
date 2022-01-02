const router = require('express').Router()
const {
	getUserInfo,
	getAllUserInfo,
	updateUserInfo,
	updateUserRole,
	deleteUser,
} = require('../controllers/user-controller')
const { authCheck, adminCheck } = require('../middlewares/auth')

router.get('/info', authCheck, getUserInfo)
router.get('/info/all', authCheck, adminCheck, getAllUserInfo)
router.put('/update', authCheck, updateUserInfo)
router.put('/update_role/:id', authCheck, adminCheck, updateUserRole)
router.delete('/delete/:id', authCheck, adminCheck, deleteUser)

module.exports = router
