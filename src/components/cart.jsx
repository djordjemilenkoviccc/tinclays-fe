import '../style/cart.css';

import React, { useContext } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { CartContext } from './cart-context';
import { getImageUrl } from '../utils/image-utils';
import { useNavigate } from 'react-router-dom';
import { HiOutlineShoppingBag } from 'react-icons/hi2';

export default function Cart({ show, handleClose, setCartItems }) {
    const { cartItems, increaseQuantity, decreaseQuantity, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();

    const calculateTotal = (items) => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const goToCheckout = (cartItems) => {
        handleClose();
        sessionStorage.setItem('scrollPosition', window.scrollY);
        navigate(`/checkout`, { state: { cartItems } });
    };

    return (
        <Offcanvas className="cart-root" show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className="cart-title">Korpa</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="cart-body">
                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <HiOutlineShoppingBag size={48} className="cart-empty-icon" />
                        <p className="cart-empty-text">Vaša korpa je prazna</p>
                    </div>
                ) : (
                    <>
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <img
                                        src={getImageUrl(item.imageList[0].path)}
                                        alt={item.name}
                                        fetchpriority="high"
                                        className="cart-item-image"
                                    />
                                    <div className="cart-item-details">
                                        <p className="cart-item-name">{item.name}</p>
                                        <p className="cart-item-price">{item.price * item.quantity} rsd</p>
                                        <div className="cart-item-actions">
                                            <div className="quantity-control">
                                                <button className="quantity-btn" onClick={() => decreaseQuantity(item.id)}>
                                                    −
                                                </button>
                                                <span className="quantity-display">{item.quantity}</span>
                                                <button className="quantity-btn" onClick={() => increaseQuantity(item.id)}>
                                                    +
                                                </button>
                                            </div>
                                            <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                                Ukloni
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-footer">
                            <div className="cart-total">
                                <span className="cart-total-label">Ukupno</span>
                                <span className="cart-total-amount">{calculateTotal(cartItems)} rsd</span>
                            </div>
                            <Button className="w-100 checkout-btn" onClick={() => goToCheckout(cartItems)}>
                                Checkout
                            </Button>
                        </div>
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
}
