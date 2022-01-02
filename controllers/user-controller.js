const User = require('../models/user-model')

exports.getUserInfo = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password')
		res.json(user)
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
}
exports.getAllUserInfo = async (req, res) => {
	try {
		const users = await User.find({}).select('-password')
		res.json(users)
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
}
exports.updateUserRole = async (req, res) => {
	try {
		const { role } = req.body
		await User.findOneAndUpdate({ _id: req.params.id }, { role })
		res.json({ msg: 'Update Success!' })
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
}
exports.deleteUser = async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id)
		res.json({ msg: 'Delete Success!' })
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
}
exports.updateUserInfo = async (req, res) => {
	try {
		const { name, avatar } = req.body
		await User.findOneAndUpdate({ _id: req.user.id }, { name, avatar })
		res.json({ msg: 'Update Success!' })
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
}
