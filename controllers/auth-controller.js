const User = require('../models/user-model')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('../utils/sendMail')
const { google } = require('googleapis')
const { OAuth2 } = google.auth

const client = new OAuth2(process.env.MAILING_SERVICE_CLIENT_ID)

const { CLIENT_URL } = process.env

exports.register = async (req, res) => {
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
}
exports.activateEmail = async (req, res) => {
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
}
exports.login = async (req, res) => {
	try {
		const { email, password } = req.body
		const user = await User.findOne({ email })
		if (!user) return res.status(400).json({ msg: 'This email does not exist.' })

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) return res.status(400).json({ msg: 'Password is incorrect.' })

		const refresh_token = createRefreshToken({ id: user._id })
		res.cookie('refreshtoken', refresh_token, {
			httpOnly: true,
			sameSite: none,
			// domain: 'http://localhost:3000',
			path: '/users/refresh_token',
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		})

		res.json({ msg: 'Login success!' })
	} catch (err) {
		return res.status(500).json({ msg: err.message })
	}
}
exports.getAccessToken = (req, res) => {
	try {
		console.log(req.cookies)
		const rf_token = req.cookies.refreshtoken
		if (!rf_token) return res.status(400).json({ msg: 'Please login now!' })

		jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
			if (err) return res.status(400).json({ msg: 'Please login now!' })

			const access_token = createAccessToken({ id: user.id })
			return res.json({ access_token })
		})
	} catch (err) {
		return res.status(500).json({ msg: err.message })
	}
}
exports.forgotPassword = async (req, res) => {
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
}
exports.resetPassword = async (req, res) => {
	try {
		const { password } = req.body

		const passwordHash = await bcrypt.hash(password, 12)

		await User.findOneAndUpdate({ _id: req.user.id }, { password: passwordHash })
		res.json({ msg: 'Password successfully changed!' })
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
}
exports.logout = async (req, res) => {
	try {
		res.clearCookie('refreshToken', { path: '/users/refresh_token' })
		return res.json({ msg: 'Logged out!' })
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
}
exports.googleLogin = async (req, res) => {
	try {
		const { tokenId } = req.body

		const verify = await client.verifyIdToken({
			idToken: tokenId,
			audience: process.env.MAILING_SERVICE_CLIENT_ID,
		})

		const { email_verified, email, name, picture } = verify.payload

		const password = email + process.env.GOOGLE_SECRET

		const passwordHash = await bcrypt.hash(password, 12)

		if (!email_verified)
			return res.status(400).json({ msg: 'Email verification failed.' })

		const user = await User.findOne({ email })

		if (user) {
			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) return res.status(400).json({ msg: 'Password is incorrect.' })

			const refresh_token = createRefreshToken({ id: newUser._id })
			res.status(202).cookie('refreshtoken', refresh_token, {
				httpOnly: true,
				sameSite: 'strict',
				path: '/users/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			})
			res.json({ msg: 'Login success!' })
		} else {
			const newUser = new User({
				name,
				email,
				password: passwordHash,
				avatar: picture,
			})

			await newUser.save()

			const refresh_token = createRefreshToken({ id: newUser._id })
			res.status(202).cookie('refreshtoken', refresh_token, {
				httpOnly: true,
				sameSite: 'strict',

				path: '/users/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			})

			res.json({ msg: 'Login success!' })
		}
	} catch (err) {
		return res.status(500).json({ msg: err.message })
	}
}
exports.facebookLogin = async (req, res) => {
	try {
		const { accessToken, userID } = req.body

		const URL = `https://graph.facebook.com/v2.9/${userID}/?fields=id,name,email,picture&access_token=${accessToken}`

		const data = await fetch(URL)
			.then((res) => res.json())
			.then((res) => {
				return res
			})

		const { email, name, picture } = data

		const password = email + process.env.FACEBOOK_SECRET

		const passwordHash = await bcrypt.hash(password, 12)

		const user = await User.findOne({ email })

		if (user) {
			const isMatch = await bcrypt.compare(password, user.password)
			if (!isMatch) return res.status(400).json({ msg: 'Password is incorrect.' })

			const refresh_token = createRefreshToken({ id: user._id })
			res.cookie('refreshtoken', refresh_token, {
				httpOnly: true,
				path: '/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			})

			res.json({ msg: 'Login success!' })
		} else {
			const newUser = new User({
				name,
				email,
				password: passwordHash,
				avatar: picture.data.url,
			})

			await newUser.save()

			const refresh_token = createRefreshToken({ id: newUser._id })
			res.cookie('refreshtoken', refresh_token, {
				httpOnly: true,
				path: '/user/refresh_token',
				maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
			})

			res.json({ msg: 'Login success!' })
		}
	} catch (err) {
		return res.status(500).json({ msg: err.message })
	}
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
	return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {
		expiresIn: '5m',
	})
}
const createAccessToken = (payload) => {
	return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}
const createRefreshToken = (payload) => {
	return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}
