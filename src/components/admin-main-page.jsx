import { Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { AuthContext } from './auth-context';
import { useNavigate } from 'react-router-dom';
import { fetchMainMessage, editMainMessage } from '../api/main-api';
import { useState, useEffect, useContext } from 'react';

export default function AdminMainPage() {
    const [mainMessage, setMainMessage] = useState("");
    const [showOnSite, setShowOnSite] = useState(true);
    const [messageSaved, setMessageSaved] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const loadMainMessage = async () => {
        try {

            const data = await fetchMainMessage();
            setMainMessage(data.value);
            setShowOnSite(data.showOnSite);
        } catch (error) {

            console.error('Error fetching main message: ', error.message);
            // TODO: Show alert
        }
    };

    const handleEditMainMessage = async () => {
        setMessageSaved(false);

        try {
            const response = await editMainMessage(mainMessage, showOnSite);

            if (response) {
                console.log('Main message updated successfully');
                setMessageSaved(true);
                setShowSuccessBanner(true);
            }
        } catch (error) {

            if (error.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to edit main message:', error.message);
                // TODO: Show alert
            }
        }
    };

    useEffect(() => {

        loadMainMessage();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="align-items-center" style={{ marginTop: "140px", paddingLeft: "5%", paddingRight: "5%" }}>
            <Row id="contactForm" className="justify-content-center align-items-center mt-3 contact-div">
                <Col lg="8" md="10" sm="12" className="d-flex justify-content-center align-items-center w-100">
                    <Form action="#" method="post" className="w-100">
                        <Form.Group as={Row}>
                            <h3>Napiši poruku na početnoj stranici</h3>
                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Control
                                as="textarea"
                                name="message"
                                rows={4}
                                placeholder="Poruka"
                                value={mainMessage}
                                onChange={(e) => setMainMessage(e.target.value)}
                                required
                                maxLength="600"
                            />
                        </Form.Group>
                        {/* Toggle for "Show on Site" */}
                        <Form.Group className="mt-3 d-flex align-items-center">
                            <Form.Check
                                type="switch"
                                id="show-on-site-switch"
                                label="Prikaži na početnoj stranici"
                                checked={showOnSite}
                                onChange={(e) => setShowOnSite(e.target.checked)}
                            />
                        </Form.Group>
                        <Form.Group as={Row} className="mt-4">
                            <Col lg={12}>
                                {messageSaved && (
                                    <Alert variant="success" onClose={() => setShowSuccessBanner(false)} dismissible>
                                        Uspešno sačuvana poruka
                                    </Alert>
                                )}
                                <div className="d-flex justify-content-center align-items-center">
                                    <Button variant="dark" className="w-50 border-0 rounded-0" onClick={() => handleEditMainMessage()}>
                                        Sačuvaj
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
