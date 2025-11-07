import { Col, Container, Row } from "react-bootstrap";
import CustomNavbar from "./CustomNav";
import PlayerMusic from "./PlayerMusic";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col
            lg={3}
            xl={2}
            className="d-none d-lg-block p-0 bg-black vh-100 px-3 pt-4 position-fixed"
          >
            <CustomNavbar />
          </Col>
          <Col xs={12} lg={9} xl={10} className="px-0 ms-auto">
            <Outlet />
          </Col>
        </Row>
      </Container>
      <PlayerMusic />
    </>
  );
};

export default MainLayout;
