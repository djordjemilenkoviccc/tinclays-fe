import React, { useContext, useState } from 'react';
import { AuthContext } from './auth-context';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../style/admin-header.css'

export default function AdminHeader() {
    const { logout } = useContext(AuthContext);  // Access the logout function from AuthContext
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);  // Track if navbar is expanded

    const handleLogout = () => {
        logout();  // Call the logout function from AuthContext
        navigate('/login');
    };

    const handleNavClick = () => {
        setExpanded(false); // Close the navbar after clicking a link
    };


    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            expanded={expanded}
            onToggle={() => setExpanded(!expanded)}
            fixed="top"
            className="custom-navbar"
        >
            <Navbar.Brand>Admin Panel</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto custom-nav">
                    <NavDropdown
                        title="Porudžbine"
                        id="basic-nav-dropdown"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <NavDropdown.Item
                            as={NavLink}
                            to="/admin-panel/in_progress"
                            onClick={handleNavClick}
                        >
                            U toku
                        </NavDropdown.Item>
                        <NavDropdown.Item
                            as={NavLink}
                            to="/admin-panel/completed"
                            onClick={handleNavClick}
                        >
                            Realizovane
                        </NavDropdown.Item>
                        <NavDropdown.Item
                            as={NavLink}
                            to="/admin-panel/failed"
                            onClick={handleNavClick}
                        >
                            Neuspešne
                        </NavDropdown.Item>
                    </NavDropdown>

                    {/* Single Links */}
                    <Nav.Link as={NavLink} to="/admin-products" onClick={handleNavClick}>
                        Uređivanje proizvoda
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/admin-categories" onClick={handleNavClick}>
                        Uređivanje kategorija
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/admin-main-page" onClick={handleNavClick}>
                        Uređivanje početne strane
                    </Nav.Link>
                    {/* <Nav.Link as={NavLink} to="/admin-costs" onClick={handleNavClick}>
                        Praćenje troškova
                    </Nav.Link> */}
                </Nav>

                {/* Logout Button */}
                <Button variant="outline-light" onClick={handleLogout}>
                    Logout
                </Button>
            </Navbar.Collapse>
        </Navbar>
    );
}
