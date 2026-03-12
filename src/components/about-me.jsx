import '../style/about-me.css';
import '../style/home.css';
import { Row, Col } from 'react-bootstrap';
import { useState } from 'react';

export default function AboutMe() {
    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    return (
        <div className='home-root'>
            {/* Hero Section — image + intro side by side */}
            <section className="about-hero">
                <Row className="align-items-center g-0">
                    <Col lg="6" className="about-hero-image-col">
                        <div className="about-hero-image-wrapper">
                            <img
                                src="/about_me_optimized.webp"
                                alt="Tina — osnivač Tinclays"
                                className={`about-hero-image ${imageLoaded ? 'about-image-visible' : ''}`}
                                onLoad={handleImageLoad}
                            />
                        </div>
                    </Col>
                    <Col lg="6" className="about-hero-text-col">
                        <div className="about-hero-content">
                            <span className="about-label">O meni</span>
                            <h1 className="about-heading">Ćao, ja sam Tina</h1>
                            <div className="about-divider"></div>
                            <p className="about-text">
                                Magistar farmacije po struci, a zaljubljenik u glinu po srcu. Moja priča sa glinom počela je sasvim slučajno, ali to je bila ljubav na prvi dodir.
                            </p>
                            <p className="about-text">
                                Ono što je počelo kao hobi, ubrzo je preraslo u strast kroz koju izražavam svoju kreativnost i stvaram unikatne šoljice koje simbolizuju vedrinu, motivaciju i vedar duh.
                            </p>
                        </div>
                    </Col>
                </Row>
            </section>

            {/* Quote / highlight band */}
            <section className="about-quote-section">
                <blockquote className="about-quote">
                    "Svaka šoljica nosi malo topline, radosti i vedrog duha."
                </blockquote>
            </section>

            {/* More about me — passions */}
            <section className="about-passions">
                <Row className="justify-content-center">
                    <Col lg="8" md="10">
                        <h2 className="about-subheading">Izvan radionice</h2>
                        <div className="about-divider about-divider-center"></div>
                        <p className="about-text about-text-center">
                            Kada ne provodim vreme u radionici ili na poslu, uživam u planinarenju, trčanju i istraživanju prirode. Sport me ispunjava i održava fokusiranom, a ljudi s dobrim srcem i lepom energijom su mi nepresušni izvor inspiracije.
                        </p>
                        <p className="about-text about-text-center">
                            Dobrodošli na moj sajt — nadam se da će vam moje šoljice doneti malo topline i radosti u svakodnevni život.
                        </p>
                    </Col>
                </Row>
            </section>
        </div>
    );
}
