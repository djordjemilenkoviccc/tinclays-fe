import '../style/footer.css';

import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

function Footer() {
    return (
        <Row className='footer'>
            <Col lg="12" md="12" sm="12">
                <p>Copyright: Tinclays 2024.</p>
            </Col>
        </Row>
    );
}

export default Footer;
