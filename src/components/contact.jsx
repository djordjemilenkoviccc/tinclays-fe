import '../style/contact.css';
import '../style/home.css';
import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';

function Contact() {
    return (
        <div className="home-root">
            <Row id="contactForm" className="justify-content-center align-items-center mt-3 contact-div">
                <Col lg="8" md="10" sm="12" className="d-flex justify-content-center align-items-center w-100">
                    <Form action="#" method="post" className="w-100">
                        <Form.Group as={Row} className="text-center">
                            <h3>Pošaljite mi poruku</h3>
                        </Form.Group>

                        <Form.Group as={Row} className="mt-5">
                            <Col lg={6} md={12} sm={12} className="mb-3 mb-lg-0">
                                <Form.Control type="text" placeholder="Ime" className="custom-input" />
                            </Col>
                            <Col lg={6} md={12} sm={12}>
                                <Form.Control type="text" placeholder="Prezime" className="custom-input" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mt-4">
                            <Col lg={12}>
                                <Form.Control type="text" placeholder="Email" className="custom-input" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mt-4">
                            <Col lg={12}>
                                <Form.Control type="text" placeholder="Naslov poruke" className="custom-input" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mt-4">
                            <Col lg={12}>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    placeholder="Poruka"
                                    className="custom-input"
                                    id="textAreaMessage"
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mt-4">
                            <Col lg={12}>
                                <div className="d-flex justify-content-center align-items-center">
                                    <Button type="submit" variant="dark" className="w-50 border-0 rounded-0">
                                        Pošalji
                                    </Button>
                                </div>
                            </Col>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}

export default Contact;
