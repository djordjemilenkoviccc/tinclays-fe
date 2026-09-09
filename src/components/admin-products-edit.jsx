import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './auth-context';
import { loadAllCategoriesWithIdAndNames } from '../api/category-api';
import { fetchProductById, updateProduct } from '../api/product-api';
import { Form, Button, Row, Col, Image, Alert, Card } from 'react-bootstrap';
import { getImageUrl } from '../utils/image-utils';
import { getCustomProductDesigns, isCustomProduct } from '../utils/custom-product';
import { getErrorMessage } from '../utils/error-handler';
import '../style/admin-products-edit.css';

export default function AdminProductsEdit() {
    const { id } = useParams();
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        showOnSite: false,
        categoryId: '',
        imageList: [],
    });

    const [selectedImage, setSelectedImage] = useState(null);
    const [showSuccessBanner, setShowSuccessBanner] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageType, setImageType] = useState(null);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Custom made products: the designs already stored, plus the ones being added
    const [customMade, setCustomMade] = useState(false);
    const [existingDesigns, setExistingDesigns] = useState([]);
    const [newDesigns, setNewDesigns] = useState([]);

    const fetchCategoriesWithIdAndNames = async () => {
        try {
            const data = await loadAllCategoriesWithIdAndNames();
            setCategories(data);
        } catch (error) {
            console.error('Error:', error);
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            }
        }
    };

    const fetchProduct = async () => {
        try {
            const data = await fetchProductById(id);
            const fetchedProduct = data.product;
            setProduct(fetchedProduct);
            setCategory(fetchedProduct.category.id);
            const image = fetchedProduct.imageList?.[0];
            if (image) {
                setImagePreview(image.imageData);
                setImageType(image.mimeType);
            }

            setCustomMade(isCustomProduct(fetchedProduct));
            setExistingDesigns(getCustomProductDesigns(fetchedProduct));
            setNewDesigns([]);

        } catch (error) {
            console.error('Error fetching product:', error);
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            }
        }
    };



    const handleUpdateProduct = async () => {
        // Clear previous messages
        setShowSuccessBanner(false);
        setErrorMessage(null);
        setIsSubmitting(true);

        const formData = new FormData();

        const productDtoRequestBlob = new Blob(
            [JSON.stringify({
                id: product.id,
                name: product.name,
                description: product.description,
                categoryId: category,
                price: product.price,
                stock: product.stock,
                archived: false,
                showOnSite: product.showOnSite,
                customMade: customMade,
                // The designs left in the list survive; the rest are removed
                keptDesignIds: customMade ? existingDesigns.map((design) => design.id) : [],
                keptDesignNames: customMade ? existingDesigns.map((design) => design.name) : [],
                designNames: customMade ? newDesigns.map((design) => design.name) : null,
            })],
            { type: "application/json" }
        );

        formData.append("productDtoRequest", productDtoRequestBlob);

        if (selectedImage) {
            formData.append("images", selectedImage);
        }

        if (customMade) {
            newDesigns.forEach((design) => formData.append("designImages", design.file));
        }

        try {
            const response = await updateProduct(formData);
            // Reload product from server to get updated data with correct structure
            await fetchProduct();
            setShowSuccessBanner(true);
            setSelectedImage(null);
            setIsSubmitting(false);

        } catch (error) {
            console.error('Error update product:', error);
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            } else {
                setErrorMessage(getErrorMessage(error));
                setIsSubmitting(false); // Re-enable button only on error
            }
        }
    };

    // The file goes to the backend, the data URL is only the preview on this page
    const handleNewDesignsChange = async (e) => {
        const files = Array.from(e.target.files ?? []);
        if (files.length === 0) return;

        try {
            const added = await Promise.all(files.map(async (file, index) => {
                const image = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });

                return {
                    file,
                    image,
                    name: `Dizajn ${existingDesigns.length + newDesigns.length + index + 1}`
                };
            }));

            setNewDesigns((prev) => [...prev, ...added]);
        } catch (error) {
            console.error('Error reading design images:', error);
            setErrorMessage('Greška pri obradi slika dizajna, pokušajte ponovo.');
        }

        e.target.value = '';
    };

    // Removing an existing design only drops it from the list sent on save, so the
    // change can still be abandoned by leaving the page
    const handleRemoveExistingDesign = (designId) => {
        setExistingDesigns((prev) => prev.filter((design) => design.id !== designId));
    };

    const handleExistingDesignNameChange = (designId, value) => {
        setExistingDesigns((prev) => prev.map((design) => (
            design.id === designId ? { ...design, name: value } : design
        )));
    };

    const handleRemoveNewDesign = (index) => {
        setNewDesigns((prev) => prev.filter((_, i) => i !== index));
    };

    const handleNewDesignNameChange = (index, value) => {
        setNewDesigns((prev) => prev.map((design, i) => (
            i === index ? { ...design, name: value } : design
        )));
    };

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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    useEffect(() => {
        fetchProduct();
        fetchCategoriesWithIdAndNames();
        setIsSubmitting(false); // Reset button state when loading/navigating to product
    }, [id]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return (
        product ? (
            <Row className="justify-content-center" style={{ marginTop: "140px", paddingRight: "10%", paddingLeft: "10%" }}>
                <Col md={6} lg={6}>
                    <Form>
                        <Form.Group controlId="formProductImage">
                            {imagePreview ? (
                                <Image
                                    src={imagePreview}
                                    alt="New Product" fluid style={{ marginBottom: "10px" }}
                                />
                            ) : product.imageList[0] ? (
                                <Image
                                    src={getImageUrl(product.imageList[0].path)}
                                    alt="Product" fluid style={{ marginBottom: "10px" }}
                                />
                            ) : (
                                <p>No image available</p>
                            )}
                            <Form.Control
                                type="file"
                                onChange={handleImageChange}
                            />
                        </Form.Group>

                        <Form.Group className='form-group'>
                            <Form.Label className="form-title">Naziv proizvoda</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="form-group">
                            <Form.Label className="form-title">Kategorija proizvoda</Form.Label>
                            <Form.Select
                                aria-label="Izaberi kategoriju"
                                value={category || (product.category?.id || "")}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className='form-group'>
                            <Form.Label className="form-title">Opis proizvoda</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={product.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className='form-group'>
                            <Form.Label className="form-title">Cena</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={product.price}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className='form-group'>
                            <Form.Label className="form-title">Broj na stanju</Form.Label>
                            <Form.Control
                                type="number"
                                name="stock"
                                value={product.stock}
                                onChange={handleInputChange}
                                min="0"
                            />
                        </Form.Group>

                        <Form.Group className='form-group'>
                            <Form.Check
                                type="switch"
                                label="Prikaži na sajtu"
                                name="showOnSite"
                                checked={product.showOnSite}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className='form-group'>
                            <Form.Check
                                type="switch"
                                label="Custom made proizvod (kupac bira dizajn i tekst)"
                                checked={customMade}
                                onChange={(e) => setCustomMade(e.target.checked)}
                            />
                        </Form.Group>

                        {customMade && (
                            <Form.Group className='form-group'>
                                <Form.Label className="form-title">Slike dizajna</Form.Label>

                                {existingDesigns.length === 0 && newDesigns.length === 0 && (
                                    <p className="text-muted" style={{ fontSize: "14px" }}>
                                        Nema dizajna. Dodajte najmanje jedan pre čuvanja.
                                    </p>
                                )}

                                <Row className="g-3">
                                    {existingDesigns.map((design) => (
                                        <Col xs={6} sm={4} key={design.id}>
                                            <Card>
                                                <Card.Img
                                                    variant="top"
                                                    src={design.imageUrl}
                                                    style={{ aspectRatio: '1', objectFit: 'cover' }}
                                                />
                                                <Card.Body className="p-2">
                                                    <Form.Control
                                                        size="sm"
                                                        type="text"
                                                        value={design.name}
                                                        onChange={(e) => handleExistingDesignNameChange(design.id, e.target.value)}
                                                    />
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        className="w-100 mt-2"
                                                        onClick={() => handleRemoveExistingDesign(design.id)}
                                                    >
                                                        Ukloni
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}

                                    {newDesigns.map((design, index) => (
                                        <Col xs={6} sm={4} key={`new-design-${index}`}>
                                            <Card border="primary">
                                                <Card.Img
                                                    variant="top"
                                                    src={design.image}
                                                    style={{ aspectRatio: '1', objectFit: 'cover' }}
                                                />
                                                <Card.Body className="p-2">
                                                    <Form.Control
                                                        size="sm"
                                                        type="text"
                                                        value={design.name}
                                                        onChange={(e) => handleNewDesignNameChange(index, e.target.value)}
                                                    />
                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        className="w-100 mt-2"
                                                        onClick={() => handleRemoveNewDesign(index)}
                                                    >
                                                        Ukloni
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                                <Form.Control
                                    className="mt-3"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleNewDesignsChange}
                                />
                                <Form.Text className="text-muted">
                                    Uklonjeni dizajni se brišu tek kada sačuvate proizvod.
                                </Form.Text>
                            </Form.Group>
                        )}

                        <Button style={{ marginTop: "20px" }} variant="primary" className="w-100" onClick={handleUpdateProduct} disabled={isSubmitting}>
                            {isSubmitting ? 'Ažuriranje...' : 'Ažuriraj proizvod'}
                        </Button>

                        {showSuccessBanner && (
                            <Alert variant="success" onClose={() => setShowSuccessBanner(false)} dismissible style={{ marginTop: "20px" }}>
                                Proizvod uspešno izmenjen!
                            </Alert>
                        )}
                        {errorMessage && (
                            <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible style={{ marginTop: "20px" }}>
                                {errorMessage}
                            </Alert>
                        )}
                    </Form>
                </Col>
            </Row>
        ) : (
            <p>Loading product details...</p>
        )
    );
}
