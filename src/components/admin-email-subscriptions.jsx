import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './auth-context';
import { useNavigate } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { getAllEmailSubscriptions, sendNewCollectionAnnouncement } from '../api/email-notification-api';
import { getErrorMessage } from '../utils/error-handler';
import '../style/admin-panel.css';

export default function AdminEmailSubscriptions() {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sending, setSending] = useState(false);
    const [sendSuccess, setSendSuccess] = useState(null);
    const [sendError, setSendError] = useState(null);

    const formatDateTime = (dateTime) => {
        if (!dateTime) return '-';

        // Parse the date string (handles both ISO format and standard format)
        const date = new Date(dateTime);

        // Extract date components
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        // Format as DD.MM.YYYY HH:mm:ss
        return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
    };

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

    const handleSendNewCollectionAnnouncement = async () => {
        // Confirm action
        const confirmed = window.confirm(
            `Da li ste sigurni da želite da pošaljete obaveštenje o novoj kolekciji svim pretplatnicima (${subscriptions.length} email-ova)?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setSending(true);
            setSendSuccess(null);
            setSendError(null);

            const response = await sendNewCollectionAnnouncement();
            setSendSuccess(response.message);
            console.log('Bulk email sent successfully:', response.message);
        } catch (error) {
            if (error.status === 401 || error.status === 403) {
                console.warn('Unauthorized: Redirecting to login.');
                navigate('/login');
            } else {
                console.error('Failed to send new collection announcement:', error);
                setSendError(getErrorMessage(error));
            }
        } finally {
            setSending(false);
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

            {/* Button to send new collection announcement */}
            {!loading && !error && subscriptions.length > 0 && (
                <div style={{ textAlign: "center", marginBottom: "20px" }}>
                    <Button
                        variant="primary"
                        onClick={handleSendNewCollectionAnnouncement}
                        disabled={sending}
                        style={{ padding: "10px 30px", fontSize: "16px" }}
                    >
                        {sending ? 'Šaljem...' : 'Pošalji obaveštenje o novoj kolekciji'}
                    </Button>
                </div>
            )}

            {/* Success/Error messages for sending */}
            {sendSuccess && (
                <Alert variant="success" onClose={() => setSendSuccess(null)} dismissible style={{ marginBottom: "20px" }}>
                    {sendSuccess}
                </Alert>
            )}
            {sendError && (
                <Alert variant="danger" onClose={() => setSendError(null)} dismissible style={{ marginBottom: "20px" }}>
                    {sendError}
                </Alert>
            )}

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
                                    <td>{formatDateTime(subscription.subscribedAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    
                </div>
            )}
        </div>
    );
}
