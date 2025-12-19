import '../style/home.css';

import { Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchMainMessage } from '../api/main-api';
import { loadAllCategoriesWithProducts } from '../api/category-api';
import { useState, useEffect, useRef } from 'react';
import Snowfall from 'react-snowfall';
import { getImageUrl } from '../utils/image-utils';
export default function Home() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [mainMessage, setMainMessage] = useState(null);
    const [collectionData, setCollectionData] = useState(null);

    const handleCardClick = (id) => {
        sessionStorage.setItem('scrollPosition', window.scrollY);
        navigate(`/products/${id}`, { state: { restoreScroll: true } });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToCollection = () => {
        const collectionElement = document.getElementById('id-collection');
        if (collectionElement) {
            collectionElement.scrollIntoView({ behavior: 'smooth' });
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
            // TODO: Show alert
        }
    };

    useEffect(() => {

        fetchCategories();
        loadMainMessage();
    }, []);

    const textRef = useRef(null);


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
                    src="/home.jpg"
                    className='cover-img'
                    fetchpriority="high">
                </img>

                <div className="overlay-content position-absolute top-50 start-50 translate-middle text-center">
                    <p className='text-on-cover-image'>Mugs & More</p>
                    <button className="btn-shop-now" onClick={scrollToCollection}>Shop now</button>
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

            <Row className='collection-paragraph'>
                <Col lg="12" md="12" sm="12">
                </Col>
            </Row>

            <Row className="justify-content-center" style={{ paddingLeft: "5%", paddingRight: "5%" }}>
                {categories.map((category) => (
                    <Col lg={4} md={4} sm={12} className="mb-5" key={category.id} onClick={() => handleCardClick(category.id)}>
                        <Card className="d-flex flex-column justify-content-between h-100 category-card">
                            <div>
                                <Card.Img
                                    className='product-image'
                                    variant="top"
                                    src={category.image ? getImageUrl(category.image.path) : '/path/to/default-category-image.jpg'}
                                />
                            </div>
                            <Card.Body>
                                <Card.Title className="text-center">{category.name}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}

            </Row>

        </div>
    )
}