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
	activateEmail: async (req, res) => {
		try {
			const { activation_token } = req.body

			const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

			const { name, email, password } = user
			const check = await User.findOne({ email })
			if (check) return res.status(400).json({ msg: 'this email already exists' })

			const newUser = await new User({ name, email, password })

			await newUser.save()

			res.json({ msg: 'Account has been activated' })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	login: async (req, res) => {
		try {
			const { email, password } = req.body

			const user = await User.findOne({ email })

			if (!user)
				return res
					.status(400)
					.json({ msg: 'This email does not exist.Please register first' })

			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) return res.status(400).json({ msg: 'Incorrect password' })

			const refresh_token = createRefreshToken({ id: user._id })

			res.cookie('refreshToken', refresh_token, {
				httpOnly: true,
				path: '/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000, //7d
			})

			return res.json({ msg: 'Login success' })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	getAccessToken: async (req, res) => {
		try {
			const rf_token = req.cookies.refreshToken

			if (!rf_token) return res.status(400).json({ msg: 'please login now!' })

			jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
				if (err) res.status(400).json({ msg: 'please login now!' })
			})

			const access_token = createAccessToken({ id: user.id })

			res.json({ access_token })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	forgotPassword: async (req, res) => {
		try {
			const { email } = req.body
			const user = await User.findOne({ email })
			if (!user) return res.status(400).json({ msg: 'This email does not exist.' })

			const access_token = createAccessToken({ id: user._id })
			const url = `${CLIENT_URL}/user/reset/${access_token}`

			sendMail(email, url, 'Reset your password!')

			res.json({ msg: 'password reset link sent.please check your email.' })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	resetPassword: async (req, res) => {
		try {
			const { password } = req.body

			const passwordHash = await bcrypt.hash(password, 12)

			await User.findOneAndUpdate({ _id: req.user.id }, { password: passwordHash })
			res.json({ msg: 'Password successfully changed!' })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	logout: async (req, res) => {
		try {
			res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
			return res.json({ msg: 'Logged out!' })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	getUserInfo: async (req, res) => {
		try {
			const user = await User.findById(req.user.id).select('-password')
			res.json(user)
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	getAllUserInfo: async (req, res) => {
		try {
			const users = await User.find().select('-password')
			res.json(users)
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	updateUserRole: async (req, res) => {
		try {
			const { role } = req.body
			await User.findOneAndUpdate({ _id: req.params.id }, { role })
			res.json({ msg: 'Update Success!' })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	deleteUser: async (req, res) => {
		try {
			await User.findByIdAndDelete(req.params.id)
			res.json({ msg: 'Delete Success!' })
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
	updateUserInfo: async (req, res) => {
		try {
			const { name, avatar } = req.body
			await User.findOneAndUpdate({ _id: req.user.id }, { name, avatar })
			res.json({ msg: 'Update Success!' })
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
