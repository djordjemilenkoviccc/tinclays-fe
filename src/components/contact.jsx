import '../style/contact.css';
import '../style/home.css';
import '../style/checkout.css';
import React from 'react';
import { useState } from 'react';
import { sendContactMessage } from '../api/main-api';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';

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
            <section className="contact-section">
                <Row className="g-0">
                    {/* Left column — heading & info */}
                    <Col lg="5" className="contact-info-col">
                        <div className="contact-info-content">
                            <span className="contact-label">Kontakt</span>
                            <h1 className="contact-heading">Javite mi se</h1>
                            <div className="contact-divider"></div>
                            <p className="contact-description">
                                Imate pitanje, predlog ili želite nešto posebno? Slobodno mi pišite — potrudiću se da odgovorim u najkraćem mogućem roku.
                            </p>

                            <div className="contact-social">
                                <p className="contact-social-label">Pratite me</p>
                                <div className="contact-social-icons">
                                    <a href="https://instagram.com/tinclays?igsh=d2doaGNmajlvMNGNo" target="_blank" rel="noopener noreferrer">
                                        <FontAwesomeIcon icon={faInstagram} size="lg" className="contact-social-icon" />
                                    </a>
                                    <a href="https://www.tiktok.com/@tinclays?_t=8sGZvahEH13&_r=1" target="_blank" rel="noopener noreferrer">
                                        <FontAwesomeIcon icon={faTiktok} size="lg" className="contact-social-icon" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Right column — form */}
                    <Col lg="7">
                        <div className="contact-form-wrapper">
                            <Form action="#" method="post">
                                <Row>
                                    <Col lg={6} md={12} className="mb-3">
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
                                    <Col lg={6} md={12} className="mb-3">
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
                                </Row>

                                <div className="mb-3">
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
                                </div>

                                <div className="mb-3">
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
                                </div>

                                <div className="mb-3">
                                    <Form.Control
                                        as="textarea"
                                        name="message"
                                        rows={5}
                                        placeholder="Poruka"
                                        className={`custom-input ${formTouched && !formData.message.trim() ? 'is-invalid' : ''}`}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    />
                                    {formTouched && !formData.message.trim() && (
                                        <div className="invalid-feedback">Ovo polje je obavezno.</div>
                                    )}
                                </div>

                                {showSuccessBanner && (
                                    <Alert className="contact-alert" variant="success" onClose={() => setShowSuccessBanner(false)} dismissible>
                                        Poruka je uspešno poslata. Potrudićemo se da Vam odgovorimo u najkraćem mogućem roku.
                                    </Alert>
                                )}

                                {showFailedBanner && (
                                    <Alert className="contact-alert" variant="danger" onClose={() => setShowFailedBanner(false)} dismissible>
                                        Greška prilikom slanja poruke. Pokušajte ponovo
                                    </Alert>
                                )}

                                <div className="d-flex justify-content-start">
                                    <Button className="send-message-btn" onClick={() => handleSubmit()} disabled={isSubmitting}>
                                        {isSubmitting ? 'Šalje se...' : 'Pošalji'}
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </section>
        </div>
    );
}

export default Contact;
