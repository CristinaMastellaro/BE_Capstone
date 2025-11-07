import "../scss/playlist.scss";
import Song from "./Song";
import { IRootState, useAppSelector } from "../redux/store";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./Loader";

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

  // TODO: non penso che questa cosa si fermi mai
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
      {isLoading ? (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 w-75 mx-auto text-center">
          <p className="mb-5">{phrase}</p>
          <Loader />
        </div>
      ) : (
        <>
          <div style={{ minHeight: "100vh" }}>
            <section className="hero">
              <div className="change-hero">
                <h1 className="my-4 ms-5">
                  {specification
                    ? specification[0].toUpperCase() +
                      specification.substring(1)
                    : "Playlist"}
                </h1>
              </div>
            </section>
            <section className="pb-5">
              {songs && songs.length < 5 && (
                <p className="w-75 mx-auto mt-3">
                  Your feelings are so deep, but our system isn't smart enough
                  yet to understand which songs are fitted for "{specification}
                  "". Want to give it another try with a more generic word?
                </p>
              )}
              {songs &&
                songs.map((song) => (
                  <Song key={song.id} song={song} playlist={songs} />
                ))}
            </section>
          </div>
        </>
      )}
    </>
  );
};

export default Playlist;
