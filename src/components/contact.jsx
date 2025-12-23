import '../style/contact.css';
import '../style/home.css';
import '../style/checkout.css';
import React from 'react';
import { useContext, useState } from 'react';
import { sendContactMessage } from '../api/main-api';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';

function Contact() {
    const [emailError, setEmailError] = useState();
    const [phoneNumberError, setPhoneNumberError] = useState();
    const [formTouched, setFormTouched] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const [showFailedBanner, setShowFailedBanner] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
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
        setShowSuccessBanner(false);
        setShowFailedBanner(false);

        let isValid = Object.values(formData).every((value) => value.trim() !== '');
        if (!isValid) {
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setEmailError(true);
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await sendContactMessage(formData)

            setFormTouched(false);
            setShowSuccessBanner(true);
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                subject: "",
                message: "",
            });

        } catch (error) {
            console.error("Error sending the message:", error);
            setShowFailedBanner(true);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="home-root">
            <Row id="contactForm" className="justify-content-center align-items-center mt-3 contact-div">
                <Col lg="8" md="10" sm="12" className="d-flex justify-content-center align-items-center w-100">
                    <Form action="#" method="post" className="w-100">
                        <Form.Group as={Row} className="text-center">
                            <p style={{fontSize: "22px"}}>Pošaljite mi poruku</p>
                        </Form.Group>

                        <Form.Group as={Row} className="mt-5">
                            <Col lg={6} md={12} sm={12} className="mb-3 mb-lg-0">
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
                            </Col>
                            <Col lg={6} md={12} sm={12}>
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
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mt-4">
                            <Col lg={12}>
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
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mt-4">
                            <Col lg={12}>
                                <Form.Control
                                    type="text"
                                    name="subject"
                                    placeholder="Naslov poruke"
                                    className={`custom-input ${formTouched && !formData.subject.trim() ? 'is-invalid' : ''}`}
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />
                                {formTouched && !formData.subject.trim() && (
                                    <div className="invalid-feedback">Ovo polje je obavezno.</div>
                                )}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mt-4">
                            <Col lg={12}>
                                <Form.Control
                                    as="textarea"
                                    name="message"
                                    rows={4}
                                    placeholder="Poruka"
                                    className={`custom-input ${formTouched && !formData.message.trim() ? 'is-invalid' : ''}`}
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                                {formTouched && !formData.message.trim() && (
                                    <div className="invalid-feedback">Ovo polje je obavezno.</div>
                                )}
                            </Col>
                        </Form.Group>

                        {showSuccessBanner && (
                            <div>
                                <Alert style={{textAlign: "center"}} variant="success" onClose={() => setShowSuccessBanner(false)} dismissible>
                                    Poruka je uspešno poslata. Potrudićemo se da Vam odgovorimo u najkraćem mogućem roku.
                                </Alert>
                            </div>

                        )}

                        {showFailedBanner && (
                            <div>
                                <Alert style={{textAlign:"center"}} variant="danger" onClose={() => setShowFailedBanner(false)} dismissible>
                                    Greška prilikom slanja poruke. Pokušajte ponovo
                                </Alert>
                            </div>

                        )}

                        <Form.Group as={Row} className="mt-4">
                            <Col lg={12}>
                                <div className="d-flex justify-content-center align-items-center">
                                    <Button className="send-message-btn" onClick={() => handleSubmit()} disabled={isSubmitting}>
                                        {isSubmitting ? 'Šalje se...' : 'Pošalji'}
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
