import axios from 'axios'
import React, { useState } from 'react'
import FacebookLogin from 'react-facebook-login'
import { GoogleLogin } from 'react-google-login'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { dispatchLogin } from '../../../redux/actions/authAction'
import { showErrMsg, showSuccessMsg } from '../../utils/notification/Notification'

const initialState = {
	email: '',
	password: '',
	err: '',
	success: '',
}
// axios.defaults.baseURL = 'http://localhost:5000'

function Login() {
	const [user, setUser] = useState(initialState)
	const dispatch = useDispatch()
	const navigate = useNavigate()

	const { email, password, err, success } = user

	const handleChangeInput = (e) => {
		const { name, value } = e.target
		setUser({ ...user, [name]: value, err: '', success: '' })
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const res = await axios.post('/auth/login', { email, password })
			setUser({ ...user, err: '', success: res.data.msg })

			localStorage.setItem('firstLogin', true)

			dispatch(dispatchLogin())
			navigate('/')
		} catch (err) {
			err.response.data.msg &&
				setUser({ ...user, err: err.response.data.msg, success: '' })
		}
	}

	const responseGoogle = async (response) => {
		try {
			const res = await axios.post('/auth/google_login', {
				tokenId: response.tokenId,
			})
			console.log(res)
			setUser({ ...user, error: '', success: res.data.msg })
			localStorage.setItem('firstLogin', true)

			dispatch(dispatchLogin())
			navigate('/')
		} catch (err) {
			err.response.data.msg &&
				setUser({ ...user, err: err.response.data.msg, success: '' })
		}
	}

	const responseFacebook = async (response) => {
		try {
			const { accessToken, userID } = response
			const res = await axios.post('/auth/facebook_login', { accessToken, userID })

			setUser({ ...user, error: '', success: res.data.msg })
			localStorage.setItem('firstLogin', true)

			dispatch(dispatchLogin())
			navigate('/')
		} catch (err) {
			err.response.data.msg &&
				setUser({ ...user, err: err.response.data.msg, success: '' })
		}
	}

	return (
		<div className='login_page'>
			<h2>Login</h2>
			{err && showErrMsg(err)}
			{success && showSuccessMsg(success)}

			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor='email'>Email Address</label>
					<input
						type='text'
						placeholder='Enter email address'
						id='email'
						value={email}
						name='email'
						onChange={handleChangeInput}
					/>
				</div>

				<div>
					<label htmlFor='password'>Password</label>
					<input
						type='password'
						placeholder='Enter password'
						id='password'
						value={password}
						name='password'
						onChange={handleChangeInput}
					/>
				</div>

				<div className='row'>
					<button type='submit'>Login</button>
					<Link to='/forgot_password'>Forgot your password?</Link>
				</div>
			</form>

			<div className='hr'>Or Login With</div>

			<div className='social'>
				<GoogleLogin
					clientId='604620324539-e3d5mt9h8ttkljhsicieaev9hi6bq8ei.apps.googleusercontent.com'
					buttonText='Login with google'
					onSuccess={responseGoogle}
					cookiePolicy={'single_host_origin'}
				/>

				<FacebookLogin
					appId='Your facebook app id'
					autoLoad={false}
					fields='name,email,picture'
					callback={responseFacebook}
				/>
			</div>

			<p>
				New Customer? <Link to='/register'>Register</Link>
			</p>
		</div>
	)
}

export default Login
