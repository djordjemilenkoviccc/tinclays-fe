import React, { useContext, useState } from 'react';
import { AuthContext } from './auth-context';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import '../assets/bootstrap.min.css';

export default function AdminHeader() {
    const { logout } = useContext(AuthContext);  // Access the logout function from AuthContext
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState(false);  // Track if navbar is expanded

    const handleLogout = () => {
        logout();  // Call the logout function from AuthContext
        navigate('/login');
    };

    return (
        <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            expanded={expanded}  // Control navbar expand state
            onToggle={() => setExpanded(!expanded)}  // Toggle navbar expand state
            style={{
                minHeight: expanded ? '350px' : '80px',  // Adjust height when expanded
                padding: '0 40px',
                transition: 'min-height 0.3s ease-in-out',  // Smooth transition for height
            }}
        >
            <Navbar.Brand href="#">Admin Panel</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link as={NavLink} to="/admin-panel">
                        Porudžbine
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/admin-products">
                        Uređivanje proizvoda
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/admin-categories">
                        Uređivanje kategorija
                    </Nav.Link>
                    <Nav.Link as={NavLink} to="/admin-orders">
                        Praćenje troškova
                    </Nav.Link>
                </Nav>
                <Button variant="outline-light" onClick={handleLogout}>
                    Logout
                </Button>
            </Navbar.Collapse>
        </Navbar>
    );
}
