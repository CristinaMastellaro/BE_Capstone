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
  TOKEN_PEXEL,
} from "../redux/actions";
import { createClient } from "pexels";

const Playlist = () => {
  const { specification } = useParams();
  const allMoods = useAppSelector(
    (state) => state.allSongs.allMoodsName as string[]
  );
  const allPlaylists = useAppSelector((state) => state.allSongs.playlists);
  const allPlaylistsNames = Object.keys(allPlaylists);
  const songs = useAppSelector((state: IRootState) => {
    if (specification !== undefined) {
      if ((allMoods as string[]).includes(specification)) {
        return state.allSongs.moods[specification];
      } else if (allPlaylistsNames.includes(specification)) {
        return (state.allSongs.playlists as Record<string, ShowSongType[]>)[
          specification
        ];
      } else {
        return state.allSongs.playlistNotPermanentlySaved;
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
    "Following the sound of your mood",
    "Is that the perfect song?",
    "Maybe not. The adventure goes on",
    "There's an Italian saying that goes: 'The one who walks slowlys walks safely and goes far'. \nOur connection is taking this saying to the next level",
    "No, we haven't forgotten about you. How can we?",
    "So... You've been here for a while. Care to talk about your favourite song?",
    "That's what you like, uh? Let us look for it, then",
  ];

  const [phrase, setPhrase] = useState(phrasesForLoading[0]);
  useEffect(() => {
    if (
      !(
        (allMoods as string[]).includes(specification as string) ||
        allPlaylistsNames.includes(specification as string)
      ) &&
      (songs as ShowSongType[]).length !== 0
    ) {
      setIsLoading(false);
      // } else if (songs !== undefined) {
    } else if (
      ((allMoods as string[]).includes(specification as string) ||
        allPlaylistsNames.includes(specification as string)) &&
      songs !== undefined
    ) {
      setIsLoading(false);
    }
  }, [songs]);

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

  const [picturePlaylist, setPicturePlaylist] = useState("");

  const getPicturePlaylist = () => {
    // const client = createClient(TOKEN_PEXEL as string);
    fetch("https://api.pexels.com/v1/search?query=" + specification, {
      headers: { Authorization: TOKEN_PEXEL as string },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Couldn't fetch the image");
        else return res.json();
      })
      .then((data) => {
        console.log("data image", data);
        setPicturePlaylist(data.photos[0].src.landscape);
      })
      .catch((err) => console.log("Error!", err));
  };

  useEffect(() => {
    getPicturePlaylist();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="d-flex flex-column justify-content-center align-items-center w-75 mx-auto text-center h-100 my-auto">
          <p className="mb-5">{phrase}</p>
          <Loader />
        </div>
      ) : (
        <>
          <div
            className="hero"
            style={{ backgroundImage: `url(${picturePlaylist})` }}
            // style={{ filter: `url(${picturePlaylist})` }}
          ></div>
          {/* <section
              className="hero"
              style={{ backgroundImage: `url(${picturePlaylist})` }}
            > */}
          <div className="change-hero bg-transparent">
            <h1 className="my-4 ms-5">
              {specification
                ? specification[0].toUpperCase() + specification.substring(1)
                : "Playlist"}
            </h1>
            {songs && songs.length !== 0 && (
              <div className="player-playlist d-flex justify-content-md-end gap-4 align-items-center mb-3">
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
          {/* </section> */}
          <section className="pt-4 pb-5 bg-transparent z-1 position-relative">
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
          {/* </div> */}
          {showModal && <CustomModal />}
        </>
      )}
    </>
  );
};

export default Playlist;
