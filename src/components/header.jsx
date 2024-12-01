import React, { useState, useContext } from 'react';
import '../style/header.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Cart from './cart';
import { CartContext } from './cart-context';

export default function Header() {
    const { cartItems, showCart, handleCloseCart, handleShowCart } = useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <Navbar fixed="top" expand="lg" className="navbar-shadow">
                <Container fluid>
                    {/* Large Screen Navigation */}
                    <div className="d-none d-lg-flex ms-auto" style={{ fontSize: "18px" }}>
                        <h3 className="header-title"><Nav.Link as={Link} to="/">Tinclays</Nav.Link></h3>
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/">Shop</Nav.Link>
                        </Nav>
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/about-me">O meni</Nav.Link>
                        </Nav>
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/contact">Kontakt</Nav.Link>
                        </Nav>
                        <Nav className="ms-auto">
                            <Nav.Link as={Link} to="/faq">FAQ</Nav.Link>
                        </Nav>
                        <Button variant="link" onClick={handleShowCart}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="cart-icon-text" viewBox="0 0 197.7 166">
                                <g transform="translate(0, -35)">
                                    <path d="M197.9 55.9L169.9 127.4 64.5 127.4 27.6 29.8 0 29.8 0.2 16.7 36.5 16.7 73.4 114.3 160.9 114.3 183 55.9" />
                                    <circle cx="143.8" cy="153" r="13"></circle>
                                    <circle cx="90.8" cy="153" r="13"></circle>
                                    <text style={{ fill: "black", fontSize: "90px" }} textAnchor="middle" x="116" y="45" dy=".48em">
                                        {totalItemsInCart}
                                    </text>
                                </g>
                            </svg>
                        </Button>
                    </div>

                    {/* Small Screen Navigation */}
                    <div className="d-lg-none d-flex justify-content-between w-100 align-items-center position-relative header-mobile">
                        <h3 className="header-title"><Nav.Link as={Link} to="/">Tinclays</Nav.Link></h3>
                        <Button variant="link" onClick={handleShowCart} className="cart-icon-button-small-screen">
                            <svg xmlns="http://www.w3.org/2000/svg" className="cart-icon-text" viewBox="0 0 197.7 166">
                                <g transform="translate(0, -35)">
                                    <path d="M197.9 55.9L169.9 127.4 64.5 127.4 27.6 29.8 0 29.8 0.2 16.7 36.5 16.7 73.4 114.3 160.9 114.3 183 55.9" />
                                    <circle cx="143.8" cy="153" r="13"></circle>
                                    <circle cx="90.8" cy="153" r="13"></circle>
                                    <text style={{ fill: "black", fontSize: "90px" }} textAnchor="middle" x="116" y="45" dy=".48em">
                                        {totalItemsInCart}
                                    </text>
                                </g>
                            </svg>
                        </Button>
                        <button className="hamburger-menu" onClick={toggleMenu}>
                            <span className="hamburger-icon">&#9776;</span>
                        </button>
                    </div>


                </Container>
            </Navbar>

            {/* Sliding Menu */}
            <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
                <button className="close-menu" onClick={closeMenu}>
                    &times;
                </button>
                <Nav className="flex-column text-center" style={{ marginTop: "40%" }}>
                    <Nav.Link as={Link} to="/" onClick={closeMenu}>Shop</Nav.Link>
                    <Nav.Link as={Link} to="/about-me" onClick={closeMenu}>O meni</Nav.Link>
                    <Nav.Link as={Link} to="/contact" onClick={closeMenu}>Kontakt</Nav.Link>
                    <Nav.Link as={Link} to="/faq" onClick={closeMenu}>FAQ</Nav.Link>
                </Nav>
            </div>

            <Cart show={showCart} handleClose={handleCloseCart} cartItems={cartItems} />
        </>
    );
}
