import React, { useState, useContext } from "react";
import "../style/header.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Navbar, Nav, Container, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import Cart from "./cart";
import { CartContext } from "./cart-context";
import { Sling as Hamburger } from "hamburger-react";
import { FiShoppingCart } from "react-icons/fi";

export default function Header() {
    const { cartItems, showCart, handleCloseCart, handleShowCart } =
        useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const totalItemsInCart = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <>
            <Navbar fixed="top" expand="lg" className="navbar-shadow">
                <Container fluid className="d-flex align-items-center">
                    {/* Large Screen Header */}
                    <div className="d-none d-lg-flex w-100 align-items-center">
                        <Navbar.Brand className="position-absolute start-50 translate-middle-x">
                            <h3 className="header-title mb-0">
                                <Nav.Link as={Link} to="/" style={{ textDecoration: "none", color: "inherit" }}>
                                    TINCLAYS
                                </Nav.Link>
                            </h3>
                        </Navbar.Brand>


                        {/* Right Links */}
                        <Nav className="ms-auto align-items-center">
                            <Nav.Link as={Link} to="/">Shop</Nav.Link>
                            <Nav.Link as={Link} to="/about-me">O meni</Nav.Link>
                            <Nav.Link as={Link} to="/contact">Kontakt</Nav.Link>
                            <Nav.Link as={Link} to="/faq">FAQ</Nav.Link>
                            <div onClick={handleShowCart} style={{ cursor: "pointer" }}>
                                <FiShoppingCart
                                    size={25}
                                    style={{ marginLeft: "20px" }}

                                />
                                <span
                                    style={{
                                        position: "relative",
                                        bottom: "16px",
                                        right: "21px",
                                        color: "#1c3d5a",
                                        borderRadius: "50%",
                                        padding: "2px 6px",
                                        fontSize: "16px",
                                    }}
                                >
                                    {totalItemsInCart}
                                </span>
                            </div>

                        </Nav>
                    </div>

                    {/* Small Screen Header */}

                    <Navbar.Text className="d-block d-lg-none justify-content-start">
                        <FiShoppingCart
                            size={28}
                            style={{ cursor: "pointer" }}
                            onClick={handleShowCart}
                        />
                        <span
                            style={{
                                position: "relative",
                                bottom: "20px",
                                right: "22px",
                                color: "#1c3d5a",
                                borderRadius: "50%",
                                padding: "2px 6px",
                                fontSize: "16px",
                            }}
                        >
                            {totalItemsInCart}
                        </span>
                    </Navbar.Text>
                    <Navbar.Brand className="d-block d-lg-none justify-content-center">
                        <h3 className="header-title">
                            <Nav.Link as={Link} to="/">TINCLAYS</Nav.Link>
                        </h3>
                    </Navbar.Brand>
                    <Navbar.Text className="d-block d-lg-none justify-content-end">
                        <Hamburger toggled={false} toggle={toggleMenu} size={28} />
                    </Navbar.Text>
                </Container>
            </Navbar>

            <Offcanvas className="side-menu" show={isMenuOpen} onHide={closeMenu} placement="end">
                <Offcanvas.Header closeButton>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column text-center" style={{ marginTop: "20%" }}>
                        <Nav.Link as={Link} to="/" onClick={closeMenu}>Shop</Nav.Link>
                        <Nav.Link as={Link} to="/about-me" onClick={closeMenu}>O meni</Nav.Link>
                        <Nav.Link as={Link} to="/contact" onClick={closeMenu}>Kontakt</Nav.Link>
                        <Nav.Link as={Link} to="/faq" onClick={closeMenu}>FAQ</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
            <Cart show={showCart} handleClose={handleCloseCart} cartItems={cartItems} />
        </>
    );
}
