import React, { useContext } from 'react';
import '../style/header.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Cart from './cart';
import { CartContext } from './cart-context';

export default function Header() {
    const { cartItems, showCart, handleCloseCart, handleShowCart } = useContext(CartContext);

    const totalItemsInCart = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <>
            <Navbar fixed="top" expand="lg" className='navbar-shadow'>
                <Container fluid>
                    <div className="d-none d-lg-flex ms-auto">
                        <Nav className='ms-auto'>
                            <Nav.Link as={Link} to="/">Početna</Nav.Link>
                        </Nav>
                        <Nav className='ms-auto'>
                            <Nav.Link as={Link} to="/about-me">O meni</Nav.Link>
                        </Nav>
                        <Nav className='ms-auto'>
                            <Nav.Link as={Link} to="/contact">Kontakt</Nav.Link>
                        </Nav>
                        <Nav className='ms-auto'>
                            <Nav.Link as={Link} to="/faq">FAQ</Nav.Link>
                        </Nav>

                        <Button
                            variant="link"
                            onClick={handleShowCart}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" className='cart-icon-text'
                                viewBox="0 0 197.7 166" preserveAspectRatio="xMinYMax meet" data-hook="svg-icon-2">
                                <g transform="translate(0, -35)">
                                    <path
                                        d="M197.9 55.9L169.9 127.4 64.5 127.4 27.6 29.8 0 29.8 0.2 16.7 36.5 16.7 73.4 114.3 160.9 114.3 183 55.9">
                                    </path>
                                    <circle cx="143.8" cy="153" r="13"></circle>
                                    <circle cx="90.8" cy="153" r="13"></circle>
                                    <text data-hook="items-count" style={{ fill: "black", fontSize: "90px" }} textAnchor="middle"
                                        x="116" y="35" dy=".48em">{totalItemsInCart}</text>
                                </g>
                            </svg>
                        </Button>

                    </div>
                </Container>
            </Navbar>

            <Cart show={showCart} handleClose={handleCloseCart} cartItems={cartItems} />
        </>
    );
}
