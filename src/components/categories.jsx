import '../style/categories.css';
import '../style/home.css';

import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadAllCategoriesWithProducts } from '../api/category-api';
import { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/image-utils';
import EmailNotificationForm from './email-notification-form';

export default function Categories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleCardClick = (id) => {
        sessionStorage.setItem('scrollPosition', window.scrollY);
        navigate(`/products/${id}`, { state: { restoreScroll: true } });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const fetchCategories = async () => {
        try {
            const data = await loadAllCategoriesWithProducts();
            setCategories(data.categoryList ?? []);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    if (!loading && categories.length === 0) {
        return (
            <div className="categories-page">
                <Row className="justify-content-center" style={{ marginTop: "50px" }}>
                    <Col lg={8} md={10} sm={12}>
                        <Card className="email-notification-card">
                            <Card.Body className="text-center">
                                <h3 className="mb-4">Nova kolekcija uskoro stiže!</h3>
                                <p className="mb-4" style={{ fontSize: "16px", color: "#666" }}>
                                    Trenutno nemamo aktivnih proizvoda, ali nova kolekcija je na putu.
                                    Ostavite nam svoju email adresu i bićete prvi koji će saznati kada novi proizvodi stignu!
                                </p>
                                <EmailNotificationForm />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }

    return (
        <div className="categories-page">

            <Row className="justify-content-center categories-grid">
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
    );
}
