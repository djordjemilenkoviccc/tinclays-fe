import { Card, Button, Row, Col, Modal, Form, Alert, Dropdown, DropdownButton } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [productsWithImages, setProductsWithImages] = useState([]);
    const navigate = useNavigate();


    const [showAdd, setShowAdd] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageType, setImageType] = useState(null);

    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [showOnSite, setShowOnSite] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            //console.log(file.type.split("/")[1]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageType(file.type.split("/")[1]);
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddClose = () => {
        setShowAdd(false);
        setShowSuccessBanner(false);
        setImagePreview(null);
    };

    const handleAddShow = () => {
        setShowAdd(true);
        setImagePreview(null);
    };

    const submitAddProduct = async () => {
        const formData = new FormData();

        const productDtoRequestBlob = new Blob(
            [JSON.stringify({
                name: name,
                categoryId: category,
                description: description,
                price: price,
                stock: stock,
                showOnSite: showOnSite,
            })],
            { type: "application/json" }
        );

        formData.append("productDtoRequest", productDtoRequestBlob);

        if (selectedImage) {
            formData.append("images", selectedImage); // Assuming `image` is the file object
        }

        const token = localStorage.getItem("jwtToken");

        try {
            const response = await fetch("http://localhost:8080/api/v1/product/addProduct", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                setShowSuccessBanner(true);
            } else {
                console.error("Failed to add product");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };



    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch('http://localhost:8080/api/v1/product/getAllProducts', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setProducts(data.products);

                } else {
                    console.error('Failed to fetch products');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch('http://localhost:8080/api/v1/category/getAllCategoriesWithIdAndNames', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    // console.log(data);
                    setCategories(data);

                } else {
                    console.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchCategories();
    }, []);


    const handleEditProduct = (product) => {
        navigate(`/admin-products/edit/${product.id}`);
    };

    return (
        <div className="align-items-center" style={{ marginTop: "40px", paddingLeft: "5%", paddingRight: "5%" }}>
            <Row className="mb-4">
                <Col className="text-center">
                    <Button variant="primary" onClick={handleAddShow}>Dodaj novi proizvod</Button>
                </Col>
            </Row>
            <Row>
                {products.map(product => (
                    <Col key={product.id} md={4} className="mb-4">
                        <Card>
                            {/* Check if imageList exists and has at least one image */}
                            {product.imageList && product.imageList.length > 0 ? (
                                <Card.Img
                                    variant="top"
                                    src={product.imageList[0].imageData.startsWith("data:image") ? product.imageList[0].imageData : `data:${product.imageList[0].mimeType};base64,${product.imageList[0].imageData}`}
                                    alt="Product image"
                                />
                            ) : (
                                <Card.Img
                                    variant="top"
                                    src="/path/to/fallback-image.jpg"
                                    alt="No product image available"
                                />
                            )}
                            <Card.Body>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Naziv: </span>{product.name}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Opis: </span>{product.description}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Kategorija: </span>{product.category.name}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Cena: </span>{product.price}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Na stanju: </span>{product.stock}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Prikaz na sajtu: </span>{product.showOnSite ? <span style={{ backgroundColor: "lightGreen" }}>Prikazan</span> : <span style={{ backgroundColor: "#FFCCCB" }}>Pauziran</span>}</Card.Text>
                            </Card.Body>
                            <Card.Footer className="text-center">
                                <Button variant="secondary" onClick={() => handleEditProduct(product)}>Izmeni</Button>{' '}
                                <Button variant="danger">Obriši</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal show={showAdd} onHide={handleAddClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Dodaj novi proizvod</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {showSuccessBanner && (
                        <Alert variant="success" onClose={() => setShowSuccessBanner(false)} dismissible>
                            Kategorija uspešno dodata!
                        </Alert>
                    )}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Naziv proizvoda</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Slika proizvoda</Form.Label>
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

                        <Form.Group className="mb-3">
                            <Form.Label>Kategorija proizvoda</Form.Label>
                            <Form.Select
                                aria-label="Izaberi kategoriju"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Izaberi kategoriju</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Opis proizvoda</Form.Label>
                            <Form.Control
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cena</Form.Label>
                            <Form.Control
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Koliko ovakvih proizvoda je na stanju</Form.Label>
                            <Form.Control
                                type="number"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Prikazi na sajtu</Form.Label>
                            <Form.Check
                                type="checkbox"
                                checked={showOnSite}
                                onChange={(e) => setShowOnSite(e.target.checked)}
                            />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleAddClose}>
                        Zatvori
                    </Button>
                    <Button variant="primary" onClick={submitAddProduct}>
                        Dodaj
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );

}
