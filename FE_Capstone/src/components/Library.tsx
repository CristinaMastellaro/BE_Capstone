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
      <div className="change-hero">
        <h1 className="fw-semibold">Library</h1>
      </div>
      <Row className="mx-0 mt-5 justify-content-center">
        <h2 className="mb-5 text-center">Playlists</h2>
        <Col xs={5} sm={3} lg={2} className="px-0 icon">
          <div
            className="favourite-songs-picture playlist-cover d-flex align-items-center justify-content-center"
            onClick={() => navigate("/playlist/favourite")}
          >
            <BsFillHeartFill className="fs-1" />
          </div>
          <p className="mt-2 text-center">Favourite</p>
        </Col>
        {playlists &&
          Object.keys(playlists).map((playlist) => {
            if (playlist !== "favourite") {
              const typeGradientList = [
                "linear-gradient(45deg",
                "radial-gradient(circle",
              ];
              const typeGradientIndex = Math.floor(Math.random() * 2);
              const rgba1 = Math.floor(Math.random() * 256);
              const rgba2 = Math.floor(Math.random() * 256);
              const rgba3 = Math.floor(Math.random() * 256);
              const rgba4 = Math.floor(Math.random() * 256);
              const rgba5 = Math.floor(Math.random() * 256);
              const rgba6 = Math.floor(Math.random() * 256);
              const firstPercentual = Math.floor(Math.random() * 50);
              const secondPercentual = Math.floor(Math.random() * 51 + 50);
              const rdmBg = `${typeGradientList[typeGradientIndex]}, rgba(${rgba1}, ${rgba2}, ${rgba3}, 1) ${firstPercentual}%, rgba(${rgba4}, ${rgba5}, ${rgba6}, 1) ${secondPercentual}%`;
              return (
                <Col xs={5} sm={3} lg={2} className="px-0 icon" key={playlist}>
                  <div
                    className="playlist-cover d-flex align-items-center justify-content-center"
                    style={{ backgroundImage: `${rdmBg}` }}
                    onClick={() => navigate("/playlist/" + playlist)}
                  ></div>
                  <p className="mt-2 text-center">{playlist}</p>
                </Col>
              );
            } else {
              return <></>;
            }
          })}
      </Row>
    </>
  );
};

export default Library;
