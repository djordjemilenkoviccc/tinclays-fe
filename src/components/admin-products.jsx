import { Card, Button, Row, Col, Modal, Form, Alert, Dropdown, DropdownButton } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct, loadAllProducts, archiveProduct } from '../api/product-api';
import { loadAllCategoriesWithIdAndNames } from '../api/category-api';
import { getImageUrl } from '../utils/image-utils';

export default function AdminProducts() {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();


    const [showAdd, setShowAdd] = useState(false);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageType, setImageType] = useState(null);

    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [showOnSite, setShowOnSite] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
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
                archived: false
            })],
            { type: "application/json" }
        );

        formData.append("productDtoRequest", productDtoRequestBlob);

        if (selectedImage) {
            formData.append("images", selectedImage);
        }

        try {
            const response = await addProduct(formData);
            setShowSuccessBanner(true);
            // TODO: Fix this (Image not loading in newProduct)
            // const newProduct = await response.json();
            // setProducts([...products, newProduct]);

        } catch (error) {
            console.error('Error add product:', error);
            if (error.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to fetch categories: ', error.message);
                // TODO: Show alert
            }
        }
    };

    const fetchAllProducts = async () => {
        try {

            const data = await loadAllProducts();

            setProducts(data.products);
            setFilteredProducts(data.products);

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const fetchCategories = async () => {
        try {

            const data = await loadAllCategoriesWithIdAndNames();
            setCategories(data);
        } catch (error) {
            console.error('Error:', error);
            if (error.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to fetch categories: ', error.message);
                // TODO: Show alert
            }
        }
    };

    // This is because we Add new Product modal
    useEffect(() => {

        fetchCategories();
    }, []);


    const handleEditProduct = (product) => {
        navigate(`/admin-products/edit/${product.id}`);
    };

    const handleArchiveProduct = async (product) => {
        const formData = new FormData();
        formData.append('productId', product.id);

        try {
            const response = await archiveProduct(formData);

            alert('Proizvod uspesno arhiviran');
            setProducts((prevProducts) => {
                const updatedProducts = prevProducts.filter((p) => p.id !== product.id);
                console.log("filtered: " + updatedProducts);
                console.log("sel. cat: " + selectedCategory);
                
                if (selectedCategory === '' || selectedCategory === null) {
                    setFilteredProducts(updatedProducts);
                } else {
                    setFilteredProducts(updatedProducts.filter((p) => p.category.id === selectedCategory));
                }

                return updatedProducts;
            });

        } catch (error) {

            console.error('Error:', error);
            if (error.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to archive product: ', error);
                alert(`${error.message}`);
            }
        }
    };

    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        if (categoryId === null) {
            setFilteredProducts(products); // Reset to show all products
        } else {
            const filtered = products.filter(product => product.category.id === categoryId);
            setFilteredProducts(filtered);
        }
    };

    useEffect(() => {

        fetchAllProducts();
    }, []);

    return (
        <div className="align-items-center" style={{ marginTop: "140px", paddingLeft: "5%", paddingRight: "5%" }}>
            <Row className="mb-4">
                <Col className="text-center">
                    <Button variant="primary" onClick={handleAddShow}>Dodaj novi proizvod</Button>
                </Col>
            </Row>
            {/* Filter Section */}
            <Row className="mb-4">
                <Col>
                    <DropdownButton
                        id="category-filter-dropdown"
                        title={selectedCategory ? categories.find(cat => cat.id === selectedCategory)?.name : 'Filter po kategoriji'}
                        onSelect={(e) => handleCategorySelect(e ? parseInt(e) : null)}
                    >
                        <Dropdown.Item eventKey={null}>Show All</Dropdown.Item>
                        {categories.map(category => (
                            <Dropdown.Item key={category.id} eventKey={category.id}>
                                {category.name}
                            </Dropdown.Item>
                        ))}
                    </DropdownButton>
                </Col>
            </Row>
            <Row>
                {filteredProducts.map(product => (
                    <Col key={product.id} md={4} className="mb-4">
                        <Card>
                            {/* Check if imageList exists and has at least one image */}
                            {product.imageList && product.imageList.length > 0 ? (
                                <Card.Img
                                    variant="top"
                                    src={getImageUrl(product.imageList[0].path)}
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
                                <Card.Text><span style={{ fontWeight: "bold" }}>ID: </span>{product.id}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Naziv: </span>{product.name}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Opis: </span>{product.description}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Kategorija: </span>{product.category.name}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Cena: </span>{product.price}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Na stanju: </span>{product.stock}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Prikaz na sajtu: </span>{product.showOnSite ? <span style={{ backgroundColor: "lightGreen" }}>Prikazan</span> : <span style={{ backgroundColor: "#FFCCCB" }}>Pauziran</span>}</Card.Text>
                            </Card.Body>
                            <Card.Footer className="text-center">
                                <Button variant="secondary" onClick={() => handleEditProduct(product)}>Izmeni</Button>{' '}
                                <Button variant="danger" onClick={() => handleArchiveProduct(product)}>Arhiviraj</Button>
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

                        {showSuccessBanner && (
                            <Alert variant="success" onClose={() => setShowSuccessBanner(false)} dismissible>
                                Proizvod uspešn dodat!
                            </Alert>
                        )}

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
