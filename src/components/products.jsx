import React, { useContext } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { CartContext } from './cart-context';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProductsByCategoryId } from '../api/product-api';
import { getImageUrl } from '../utils/image-utils';
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
        const loadProductsByCategoryId = async () => {

            try {
                
                const data = await fetchProductsByCategoryId(categoryId);
                setProducts(data.products);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        loadProductsByCategoryId();
    }, [categoryId]);

    return (
        <div style={{ paddingLeft: "5%", paddingRight: "5%", marginTop: "120px" }}>
            <Row>
                {products.map((product, index) => {
                    const cartQuantity = getCartItemQuantity(product.id);
                    const isMaxQuantityReached = cartQuantity >= product.stock;

                    return (
                        <Col
                            lg="4"
                            md="4"
                            sm="12"
                            className='text-center product-root'
                            key={product.id}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <img
                                src={getImageUrl(product.imageList[0].detailsPath)}
                                alt={product.name}
                                className='product-image'
                                fetchpriority="high"
                            />
                            <p>{product.name}</p>
                            <h6>{product.price} RSD</h6>
                            <div className="mt-3 w-100">
                                <Button
                                    className="w-100 hidden-button add-to-cart-btn"
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
