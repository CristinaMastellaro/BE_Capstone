import "../scss/playlist.scss";
import Song from "./Song";
import { IRootState, useAppDispatch, useAppSelector } from "../redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import ShowSongType from "../types/ShowSongType";
import CustomModal from "./CustomModal";
import Form from "react-bootstrap/Form";
import { BiDotsVerticalRounded, BiPlay, BiShuffle, BiX } from "react-icons/bi";
import {
  deletePlaylist,
  isShufflingSongs,
  renamePlaylist,
  resetPlaylist,
  saveCurrentPlaylist,
  saveCurrentSong,
  TOKEN_PEXEL,
} from "../redux/actions";
import { Modal } from "react-bootstrap";

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

  // For dropwdown
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      iconRef.current &&
      !iconRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  // For change name playlist
  const [isChangingName, setIsChangingName] = useState(false);
  const [newName, setNewName] = useState("");

  const navigate = useNavigate();
  const changeName = () => {
    dispatch(renamePlaylist(specification as string, newName));
    navigate("/library");
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isPictureLoading, setIsPictureLoading] = useState(true);
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
    } else if (
      ((allMoods as string[]).includes(specification as string) ||
        allPlaylistsNames.includes(specification as string)) &&
      songs !== undefined
    ) {
      setIsLoading(false);
    }
  }, [songs]);

  useEffect(() => {
    if (!(isLoading || isPictureLoading)) return;

    let change = 1;
    const interval = setInterval(() => {
      setPhrase(phrasesForLoading[change]);
      if (change === phrasesForLoading.length - 1) {
        change = 0;
      } else change++;
    }, 5000);

    return () => clearInterval(interval);
  }, [isPictureLoading, isLoading]);

  const [picturePlaylist, setPicturePlaylist] = useState("");

  const getPicturePlaylist = () => {
    fetch("https://api.pexels.com/v1/search?query=" + specification, {
      headers: { Authorization: TOKEN_PEXEL as string },
    })
      .then((res) => {
        if (!res.ok) {
          setIsPictureLoading(false);
          throw new Error("Couldn't fetch the image");
        } else return res.json();
      })
      .then((data) => {
        setPicturePlaylist(data.photos[0].src.landscape);
        setIsPictureLoading(false);
      })
      .catch((err) => console.log("Error!", err));
  };

  useEffect(() => {
    getPicturePlaylist();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {isLoading || isPictureLoading ? (
        <div className="d-flex flex-column justify-content-center align-items-center w-75 mx-auto text-center h-100 my-auto">
          <p className="mb-5">{phrase}</p>
          <Loader />
        </div>
      ) : (
        <>
          <div className="position-relative">
            {isChangingName && (
              <div
                className="modal show modal-change-name"
                style={{ display: "block", position: "absolute" }}
              >
                <Modal.Dialog>
                  <Modal.Header className="d-flex justify-content-between">
                    <Modal.Title>Change playlist name</Modal.Title>
                    <BiX onClick={() => setIsChangingName(false)} />
                  </Modal.Header>

                  <Modal.Body>
                    <Form onSubmit={changeName}>
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Label>New playlist name:</Form.Label>
                        <Form.Control
                          type="text"
                          className="w-75"
                          placeholder={specification}
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                        />
                      </Form.Group>
                      <button type="submit" className="my-btn-blue">
                        Save
                      </button>
                    </Form>
                  </Modal.Body>
                </Modal.Dialog>
              </div>
            )}
            <div
              className="hero"
              style={{ backgroundImage: `url(${picturePlaylist})` }}
            ></div>
            <div className="change-hero bg-transparent">
              <h1 className="my-4 ms-5">
                {specification
                  ? specification[0].toUpperCase() + specification.substring(1)
                  : "Playlist"}
              </h1>
              {songs && songs.length !== 0 && (
                <div className="player-playlist d-flex justify-content-md-end gap-4 align-items-center mb-3 me-5">
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
                  <div className="my-bg-pink rounded-circle d-inline-block d-flex justify-content-center align-items-center play-button">
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
                  {allPlaylistsNames.includes(specification as string) && (
                    <span ref={iconRef}>
                      <BiDotsVerticalRounded
                        className="icons-for-playing fs-3"
                        onClick={() => setShowDropdown(!showDropdown)}
                      />
                    </span>
                  )}
                  {showDropdown && (
                    <div
                      ref={dropdownRef}
                      className="drop-order-playlist text-dark small"
                    >
                      <ul>
                        <li onClick={() => setIsChangingName(true)}>
                          Rename playlist
                        </li>
                        <li
                          onClick={() => {
                            dispatch(deletePlaylist(specification as string));
                            navigate("/library");
                          }}
                        >
                          Delete playlist
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            <section className="pt-4 pb-5 bg-transparent z-1 position-relative">
              {songs &&
                songs.length === 0 &&
                allPlaylistsNames.includes(specification as string) && (
                  <>
                    <div className="d-flex justify-content-end">
                      <span ref={iconRef}>
                        <BiDotsVerticalRounded
                          className="icons-for-playing me-5 fs-3 "
                          onClick={() => setShowDropdown(!showDropdown)}
                        />
                      </span>
                    </div>
                    {showDropdown && (
                      <div
                        ref={dropdownRef}
                        className="drop-order-playlist text-dark small"
                      >
                        <ul>
                          <li onClick={() => setIsChangingName(true)}>
                            Rename playlist
                          </li>
                          <li
                            onClick={() => {
                              dispatch(deletePlaylist(specification as string));
                              navigate("/library");
                            }}
                          >
                            Delete playlist
                          </li>
                        </ul>
                      </div>
                    )}
                  </>
                )}
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
            {showModal && <CustomModal />}
          </div>
        </>
      )}
    </>
  );
};

export default Playlist;
