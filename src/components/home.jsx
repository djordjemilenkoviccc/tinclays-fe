import '../style/home.css';

import Contact from './contact';
import { Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    const handleCardClick = (id) => {
        sessionStorage.setItem('scrollPosition', window.scrollY);
        navigate(`/products/${id}`, { state: { restoreScroll: true } });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToCollection = () => {
        const collectionElement = document.getElementById('id-collection');
        if (collectionElement) {
            collectionElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className='home-root'>

            <div className="overlay-container position-relative">
                <img
                    src="https://static.wixstatic.com/media/d01231e46af34161be7ad101d281a441.jpg/v1/fill/w_1960,h_1478,al_c,q_90,usm_0.66_1.00_0.01,enc_auto/d01231e46af34161be7ad101d281a441.jpg"
                    className='cover-img'
                    fetchpriority="high">
                </img>

                <div className="overlay-content position-absolute top-50 start-50 translate-middle text-center">
                    <h1 className='text-on-cover-image'>TINCLAYS</h1>
                    <p className='text-on-cover-image'>Mugs and More</p>
                    <Button className="btn-shop-now" onClick={scrollToCollection}>Shop now</Button>
                </div>
            </div>

            <Row id="id-collection" className='collection-paragraph'>
                <Col lg="12" md="12" sm="12">
                    <h3 className="pt-5">OUR COLLECTION</h3>

                    <p className="mt-3 mt-md-5">I'm a paragraph. Click here to add your own text and
                        edit
                        me. It’s easy.
                        Just click “Edit Text” or
                        double click me to add your own content and make changes to the font. I’m a great place for you
                        to
                        tell a story and let your users know a little more about you.</p>
                </Col>
            </Row>

            <Row>
                <Col lg="6" md="6" sm="12" className='text-center category-card' onClick={() => handleCardClick(1)}>
                    <img src="https://static.wixstatic.com/media/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg/v1/fill/w_1036,h_690,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg"
                        alt="I'm a product"
                        className='product-image'
                        fetchpriority="high">
                    </img>
                    <p>Rucno radjene solje sa spiralnom ruckom</p>
                </Col>

                <Col lg="6" md="6" sm="12" className='text-center category-card'>
                    <img src="https://static.wixstatic.com/media/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg/v1/fill/w_1036,h_690,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg"
                        alt="I'm a product"
                        className='product-image'
                        fetchpriority="high">
                    </img>
                    <p>Rucno radjene solje sa ravnom ruckom</p>
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col lg="6" md="6" sm="12" className='text-center category-card'>
                    <img src="https://static.wixstatic.com/media/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg/v1/fill/w_1036,h_690,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg"
                        alt="I'm a product"
                        className='product-image'
                        fetchpriority="high">
                    </img>
                    <p>TO-GO solje</p>
                </Col>

                <Col lg="6" md="6" sm="12" className='text-center category-card'>
                    <img src="https://static.wixstatic.com/media/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg/v1/fill/w_1036,h_690,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/697bc8_5b14db998c9f45379e50e7e7fb0ad18c~mv2_d_3000_1744_s_2.jpg"
                        alt="I'm a product"
                        className='product-image'
                        fetchpriority="high">
                    </img>
                    <p>Ostalo</p>
                </Col>
            </Row>

            
        </div>
    )
}