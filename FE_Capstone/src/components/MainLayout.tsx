import { Col, Container, Row } from "react-bootstrap";
import CustomNavbar from "./CustomNav";
import PlayerMusic from "./PlayerMusic";
import { Outlet } from "react-router-dom";
import "../scss/customNav.scss";
import CustomFooter from "./CustomFooter";

const MainLayout = () => {
  return (
    <>
      <Container fluid>
        <Row>
          <Col
            xs={12}
            lg={3}
            xl={2}
            className="py-2 p-lg-0 bg-black px-lg-3 pt-lg-4 position-fixed bottom-0 custom-nav"
          >
            <CustomNavbar />
          </Col>
          <Col
            xs={12}
            lg={9}
            xl={10}
            className="px-0 ms-auto d-flex flex-column"
            style={{ minHeight: "100vh" }}
          >
            <div className="flex-grow-1">
              <Outlet />
            </div>
            <div>
              <CustomFooter />
            </div>
          </Col>
        </Row>
      </Container>
      <PlayerMusic />
    </>
  );
};

export default MainLayout;
