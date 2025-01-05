import '../style/footer.css';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';
import { Row, Col } from 'react-bootstrap';

function Footer() {
    return (
        <Row className="footer">
            <Col lg="12" md="12" sm="12" className="text-center">
                <p className='copyright'>Copyright: @Tinclays {new Date().getFullYear()}.</p>
                <div className=" follow-us">
                    <a href="https://instagram.com/tinclays?igsh=d2doaGNmajlvMNGNo" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon
                            icon={faInstagram}
                            size="2x"
                            style={{ color: 'rgb(65, 65, 65)', marginRight: "15px" }}
                        />
                    </a>
                    <a href="https://www.tiktok.com/@tinclays?_t=8sGZvahEH13&_r=1" target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon
                            icon={faTiktok}
                            size="2x"
                            style={{ color: 'rgb(65, 65, 65)', marginBottom: "2px" }}
                        />
                    </a>
                </div>
            </Col>
        </Row>
    );
}

export default Footer;
