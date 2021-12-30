import React, { useState } from 'react'
import { Form, FormGroup, Label, Input, Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'
const initialState = {
	email: '',
	password: '',
	err: '',
	success: '',
}
const Login = () => {
	const [user, setUser] = useState(initialState)

	const { email, password, err, success } = user

	const handleInputChange = (e) => {
		const { name, value } = e.target

		setUser({ ...user, [name]: value, err: '', success: '' })
	}
	const handleSubmit = async (e) => {
		e.preventDefault()
		try {
			const res = await axios.post('/users/login', { email, password })
			console.log(res)

			setUser({ ...user, err: '', success: res.data.msg })

			localStorage.setItem('firstLogin', true)
		} catch (error) {
			error.response.data.msg &&
				setUser({
					...user,

					err: error.response.data.msg,
					success: '',
				})
		}
	}
	return (
		<Form inline className='container mt-5' onSubmit={handleSubmit}>
			<FormGroup>
				<Label for='Email' hidden>
					Email
				</Label>
				<Input
					id='Email'
					name='email'
					placeholder='Email'
					type='email'
					value={email}
					onChange={handleInputChange}
				/>
			</FormGroup>{' '}
			<FormGroup>
				<Label for='Password' hidden>
					Password
				</Label>
				<Input
					id='Password'
					name='password'
					placeholder='Password'
					type='password'
					value={password}
					onChange={handleInputChange}
				/>
			</FormGroup>{' '}
			<Button type='submit'>Submit</Button>
			<Link to='/forgot_password'>Forgot Password</Link>
		</Form>
	)
}

export default Login
