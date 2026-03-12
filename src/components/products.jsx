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
        <div className="home-root">
            {/* Header */}
            <section className="products-hero">
                <span className="products-label">Kolekcija</span>
                <h1 className="products-heading">Naši proizvodi</h1>
                <div className="products-divider"></div>
            </section>

            {/* Product Grid */}
            <section className="products-grid">
                <Row>
                    {products.map((product, index) => {
                        const cartQuantity = getCartItemQuantity(product.id);
                        const isMaxQuantityReached = cartQuantity >= product.stock;

                        return (
                            <Col
                                lg="4"
                                md="4"
                                sm="6"
                                xs="12"
                                className="product-col"
                                key={product.id}
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="product-card">
                                    <div className="product-image-wrapper">
                                        <img
                                            src={getImageUrl(product.imageList[0].detailsPath)}
                                            alt={product.name}
                                            className="product-image"
                                            fetchpriority="high"
                                        />
                                        <div className="product-overlay">
                                            <Button
                                                className="add-to-cart-btn"
                                                onClick={() => addToCart(product)}
                                                disabled={isMaxQuantityReached}
                                            >
                                                {isMaxQuantityReached ? "Maksimalna količina" : "Dodaj u korpu"}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="product-info">
                                        <p className="product-name">{product.name}</p>
                                        <p className="product-price">{product.price} rsd</p>
                                    </div>

                                    {/* Mobile-only button */}
                                    <Button
                                        className="add-to-cart-btn add-to-cart-btn-mobile"
                                        onClick={() => addToCart(product)}
                                        disabled={isMaxQuantityReached}
                                    >
                                        {isMaxQuantityReached ? "Maksimalna količina" : "Dodaj u korpu"}
                                    </Button>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </section>
        </div>
    );
}
