import React from 'react'
import {
	Navbar,
	NavbarBrand,
	NavbarToggler,
	Collapse,
	Nav,
	NavItem,
	NavLink,
} from 'reactstrap'
import { Link } from 'react-router-dom'

const NavBar = () => {
	return (
		<div>
			<Navbar color='dark' expand='md' dark>
				<NavbarBrand>
					<Link to='/'>Skeleton</Link>
				</NavbarBrand>
				<NavbarToggler />
				<Collapse navbar>
					<Nav className='ms-auto' navbar>
						<NavItem>
							<NavLink>
								<Link to='/login'>Login</Link>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink>
								<Link to='/register'>Signup</Link>
							</NavLink>
						</NavItem>
						<NavItem>
							<NavLink>
								<Link to='/profile'>Profile</Link>
							</NavLink>
						</NavItem>
					</Nav>
				</Collapse>
			</Navbar>
		</div>
	)
}

export default NavBar
