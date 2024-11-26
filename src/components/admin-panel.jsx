import "../style/admin-panel.css";
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from './auth-context';
import { Card, Button, Row, Col, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'react-bootstrap-icons'; // Bootstrap icon for hamburger

export default function AdminPanel() {

    const { status } = useParams();
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch(`http://localhost:8080/api/v1/order/getAllByStatus/${status}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setOrders(data);
                } else {
                    console.error('Failed to fetch orders');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchOrders();
    }, [status]);


    const handleStatusChange = async (orderId, newStatus) => {

        const formData = new FormData();
        formData.append('status', newStatus);
        formData.append('orderId', orderId);
        const token = localStorage.getItem('jwtToken');

        try {
            const response = await fetch('http://localhost:8080/api/v1/order/updateOrderStatus', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const updatedOrders = orders.filter(order => order.id !== orderId);
                setOrders(updatedOrders);
                console.log("Changed");
            } else {
                console.error('Failed to update category');
            }
        } catch (error) {
            console.error('Error:', error);
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

    return (
        <div className="align-items-center" style={{ marginTop: "140px", paddingLeft: "5%", paddingRight: "5%" }}>
            <h2 style={{ textAlign: "center" }}>{getMessage()}</h2>
            <hr></hr>
            <Row className="justify-content-center">
                {orders.map((order) => (
                    <Col key={order.id} lg={4} md={4} sm={12} className="mb-4">
                        <Card className="border">
                            <div
                                style={{
                                    backgroundColor: order.status === "IN_PROGRESS" ? "#ffeb3b" : "#4caf50",
                                    color: order.status === "IN_PROGRESS" ? "#000" : "#fff",
                                    padding: "10px",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    borderBottom: "1px solid #ddd",
                                }}
                            >
                                {order.status === "IN_PROGRESS" ? "U Toku" : "Završena"}

                                <DropdownButton
                                    id={`status-dropdown-${order.id}`}
                                    title={<Pencil />}
                                    variant="secondar"
                                    onSelect={(eventKey) => handleStatusChange(order.id, eventKey)}
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
                                </DropdownButton>
                            </div>

                            <Card.Body>
                                {order.products.map((product, productIndex) =>
                                    product.images.map((image, imageIndex) => (
                                        <div
                                            key={`${productIndex}-${imageIndex}`}
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
                                                src={`data:${image.mimeType};base64,${image.imageData}`}
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
                                    ))
                                )}

                                {/* Order Details */}
                                <Card.Text><span style={{ fontWeight: "bold" }}>Broj porudžbine: </span>{order.id} </Card.Text>
                                <Card.Text><span style={{ fontWeight: "bold" }}>Vrednost: </span>{order.totalPrice} rsd </Card.Text>
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
                ))}
            </Row>



        </div>
    );
}
