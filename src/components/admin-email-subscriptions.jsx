import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './auth-context';
import { useNavigate } from 'react-router-dom';
import { Table, Alert } from 'react-bootstrap';
import { getAllEmailSubscriptions } from '../api/email-notification-api';
import '../style/admin-panel.css';

export default function AdminEmailSubscriptions() {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const data = await getAllEmailSubscriptions();
            setSubscriptions(data);
            setError(null);
        } catch (error) {
            if (error.status === 401 || error.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to fetch email subscriptions: ', error.message);
                setError('Greška pri učitavanju pretplata.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    return (
        <div className="align-items-center" style={{ marginTop: "140px", paddingLeft: "5%", paddingRight: "5%" }}>
            <h2 style={{ textAlign: "center" }}>Email Pretplate</h2>
            <p style={{ textAlign: "center", color: "#666" }}>
                Lista svih korisnika koji su se pretplatili na obaveštenja
            </p>
            <hr />

            {loading && (
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <div style={{
                        border: '4px solid #f3f3f3',
                        borderTop: '4px solid #2a3b59',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto'
                    }}></div>
                </div>
            )}

            {error && (
                <Alert variant="danger" style={{ textAlign: "center" }}>
                    {error}
                </Alert>
            )}

            {!loading && !error && subscriptions.length === 0 && (
                <Alert variant="info" style={{ textAlign: "center" }}>
                    Trenutno nema pretplatnika
                </Alert>
            )}

            {!loading && !error && subscriptions.length > 0 && (
                <div style={{ overflowX: 'auto' }}>
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <strong>Ukupno pretplatnika: {subscriptions.length}</strong>
                    </div>
                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th style={{ width: '50%' }}>Email</th>
                                <th style={{ width: '20%' }}>Datum pretplate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subscriptions.map((subscription) => (
                                <tr key={subscription.id}>
                                    <td>{subscription.email}</td>
                                    <td>
                                        {subscription.subscribedAt
                                            ? new Date(subscription.subscribedAt).toLocaleDateString('sr-RS')
                                            : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                </div>
            )}
        </div>
    );
}
