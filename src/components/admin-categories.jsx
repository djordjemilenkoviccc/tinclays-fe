import { Card, Button, Row, Col, Dropdown, DropdownButton, Form } from 'react-bootstrap';


export default function AdminCategories() {

    const categories = [
        {
            "id": "1",
            "name": "Ravne solje"
        },
        {
            "id": "2",
            "name": "Rucne solje"
        }
    ];

    return (
        <div className="align-items-center" style={{ marginTop: "40px", paddingLeft: "5%", paddingRight: "5%" }}>
            <button>Dodaj novu kategoriju</button>

            <Row lg="12" md="12" sm="12" className="justify-content-center">
                {categories.map((category) => (
                    <Col lg="6" md="12" sm="12" className="mb-5 sm-5" key={category.id}>
                        <Card className="d-flex flex-column justify-content-between" style={{ height: '100%', position: 'relative', border: "1px solid black" }}>
                            <Card.Body>
                                {category.name}
                            </Card.Body>
                        </Card>
                    </Col>
                ))};
            </Row>
        </div>
    )
}