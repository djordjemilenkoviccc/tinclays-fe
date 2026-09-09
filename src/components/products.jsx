import React, { useContext } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { CartContext } from './cart-context';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProductsByCategoryId } from '../api/product-api';
import { getImageUrl } from '../utils/image-utils';
import EmailNotificationModal from './email-notification-modal';
import { isCustomProduct } from '../utils/custom-product';
import '../style/products.css';
import '../style/custom-product.css';
import '../style/home.css';

export default function Products() {
    const { cartItems, addToCart } = useContext(CartContext);
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [showEmailModal, setShowEmailModal] = useState(false);

    // A custom made product can be in the cart several times (one line per
    // design/text combination), so every line of the product counts
    const getCartItemQuantity = (productId) => {
        return cartItems.reduce((total, item) => (
            item.id === productId || item.productId === productId
                ? total + item.quantity
                : total
        ), 0);
    };

    const goToCustomization = (product) => {
        navigate(`/custom-product/${categoryId}/${product.id}`, { state: { product } });
    };

    useEffect(() => {
        const loadProductsByCategoryId = async () => {
            try {
                const data = await fetchProductsByCategoryId(categoryId);
                const loadedProducts = data.products ?? [];
                setProducts(loadedProducts);
                setCategoryName(loadedProducts[0]?.category?.name ?? '');

                // If the whole category is out of stock, prompt the email capture
                const allOutOfStock =
                    loadedProducts.length > 0 &&
                    !loadedProducts.some((p) => p.stock > 0);
                setShowEmailModal(allOutOfStock);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        loadProductsByCategoryId();
    }, [categoryId]);

    // On phone-size screens, reveal each product as it scrolls into view
    useEffect(() => {
        if (products.length === 0) return;

        const isPhone = window.matchMedia('(max-width: 767.98px)').matches;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!isPhone || prefersReducedMotion) return;

        const cols = document.querySelectorAll('.products-grid .product-col');
        cols.forEach((col) => col.classList.add('reveal-on-scroll'));

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
        );

        cols.forEach((col) => observer.observe(col));

        return () => observer.disconnect();
    }, [products]);

    // Reserve description space only when the category actually has descriptions,
    // so every card in the grid stays the same height
    const hasDescriptions = products.some((p) => p.description);

    return (
        <div className="home-root">
            <EmailNotificationModal
                show={showEmailModal}
                onClose={() => setShowEmailModal(false)}
            />

            {/* Header */}
            <section className="products-hero">
                <span className="products-label">Kolekcija</span>
                <h1 className="products-heading">{categoryName}</h1>
                <div className="products-divider"></div>
            </section>

            {/* Product Grid */}
            <section className="products-grid">
                <Row>
                    {products.map((product, index) => {
                        const cartQuantity = getCartItemQuantity(product.id);
                        const isOutOfStock = product.stock <= 0;
                        const isMaxQuantityReached = cartQuantity >= product.stock;
                        const isCustom = isCustomProduct(product);
                        const buttonLabel = isOutOfStock
                            ? "Nema na stanju"
                            : isMaxQuantityReached
                                ? "Maksimalna količina"
                                : isCustom
                                    ? "Personalizuj"
                                    : "Dodaj u korpu";
                        // Custom made products are configured on their own page
                        const handleProductAction = () => (
                            isCustom ? goToCustomization(product) : addToCart(product)
                        );

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
                                        {isOutOfStock && (
                                            <div className="out-of-stock-badge">Nema na stanju</div>
                                        )}
                                        {isCustom && (
                                            <div className="custom-made-badge">Po želji</div>
                                        )}
                                        <img
                                            src={getImageUrl(product.imageList[0].detailsPath)}
                                            alt={product.name}
                                            className="product-image"
                                            fetchpriority="high"
                                        />
                                        <div className="product-overlay">
                                            <Button
                                                className="add-to-cart-btn"
                                                onClick={handleProductAction}
                                                disabled={isMaxQuantityReached}
                                            >
                                                {buttonLabel}
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="product-info">
                                        <p className="product-name">{product.name}</p>
                                        {hasDescriptions && (
                                            <p
                                                className="product-description"
                                                title={product.description}
                                            >
                                                {product.description}
                                            </p>
                                        )}
                                        <p className="product-price">{product.price} rsd</p>
                                    </div>

                                    {/* Mobile-only button */}
                                    <Button
                                        className="add-to-cart-btn add-to-cart-btn-mobile"
                                        onClick={handleProductAction}
                                        disabled={isMaxQuantityReached}
                                    >
                                        {buttonLabel}
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
