import { Card, Button, Row, Col, Modal, Form, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export default function AdminCategories() {

    const [categories, setCategories] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedImage, setUpdatedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageType, setImageType] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch('http://localhost:8080/api/v1/category/getAllCategories', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
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

    const submitAddCategory = async () => {
        const formData = new FormData();
        formData.append('name', updatedName);
        formData.append('image', updatedImage);

        const token = localStorage.getItem('jwtToken');

        try {
            const response = await fetch('http://localhost:8080/api/v1/category/addCategory', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const newCategory = await response.json();
                setCategories([...categories, newCategory]);
                setShowSuccessBanner(true);
            } else {
                console.error('Failed to add category');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const submitEditCategory = async () => {
        const formData = new FormData();
        formData.append('id', selectedCategory.id);
        formData.append('name', updatedName);
        formData.append('image', updatedImage);

        const token = localStorage.getItem('jwtToken');

        try {
            const response = await fetch('http://localhost:8080/api/v1/category/updateCategory', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                setCategories(categories.map(cat =>
                    cat.id === selectedCategory.id ? { ...cat, name: updatedName, image: imagePreview } : cat
                ));
                setShowSuccessBanner(true); // Show success banner
            } else {
                console.error('Failed to update category');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleEditClose = () => {
        setShowEdit(false);
        setShowSuccessBanner(false);
        setUpdatedImage(null);
        setImagePreview(null);
    };

    const handleEditShow = (category) => {
        setSelectedCategory(category);
        setUpdatedName(category.name);
        setImagePreview(category.image);
        setShowEdit(true);
    };

    const handleAddShow = () => {
        setShowAdd(true);
        setUpdatedName('');
        setImagePreview(null);
    };

    const handleAddClose = () => {
        setShowAdd(false);
        setShowSuccessBanner(false);
        setUpdatedImage(null);
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUpdatedImage(file);
            //console.log(file.type.split("/")[1]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageType(file.type.split("/")[1]);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };



    return (
        <div className="align-items-center" style={{ marginTop: "40px", paddingLeft: "5%", paddingRight: "5%" }}>
            <Row className="mb-4">
                <Col className="text-center">
                    <Button variant="primary" onClick={handleAddShow}>Dodaj novu kategoriju</Button>
                </Col>
            </Row>
            <Row lg={12} md={12} sm={12} className="justify-content-center">
                {categories.map((category) => (
                    <Col lg={6} md={12} sm={12} className="mb-5" key={category.id}>
                        <Card className="d-flex flex-column justify-content-between h-100" style={{ border: "1px solid black" }}>
                            <Card.Img
                                variant="top"
                                src={category.image.startsWith("data:image") ? category.image : `data:${category.mimeType};base64,${category.image}`}
                                style={{ height: '100%', objectFit: 'cover' }}
                            />
                            <Card.Body>
                                <Card.Title className="text-center">{category.name}</Card.Title>
                            </Card.Body>
                            <Card.Footer className="text-center">
                                <Button variant="secondary" onClick={() => handleEditShow(category)}>Izmeni</Button>{' '}
                                <Button variant="danger">Obriši</Button>
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
