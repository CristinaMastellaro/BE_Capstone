import "../scss/playlist.scss";
import Song from "./Song";
import { IRootState, useAppDispatch, useAppSelector } from "../redux/store";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "./Loader";
import ShowSongType from "../types/ShowSongType";
import CustomModal from "./CustomModal";
import { BiPlay, BiShuffle } from "react-icons/bi";
import {
  isShufflingSongs,
  resetPlaylist,
  saveCurrentPlaylist,
  saveCurrentSong,
} from "../redux/actions";

const Playlist = () => {
  const { specification } = useParams();
  const allMoods = useAppSelector(
    (state) => state.allSongs.allMoodsName as string[]
  );
  const songs = useAppSelector((state: IRootState) => {
    if (specification !== undefined) {
      if ((allMoods as string[]).includes(specification)) {
        return state.allSongs.moods[specification];
      } else {
        return (state.allSongs.playlists as Record<string, ShowSongType[]>)[
          specification
        ];
      }
    }
  });

  // For playing songs
  const savedPlaylist = useAppSelector((state) => state.player.currentPlaylist);
  const isShuffle = useAppSelector((state) => state.player.isShuffled);

  const showModal = useAppSelector((state) => state.options.showModal);
  const dispatch = useAppDispatch();

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
    if (!isLoading) return;

    let change = 1;
    const interval = setInterval(() => {
      setPhrase(phrasesForLoading[change]);
      if (change === phrasesForLoading.length - 1) {
        change = 0;
      } else change++;
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoading]);

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
                {songs && songs.length !== 0 && (
                  <div className="player-playlist d-flex justify-content-md-end gap-4 align-items-center mb-4">
                    <BiShuffle
                      className={
                        isShuffle
                          ? "icons-for-playing my-pink fs-3"
                          : "icons-for-playing fs-3"
                      }
                      onClick={() => {
                        dispatch(isShufflingSongs(!isShuffle));
                      }}
                    />
                    <div className="me-5 my-bg-pink rounded-circle d-inline-block d-flex justify-content-center align-items-center play-button">
                      <BiPlay
                        className="ms-2 icons-for-playing"
                        onClick={() => {
                          dispatch(saveCurrentSong(songs[0]));
                          if (savedPlaylist !== songs) {
                            dispatch(resetPlaylist());
                            songs.forEach((song) =>
                              dispatch(saveCurrentPlaylist(song))
                            );
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>
            <section className="pt-4 pb-5">
              {songs && songs.length === 0 && (
                <>
                  <p className="w-75 mx-auto mt-3">
                    {specification === "favourite"
                      ? "It's time to save your favourite songs or to look for new ones!"
                      : allMoods.includes(specification as string)
                      ? `Your feelings are so deep, but our system isn't smart enough
                  yet to understand which songs are fitted for "${specification}
                  ". Want to give it another try with a more generic word?`
                      : "Isn't there some good music that feels like " +
                        specification +
                        "?"}
                  </p>
                </>
              )}
              {songs &&
                (songs as ShowSongType[]).map((song) => (
                  <Song
                    key={song.id}
                    song={song}
                    playlist={songs as ShowSongType[]}
                    namePlaylist={specification as string}
                  />
                ))}
            </section>
          </div>
          {showModal && <CustomModal />}
        </>
      )}
    </>
  );
};

export default Playlist;
