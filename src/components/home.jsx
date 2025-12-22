import '../style/home.css';

import { Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchMainMessage } from '../api/main-api.jsx';
import { loadAllCategoriesWithProducts } from '../api/category-api.jsx';
import { subscribeEmail } from '../api/email-notification-api.jsx';
import { getErrorMessage } from '../utils/error-handler.js';
import { useState, useEffect } from 'react';


export default function Home() {
    const navigate = useNavigate();
    const [mainMessage, setMainMessage] = useState(null);
    const [collectionData, setCollectionData] = useState(null);
    const [bannerLoaded, setBannerLoaded] = useState(false);
    const [categories, setCategories] = useState([]);
    const [email, setEmail] = useState('');
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [emailError, setEmailError] = useState('');

    const goToCategories = () => {
        if (categories.length === 0) {
            // Scroll to email notification section if no categories exist
            const emailSection = document.getElementById('email-notification-section');
            if (emailSection) {
                emailSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            // Navigate to categories page if categories exist
            navigate('/categories');
        }
    };

    const loadMainMessage = async () => {

        try {

            const data = await fetchMainMessage();
            setMainMessage(data[0]);
            setCollectionData(data[1]);

        } catch (error) {
            console.error('Error fetching main message: ', error.message);
            // TODO: Show alert
        }
    };

    const fetchCategories = async () => {
        try {
            const data = await loadAllCategoriesWithProducts();
            setCategories(data.categoryList);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setEmailError('Email je obavezan.');
            return;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Unesite validnu email adresu.');
            return;
        }

        try {
            const response = await subscribeEmail(email);

            if (response.success) {
                setEmailSubmitted(true);
                setEmailError('');
                setEmail('');

                // Reset success message after 5 seconds
                setTimeout(() => {
                    setEmailSubmitted(false);
                }, 8000);
            } else {
                setEmailError(response.message || 'Email je već prijavljen.');
            }
        } catch (error) {
            console.error('Error subscribing email:', error);
            const errorMsg = getErrorMessage(error);

            // Translate backend error messages to Serbian
            if (errorMsg.includes('already subscribed')) {
                setEmailError('Email je već registrovan.');
            } else {
                setEmailError('Došlo je do greške. Pokušajte ponovo.');
            }
        }
    };

    useEffect(() => {
        loadMainMessage();
        fetchCategories();
    }, []);

    return (
        <div style={{ marginTop: collectionData && collectionData.showOnSite ? "170px" : "120px" }}>

            {collectionData && collectionData.showOnSite && (
                <div className="message-slider">
                    <div className="message-slider-text">
                        <p>
                            Nova kolekcija izlazi {collectionData.value}
                        </p>
                    </div>
                </div>
            )}

            <div className="overlay-container position-relative" style={{ paddingLeft: "5%", paddingRight: "5%" }}>
                <img
                    src="/home_banner_optimized.webp"
                    className={`cover-img ${bannerLoaded ? 'banner-fade-in' : ''}`}
                    alt="Home banner"
                    fetchpriority="high"
                    onLoad={() => setBannerLoaded(true)}>
                </img>

                <div className={`overlay-content position-absolute top-50 start-50 translate-middle text-center ${bannerLoaded ? 'banner-content-fade-in' : ''}`}>
                    <p className='text-on-cover-image'>Mugs & More</p>
                    <button className="btn-shop-now" onClick={goToCategories}>Shop now</button>
                </div>
            </div>

            <br></br>

            <Row id="id-collection" style={{ paddingLeft: "5%", paddingRight: "5%" }}>
                {mainMessage && mainMessage.showOnSite && (
                    <Col lg="12" md="12" sm="12">
                        <Card className="d-flex flex-column text-center justify-content-between main-message">
                            <Card.Body>
                                <p className="mt-3 md-5" style={{ fontSize: "18px", lineHeight: "1.8" }}>{mainMessage.value}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                )}

            </Row>

            {categories.length === 0 && (
                <Row id="email-notification-section" className="justify-content-center" style={{ paddingLeft: "5%", paddingRight: "5%", marginTop: "50px" }}>
                    <Col lg={8} md={10} sm={12}>
                        <Card className="email-notification-card">
                            <Card.Body className="text-center">
                                <h3 className="mb-4">Nova kolekcija uskoro stiže!</h3>
                                <p className="mb-4" style={{ fontSize: "16px", color: "#666" }}>
                                    Trenutno nemamo aktivnih proizvoda, ali nova kolekcija je na putu.
                                    Ostavite nam svoju email adresu i bićete prvi koji će saznati kada novi proizvodi stignu!
                                </p>

                                {emailSubmitted && (
                                    <Alert variant="success" className="mb-3">
                                        Hvala! Obavestićemo vas kada nova kolekcija bude dostupna.
                                    </Alert>
                                )}

                                <Form onSubmit={handleEmailSubmit} className="email-notification-form">
                                    <Row className="justify-content-center">
                                        <Col lg={8} md={10} sm={12}>
                                            <Form.Group className="mb-3">
                                                <Form.Control
                                                    type="email"
                                                    placeholder="Unesite vašu email adresu"
                                                    value={email}
                                                    onChange={(e) => {
                                                        setEmail(e.target.value);
                                                        setEmailError('');
                                                    }}
                                                    className={emailError ? 'is-invalid' : ''}
                                                />
                                                {emailError && (
                                                    <div className="invalid-feedback d-block">{emailError}</div>
                                                )}
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Button type="submit" className="notify-btn">
                                        Obavesti me
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}

        </div>
    )
}