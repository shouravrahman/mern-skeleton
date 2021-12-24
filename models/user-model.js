const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'please provide your name'],
		trim: true,
	},
	email: {
		type: String,
		required: [true, 'please provide your email'],
		trim: true,
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'please provide your password'],
	},
	role: {
		type: Number,
		default: 0, // 0 => user , 1 => admin
	},
	avatar: {
		type: String,
		default: '', //TODO:place a default avatar image link
	},
})
module.exports = mongoose.model('User', userSchema)
