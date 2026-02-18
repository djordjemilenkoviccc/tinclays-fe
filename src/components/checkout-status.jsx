import '../style/checkout-status.css';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { getImageUrl } from '../utils/image-utils';

export default function CheckoutStatus() {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        message,
        status,
        description,
        unavailableProducts,
        orderItems,
        totalAmount,
        customerName,
        customerEmail
    } = location.state || {};

    return (
        <div className="checkout-status-root">
            {status === "success" && (
                <div className="checkout-status-container fade-in-up">
                    <div className="status-icon success-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </div>
                    <h2 className="status-title success-text">{message}</h2>
                    {customerName && (
                        <p className="status-subtitle">
                            Hvala Vam, {customerName}!
                        </p>
                    )}
                    <p className="status-description">
                        Proverite Vaš email {customerEmail && <strong>({customerEmail})</strong>} na koji ćemo poslati detalje o porudžbini kao i uputstvo za plaćanje.
                    </p>
                </div>
            )}

            {status === "failed" && (
                <div className="checkout-status-container fade-in-up">
                    <div className="status-icon failed-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </div>
                    <h2 className="status-title failed-text">{message}</h2>
                    {description && <p className="status-description">{description}</p>}

                    {unavailableProducts && unavailableProducts.length > 0 && (
                        <div className="unavailable-products">
                            {unavailableProducts.map((product, index) => (
                                <div key={index} className="unavailable-product-item">
                                    {product.image && (
                                        <div className="unavailable-product-image-wrapper">
                                            <img
                                                src={getImageUrl(product.image)}
                                                alt={product.name}
                                                className="unavailable-product-image"
                                            />
                                        </div>
                                    )}
                                    <div className="unavailable-product-info">
                                        <span className="unavailable-product-name">{product.name}</span>
                                        {product.reason === 'INSUFFICIENT_STOCK' ? (
                                            <span className="unavailable-product-detail">
                                                Tražena količina: {product.requestedQuantity}, dostupno: {product.availableStock}
                                            </span>
                                        ) : (
                                            <span className="unavailable-product-detail">
                                                Proizvod trenutno nije dostupan
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {orderItems && orderItems.length > 0 && (
                <div className="order-summary fade-in-up-delayed">
                    <h3 className="order-summary-title">Vaša porudžbina</h3>
                    <div className="order-divider"></div>

                    <div className="order-items">
                        {orderItems.map((item, index) => (
                            <Row key={index} className="order-item align-items-center">
                                <Col xs={3} sm={2}>
                                    <div className="order-item-image-wrapper">
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.name}
                                            className="order-item-image"
                                        />
                                    </div>
                                </Col>
                                <Col xs={5} sm={6}>
                                    <p className="order-item-name">{item.name}</p>
                                    <p className="order-item-qty">Količina: {item.quantity}</p>
                                </Col>
                                <Col xs={4} sm={4} className="text-end">
                                    <p className="order-item-price">{item.price * item.quantity} rsd</p>
                                    {item.quantity > 1 && (
                                        <p className="order-item-unit-price">{item.price} rsd / kom</p>
                                    )}
                                </Col>
                            </Row>
                        ))}
                    </div>

                    <div className="order-divider"></div>
                    <div className="order-total">
                        <span>Ukupno</span>
                        <span className="order-total-amount">{totalAmount} rsd</span>
                    </div>
                </div>
            )}

            <div className="checkout-status-actions fade-in-up-delayed-2">
                <Button className="back-to-shop-btn" onClick={() => navigate('/')}>
                    Nazad na Shop
                </Button>
            </div>
        </div>
    );
}
