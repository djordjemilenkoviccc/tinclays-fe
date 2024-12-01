import '../style/home.css';

import { Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Home() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/v1/category/getAllCategoriesWithProducts', {
                    method: 'GET'
                });

                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categoryList);
                } else {
                    console.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className='home-root'>

            <div className="overlay-container position-relative">
                <img
                    src="https://static.wixstatic.com/media/d01231e46af34161be7ad101d281a441.jpg/v1/fill/w_1960,h_1478,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/d01231e46af34161be7ad101d281a441.jpg"
                    className='cover-img'
                    fetchpriority="high">
                </img>

                <div className="overlay-content position-absolute top-50 start-50 translate-middle text-center">
                    <p className='text-on-cover-image'>Mugs and More</p>
                    <button className="btn-shop-now" onClick={scrollToCollection}>Shop now</button>
                </div>
            </div>

            <br></br>
            
            <Row id="id-collection">
                <Col lg="12" md="12" sm="12">
                    <Card className="d-flex flex-column justify-content-between h-100">
                        <Card.Body>
                            <p className="mt-3 md-5" style={{ textAlign: "center", fontSize: "18px", lineHeight: "1.8" }}>Šolje ce biti na stanju 12.12.2024.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row className='collection-paragraph'>
                <Col lg="12" md="12" sm="12">
                </Col>
            </Row>

            <Row className="justify-content-center">
                {categories.map((category) => (
                    <Col lg={4} md={4} sm={12} className="mb-5" key={category.id} onClick={() => handleCardClick(category.id)}>
                        <Card className="d-flex flex-column justify-content-between h-100 category-card">
                            <div>
                                <Card.Img
                                    className='product-image'
                                    variant="top"
                                    src={category.image.startsWith("data:image") ? category.image : `data:${category.mimeType};base64,${category.image}`}
                                />
                            </div>
                            <Card.Body>
                                <Card.Title className="text-center">{category.name}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}

            </Row>

            {/* <Row>
                <Col lg="6" md="6" sm="12" className='text-center category-card' onClick={() => handleCardClick(1)}>
                    <img src="https://static.wixstatic.com/media/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg/v1/fill/w_1036,h_690,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg"
                        alt="I'm a product"
                        className='product-image'
                        fetchpriority="high">
                    </img>
                    <p>Rucno radjene solje sa spiralnom ruckom</p>
                </Col>

                <Col lg="6" md="6" sm="12" className='text-center category-card'>
                    <img src="https://static.wixstatic.com/media/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg/v1/fill/w_1036,h_690,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg"
                        alt="I'm a product"
                        className='product-image'
                        fetchpriority="high">
                    </img>
                    <p>Rucno radjene solje sa ravnom ruckom</p>
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col lg="6" md="6" sm="12" className='text-center category-card'>
                    <img src="https://static.wixstatic.com/media/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg/v1/fill/w_1036,h_690,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg"
                        alt="I'm a product"
                        className='product-image'
                        fetchpriority="high">
                    </img>
                    <p>TO-GO solje</p>
                </Col>

                <Col lg="6" md="6" sm="12" className='text-center category-card'>
                    <img src="https://static.wixstatic.com/media/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg/v1/fill/w_1036,h_690,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg"
                        alt="I'm a product"
                        className='product-image'
                        fetchpriority="high">
                    </img>
                    <p>Ostalo</p>
                </Col>
            </Row> */}


        </div>
    )
}