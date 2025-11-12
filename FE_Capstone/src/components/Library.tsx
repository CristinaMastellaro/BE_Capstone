import { Col, Container, Row } from "react-bootstrap";
import "../scss/library.scss";
import { BsFillHeartFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/store";
import ShowSongType from "../types/ShowSongType";

const Library = () => {
  const navigate = useNavigate();
  const playlists = useAppSelector(
    (state) => state.allSongs.playlists as Record<string, ShowSongType[]>
  );

  return (
    <>
      <Container fluid>
        <h1 className="mt-5 ms-4 fw-bold">Library</h1>
        <Row className="ms-3 mt-5">
          <h2 className="mb-5">Playlist</h2>
          {playlists &&
            Object.keys(playlists).map((playlist) => (
              <Col xs={4} md={3} lg={2} className="px-0" key={playlist}>
                <div
                  className="favourite-songs-picture d-flex align-items-center justify-content-center"
                  onClick={() => navigate("/playlist/" + playlist)}
                >
                  <BsFillHeartFill className="fs-1" />
                </div>
                <p className="mt-2 text-center">{playlist}</p>
              </Col>
            ))}
        </Row>
      </Container>
    </>
  );
};

export default Library;
