const jwt = require('jsonwebtoken')
const User = require('../models/user-model')
const authCheck = async (req, res, next) => {
	try {
		const token = req.header('Authorization')
		if (!token) return res.status(400).json({ msg: 'Invalid authentication.' })

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) return res.status(400).json({ msg: 'Invalid authentication.' })

			req.user = user

			next()
		})
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
}
const adminCheck = async (req, res, next) => {
	try {
		const user = await User.findOne({ _id: req.user.id })

		if (user.role !== 1)
			return res.status(400).json({ msg: 'Admin resource access denied' })

		next()
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
}
module.exports = { authCheck, adminCheck }
