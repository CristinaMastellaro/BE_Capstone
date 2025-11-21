import { Col, Container, Row } from "react-bootstrap";
import CustomNavbar from "./CustomNav";
import PlayerMusic from "./PlayerMusic";
import { Outlet } from "react-router-dom";
import "../scss/customNav.scss";
import CustomFooter from "./CustomFooter";

const MainLayout = () => {
  return (
    <>
      <Container fluid className="my-bg-container">
        <Row>
          <Col
            xs={12}
            lg={3}
            xl={2}
            className="py-2 p-lg-0 bg-black px-lg-3 pt-lg-4 position-fixed bottom-0 custom-nav z-1"
          >
            <CustomNavbar />
          </Col>
          <Col
            xs={12}
            lg={9}
            xl={10}
            className={"px-0 ms-auto d-flex flex-column"}
            style={{ minHeight: "100vh" }}
          >
            <div className="flex-grow-1 px-0 mx-0">
              <Outlet />
            </div>
            <div className="z-0 position-relative">
              <CustomFooter />
            </div>
          </Col>
        </Row>
      </Container>
      <div className="position-relative z-2">
        <PlayerMusic />
      </div>
    </>
  );
};

export default MainLayout;
