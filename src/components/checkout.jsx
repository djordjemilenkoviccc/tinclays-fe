import '../style/checkout.css';
import React, { useContext, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { CartContext } from './cart-context';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/order-api';
import { getImageUrl } from '../utils/image-utils';

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, setCartItems } = useContext(CartContext);
    const [formTouched, setFormTouched] = useState(false);
    const [emailError, setEmailError] = useState();
    const [phoneNumberError, setPhoneNumberError] = useState();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        houseNumber: '',
        postalCode: '',
        email: '',
        phoneNumber: '',
        status: 'IN_PROGRESS'
    });

    const sanitizeInput = (value) => {
        return value.replace(/['";\-]/g, '');
    };

    const handleChange = (e) => {
        const sanitizedValue = sanitizeInput(e.target.value);
        setFormData({
            ...formData,
            [e.target.name]: sanitizedValue,
        });
        setEmailError(false);
        setPhoneNumberError(false);
    };

    const fieldOrder = [
        { name: 'firstName', id: 'formFirstName' },
        { name: 'lastName', id: 'formLastName' },
        { name: 'address', id: 'formAddress' },
        { name: 'houseNumber', id: 'formHouseNumber' },
        { name: 'postalCode', id: 'formPostalCode' },
        { name: 'city', id: 'formCity' },
        { name: 'email', id: 'formEmail' },
        { name: 'phoneNumber', id: 'formPhoneNumber' },
    ];

    const focusFirstInvalidField = () => {
        for (const field of fieldOrder) {
            if (!formData[field.name].trim()) {
                const el = document.getElementById(field.id);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    el.focus();
                }
                return;
            }
        }
    };

    const handleSubmit = async (e) => {

        setFormTouched(true);
        let isValid = Object.values(formData).every((value) => value.trim() !== '');
        if (!isValid) {
            focusFirstInvalidField();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{9,15}$/;
        if (!emailRegex.test(formData.email)) {
            setEmailError(true);
            isValid = false;
        }
        if (!phoneRegex.test(formData.phoneNumber)) {
            setPhoneNumberError(true);
            isValid = false;
        }

        if (!isValid) {
            const emailInvalid = !emailRegex.test(formData.email);
            const el = document.getElementById(emailInvalid ? 'formEmail' : 'formPhoneNumber');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.focus();
            }
            return;
        }

        const { firstName, lastName, address, city, houseNumber, postalCode, email, phoneNumber, status } = formData;

        const orderProductDtos = cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));

        const orderDtoRequest = {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            address: address.trim(),
            city: city.trim(),
            houseNumber: houseNumber.trim(),
            postalCode: postalCode.toString().trim(),
            email: email.trim(),
            phone: phoneNumber.trim(),
            status: status,
            products: orderProductDtos,
            totalAmount: cartItems.reduce((total, item) => total + item.quantity * item.price, 0)
        };

        console.log("Sanitized Form Data:", orderDtoRequest);

        setIsSubmitting(true);

        const orderItems = cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.imageList[0]?.path
        }));
        const totalAmount = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

        try {
            const response = await createOrder(orderDtoRequest);

            if (response.ok) {
                localStorage.removeItem('cartItems');
                setCartItems([]);
                navigate('/checkout-status', {
                    state: {
                        message: "Narudžbina je uspešno kreirana",
                        status: "success",
                        orderItems,
                        totalAmount,
                        customerName: `${formData.firstName} ${formData.lastName}`,
                        customerEmail: formData.email
                    }
                });
            } else {
                const contentType = response.headers.get('content-type');
                let errorMessage = 'Greška pri obradi porudžbine, pokušajte ponovo';
                let unavailableProducts = [];

                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                    unavailableProducts = (errorData.unavailableProducts || []).map(product => {
                        const cartItem = cartItems.find(item => item.name === product.name);
                        return { ...product, image: cartItem?.imageList?.[0]?.path };
                    });
                }

                navigate('/checkout-status', {
                    state: {
                        message: "Neuspelo kreiranje porudžbine",
                        description: errorMessage,
                        unavailableProducts,
                        status: "failed",
                        orderItems,
                        totalAmount
                    }
                });
            }
        } catch (error) {
            console.error("Error creating order:", error);
            navigate('/checkout-status', {
                state: {
                    message: "Neuspelo kreiranje porudžbine",
                    description: 'Greška pri obradi porudžbine, pokušajte ponovo',
                    status: "failed",
                    orderItems,
                    totalAmount
                }
            });
        } finally {
            setIsSubmitting(false);
        }

    };

    const totalAmount = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

    return (
        <div className="home-root">
            {/* Header */}
            <section className="checkout-hero">
                <span className="checkout-label">Završi kupovinu</span>
                <h1 className="checkout-heading">Checkout</h1>
                <div className="checkout-divider"></div>
            </section>

            <Row className="checkout-content g-5">
                {/* Left Column: Form */}
                <Col lg={7} md={12}>
                    <div className="checkout-form-wrapper">
                        <h2 className="checkout-section-title">Podaci za dostavu</h2>
                        <Form>
                            <Row className="mb-3">
                                <Col sm={6} className="mb-3 mb-sm-0">
                                    <Form.Group controlId="formFirstName">
                                        <Form.Control
                                            type="text"
                                            name="firstName"
                                            className={`custom-input ${formTouched && !formData.firstName.trim() ? 'is-invalid' : ''}`}
                                            placeholder="Ime"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                        {formTouched && !formData.firstName.trim() && (
                                            <div className="invalid-feedback">Ovo polje je obavezno.</div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col sm={6}>
                                    <Form.Group controlId="formLastName">
                                        <Form.Control
                                            type="text"
                                            name="lastName"
                                            placeholder="Prezime"
                                            className={`custom-input ${formTouched && !formData.lastName.trim() ? 'is-invalid' : ''}`}
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                        {formTouched && !formData.lastName.trim() && (
                                            <div className="invalid-feedback">Ovo polje je obavezno.</div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="mb-3">
                                <Form.Group controlId="formAddress">
                                    <Form.Control
                                        type="text"
                                        name="address"
                                        placeholder="Adresa"
                                        className={`custom-input ${formTouched && !formData.address.trim() ? 'is-invalid' : ''}`}
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                    {formTouched && !formData.address.trim() && (
                                        <div className="invalid-feedback">Ovo polje je obavezno.</div>
                                    )}
                                </Form.Group>
                            </div>

                            <Row className="mb-3">
                                <Col sm={4} className="mb-3 mb-sm-0">
                                    <Form.Group controlId="formHouseNumber">
                                        <Form.Control
                                            type="text"
                                            name="houseNumber"
                                            placeholder="Kućni broj"
                                            className={`custom-input ${formTouched && !formData.houseNumber.trim() ? 'is-invalid' : ''}`}
                                            value={formData.houseNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                        {formTouched && !formData.houseNumber.trim() && (
                                            <div className="invalid-feedback">Ovo polje je obavezno.</div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col sm={4} className="mb-3 mb-sm-0">
                                    <Form.Group controlId="formPostalCode">
                                        <Form.Control
                                            type="text"
                                            name="postalCode"
                                            placeholder="Poštanski broj"
                                            maxLength="5"
                                            className={`custom-input ${formTouched && !formData.postalCode.trim() ? 'is-invalid' : ''}`}
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            onInput={(e) => {
                                                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                                            }}
                                            required
                                        />
                                        {formTouched && !formData.postalCode.trim() && (
                                            <div className="invalid-feedback">Ovo polje je obavezno.</div>
                                        )}
                                    </Form.Group>
                                </Col>
                                <Col sm={4}>
                                    <Form.Group controlId="formCity">
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            placeholder="Grad"
                                            className={`custom-input ${formTouched && !formData.city.trim() ? 'is-invalid' : ''}`}
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                        {formTouched && !formData.city.trim() && (
                                            <div className="invalid-feedback">Ovo polje je obavezno.</div>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <div className="mb-3">
                                <Form.Group controlId="formEmail">
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        className={`custom-input ${(formTouched && !formData.email.trim()) || emailError ? 'is-invalid' : ''}`}
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    {formTouched && !formData.email.trim() && (
                                        <div className="invalid-feedback">Ovo polje je obavezno.</div>
                                    )}
                                    {emailError && <div className="invalid-feedback">Pogrešan format email adrese.</div>}
                                </Form.Group>
                            </div>

                            <div className="mb-3">
                                <Form.Group controlId="formPhoneNumber">
                                    <Form.Control
                                        as="input"
                                        type="text"
                                        placeholder="Broj telefona"
                                        name="phoneNumber"
                                        className={`custom-input ${(formTouched && !formData.phoneNumber.trim()) || phoneNumberError ? 'is-invalid' : ''}`}
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                    {formTouched && !formData.phoneNumber.trim() && (
                                        <div className="invalid-feedback">Ovo polje je obavezno.</div>
                                    )}
                                    {phoneNumberError && <div className="invalid-feedback">Pogrešan format broja telefona.</div>}
                                </Form.Group>
                            </div>
                        </Form>
                    </div>
                </Col>

                {/* Right Column: Order Summary */}
                <Col lg={5} md={12}>
                    <div className="order-summary">
                        <h2 className="checkout-section-title">Vaša porudžbina</h2>

                        <div className="order-items">
                            {cartItems.map((item, index) => (
                                <div key={index} className="order-item">
                                    <img
                                        src={getImageUrl(item.imageList[0].path)}
                                        alt={item.name}
                                        className="order-item-image"
                                        fetchpriority="high"
                                    />
                                    <div className="order-item-details">
                                        <p className="order-item-name">{item.name}</p>
                                        <p className="order-item-qty">Količina: {item.quantity}</p>
                                    </div>
                                    <p className="order-item-price">{item.price * item.quantity} rsd</p>
                                </div>
                            ))}
                        </div>

                        <div className="order-total">
                            <span className="order-total-label">Ukupno</span>
                            <span className="order-total-amount">{totalAmount} rsd</span>
                        </div>

                        <Button
                            className="w-100 checkout-submit-btn"
                            onClick={() => handleSubmit()}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Naručivanje...' : 'Naruči'}
                        </Button>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
