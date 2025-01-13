import '../style/about-me.css';
import '../style/home.css';
import { Button, Row, Col, Card } from 'react-bootstrap';

export default function AboutMe() {
    return (
        <div className='home-root'>

            <Row className="justify-content-center align-items-center mt-5" style={{paddingTop: "5%"}}>
                <Col className="justify-content-center align-items-center w-100">
                    <p className='about-text'>Ćao, ja sam Tina, magistar farmacije po struci, a zaljubljenik u glinu po srcu. Moja priča sa glinom počela je sasvim slučajno, ali to je bila ljubav na prvi dodir. Ono što je počelo kao hobi, ubrzo je preraslo u strast kroz koju izražavam svoju kreativnost i stvaram unikatne šoljice koje simbolizuju vedrinu, motivaciju i vedar duh.</p>
                    <p className='about-text'>Kada ne provodim vreme u radionici ili na poslu, uživam u planinarenju, trčanju i istraživanju prirode. Sport me ispunjava i održava fokusiranom, a ljudi s dobrim srcem i lepom energijom su mi nepresušni izvor inspiracije.</p>
                    <p className='about-text'>Dobrodošli na moj sajt - nadam se da će vam moje šoljice doneti malo topline i radosti u svakodnevni život.</p>
                </Col>
            </Row>
            <Row className="justify-content-center align-items-center mt-4">
                <Col lg="6" md="8" sm="10" className="d-flex justify-content-center">
                    <img
                        src="/about_me.jpg"
                        alt="About Me"
                        className="about-image"
                    />
                </Col>
            </Row>


        </div>
    )
}