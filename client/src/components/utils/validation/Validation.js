/* eslint-disable no-useless-escape */
export const isEmpty = (value) => {
	if (!value) return true
	return false
}

export const isEmail = (email) => {
	// eslint-disable-next-line
	const re =
		/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return re.test(email)
}
export const isValid = (password) => {
	return String(password).match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
}

export const isMatch = (password, cf_password) => {
	if (password === cf_password) return true
	return false
}
