import { Card, Button, Row, Col, Modal, Form, Alert } from 'react-bootstrap';
import { fetchAllCategories, addCategory, editCategory } from '../api/category-api';
import { useState, useEffect } from 'react';
import { getImageUrl } from '../utils/image-utils';

export default function AdminCategories() {

    const [categories, setCategories] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
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

            if (error.status === 403) {
                navigate('/login');
            } else {
                console.error('Error fetching categories: ', error.message);
                // TODO: Show alert
            }
        }
    };

    const submitAddCategory = async () => {

        try {
            const newCategory = await addCategory(updatedName, updatedImage, updatedShowOnSite);
            setCategories([...categories, newCategory]);
            setShowSuccessBanner(true);

        } catch (error) {

            if (error.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to add category:', error.message);
                // TODO: Show alert
            }
        }
    };


    const submitEditCategory = async () => {

        try {
            const response = await editCategory(selectedCategory.id, updatedName, updatedImage, updatedShowOnSite);
            
            if (response) {
                setCategories(categories.map(cat =>
                    cat.id === selectedCategory.id ? { ...cat, name: updatedName, image: imagePreview, showOnSite: updatedShowOnSite } : cat
                ));
                setShowSuccessBanner(true);
            }
        } catch (error) {

            if (error.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to edit category:', error.message);
                // TODO: Show alert
            }
        }
    };

    const handleEditClose = () => {
        setShowEdit(false);
        setShowSuccessBanner(false);
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
                    <Form>
                        <Form.Group className="mb-3" controlId="formCategoryName">
                            <Form.Label>Ime</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedName}
                                onChange={(e) => setUpdatedName(e.target.value)}
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
                                    src={imagePreview.startsWith("data:image") ? imagePreview : `data:${imageType};base64,${imagePreview}`}
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
                    <Form>
                        <Form.Group className="mb-3" controlId="formNewCategoryName">
                            <Form.Label>Ime nove kategorije</Form.Label>
                            <Form.Control
                                type="text"
                                value={updatedName}
                                onChange={(e) => setUpdatedName(e.target.value)}
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
                                    src={imagePreview.startsWith("data:image") ? imagePreview : `data:${imageType};base64,${imagePreview}`}
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
