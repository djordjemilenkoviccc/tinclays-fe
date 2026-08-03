import { Modal } from 'react-bootstrap';
import EmailNotificationForm from './email-notification-form';

export default function EmailNotificationModal({ show, onClose }) {
    // After a successful subscription, briefly show the success message,
    // then close so the (out-of-stock) products behind become visible.
    const handleSuccess = () => {
        setTimeout(() => {
            onClose();
        }, 2500);
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Nova kolekcija uskoro stiže!</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
                <p className="mb-4" style={{ fontSize: '16px', color: '#666' }}>
                    Trenutno nemamo proizvoda na stanju za ovu kolekciju, ali novi
                    proizvodi su na putu. Ostavite nam svoju email adresu i bićete prvi
                    koji će saznati kada novi proizvodi stignu!
                </p>
                <EmailNotificationForm onSuccess={handleSuccess} />
            </Modal.Body>
        </Modal>
    );
}
