const cloudinary = require('cloudinary')
const fs = require('fs')
const removeTmp = require('../utils/removeTmp')

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_SECRET,
})
const uploadCtrl = {
	uploadAvatar: async (req, res) => {
		try {
			const file = req.files.file
			cloudinary.v2.uploader.upload(
				file.tempFilePath,
				{
					folder: 'avatar',
					width: 150,
					height: 150,
					crop: 'fill',
				},
				async (err, result) => {
					if (err) throw err

					removeTmp(file.tempFilePath)

					res.json({ url: result.secure_url })
				}
			)
		} catch (error) {
			return res.status(500).json({ msg: error.message })
		}
	},
}
module.exports = uploadCtrl
