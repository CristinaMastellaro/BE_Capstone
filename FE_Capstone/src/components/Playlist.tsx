import { Col, Container, Row } from "react-bootstrap";
import "../scss/playlist.scss";
import Song from "./Song";
import { IRootState, useAppSelector } from "../redux/store";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import PlayerMusic from "./PlayerMusic";
import CustomNavbar from "./CustomNav";

const Playlist = () => {
  const { specification } = useParams();
  const songs = useAppSelector((state: IRootState) => {
    if (specification !== undefined) {
      return state.allSongs.moods[specification];
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const phrasesForLoading = [
    "Last.fm API was used for this reasearch",
    "Following the sound of your mood",
    "Is that the perfect song?",
    "Maybe not. The adventure goes on",
    "There's an Italian saying that goes: 'The one who walks slowlys walks safely and goes far'. \nOur connection is taking this saying to the next level",
    "No, we haven't forgotten about you. How can we?",
    "So... You've been here for a while. Care to talk about your favourite song?",
  ];

  const [phrase, setPhrase] = useState(phrasesForLoading[0]);

  useEffect(() => {
    if (songs !== undefined) {
      setIsLoading(false);
    }
  }, [songs]);

  useEffect(() => {
    if (isLoading) {
      let change = 1;
      setInterval(() => {
        setPhrase(phrasesForLoading[change]);
        if (change === phrasesForLoading.length - 1) {
          change = 0;
        } else change++;
      }, 5000);
    }
  }, []);

  return (
    <>
      <Container fluid className="playlist">
        <Row>
          <Col
            // className="m-0 px-0 d-none d-lg-block p-0 bg-black"
            lg={3}
            xl={2}
            className="d-none d-lg-block p-0 bg-black vh-100 px-3 pt-4"
          >
            <CustomNavbar />
          </Col>
          <Col className="m-0 px-0" lg={9} xl={10}>
            {isLoading ? (
              <div className="d-flex flex-column justify-content-center align-items-center vh-100 w-75 mx-auto text-center">
                <p className="mb-5">{phrase}</p>
                <Loader />
              </div>
            ) : (
              <>
                <section className="hero"></section>
                <section className="pb-5">
                  <h1 className="my-4 ms-5">{specification}</h1>
                  {songs &&
                    songs.map((song) => (
                      <Song key={song.id} song={song} playlist={songs} />
                    ))}
                </section>
              </>
            )}
          </Col>
        </Row>
        <PlayerMusic />
      </Container>
    </>
  );
};

export default Playlist;
