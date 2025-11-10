import { Col, Container, Row } from "react-bootstrap";
import "../scss/library.scss";
import { BsFillHeartFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const Library = () => {
  const navigate = useNavigate();

  return (
    <>
      <Container fluid>
        <h1 className="mt-5 ms-4 fw-bold">Library</h1>
        <Row className="ms-3 mt-5">
          <h2 className="mb-5">Playlist</h2>
          <Col xs={4} md={3} lg={2} className="px-0">
            <div
              className="favourite-songs-picture d-flex align-items-center justify-content-center"
              onClick={() => navigate("/playlist/favourite")}
            >
              <BsFillHeartFill className="fs-1" />
            </div>
            <p className="mt-2 text-center">Favourite</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Library;
