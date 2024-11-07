import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Form, Button, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios';
import '../style/admin-products-edit.css';

export default function AdminProductsEdit() {

    const { id } = useParams();
    const [product, setProduct] = useState([]);

    const [selectedImage, setSelectedImage] = useState(null);

    const [imagePreview, setImagePreview] = useState(null);
    const [imageType, setImageType] = useState(null);
    

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch(`http://localhost:8080/api/v1/product/${id}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    console.error('Failed to fetch product');
                    return;
                }

                const { product } = await response.json();
                setProduct(product);
                const image = product.imageList?.[0];
                if (image) {
                    setImagePreview(image.imageData);
                    setImageType(image.mimeType);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('jwtToken');
            await axios.put(`http://localhost:8080/api/v1/product/update/${id}`, product, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            alert("Product updated successfully!");
        } catch (error) {
            console.error('Error updating product:', error);
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

    return (
        product ? (
            <Row className="justify-content-center" style={{ marginTop: "40px", paddingRight: "10%", paddingLeft: "10%" }}>
                <Col md={6} lg={6}>
                    <Form onSubmit={handleUpdateProduct}>

                        <Form.Group controlId="formProductImage">
                            {product.imageList ? (
                                <Image
                                    src={imagePreview.startsWith("data:image") ? imagePreview : `data:${imageType};base64,${imagePreview}`}
                                    alt="Product" fluid style={{ marginBottom: "10px" }} />
                            ) : (
                                <p>No image available</p>
                            )}
                            <Form.Control
                                type="file"
                                onChange={handleImageChange}
                            />
                        </Form.Group>

                        <Form.Group className='form-group' controlId="formProductName">
                            <Form.Label className="form-title">Naziv proizvoda</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={product.name}
                            />
                        </Form.Group>

                        <Form.Group className='form-group' controlId="formProductDescription">
                            <Form.Label className="form-title">Opis proizvoda</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={product.description}
                            />
                        </Form.Group>

                        <Form.Group className='form-group' controlId="formProductPrice">
                            <Form.Label className="form-title">Cena</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={product.price}
                            />
                        </Form.Group>

                        <Form.Group className='form-group' controlId="formProductStock">
                            <Form.Label className="form-title">Broj na stanju</Form.Label>
                            <Form.Control
                                type="number"
                                name="stock"
                                value={product.stock}
                            />
                        </Form.Group>

                        <Form.Group className='form-group' controlId="formShowOnWebsite">
                            <Form.Check
                                type="switch"
                                label="Prikaži na sajtu"
                                name="showOnWebsite"
                                checked={product.showOnSite}
                            />
                        </Form.Group>

                        <Button style={{ marginTop: "20px" }} variant="primary" type="submit" className="w-100">
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
