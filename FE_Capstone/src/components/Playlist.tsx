import { Container } from "react-bootstrap";
import "../scss/playlist.scss";
import Song from "./Song";
import { IRootState, useAppSelector } from "../redux/store";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import PlayerMusic from "./PlayerMusic";

const Playlist = () => {
  const { specification } = useParams();
  const songs = useAppSelector((state: IRootState) => {
    if (specification !== undefined) {
      return state.allSongs.moods[specification];
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const phrasesForLoading = [
    "We're searching for your music",
    "Last.fm API was used for this reasearch",
    "In mood for some music",
    "No, we haven't forgotten about you. \nThe API is just slow",
    "There's an Italian saying that goes: 'The one who walks slowlys walks safely and goes far'. \nOur connection is taking this saying to the next level",
  ];

  useEffect(() => {
    if (songs !== undefined) {
      setIsLoading(false);
    }
  }, [songs]);

  return (
    <>
      <Container fluid className="p-0 playlist pb-5">
        {isLoading ? (
          <div className="d-flex flex-column justify-content-center align-items-center vh-100 w-75 mx-auto text-center">
            {phrasesForLoading.map((phrase) => (
              <p key={phrase}>{phrase}</p>
            ))}
            <Loader />
          </div>
        ) : (
          <>
            <section className="hero"></section>
            <section>
              <h1 className="my-4 ms-5">{specification}</h1>
              {songs &&
                songs.map((song) => (
                  <Song key={song.id} song={song} playlist={songs} />
                ))}
            </section>
          </>
        )}
        <PlayerMusic />
      </Container>
    </>
  );
};

export default Playlist;
