import { Col, Row } from "react-bootstrap";
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
      {/* <Container fluid> */}
      <div className="change-hero">
        <h1 className="fw-semibold">Library</h1>
      </div>
      <Row className="mx-0 mt-5">
        <h2 className="mb-5 text-center">Playlists</h2>
        {playlists &&
          Object.keys(playlists).map((playlist) => (
            <Col xs={4} lg={3} className="px-0" key={playlist}>
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
      {/* </Container> */}
    </>
  );
};

export default Library;
