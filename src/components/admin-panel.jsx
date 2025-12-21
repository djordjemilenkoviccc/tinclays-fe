import "../style/admin-panel.css";
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from './auth-context';
import { Card, Button, Row, Col, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { loadOrdersByStatus, changeOrderStatus } from '../api/order-api';
import { Pencil } from 'react-bootstrap-icons';
import { getImageUrl } from "../utils/image-utils";

export default function AdminPanel() {

    const { status } = useParams();
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [orders, setOrders] = useState(null);

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

    return (
        <div className="align-items-center" style={{ marginTop: "140px", paddingLeft: "5%", paddingRight: "5%" }}>
            <h2 style={{ textAlign: "center" }}>{orders ? getMessage() : ''}</h2>
            <hr></hr>
            <Row className="justify-content-center">
                {orders ? orders.map((order) => (
                    <Col key={order.id} lg={4} md={4} sm={12} className="mb-4">
                        <Card className="border">
                            <div
                                style={{
                                    backgroundColor:
                                        order.status === "IN_PROGRESS"
                                            ? "#ffeb3b" // Yellow for IN_PROGRESS
                                            : order.status === "FAILED"
                                                ? "#f44336" // Red for FAILED
                                                : "#4caf50", // Green for other statuses (e.g., COMPLETED)
                                    color: order.status === "IN_PROGRESS" ? "#000" : "#fff",
                                    padding: "10px",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    borderBottom: "1px solid #ddd",
                                }}
                            >
                                {order.status === "IN_PROGRESS"
                                    ? "U Toku"
                                    : order.status === "FAILED"
                                        ? "Neuspešna" // Label for FAILED
                                        : "Završena"}

                                <DropdownButton
                                    id={`status-dropdown-${order.id}`}
                                    title={<Pencil />}
                                    variant="secondar"
                                    onSelect={(eventKey) => handleChangeOrderStatus(order.id, eventKey)}
                                    align="end"
                                    style={{
                                        position: 'absolute',
                                        top: 2,
                                        right: 0,
                                        zIndex: 1
                                    }}
                                    className="custom-dropdown-btn"
                                >
                                    <Dropdown.Item eventKey="IN_PROGRESS">U toku</Dropdown.Item>
                                    <Dropdown.Item eventKey="COMPLETED">Završena</Dropdown.Item>
                                    <Dropdown.Item eventKey="FAILED">Neuspešna</Dropdown.Item>
                                </DropdownButton>
                            </div>

                            <Card.Body>
                                {order.products.map((product, productIndex) =>
                                    product.images.map((image, imageIndex) => (
                                        <div key={`product-${productIndex}-image-${imageIndex}`}>
                                            {/* Product ID */}
                                            <div>
                                                <h2>
                                                    <span
                                                        style={{
                                                            fontWeight: "bold",
                                                            fontSize: "16px",
                                                            marginRight: "10px",
                                                        }}
                                                    >
                                                        ID proizvoda: {product.id}
                                                    </span>
                                                </h2>
                                            </div>

                                            {/* Product Image and Quantity */}
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    marginBottom: "10px",
                                                    border: "1px solid #ddd",
                                                    borderRadius: "4px",
                                                    padding: "5px",
                                                }}
                                            >
                                                {/* Product Image */}
                                                <Card.Img
                                                    src={getImageUrl(image.path)}
                                                    alt={product.productName}
                                                    style={{
                                                        width: "90%",
                                                        height: "90%",
                                                        objectFit: "cover",
                                                        borderRadius: "4px",
                                                    }}
                                                />

                                                {/* Quantity */}
                                                <span
                                                    style={{
                                                        fontWeight: "bold",
                                                        fontSize: "18px",
                                                        color: "#555",
                                                    }}
                                                >
                                                    x {product.quantity}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}


                                {/* Order Details */}
                                <Card.Text><span style={{ fontWeight: "bold" }}>ID porudžbine: </span>{order.id} </Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Vrednost: </span>{order.totalAmount} rsd </Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Datum i vreme kreiranja: </span>{order.dateCreated} </Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Ime i prezime: </span>{order.firstName} {order.lastName}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Adresa: </span>{order.address} {order.houseNumber}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Poštanski broj: </span>{order.postalCode}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Grad: </span>{order.city}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Telefon: </span>{order.phoneNumber}</Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Email: </span>{order.email}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )) : ''}
            </Row>



        </div>
    );
}
