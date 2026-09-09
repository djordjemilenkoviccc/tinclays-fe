import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Row, Col, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { HiOutlineCheckCircle } from 'react-icons/hi2';
import { CartContext } from './cart-context';
import { fetchProductsByCategoryId } from '../api/product-api';
import { getImageUrl } from '../utils/image-utils';
import {
    CUSTOM_TEXT_MAX_LENGTH,
    buildCustomCartItem,
    getCustomProductDesigns
} from '../utils/custom-product';
import '../style/custom-product.css';
import '../style/products.css';
import '../style/home.css';

export default function CustomProduct() {
    const { categoryId, productId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { cartItems, addToCart } = useContext(CartContext);

    // Arriving from the product grid the product is handed over directly; on a
    // refresh or a shared link it is loaded again from its category
    const [product, setProduct] = useState(location.state?.product ?? null);
    const [isLoading, setIsLoading] = useState(!location.state?.product);
    const [selectedDesign, setSelectedDesign] = useState(null);
    const [customText, setCustomText] = useState('');
    const [validationMessage, setValidationMessage] = useState(null);

    useEffect(() => {
        if (product) return;

        const loadProduct = async () => {
            try {
                const data = await fetchProductsByCategoryId(categoryId);
                const found = (data.products ?? []).find(
                    (p) => String(p.id) === String(productId)
                );
                setProduct(found ?? null);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProduct();
    }, [product, categoryId, productId]);

    const designs = useMemo(() => getCustomProductDesigns(product), [product]);

    // A personalised product can be ordered several times with different designs,
    // so the stock limit counts every line of this product
    const cartQuantity = cartItems.reduce(
        (total, item) =>
            item.productId === product?.id || item.id === product?.id
                ? total + item.quantity
                : total,
        0
    );

    const isOutOfStock = product ? product.stock <= 0 : false;
    const isMaxQuantityReached = product ? cartQuantity >= product.stock : false;

    const handleTextChange = (e) => {
        setCustomText(e.target.value.slice(0, CUSTOM_TEXT_MAX_LENGTH));
        setValidationMessage(null);
    };

    const handleDesignSelect = (design) => {
        setSelectedDesign(design);
        setValidationMessage(null);
    };

    const handleAddToCart = () => {
        if (!selectedDesign) {
            setValidationMessage('Izaberite dizajn.');
            return;
        }
        if (!customText.trim()) {
            setValidationMessage('Upišite tekst koji želite na proizvodu.');
            return;
        }

        addToCart(buildCustomCartItem(product, selectedDesign, customText));
        setValidationMessage(null);
    };

    if (isLoading) {
        return (
            <div className="home-root">
                <section className="products-hero">
                    <h1 className="products-heading">Personalizacija</h1>
                    <div className="products-divider"></div>
                </section>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="home-root">
                <section className="products-hero">
                    <h1 className="products-heading">Proizvod nije pronađen</h1>
                    <div className="products-divider"></div>
                    <Button className="add-to-cart-btn" onClick={() => navigate(`/products/${categoryId}`)}>
                        Nazad na kolekciju
                    </Button>
                </section>
            </div>
        );
    }

    const buttonLabel = isOutOfStock
        ? 'Nema na stanju'
        : isMaxQuantityReached
            ? 'Maksimalna količina'
            : 'Dodaj u korpu';

    return (
        <div className="home-root">
            <section className="products-hero">
                <span className="products-label">Personalizuj</span>
                <h1 className="products-heading">{product.name}</h1>
                <div className="products-divider"></div>
            </section>

            <section className="custom-product">
                <Row className="g-5">
                    {/* Preview */}
                    <Col lg={6} md={12}>
                        <div className="custom-preview">
                            <div className="custom-preview-image-wrapper">
                                {isOutOfStock && (
                                    <div className="out-of-stock-badge">Nema na stanju</div>
                                )}
                                {product.imageList?.[0] && (
                                    <img
                                        src={getImageUrl(product.imageList[0].detailsPath)}
                                        alt={product.name}
                                        className="custom-preview-image"
                                        fetchpriority="high"
                                    />
                                )}
                            </div>

                            <div className="custom-preview-summary">
                                <div className="custom-preview-row">
                                    <span className="custom-preview-label">Dizajn</span>
                                    {selectedDesign ? (
                                        <span className="custom-preview-value">
                                            <img
                                                src={selectedDesign.imageUrl}
                                                alt={selectedDesign.name}
                                                className="custom-preview-design"
                                            />
                                            {selectedDesign.name}
                                        </span>
                                    ) : (
                                        <span className="custom-preview-placeholder">Nije izabran</span>
                                    )}
                                </div>
                                <div className="custom-preview-row">
                                    <span className="custom-preview-label">Tekst</span>
                                    {customText.trim() ? (
                                        <span className="custom-preview-text">{customText}</span>
                                    ) : (
                                        <span className="custom-preview-placeholder">Nije upisan</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Col>

                    {/* Configurator */}
                    <Col lg={6} md={12}>
                        <div className="custom-config">
                            {product.description && (
                                <p className="custom-config-description">{product.description}</p>
                            )}
                            <p className="custom-config-price">{product.price} rsd</p>

                            <div className="custom-config-block">
                                <h2 className="custom-config-title">1. Izaberite dizajn</h2>
                                {designs.length === 0 ? (
                                    <p className="custom-config-empty">
                                        Za ovaj proizvod još nema dostupnih dizajna.
                                    </p>
                                ) : (
                                    <div className="custom-design-grid">
                                        {designs.map((design) => (
                                            <button
                                                type="button"
                                                key={design.id}
                                                className={`custom-design-option${
                                                    selectedDesign?.id === design.id ? ' is-selected' : ''
                                                }`}
                                                onClick={() => handleDesignSelect(design)}
                                                aria-pressed={selectedDesign?.id === design.id}
                                            >
                                                <img
                                                    src={design.imageUrl}
                                                    alt={design.name}
                                                    className="custom-design-image"
                                                />
                                                <span className="custom-design-name">{design.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="custom-config-block">
                                <h2 className="custom-config-title">2. Upišite tekst</h2>
                                <Form.Control
                                    type="text"
                                    className="custom-text-input"
                                    value={customText}
                                    onChange={handleTextChange}
                                    maxLength={CUSTOM_TEXT_MAX_LENGTH}
                                    placeholder="Npr. Mogu sve"
                                />
                                <div className="custom-text-counter">
                                    {customText.length}/{CUSTOM_TEXT_MAX_LENGTH} karaktera
                                </div>
                            </div>

                            {validationMessage && (
                                <p className="custom-validation">{validationMessage}</p>
                            )}

                            <div className="custom-note">
                                <HiOutlineCheckCircle size={20} className="custom-note-icon" />
                                <div className="custom-note-body">
                                    <p className="custom-note-title">Važne informacije</p>
                                    <p>
                                        Svaka šoljica iz ove limitirane kolekcije izrađuje se ručno i po
                                        porudžbini, zbog čega je proces izrade nepredvidiv i postoji
                                        mogućnost da se šoljica tokom izrade ošteti.
                                    </p>
                                    <p>
                                        U slučaju potpunog oštećenja, porudžbina će biti otkazana, a novac
                                        vraćen u celosti. Ukoliko je oštećenje manje i šoljica je i dalje
                                        funkcionalna, bićete obavešteni i moći ćete da je zadržite uz
                                        korekciju cene ili da odustanete od porudžbine.
                                    </p>
                                    <p>Rok izrade je do 30 dana od dana poručivanja.</p>
                                    <p className="custom-note-signoff">
                                        Hvala na razumevanju i poverenju u ručni rad.
                                    </p>
                                </div>
                            </div>

                            <Button
                                className="add-to-cart-btn custom-add-btn"
                                onClick={handleAddToCart}
                                disabled={isOutOfStock || isMaxQuantityReached || designs.length === 0}
                            >
                                {buttonLabel}
                            </Button>

                            <Button
                                variant="link"
                                className="custom-back-btn"
                                onClick={() => navigate(`/products/${categoryId}`)}
                            >
                                Nazad na kolekciju
                            </Button>
                        </div>
                    </Col>
                </Row>
            </section>
        </div>
    );
}
