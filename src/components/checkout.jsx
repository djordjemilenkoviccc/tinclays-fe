import '../style/checkout.css';
import React, { useContext, useState } from 'react';
import { Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { CartContext } from './cart-context';
import { useNavigate } from 'react-router-dom';
import {createOrder} from '../api/order-api';
import { getImageUrl } from '../utils/image-utils';

export default function Checkout() {
    const navigate = useNavigate();
    const { cartItems, setCartItems } = useContext(CartContext);
    const [formTouched, setFormTouched] = useState(false);
    const [emailError, setEmailError] = useState();
    const [phoneNumberError, setPhoneNumberError] = useState();

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

    const handleSubmit = async (e) => {

        setFormTouched(true);
        let isValid = Object.values(formData).every((value) => value.trim() !== '');
        if (!isValid) {
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

        try {
            const response = await createOrder(orderDtoRequest);

            localStorage.removeItem('cartItems');
            setCartItems([]);
            navigate('/checkout-status', { state: { message: "Narudžbina je uspešno kreirana", status: "success" } });

        } catch (error) {

            console.error("Error creating order:", error.response ? error.response.data : error.message);
            setCartItems([]);
            navigate('/checkout-status', { state: { message: "Neuspelo kreiranje porudžbine", description: error.response ? error.response.data : 'Greška pri obradi porudžbine, pokušajte ponovo', status: "failed" } });
        }

    };

    return (
        <div className="justify-content-center align-items-center root-div">
            <Row>
                {/* Left Column: Checkout Form */}
                <Col md={12} lg={6} sm={12}>
                    <Form>
                        <Row className="mb-5">
                            <Form.Group as={Col} controlId="formFirstName">
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

                            <Form.Group as={Col} controlId="formLastName">
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
                        </Row>

                        <Form.Group className="mb-5" controlId="formAddress">
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

                        <Row className="mb-5">
                            <Form.Group as={Col} controlId="formHouseNumber">
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

                            <Form.Group className="mb-5" as={Col} controlId="formPostalCode">
                                <Form.Control
                                    type="text"
                                    name="postalCode"
                                    placeholder="Poštanski broj"
                                    maxLength="5"
                                    className={`custom-input ${formTouched && !formData.postalCode.trim() ? 'is-invalid' : ''}`}
                                    value={formData.postalCode}
                                    onChange={handleChange}
                                    onInput={(e) => {
                                        e.target.value = e.target.value.replace(/[^0-9]/g, ''); // Allow only numbers
                                    }}
                                    required
                                />
                                {formTouched && !formData.postalCode.trim() && (
                                    <div className="invalid-feedback">Ovo polje je obavezno.</div>
                                )}
                            </Form.Group>


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
                        </Row>

                        <Form.Group className="mb-5" controlId="formEmail">
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

                        <Form.Group className="mb-5" controlId="formPhoneNumber">
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
                        <div className="text-center mt-4">
                            <h5>
                                Ukupno: {cartItems.reduce((total, item) => total + item.quantity * item.price, 0)} rsd
                            </h5>
                        </div>

                    </Form>
                </Col>


                <Col md={12} lg={6} sm={12} style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <ListGroup variant="flush" style={{ textAlign: "center", backgroundColor: "white" }}>
                        {cartItems.map((item, index) => (
                            <ListGroup.Item key={index}>
                                <p>{item.quantity} x {item.price} rsd</p>
                                <img
                                    src={getImageUrl(item.imageList[0].path)}
                                    alt={item.name}
                                    style={{ width: "70%", height: "auto", objectFit: "cover" }}
                                    className='product-image'
                                    fetchpriority="high"
                                />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                </Col>
            </Row>
            <Row>
                <Col md={12} lg={6} sm={12}>
                    <Button className="w-100 checkout-btn" onClick={() => handleSubmit()}>
                        Naruči
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
