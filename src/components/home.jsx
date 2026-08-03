import '../style/home.css';

import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchMainMessage } from '../api/main-api.jsx';
import { useState, useEffect } from 'react';


export default function Home() {
    const navigate = useNavigate();
    const [mainMessage, setMainMessage] = useState(null);
    const [collectionData, setCollectionData] = useState(null);
    const [bannerLoaded, setBannerLoaded] = useState(false);

    const goToCategories = () => {
        navigate('/categories');
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

    useEffect(() => {
        loadMainMessage();
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
                    <p className='text-on-cover-image'>Mugs<br></br>&<br></br>More</p>
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

        </div>
    )
}
