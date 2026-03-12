import React, { useState, useContext } from "react";
import "../style/header.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Navbar, Nav, Offcanvas } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import Cart from "./cart";
import { CartContext } from "./cart-context";
import { Sling as Hamburger } from "hamburger-react";
import { HiOutlineShoppingBag } from "react-icons/hi2";

export default function Header() {
    const { cartItems, showCart, handleCloseCart, handleShowCart } =
        useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const totalItemsInCart = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <Navbar fixed="top" expand="lg" className="navbar-shadow">
                {/* ===== Desktop Header ===== */}
                <div className="d-none d-lg-flex header-desktop">
                    <Nav className="header-nav-left">
                        <Nav.Link
                            as={Link}
                            to="/"
                            className={`header-link ${isActive("/") ? "header-link-active" : ""}`}
                        >
                            Shop
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/about-me"
                            className={`header-link ${isActive("/about-me") ? "header-link-active" : ""}`}
                        >
                            O meni
                        </Nav.Link>
                    </Nav>

                    <Link to="/" className="header-logo">
                        TINCLAYS
                    </Link>

                    <Nav className="header-nav-right">
                        <Nav.Link
                            as={Link}
                            to="/contact"
                            className={`header-link ${isActive("/contact") ? "header-link-active" : ""}`}
                        >
                            Kontakt
                        </Nav.Link>
                        <Nav.Link
                            as={Link}
                            to="/faq"
                            className={`header-link ${isActive("/faq") ? "header-link-active" : ""}`}
                        >
                            FAQ
                        </Nav.Link>
                        <button
                            className="header-cart-btn"
                            onClick={handleShowCart}
                            aria-label="Korpa"
                        >
                            <HiOutlineShoppingBag size={24} />
                            {totalItemsInCart > 0 && (
                                <span className="header-cart-badge">
                                    {totalItemsInCart}
                                </span>
                            )}
                        </button>
                    </Nav>
                </div>

                {/* ===== Mobile Header ===== */}
                <div className="d-flex d-lg-none header-mobile">
                    <button
                        className="header-cart-btn"
                        onClick={handleShowCart}
                        aria-label="Korpa"
                    >
                        <HiOutlineShoppingBag size={26} />
                        {totalItemsInCart > 0 && (
                            <span className="header-cart-badge">
                                {totalItemsInCart}
                            </span>
                        )}
                    </button>

                    <Link to="/" className="header-logo">
                        TINCLAYS
                    </Link>

                    <Hamburger toggled={isMenuOpen} toggle={toggleMenu} size={24} color="#1c3d5a" />
                </div>
            </Navbar>

            {/* ===== Mobile Side Menu ===== */}
            <Offcanvas className="side-menu" show={isMenuOpen} onHide={closeMenu} placement="end">
                <Offcanvas.Header closeButton />
                <Offcanvas.Body>
                    <Nav className="flex-column text-center side-menu-nav">
                        <Nav.Link as={Link} to="/" onClick={closeMenu} className={isActive("/") ? "side-menu-link-active" : ""}>
                            Shop
                        </Nav.Link>
                        <Nav.Link as={Link} to="/about-me" onClick={closeMenu} className={isActive("/about-me") ? "side-menu-link-active" : ""}>
                            O meni
                        </Nav.Link>
                        <Nav.Link as={Link} to="/contact" onClick={closeMenu} className={isActive("/contact") ? "side-menu-link-active" : ""}>
                            Kontakt
                        </Nav.Link>
                        <Nav.Link as={Link} to="/faq" onClick={closeMenu} className={isActive("/faq") ? "side-menu-link-active" : ""}>
                            FAQ
                        </Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>

            <Cart show={showCart} handleClose={handleCloseCart} cartItems={cartItems} />
        </>
    );
}
