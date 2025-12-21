import { Card, Button, Row, Col, Modal, Form, Alert } from 'react-bootstrap';
import { fetchAllCategories, addCategory, editCategory } from '../api/category-api';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth-context';
import { getImageUrl } from '../utils/image-utils';
import { getErrorMessage } from '../utils/error-handler';

export default function AdminCategories() {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedImage, setUpdatedImage] = useState(null);
    const [updatedShowOnSite, setShowOnSite] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageType, setImageType] = useState(null);


    const loadAllCategories = async () => {
        try {
            const data = await fetchAllCategories();
            setCategories(data.categoryList);

        } catch (error) {
            console.error('Error fetching categories: ', error.message);
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            }
        }
    };

    const submitAddCategory = async () => {
        // Clear previous messages
        setShowSuccessBanner(false);
        setErrorMessage(null);

        try {
            const newCategory = await addCategory(updatedName, updatedImage, updatedShowOnSite);
            // Reload categories from server to get updated data with correct structure
            await loadAllCategories();
            setShowSuccessBanner(true);

        } catch (error) {
            console.error('Failed to add category:', error.message);
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            } else {
                setErrorMessage(getErrorMessage(error));
            }
        }
    };


    const submitEditCategory = async () => {
        // Clear previous messages
        setShowSuccessBanner(false);
        setErrorMessage(null);

        try {
            const response = await editCategory(selectedCategory.id, updatedName, updatedImage, updatedShowOnSite);

            if (response) {
                // Reload categories from server to get updated data with correct structure
                await loadAllCategories();
                setShowSuccessBanner(true);
            }
        } catch (error) {
            console.error('Failed to edit category:', error.message);
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            } else {
                setErrorMessage(getErrorMessage(error));
            }
        }
    };

    const handleEditClose = () => {
        setShowEdit(false);
        setShowSuccessBanner(false);
        setErrorMessage(null);
        setUpdatedImage(null);
        setShowOnSite(false);
        setImagePreview(null);
    };

    const handleEditShow = (category) => {
        setSelectedCategory(category);
        setUpdatedName(category.name);
        setShowOnSite(category.showOnSite);
        setImagePreview(category.image ? getImageUrl(category.image.path) : null);
        setShowEdit(true);
    };

    const handleAddShow = () => {
        setShowAdd(true);
        setUpdatedName('');
        setShowOnSite(false);
        setImagePreview(null);
    };

    const handleAddClose = () => {
        setShowAdd(false);
        setShowSuccessBanner(false);
        setErrorMessage(null);
        setShowOnSite(false);
        setUpdatedImage(null);
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUpdatedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageType(file.type.split("/")[1]);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        loadAllCategories();
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="align-items-center" style={{ marginTop: "140px", paddingLeft: "5%", paddingRight: "5%" }}>
            <Row className="mb-4">
                <Col className="text-center">
                    <Button variant="primary" onClick={handleAddShow}>Dodaj novu kategoriju</Button>
                </Col>
            </Row>
            <Row className="justify-content-center">
                {categories.map((category) => (
                    <Col lg={4} md={4} sm={12} className="mb-5" key={category.id}>
                        <Card className="d-flex flex-column justify-content-between h-100" style={{ border: "1px solid black" }}>
                            <Card.Img
                                variant="top"
                                src={category.image ? getImageUrl(category.image.path) : '/path/to/default-category-image.jpg'}
                                style={{ height: '100%', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title className="text-center">{category.name}</Card.Title>
                                <Card.Text className="text-center"><span style={{ fontWeight: "bold" }}>Prikaz na sajtu: </span>{category.showOnSite ? <span style={{ backgroundColor: "lightGreen" }}>Prikazan</span> : <span style={{ backgroundColor: "#FFCCCB" }}>Pauziran</span>}</Card.Text>
                            </Card.Body>
                            <Card.Footer className="text-center">
                                <Button variant="secondary" onClick={() => handleEditShow(category)}>Izmeni</Button>{' '}
                                {/* <Button variant="danger">Obriši</Button> */}
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Edit Category Modal */}
            <Modal show={showEdit} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Izmeni kategoriju</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showSuccessBanner && (
                        <Alert variant="success" onClose={() => setShowSuccessBanner(false)} dismissible>
                            Kategorija uspešno izmenjena!
                        </Alert>
                    )}
                    {errorMessage && (
                        <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
                            {errorMessage}
                        </Alert>
                    )}
                    <Form>
                        <Form.Group className="mb-3" controlId="formCategoryName">
                            <Form.Label>Ime</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedName}
                                onChange={(e) => setUpdatedName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formCategoryImage">
                            <Form.Label>Slika</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <Card.Img
                                    variant="top"
                                    src={imagePreview}
                                    style={{ height: '100%', objectFit: 'cover' }}
                                />
                            )}
                        </Form.Group>
                        <Form.Group className='form-group' controlId="formShowOnSite">
                            <Form.Check
                                type="switch"
                                label="Prikaži na sajtu"
                                name="showOnSite"
                                checked={updatedShowOnSite}
                                onChange={(e) => setShowOnSite(e.target.checked)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleEditClose}>
                        Zatvori
                    </Button>
                    <Button variant="primary" onClick={submitEditCategory}>
                        Sačuvaj
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* Add New Category Modal */}
            <Modal show={showAdd} onHide={handleAddClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Dodaj novu kategoriju</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showSuccessBanner && (
                        <Alert variant="success" onClose={() => setShowSuccessBanner(false)} dismissible>
                            Kategorija uspešno dodata!
                        </Alert>
                    )}
                    {errorMessage && (
                        <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
                            {errorMessage}
                        </Alert>
                    )}
                    <Form>
                        <Form.Group className="mb-3" controlId="formNewCategoryName">
                            <Form.Label>Ime nove kategorije</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedName}
                                onChange={(e) => setUpdatedName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formNewCategoryImage">
                            <Form.Label>Slika nove kategorije</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <Card.Img
                                    variant="top"
                                    src={imagePreview}
                                    style={{ height: '100%', objectFit: 'cover' }}
                                />
                            )}
                        </Form.Group>
                        <Form.Group className='form-group' controlId="formNewShowOnSite">
                            <Form.Check
                                type="switch"
                                label="Prikaži na sajtu"
                                checked={updatedShowOnSite}
                                onChange={(e) => setShowOnSite(e.target.checked)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddClose}>
                        Zatvori
                    </Button>
                    <Button variant="primary" onClick={submitAddCategory}>
                        Dodaj
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
