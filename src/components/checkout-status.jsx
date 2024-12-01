import '../style/checkout.css';
import '../style/home.css';
import React from 'react';

import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Form, Button } from 'react-bootstrap';


export default function CheckoutStatus() {
    const navigate = useNavigate();
    const location = useLocation();
    const { message, status, description } = location.state || {};

    const backToShop = () => {
        navigate('/');
    }

    return (
        <div className="home-root text-center">
            {status === "success" && (
                <div>
                    <h2 className='pt-3 pb-5' style={{ color: "green" }}>{message}</h2>

                    <p>Hvala na porudžbini. Na Vaš email ćemo poslati detalje o porudžbini kao i uputstvo za plaćanje.</p>
                    <p>Nakon što evidentiramo uplatu, šaljemo paket brzom poštom.</p>
                </div>
            )}
            {status === "failed" && (
                <div>
                    <h2 className='pt-3 pb-5' style={{ color: "red" }}>{message}</h2>
                    <p>{description}</p>
                </div>
            )}
            <Button variant="dark" className="w-50 border-0 rounded-0 mt-5" onClick={() => backToShop()}>Nazad na Shop</Button>

        </div>
    )
}