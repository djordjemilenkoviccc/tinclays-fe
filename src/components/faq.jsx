import '../style/faq.css';
import '../style/home.css';
import { Accordion, Container, Row, Col } from 'react-bootstrap';

export default function Faq() {

    const faqData = [
        {
            question: "Kako se šoljice održavaju?",
            answer: "Šoljice možete prati u mašini za pranje posuđa, ali se svakako uvek više preporučuje ručno pranje.",
        },
        // {
        //     question: "Koje veličine su šoljice?",
        //     answer: "Odgovoriti"
        // },
        {
            question: "Kako funkcioniše prodaja?",
            answer: "Prodaja trenutno funkcioniše na sledeći način. Nakon što izaberete proizvod koji želite i kreirate porudžbinu, na Vaš email ćemo poslati instrukcije za plaćanje. Plaćanje možete izvršiti u pošti ili preko mobilne aplikacije Vaše banke popunjavanjem uplatnice ili skeniranjem QR koda iz aplikacije banke. Nakon što evidentiramo uplatu, Vaš proizvod šaljemo brzom poštom."
        },
        {
            question: "Koliko traje proces pravljenja šolje?",
            answer: "Proces pravljenja šolje traje oko mesec dana. Najpre napravljene šoljice se suše 10-ak dana na sobnoj temperaturi. Potom se peku prvi put na temperaturi od 900 stepeni. Zatim se šolje oslikavaju bojama, glaziraju i ponovo peku na 1200 stepeni. Nakon toga se dodaje nadglazurno zlato, pa sledi dodatni krug pečenja na manjoj temperaturi.",
        },
        {
            question: "Koji je način preuzimanja i slanja?",
            answer: "Sve poručene šoljice šaljemo brzom poštom. Ukoliko želite, šoljicu možete preuzeti lično u našem studiju.",
        },
        {
            question: "Koja je cena poštarine?",
            answer: "Poštarinu plaća kupac i cena iznosi oko 500 din.",
        },
        {
            question: "Kada poručim šolju, kada ona stiže na adresu?",
            answer: "Šoljice šaljemo 2-3 radna dana po porudžbini, poštar stiže kod Vas dan nakon slanja.",
        },
        {
            question: "Šta se dešava ukoliko se šoljica razbije prilikom transporta?",
            answer: "Ukoliko dođe do potpunog oštećenja šoljice prilikom transporta, potrebno je da nam pošaljete snimak i mi ćemo Vam vratiti novac.",
        },
        {
            question: "Koliko često izlaze kolekcije novih šolja?",
            answer: "Svaki mesec, kao što smo naveli proces izrade je prilično dug.",
        },
        {
            question: "Da li mogu da napišem personalizovani natpis na šoljicu?",
            answer: "Ne radimo personalizovanje šoljica, osim ukoliko ne najavimo da je u pitanju \"Custom made\" kolekcija.",
        },
        {
            question: "Da li radite porudžbine unapred tzv. pre-order?",
            answer: "Ne radimo pre-order, prodajemo isključivo ono što je na stanju. Iz jednostavnog razloga, rad sa keramikom je veoma senzitivan i ne možemo obećati da neće doći do pucanja prilikom pečenja. Iz tog razloga prodajemo samo šoljice za koje garantujemo kvalitet.",
        },
    ];

    return (
        <div className='home-root'>


            <Row className="text-center mb-4" style={{paddingTop: "5%"}}>
                <Col>
                    <p className="faq-subheader">
                        Pronađite odgovore na uobičajena pitanja o našim proizvodima i uslugama.
                    </p>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Accordion>
                        {faqData.map((item, index) => (
                            <Accordion.Item eventKey={index.toString()} key={index}>
                                <Accordion.Header>{item.question}</Accordion.Header>
                                <Accordion.Body>{item.answer}</Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Col>
            </Row>


        </div>
    )
}