import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import Body from './components/body/Body'
import Header from './components/header/Header'
import { dispatchGetUser, fetchUser } from './redux/actions/authAction'

function App() {
	const dispatch = useDispatch()
	const token = useSelector((state) => state.token)
	const auth = useSelector((state) => state.auth)

	axios.defaults.baseURL = 'http://localhost:5000'
	axios.defaults.withCredentials = true

	useEffect(() => {
		const firstLogin = localStorage.getItem('firstLogin')
		if (firstLogin) {
			const getToken = async () => {
				const res = await axios.get('/auth/refresh_token')
				console.log('response', res)
				dispatch({ type: 'GET_TOKEN', payload: res.data.access_token })
			}
			getToken()
		}
	}, [auth.isLogged, dispatch])

	useEffect(() => {
		if (token) {
			const getUser = () => {
				// dispatch(dispatchLogin())

				return fetchUser(token).then((res) => {
					dispatch(dispatchGetUser(res))
				})
			}
			getUser()
		}
	}, [token, dispatch])

	return (
		<Router>
			<div className='App'>
				<Header />
				<Body />
			</div>
		</Router>
	)
}

export default App
