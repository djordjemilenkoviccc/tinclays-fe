import React, { useState, useContext } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import { authenticateUser } from '../api/auth-api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './auth-context';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await authenticateUser(username, password);
            const accessToken = response.jwtToken;
            const refreshToken = response.refreshToken;
            login(accessToken, refreshToken);

            navigate('/admin-panel/in_progress');
        } catch (error) {
            if (error.status === 403) {
                setError('Pogrešno korisničko ime ili lozinka.');
            } else {
                setError('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Row className="w-100">
                <Col xs={12} md={6} lg={4} className="mx-auto">
                    <h2 className="text-center mb-4">Uloguj se na Admin panel</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formBasicUsername" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"  // Add this to help browser recognize the field
                                autoComplete="username"  // Add autoComplete for the browser
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"  // Add this to help browser recognize the field
                                autoComplete="current-password"  // Add autoComplete for the browser
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="dark" type="submit" className="w-100">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
