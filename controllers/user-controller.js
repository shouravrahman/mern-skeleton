const User = require('../models/user-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail')

const { CLIENT_URL } = process.env
const userCtrl = {
	register: async (req, res) => {
		try {
			const { name, email, password } = req.body

			if (!name || !email || !password)
				return res.status(400).json({ msg: 'Please fill out all the fields!' })
			if (!validateEmail(email))
				return res.status(400).json({ msg: 'Please provide a valid email address!' })
			if (!validatePassword(password))
				return res.status(400).json({
					msg: 'Password must be 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter',
				})

			const user = await User.findOne({ email })
			if (user) res.status(400).json({ msg: 'This email already exists!' })

			const passwordHash = await bcrypt.hash(password, 12)

			const newUser = {
				name,
				email,
				password: passwordHash,
			}

			const activation_token = createActivationToken(newUser)

			const url = `${CLIENT_URL}/user/activate/${activation_token}`
			sendMail(email, url, 'Verify your email address')

			res.json({
				msg: 'Register success! please check your email to activate your account',
			})
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
}
const validateEmail = (email) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		)
}
const validatePassword = (password) => {
	return String(password).match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
}
const createActivationToken = (payload) => {
	return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' })
}
const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '20m' })
}
const createRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl
