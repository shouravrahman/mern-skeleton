const fs = require('fs')
const removeTmp = require('../utils/removeTmp')
module.exports = async function (req, res, next) {
	try {
		if (!req.files || Object.keys(req.files).length === 0)
			return res.status(400).json({ msg: 'No files were uploaded.' })
		const file = req.files.file

		if (file.size > 1024 * 1024) {
			removeTmp(file.tempFilePath)
			return res.status(400).json({ msg: 'Size too large.Maximum file size 1mb' })
		} //1mb

		if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
			removeTmp(file.tempFilePath)
			return res
				.status(400)
				.json({ msg: 'File format invalid.Only JPEG and PNG are allowed' })
		} //format

		next()
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
}
