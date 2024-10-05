import '../style/checkout.css';
import React, { useContext, useState } from 'react';
import { Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import { CartContext } from './cart-context';

export default function Checkout() {
    const { cartItems } = useContext(CartContext);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        houseNumber: '',
        zipCode: '',
        email: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="justify-content-center align-items-center root-div">
            <Row className="w-100">
                {/* Left Column: Checkout Form */}
                <Col md={12} lg={6} sm={12}>
                    <Form onSubmit={handleSubmit} className="p-3">
                        <Row className="mb-5">
                            <Form.Group as={Col} controlId="formFirstName">
                                <Form.Control
                                    type="text"
                                    name="firstName"
                                    className="custom-input"
                                    placeholder="Ime"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formLastName">
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    placeholder="Prezime"
                                    className="custom-input"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-5" controlId="formAddress">
                            <Form.Control
                                type="text"
                                name="address"
                                placeholder="Adresa"
                                className="custom-input"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Row className="mb-5">
                            <Form.Group as={Col} controlId="formHouseNumber">
                                <Form.Control
                                    type="text"
                                    name="houseNumber"
                                    placeholder="Kućni broj"
                                    className="custom-input"
                                    value={formData.houseNumber}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-5" as={Col} controlId="formZipCode">
                                <Form.Control
                                    type="number"
                                    name="zipCode"
                                    placeholder="Poštanski broj"
                                    className="custom-input"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>


                            <Form.Group controlId="formCity">
                                <Form.Control
                                    type="text"
                                    name="city"
                                    placeholder="Grad"
                                    className="custom-input"
                                    value={formData.city}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Row>

                        <Form.Group className="mb-5" controlId="formEmail">
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="custom-input"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-5" controlId="formPhoneNumber">
                            <Form.Control
                                as="input"
                                type="text"
                                placeholder="Broj telefona"
                                name="phoneNumber"
                                className="custom-input"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <div className="text-center mt-4">
                            <h5>
                                Ukupno za placanje: {cartItems.reduce((total, item) => total + item.quantity * item.price, 0)} rsd
                            </h5>
                        </div>

                    </Form>
                </Col>

               
                <Col md={12} lg={6} sm={12} style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <ListGroup variant="flush" style={{ textAlign: "center", backgroundColor: "white" }}>
                        {cartItems.map((item, index) => (
                            <ListGroup.Item key={index}>
                                <p>{item.name} - {item.quantity} x {item.price} rsd</p>
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    style={{ width: "70%", height: "auto" }}
                                    className='product-image'
                                    fetchpriority="high"
                                />
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                </Col>

                <Button variant="dark" type="submit" className='w-50'>
                    Naruči
                </Button>


            </Row>
        </div>
    );
}
