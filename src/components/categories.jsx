import '../style/categories.css';

import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadAllCategoriesWithProducts } from '../api/category-api';
import { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/image-utils';

export default function Categories() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    const handleCardClick = (id) => {
        sessionStorage.setItem('scrollPosition', window.scrollY);
        navigate(`/products/${id}`, { state: { restoreScroll: true } });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const fetchCategories = async () => {
        try {
            const data = await loadAllCategoriesWithProducts();
            setCategories(data.categoryList);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

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
