import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from './auth-context';
import { loadAllCategoriesWithIdAndNames } from '../api/category-api';
import { fetchProductById, updateProduct } from '../api/product-api';
import { Form, Button, Row, Col, Image, Alert } from 'react-bootstrap';
import { getImageUrl } from '../utils/image-utils';
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
            })],
            { type: "application/json" }
        );

        formData.append("productDtoRequest", productDtoRequestBlob);

        if (selectedImage) {
            formData.append("images", selectedImage);
        }

        try {
            const response = await updateProduct(formData);
            // Reload product from server to get updated data with correct structure
            await fetchProduct();
            setShowSuccessBanner(true);
            // Clear the selected image after successful update
            setSelectedImage(null);

        } catch (error) {
            console.error('Error update product:', error);
            if (error.status === 401 || error.status === 403) {
                navigate('/login');
            } else {
                setErrorMessage(getErrorMessage(error));
            }
        }
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

                        {showSuccessBanner && (
                            <Alert variant="success" onClose={() => setShowSuccessBanner(false)} dismissible>
                                Proizvod uspešno izmenjen!
                            </Alert>
                        )}
                        {errorMessage && (
                            <Alert variant="danger" onClose={() => setErrorMessage(null)} dismissible>
                                {errorMessage}
                            </Alert>
                        )}

                        <Button style={{ marginTop: "20px" }} variant="primary" className="w-100" onClick={handleUpdateProduct}>
                            Ažuriraj proizvod
                        </Button>
                    </Form>
                </Col>
            </Row>
        ) : (
            <p>Loading product details...</p>
        )
    );
}
