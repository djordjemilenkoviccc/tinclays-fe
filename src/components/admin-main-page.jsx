import { Button, Row, Col, Form, Alert, Image } from 'react-bootstrap';
import { AuthContext } from './auth-context';
import { useNavigate } from 'react-router-dom';
import { fetchMainMessage, editMainMessage } from '../api/main-api';
import { uploadImage, fetchImageByType } from '../api/image-api';
import { useState, useEffect, useContext } from 'react';
import { getErrorMessage } from '../utils/error-handler';
import { getImageUrl } from '../utils/image-utils';

export default function AdminMainPage() {
    const [mainMessage, setMainMessage] = useState("");

    const [collectionDate, setCollectionDate] = useState("");
    const [showOnSiteMainMessage, setShowOnSiteMainMessage] = useState(true);
    const [showOnSiteCollectionDate, setShowOnSiteCollectionDate] = useState(true);
    const [messageSaved, setMessageSaved] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    // Image upload states
    const [bannerImage, setBannerImage] = useState(null);
    const [bannerImagePreview, setBannerImagePreview] = useState(null);
    const [aboutMeImage, setAboutMeImage] = useState(null);
    const [aboutMeImagePreview, setAboutMeImagePreview] = useState(null);

    // Current images from database
    const [currentBannerImage, setCurrentBannerImage] = useState(null);
    const [currentAboutMeImage, setCurrentAboutMeImage] = useState(null);

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

    const loadExistingImages = async () => {
        try {
            // Fetch banner image
            const bannerImageData = await fetchImageByType('home_banner');
            if (bannerImageData) {
                setCurrentBannerImage(bannerImageData);
            }

            // Fetch about-me image
            const aboutMeImageData = await fetchImageByType('about_me');
            if (aboutMeImageData) {
                setCurrentAboutMeImage(aboutMeImageData);
            }

        } catch (error) {
            console.error('Error fetching images: ', error.message);
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            }
        }
    };

    const handleBannerImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAboutMeImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAboutMeImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAboutMeImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleEditMainMessage = async () => {
        // Clear previous messages
        setMessageSaved(false);
        setShowSuccessBanner(false);
        setErrorMessage(null);

        try {
            // Update main message and collection date
            const response = await editMainMessage(mainMessage, showOnSiteMainMessage, collectionDate, showOnSiteCollectionDate);

            // Upload banner image if selected
            if (bannerImage) {
                await uploadImage(bannerImage, 'home_banner');
                console.log('Banner image uploaded successfully');
            }

            // Upload about-me image if selected
            if (aboutMeImage) {
                await uploadImage(aboutMeImage, 'about_me');
                console.log('About-me image uploaded successfully');
            }

            if (response) {
                console.log('Main message updated successfully');
                setMessageSaved(true);
                setShowSuccessBanner(true);
                // Clear selected images after successful upload
                setBannerImage(null);
                setBannerImagePreview(null);
                setAboutMeImage(null);
                setAboutMeImagePreview(null);
                // Reload images from database to show newly uploaded images
                await loadExistingImages();
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
        loadExistingImages();
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

                        <br></br>
                        <Form.Group as={Row}>
                            <h3>Postavi sliku za baner</h3>
                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleBannerImageChange}
                            />
                            {bannerImagePreview ? (
                                <div className="mt-3">
                                    <p className="text-muted small">Nova slika (nije sačuvana):</p>
                                    <Image
                                        src={bannerImagePreview}
                                        alt="Banner preview"
                                        fluid
                                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                                    />
                                </div>
                            ) : currentBannerImage ? (
                                <div className="mt-3">
                                    <p className="text-muted small">Trenutna slika:</p>
                                    <Image
                                        src={getImageUrl(currentBannerImage.path)}
                                        alt="Current banner"
                                        fluid
                                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                                    />
                                </div>
                            ) : (
                                <p className="text-muted small mt-2">Nema slike za baner</p>
                            )}
                        </Form.Group>

                        <br></br>
                        <Form.Group as={Row}>
                            <h3>Postavi sliku za O meni sekciju</h3>
                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleAboutMeImageChange}
                            />
                            {aboutMeImagePreview ? (
                                <div className="mt-3">
                                    <p className="text-muted small">Nova slika (nije sačuvana):</p>
                                    <Image
                                        src={aboutMeImagePreview}
                                        alt="About me preview"
                                        fluid
                                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                                    />
                                </div>
                            ) : currentAboutMeImage ? (
                                <div className="mt-3">
                                    <p className="text-muted small">Trenutna slika:</p>
                                    <Image
                                        src={getImageUrl(currentAboutMeImage.path)}
                                        alt="Current about me"
                                        fluid
                                        style={{ maxHeight: '200px', objectFit: 'contain' }}
                                    />
                                </div>
                            ) : (
                                <p className="text-muted small mt-2">Nema slike za O meni sekciju</p>
                            )}
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
