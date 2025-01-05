import '../style/cart.css';

import React, { useContext } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { CartContext } from './cart-context';

import { useNavigate } from 'react-router-dom';

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

    const getImageUrl = (path) => {
        const baseUrl = "http://localhost:8080/api/v1/images/getImage";
        return `${baseUrl}?path=${encodeURIComponent(path)}`;
    };

    return (
        <Offcanvas className="cart-root text-center" show={show} onHide={handleClose} placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Pregled korpe</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {cartItems.length === 0 ? (
                    <p className='cart-empty-text'>Vaša korpa je prazna</p>
                ) : (
                    <div>
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <h5>{item.name}</h5>
                                <img
                                    src={getImageUrl(item.imageList[0].path)}
                                    alt={item.name}
                                    fetchpriority="high"
                                    className='image-in-cart'
                                />
                                <div className="quantity-control">
                                    <Button variant="link" className="quantity-btn" onClick={() => decreaseQuantity(item.id)}>
                                        -
                                    </Button>
                                    <span className="quantity-display">{item.quantity}</span>
                                    <Button variant="link" className="quantity-btn" onClick={() => increaseQuantity(item.id)}>
                                        +
                                    </Button>
                                    <Button variant="link" className="remove-btn" onClick={() => removeFromCart(item.id)}>
                                        Ukloni
                                    </Button>
                                </div>
                                <p>Cena: {item.price * item.quantity} rsd</p>
                            </div>
                        ))}
                        <hr />
                        <h4>Ukupno: {calculateTotal(cartItems)} rsd</h4>
                    </div>
                )}
                {cartItems.length !== 0 && (
                    <Button className="btn btn-dark w-100 rounded-0 checkout-btn" onClick={() => goToCheckout(cartItems)}>Checkout</Button>
                )}

            </Offcanvas.Body>
        </Offcanvas>
    );
}
