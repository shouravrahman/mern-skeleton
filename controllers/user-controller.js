const User = require('../models/user-model')
const bcrypt = require('bcrypt')
const userCtrl = {
	register: async (req, res) => {
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

			res.json(newUser)
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
}

module.exports = userCtrl
