import React from "react";

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { GameMode } from '../constants';
import Auth from '../models/Auth';

const Navigation = () => {
	const logout = () => {
		localStorage.removeItem('user_id');
		localStorage.removeItem('user_name');
		Auth.logout();
	};

	return (
		<Navbar sticky='top' bg='light' expand="lg">
			<Navbar.Brand href='/' className="ms-3 px-1">Square Lab</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link href='/'>Home</Nav.Link>
					<NavDropdown title="Sprint" id="basic-nav-dropdown">
						<NavDropdown.Item href={`/game/${GameMode.SPRINT}/3`}>3×3</NavDropdown.Item>
						<NavDropdown.Item href={`/game/${GameMode.SPRINT}/4`}>4×4</NavDropdown.Item>
						<NavDropdown.Item href={`/game/${GameMode.SPRINT}/5`}>5×5</NavDropdown.Item>
					</NavDropdown>
					<NavDropdown title="Ultra" id="basic-nav-dropdown">
						<NavDropdown.Item href={`/game/${GameMode.ULTRA}/3`}>3×3</NavDropdown.Item>
						<NavDropdown.Item href={`/game/${GameMode.ULTRA}/4`}>4×4</NavDropdown.Item>
						<NavDropdown.Item href={`/game/${GameMode.ULTRA}/5`}>5×5</NavDropdown.Item>
					</NavDropdown>
					{
						localStorage.getItem('user_id') !== null ?
						<NavDropdown title={localStorage.getItem('user_name')} id="basic-nav-dropdown">
							<NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
							<NavDropdown.Item href="/" onClick={logout}>Logout</NavDropdown.Item>
						</NavDropdown> :
						null
					}
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};

export default Navigation;