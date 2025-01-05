import { Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export default function AdminMainPage() {
    const [mainMessage, setMainMessage] = useState("");
    const [showOnSite, setShowOnSite] = useState(true); // New state for the toggle
    const [messageSaved, setMessageSaved] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);

    // Fetch the main message and the "showOnSite" setting
    useEffect(() => {
        const fetchMainMessage = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch('http://localhost:8080/api/v1/appsettings/getMainMessage', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setMainMessage(data.value);
                    setShowOnSite(data.showOnSite);
                } else if (response.status === 403) {
                    console.warn('Unauthorized: Redirecting to login.');
                    navigate('/login');
                } else {
                    console.error('Failed to fetch main message');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchMainMessage();
    }, []);

    // Save the main message and "showOnSite" toggle state
    const handleSaveMainMessage = async () => {
        setMessageSaved(false);

        const formData = new FormData();
        formData.append('newMessage', mainMessage);
        formData.append('showOnSite', showOnSite); // Include the "showOnSite" state
        const token = localStorage.getItem('jwtToken');

        try {
            const response = await fetch('http://localhost:8080/api/v1/appsettings/setMainMessage', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                console.log('Main message updated successfully');
                setMessageSaved(true);
                setShowSuccessBanner(true);
            } else if (response.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to update main message');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

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
                                    <Button variant="dark" className="w-50 border-0 rounded-0" onClick={() => handleSaveMainMessage()}>
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
