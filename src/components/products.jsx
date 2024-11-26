import React, { useContext } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { CartContext } from './cart-context';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../style/products.css';
import '../style/home.css';

export default function Products() {
    const { cartItems, addToCart } = useContext(CartContext);
    const { categoryId } = useParams();
    const [products, setProducts] = useState([]);

    const getCartItemQuantity = (productId) => {
        const cartItem = cartItems.find(item => item.id === productId);
        return cartItem ? cartItem.quantity : 0;
    };

    useEffect(() => {
        const fetchProductsByCategoryId = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/v1/product/getAllProductsByCategory/${categoryId}`, {
                    method: 'GET'
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

        fetchProductsByCategoryId();
    }, [categoryId]);

    return (
        <div style={{ paddingLeft: "5%", paddingRight: "5%", marginTop: "120px" }}>

            <Row>
                {products.map(product => {
                    const cartQuantity = getCartItemQuantity(product.id);
                    const isMaxQuantityReached = cartQuantity >= product.stock;

                    return (
                        <Col lg="4" md="4" sm="12" className='text-center product-root' key={product.id}>
                            <img
                                src={`data:${product.imageList[0].mimeType};base64,${product.imageList[0].imageData}`}
                                alt={product.name}
                                className='product-image'
                                fetchpriority="high"
                            /> 
                            <p>{product.name}</p>
                            <h6>{product.price} RSD</h6>
                            <div className="mt-3 w-100">
                                <Button

                                    className="btn btn-dark w-100 rounded-0 hidden-button"
                                    onClick={() => addToCart(product)}
                                    disabled={isMaxQuantityReached}
                                >
                                    {isMaxQuantityReached ? "Dodata je maksimalna dostupna količina" : "Dodaj u korpu"}
                                </Button>
                            </div>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
}
