import './App.css'
import Layout from './pages/Layout'
import Login from './components/Login'
import Register from './components/Register'
import Profile from './components/Profile'
import { Routes, Route } from 'react-router-dom'
function App() {
	return (
		<div className='App'>
			<Layout>
				<Routes>
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
					<Route path='/profile' element={<Profile />} />
				</Routes>
			</Layout>
		</div>
	)
}

export default App
