import "../style/admin-panel.css";
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './auth-context';
import { Card, Button, Row, Col, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Pencil } from 'react-bootstrap-icons'; // Bootstrap icon for hamburger

export default function AdminPanel() {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    // State to hold the current orders and their status
    const [orders, setOrders] = useState([
        {
            "id": "1",
            "date": "03.09.2024",
            "quantity": "2",
            "price": "5600",
            "address": "Generala Stefanika 25",
            "status": "1",
            "firstName": "Ivana",
            "lastName": "Peric"
        },
        {
            "id": "2",
            "date": "03.09.2024",
            "quantity": "1",
            "price": "2800",
            "address": "Vojvode Stefanika 25",
            "status": "2",
            "firstName": "Jovana",
            "lastName": "Peric"
        },
        {
            "id": "3",
            "date": "03.09.2024",
            "quantity": "1",
            "price": "2800",
            "address": "Marka Stefanika 25",
            "status": "1",
            "firstName": "Natasa",
            "lastName": "Markovic"
        },
        {
            "id": "4",
            "date": "03.09.2024",
            "quantity": "1",
            "price": "2800",
            "address": "Milana Stefanika 25",
            "status": "1",
            "firstName": "Tina",
            "lastName": "Cikaric"
        }
    ]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const handleOrderClick = (orderId) => {
        // Navigate to order-details page with the order ID as a parameter
        navigate(`/order-details/${orderId}`);
    };

    // Handle status change for an order
    const handleStatusChange = (orderId, newStatus) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
    };

    return (
        <div className="align-items-center" style={{ marginTop: "40px", paddingLeft: "5%", paddingRight: "5%" }}>

            <Row lg="12" md="12" sm="12" className="justify-content-center">
                {orders.map((order) => (
                    <Col lg="6" md="12" sm="12" className="mb-5 sm-5" key={order.id}>
                        <Card className="d-flex flex-column justify-content-between" style={{ height: '100%', position: 'relative', border: "1px solid black" }}>
                            {order.status === "1" && (
                                <div style={{ backgroundColor: '#e6c363', padding: '10px', textAlign: 'center', color: "black" }}>
                                    Narudzbina u procesu
                                </div>
                            )}
                            {order.status === "2" && (
                                <div style={{ backgroundColor: '#95e683', padding: '10px', textAlign: 'center', color: "black" }}>
                                    Realizovana
                                </div>
                            )}
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
                                <Dropdown.Item eventKey="1">U procesu</Dropdown.Item>
                                <Dropdown.Item eventKey="2">Realizovana</Dropdown.Item>
                                <Dropdown.Item eventKey="3">Vracena nazad</Dropdown.Item>
                            </DropdownButton>
                            <Card.Body>
                                <div style={{ position: 'relative' }}>
                                    <Card.Text><span style={{fontWeight: "bold"}}>Datum porucivanja: </span>{order.date}</Card.Text>
                                    <hr></hr>
                                    <Card.Text><span style={{fontWeight: "bold"}}>Ime: </span>{order.firstName} {order.lastName}</Card.Text>
                                    <hr></hr>
                                    <Card.Text><span style={{fontWeight: "bold"}}>Adresa: </span> {order.address}</Card.Text>
                                    <hr></hr>
                                    <Card.Text><span style={{fontWeight: "bold"}}>Cena narudzbine: </span> {order.price} rsd</Card.Text>
                                    <hr></hr>

                                    <div className="d-flex justify-content-center">
                                        <Button
                                            variant="primary"
                                            onClick={() => handleOrderClick(order.id)}
                                            className="btn btn-dark"
                                        >
                                            Vidi detalje
                                        </Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
}
