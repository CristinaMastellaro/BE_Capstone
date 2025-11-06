import { Container } from "react-bootstrap";
import "../scss/playlist.scss";
import Song from "./Song";
import { IRootState, useAppSelector } from "../redux/store";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./Loader";

const Playlist = () => {
  const { specification } = useParams();
  const songs = useAppSelector((state: IRootState) => {
    console.log("specification", specification);
    if (specification !== undefined) {
      console.log(
        "state.allSongs.moods[specification]",
        state.allSongs.moods[specification]
      );
      return state.allSongs.moods[specification];
    }
  });

  const [isLoading, setIsLoading] = useState(true);
  const phrasesForLoading = [
    "We're searching for your music",
    "Last.fm API was used for this reasearch",
    "In mood for some music",
  ];

  useEffect(() => {
    if (songs !== undefined) {
      setIsLoading(false);
    }
    console.log("I entered the useEffect!");
  }, [songs]);

  return (
    <>
      <Container fluid className="p-0 playlist">
        {isLoading ? (
          <div className="d-flex flex-column justify-content-center align-items-center vh-100">
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
                  <Song
                    key={song.id}
                    id={song.id}
                    cover={song.cover}
                    author={song.author}
                    title={song.title}
                    preview={song.preview}
                  />
                ))}
            </section>
          </>
        )}
      </Container>
    </>
  );
};

export default Playlist;
