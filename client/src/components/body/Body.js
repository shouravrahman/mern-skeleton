import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom'
import ForgotPass from '../body/auth/ForgotPassword'
import ResetPass from '../body/auth/ResetPassword'
import Home from '../body/home/Home'
import EditUser from '../body/profile/EditUser'
import Profile from '../body/profile/Profile'
import NotFound from '../utils/NotFound/NotFound'
import ActivationEmail from './auth/ActivationEmail'
import Login from './auth/Login'
import Register from './auth/Register'

function Body() {
	const auth = useSelector((state) => state.auth)
	const { isLogged, isAdmin } = auth
	return (
		<section>
			<Routes>
				<Route path='/' element={<Home />} />

				<Route path='/login' element={isLogged ? <NotFound /> : <Login />} />
				<Route path='/register' element={isLogged ? <NotFound /> : <Register />} />

				<Route
					path='/forgot_password'
					element={isLogged ? <NotFound /> : <ForgotPass />}
				/>
				<Route
					path=' /users/reset/:token'
					element={isLogged ? <NotFound /> : <ResetPass />}
				/>

				<Route
					path=' /users/activate/:activation_token'
					element={<ActivationEmail />}
				/>

				<Route path='/profile' element={isLogged ? <Profile /> : <NotFound />} />
				<Route
					path='/edit_user/:id'
					element={isAdmin ? <EditUser /> : <NotFound />}
				/>
			</Routes>
		</section>
	)
}

export default Body
