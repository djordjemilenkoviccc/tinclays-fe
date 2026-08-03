import { Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { subscribeEmail } from '../api/email-notification-api.jsx';
import { getErrorMessage } from '../utils/error-handler.js';

/**
 * Shared email-capture form (input + submit + feedback).
 * Used both inline (categories empty-state) and inside the products-page modal.
 *
 * @param {() => void} [onSuccess] - called after a successful subscription.
 *   When provided (modal), the caller decides what to do next (e.g. close).
 *   When omitted (inline), the success message auto-hides after a few seconds.
 */
export default function EmailNotificationForm({ onSuccess }) {
    const [email, setEmail] = useState('');
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [emailError, setEmailError] = useState('');

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setEmailError('Email je obavezan.');
            return;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Unesite validnu email adresu.');
            return;
        }

        try {
            const response = await subscribeEmail(email);

            if (response.success) {
                setEmailSubmitted(true);
                setEmailError('');
                setEmail('');

                if (onSuccess) {
                    onSuccess();
                } else {
                    setTimeout(() => setEmailSubmitted(false), 8000);
                }
            } else {
                setEmailError(response.message || 'Email je već prijavljen.');
            }
        } catch (error) {
            console.error('Error subscribing email:', error);
            const errorMsg = getErrorMessage(error);

            if (errorMsg.includes('already subscribed')) {
                setEmailError('Email je već registrovan.');
            } else {
                setEmailError('Došlo je do greške. Proveriti format email-a i pokušajte ponovo.');
            }
        }
    };

    return (
        <>
            {emailSubmitted && (
                <Alert variant="success" className="mb-3">
                    Hvala! Obavestićemo vas kada nova kolekcija bude dostupna.
                </Alert>
            )}

            <Form onSubmit={handleEmailSubmit} className="email-notification-form">
                <Form.Group className="mb-3">
                    <Form.Control
                        type="email"
                        placeholder="Unesite vašu email adresu"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError('');
                        }}
                        className={emailError ? 'is-invalid' : ''}
                    />
                    {emailError && (
                        <div className="invalid-feedback d-block">{emailError}</div>
                    )}
                </Form.Group>
                <Button type="submit" className="notify-btn">
                    Obavesti me
                </Button>
            </Form>
        </>
    );
}
