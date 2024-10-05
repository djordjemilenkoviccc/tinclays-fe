import React, { useContext } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { CartContext } from './cart-context';
import products from '../assets/data/products.json';
import '../style/products.css';

export default function Products() {
    const { cartItems, addToCart } = useContext(CartContext);

    const getCartItemQuantity = (productId) => {
        const cartItem = cartItems.find(item => item.id === productId);
        return cartItem ? cartItem.quantity : 0;
    };

    return (
        <div style={{ paddingLeft: "5%", paddingRight: "5%", marginTop: "100px" }}>
            <p style={{ textAlign: "center", fontSize: "28px" }}>Ovo je kategorija rucno napravljene solje</p>

            <Row>
                {products.map(product => {
                    const cartQuantity = getCartItemQuantity(product.id);
                    const isMaxQuantityReached = cartQuantity >= product.amount;

                    return (
                        <Col lg="6" md="6" sm="12" className='text-center product-root' key={product.id}>
                            <img
                                src={product.imageUrl}
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
