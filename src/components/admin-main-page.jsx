import { Button, Row, Col, Form, Alert } from 'react-bootstrap';
import { AuthContext } from './auth-context';
import { useNavigate } from 'react-router-dom';
import { fetchMainMessage, editMainMessage } from '../api/main-api';
import { useState, useEffect, useContext } from 'react';
import { getErrorMessage } from '../utils/error-handler';

export default function AdminMainPage() {
    const [mainMessage, setMainMessage] = useState("");

    const [collectionDate, setCollectionDate] = useState("");
    const [showOnSiteMainMessage, setShowOnSiteMainMessage] = useState(true);
    const [showOnSiteCollectionDate, setShowOnSiteCollectionDate] = useState(true);
    const [messageSaved, setMessageSaved] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const loadMainMessage = async () => {
        try {

            const data = await fetchMainMessage();
            setMainMessage(data[0].value);
            setShowOnSiteMainMessage(data[0].showOnSite);
            setCollectionDate(data[1].value);
            setShowOnSiteCollectionDate(data[1].showOnSite);

        } catch (error) {

            console.error('Error fetching main message: ', error.message);
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            }
            // TODO: Show alert
        }
    };

    const handleEditMainMessage = async () => {
        // Clear previous messages
        setMessageSaved(false);
        setShowSuccessBanner(false);
        setErrorMessage(null);

        try {
            const response = await editMainMessage(mainMessage, showOnSiteMainMessage, collectionDate, showOnSiteCollectionDate);

            if (response) {
                console.log('Main message updated successfully');
                setMessageSaved(true);
                setShowSuccessBanner(true);
            }
        } catch (error) {
            console.error('Failed to edit main message:', error.message);
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            } else {
                setErrorMessage(getErrorMessage(error));
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
                                checked={showOnSiteMainMessage}
                                onChange={(e) => setShowOnSiteMainMessage(e.target.checked)}
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Group as={Row}>
                            <h3>Upisi datum kad izlazi nova kolekcija</h3>
                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Control
                                type="text"
                                name="collection_arrive"
                                onChange={(e) => setCollectionDate(e.target.value)}
                                value={collectionDate}
                                required
                            />
                        </Form.Group>
                        {/* Toggle for "Show on Site" */}
                        <Form.Group className="mt-3 d-flex align-items-center">
                            <Form.Check
                                type="switch"
                                id="show-on-site-switch"
                                label="Prikaži na početnoj stranici"
                                checked={showOnSiteCollectionDate}
                                onChange={(e) => setShowOnSiteCollectionDate(e.target.checked)}
                            />
                        </Form.Group>
                        <Form.Group as={Row} className="mt-4">
                            <Col lg={12}>
                                {messageSaved && (
                                    <Alert variant="success" onClose={() => setShowSuccessBanner(false)} dismissible>
                                        Uspešno sačuvane promene
                                    </Alert>
                                )}
                                {errorMessage && (
                                    <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
                                        {errorMessage}
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
