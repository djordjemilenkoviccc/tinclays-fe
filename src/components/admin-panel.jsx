import "../style/admin-panel.css";
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from './auth-context';
import { Card, Button, Row, Col, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadOrdersByStatus, changeOrderStatus, sendPaymentSlip, markOrderAsPaid, notifyOrderShipped } from '../api/order-api';
import { Pencil, BellFill } from 'react-bootstrap-icons';
import { getImageUrl } from "../utils/image-utils";

const formatDateTime = (dateTime) => {
    if (!dateTime) return '-';

    const isoUtc = dateTime.endsWith('Z') ? dateTime : dateTime + 'Z';
    const date = new Date(isoUtc);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
};

export default function AdminPanel() {

    const { status } = useParams();
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [orders, setOrders] = useState(null);
    const [sendingSlipOrderId, setSendingSlipOrderId] = useState(null);
    const [sendingShippedOrderId, setSendingShippedOrderId] = useState(null);

    const fetchOrders = async () => {
        try {

            const data = await loadOrdersByStatus(status);
            setOrders(data);

        } catch (error) {
            if (error.status === 401 || error.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to fetch orders by status: ', error.message);
                // TODO: Show alert
            }
        }
    };

    const handleChangeOrderStatus = async (orderId, newStatus) => {

        try {
            const response = await changeOrderStatus(orderId, newStatus);

            if (response) {
                const updatedOrders = orders.filter(order => order.id !== orderId);
                setOrders(updatedOrders);
                console.log("Changed");
            }
        } catch (error) {

            if (error.status === 401 || error.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to change status of order: ', error.message);
                // TODO: Show alert
            }
        }
    };

    const handleSendPaymentSlip = async (orderId) => {
        setSendingSlipOrderId(orderId);
        try {
            await sendPaymentSlip(orderId);
            setOrders(orders.map(o => o.id === orderId ? { ...o, slipSent: true } : o));
            alert('Uplatnica je uspešno poslata!');
        } catch (error) {
            if (error.status === 401 || error.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to send payment slip: ', error.message);
                alert('Greška prilikom slanja uplatnice.');
            }
        } finally {
            setSendingSlipOrderId(null);
        }
    };

    const handleMarkAsPaid = async (orderId) => {
        try {
            await markOrderAsPaid(orderId);
            const updated = orders.map(o => o.id === orderId ? { ...o, paid: true } : o);
            const paidOrder = updated.find(o => o.id === orderId);
            const rest = updated.filter(o => o.id !== orderId);
            setOrders([...rest, paidOrder]);
        } catch (error) {
            if (error.status === 401 || error.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to mark order as paid: ', error.message);
                alert('Greška prilikom označavanja uplate.');
            }
        }
    };

    const handleNotifyShipped = async (orderId) => {
        const confirmed = window.confirm('Da li želite da pošaljete obaveštenje?');
        if (!confirmed) return;

        setSendingShippedOrderId(orderId);
        try {
            await notifyOrderShipped(orderId);
            setOrders(orders.map(o => o.id === orderId ? { ...o, shipped: true } : o));
            alert('Obaveštenje o slanju je uspešno poslato!');
        } catch (error) {
            if (error.status === 401 || error.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to notify order shipped: ', error.message);
                alert('Greška prilikom slanja obaveštenja.');
            }
        } finally {
            setSendingShippedOrderId(null);
        }
    };

    const getMessage = () => {

        if (orders.length === 0) {
            return "Trenutno nema porudzbina";
        }

        if (status === "in_progress") {
            return "Lista svih porudžbina koje su u toku";
        } else if (status === "completed") {
            return "Lista svih porudžbina koje su realizovane";
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {

        fetchOrders();
    }, [status]);

    const getStatusStyle = (orderStatus) => {
        switch (orderStatus) {
            case "IN_PROGRESS":
                return { bg: "#fff8e1", color: "#f9a825", label: "U toku" };
            case "FAILED":
                return { bg: "#fdecea", color: "#d32f2f", label: "Neuspešna" };
            default:
                return { bg: "#e8f5e9", color: "#388e3c", label: "Završena" };
        }
    };

    return (
        <div style={{ marginTop: "140px", paddingLeft: "5%", paddingRight: "5%", paddingBottom: "40px" }}>
            {orders && (
                <>
                    <p className="order-page-title">{getMessage()}</p>
                    {orders.length > 0 && (
                        <p className="order-page-subtitle">{orders.length} {orders.length === 1 ? 'porudžbina' : 'porudžbina'}</p>
                    )}
                </>
            )}
            <Row className="justify-content-center">
                {orders ? orders.map((order) => {
                    const statusStyle = getStatusStyle(order.status);
                    return (
                    <Col key={order.id} lg={4} md={6} sm={12} style={{ marginBottom: "3.5rem" }}>
                        <Card className="order-card">
                            {/* Header */}
                            <div className="order-card-header" style={{ backgroundColor: statusStyle.bg, position: "relative" }}>
                                <div style={{ paddingRight: "36px" }}>
                                    <div style={{ marginBottom: "6px" }}>
                                        <span style={{ fontSize: "13px", color: "#888" }}>#{order.id}</span>
                                        <span style={{ fontSize: "12px", color: "#aaa", marginLeft: "10px" }}>{formatDateTime(order.dateCreated)}</span>
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                        <span className="order-status-badge" style={{ backgroundColor: statusStyle.color, color: "#fff" }}>
                                            {statusStyle.label}
                                        </span>
                                        {order.slipSent && <span className="slip-sent-badge" style={{ backgroundColor: "#e3f2fd", color: "#1565c0" }}>Uplatnica poslata</span>}
                                        {order.paid && <span className="slip-sent-badge">$$$ Plaćeno</span>}
                                        {order.shipped && <span className="slip-sent-badge" style={{ backgroundColor: "#fff3e0", color: "#e65100" }}><BellFill size={11} style={{ marginRight: "4px" }} />Poslato</span>}
                                    </div>
                                </div>
                                <DropdownButton
                                    id={`status-dropdown-${order.id}`}
                                    title={<Pencil size={14} />}
                                    variant="secondary"
                                    onSelect={(eventKey) => {
                                        if (eventKey === "MARK_PAID") {
                                            handleMarkAsPaid(order.id);
                                        } else {
                                            handleChangeOrderStatus(order.id, eventKey);
                                        }
                                    }}
                                    align="end"
                                    className="custom-dropdown-btn"
                                    style={{ position: "absolute", top: "8px", right: "8px" }}
                                >
                                    <Dropdown.Item eventKey="IN_PROGRESS">U toku</Dropdown.Item>
                                    <Dropdown.Item eventKey="COMPLETED">Završena</Dropdown.Item>
                                    <Dropdown.Item eventKey="FAILED">Neuspešna</Dropdown.Item>
                                    {!order.paid && (
                                        <>
                                            <Dropdown.Divider />
                                            <Dropdown.Item eventKey="MARK_PAID">Označi kao plaćeno</Dropdown.Item>
                                        </>
                                    )}
                                </DropdownButton>
                            </div>

                            <Card.Body>
                                {/* Products */}
                                <div className="order-section">
                                    <div className="order-section-title">Proizvodi</div>
                                    {order.products.map((product, productIndex) =>
                                        product.images.map((image, imageIndex) => (
                                            <div className="order-product-row" key={`product-${productIndex}-image-${imageIndex}`}>
                                                <img
                                                    src={getImageUrl(image.path)}
                                                    alt={product.productName}
                                                    className="order-product-img"
                                                />
                                                <div className="order-product-info">
                                                    <p className="order-product-name">{product.productName}</p>
                                                    <p className="order-product-qty">x {product.quantity}</p>
                                                </div>
                                                <span className="order-product-price">{product.price * product.quantity} rsd</span>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Total */}
                                <div className="order-total-row">
                                    <span className="order-total-label">Ukupno</span>
                                    <span className="order-total-value">{order.totalAmount} rsd</span>
                                </div>

                                <div className="order-section-divider"></div>

                                {/* Customer details */}
                                <div className="order-section">
                                    <div className="order-section-title">Kupac</div>
                                    <div className="order-detail-row">
                                        <span className="order-detail-label">Ime i prezime</span>
                                        <span className="order-detail-value">{order.firstName} {order.lastName}</span>
                                    </div>
                                    <div className="order-detail-row">
                                        <span className="order-detail-label">Telefon</span>
                                        <span className="order-detail-value">{order.phoneNumber}</span>
                                    </div>
                                    <div className="order-detail-row">
                                        <span className="order-detail-label">Email</span>
                                        <span className="order-detail-value">{order.email}</span>
                                    </div>
                                </div>

                                <div className="order-section-divider"></div>

                                {/* Delivery details */}
                                <div className="order-section">
                                    <div className="order-section-title">Dostava</div>
                                    <div className="order-detail-row">
                                        <span className="order-detail-label">Adresa</span>
                                        <span className="order-detail-value">{order.address} {order.houseNumber}</span>
                                    </div>
                                    <div className="order-detail-row">
                                        <span className="order-detail-label">Grad</span>
                                        <span className="order-detail-value">{order.postalCode}, {order.city}</span>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="order-section" style={{ paddingTop: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {order.status === "IN_PROGRESS" && !order.slipSent && (
                                        <Button
                                            className="w-100"
                                            style={{ backgroundColor: '#6f42c1', borderColor: '#6f42c1', borderRadius: '8px', padding: '10px' }}
                                            onClick={() => handleSendPaymentSlip(order.id)}
                                            disabled={sendingSlipOrderId === order.id}
                                        >
                                            {sendingSlipOrderId === order.id ? 'Slanje...' : 'Pošalji uplatnicu'}
                                        </Button>
                                    )}
                                    {!order.shipped && (
                                        <Button
                                            className="w-100"
                                            variant="outline-primary"
                                            style={{ borderRadius: '8px', padding: '10px' }}
                                            onClick={() => handleNotifyShipped(order.id)}
                                            disabled={sendingShippedOrderId === order.id}
                                        >
                                            {sendingShippedOrderId === order.id ? 'Slanje...' : 'Obavesti da je poslato'}
                                        </Button>
                                    )}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    );
                }) : ''}
            </Row>
        </div>
    );
}
