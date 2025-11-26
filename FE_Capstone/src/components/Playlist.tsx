import "../scss/playlist.scss";
import Song from "./Song";
import { IRootState, useAppDispatch, useAppSelector } from "../redux/store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import ShowSongType from "../types/ShowSongType";
import CustomModal from "./CustomModal";
import Form from "react-bootstrap/Form";
import {
  BiDotsVerticalRounded,
  BiInfoCircle,
  BiPlay,
  BiShuffle,
  BiX,
} from "react-icons/bi";
import {
  deletePlaylist,
  // ENDPOINT,
  findAllPlaylists,
  isShufflingSongs,
  renamePlaylist,
  resetPlaylist,
  resetPlaylists,
  saveCurrentPlaylist,
  saveCurrentSong,
} from "../redux/actions";
import { Modal } from "react-bootstrap";

const Playlist = () => {
  // const TOKEN = useAppSelector((state) => state.user.token);

  const { specification } = useParams();
  const allMoods = useAppSelector(
    (state) => state.allSongs.allMoodsName as string[]
  );

  const allPlaylists = useAppSelector((state) => state.allSongs.playlists);
  const allPlaylistsNames = Object.keys(allPlaylists);

  const songs = useAppSelector((state: IRootState) => {
    if (specification !== undefined) {
      if (
        (allMoods as string[]).includes(specification)
        // ||
        // specification === "confused"
      ) {
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

  // The songs saved in the db don't have the preview: we have to ask a request to the API for each song
  // useEffect(() => {
  //   if (specification && allPlaylistsNames.includes(specification)) {
  //     songs?.forEach((song: ShowSongType) => {
  //       fetch(ENDPOINT + "/api/track/" + song.id, {
  //         headers: { Authorization: `Bearer ${TOKEN}` },
  //       })
  //         .then((res) => {
  //           if (!res.ok) throw new Error("We couldn't retrieve the song");
  //           else return res.json();
  //         })
  //         .then((data) => {
  //           console.log("data da db", data);
  //           song.preview = data.preview;
  //         })
  //         .catch((err) => console.log("Error!", err));
  //     });
  //   }
  // }, []);

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
  const nameCountries = useAppSelector(
    (state) => state.options.nameCountries as string[]
  );

  const [isDeleted, setIsDeleted] = useState(false);
  const [alert, setAlert] = useState(false);
  const [isChangedName, setIsChangedName] = useState(false);
  const navigate = useNavigate();

  const changeName = (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(false);
    if (
      !nameCountries.includes(newName) &&
      !allMoods.includes(newName) &&
      !Object.keys(allPlaylists).includes(newName)
    ) {
      dispatch(renamePlaylist(specification as string, newName));
      dispatch(resetPlaylists());
      setIsChangedName(true);
      setTimeout(() => {
        dispatch(findAllPlaylists());
      }, 2000);
      setTimeout(() => {
        navigate("/library");
      }, 4000);
    } else {
      setAlert(true);
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  // const [isPictureLoading, setIsPictureLoading] = useState(true);
  const phrasesForLoading = [
    "Following the muses' whispers",
    "Is that the perfect song?",
    "Maybe not. The odyssey goes on",
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
        // specification === "confused" ||
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

  // While waiting for the songs
  useEffect(() => {
    if (
      !(
        isLoading
        // || isPictureLoading
      )
    )
      return;

    let change = 1;
    const interval = setInterval(() => {
      setPhrase(phrasesForLoading[change]);
      if (change === phrasesForLoading.length - 1) {
        change = 0;
      } else change++;
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoading]);

  // const [picturePlaylist, setPicturePlaylist] = useState("");

  // const getPicturePlaylist = () => {
  //   fetch(
  //     ENDPOINT + "/api/picture?search=" + specification?.replaceAll(" ", ""),
  //     {
  //       headers: { Authorization: `Bearer ${TOKEN}` },
  //     }
  //   )
  //     .then((res) => {
  //       if (!res.ok) {
  //         setIsPictureLoading(false);
  //         throw new Error("Couldn't fetch the image");
  //       } else {
  //         return res.json();
  //       }
  //     })
  //     .then((data) => {
  //       if (data && data.photos[0] && data.photos[0]) {
  //         setPicturePlaylist(data.photos[0].src.landscape);
  //       }
  //       setIsPictureLoading(false);
  //     })
  //     .catch((err) => console.log("Error!", err));
  // };

  useEffect(() => {
    // getPicturePlaylist();
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {isLoading ? (
        // || isPictureLoading
        <div
          className="d-flex flex-column justify-content-center align-items-center w-75 mx-auto text-center h-100 my-auto"
          style={{ minHeight: "90vh" }}
        >
          <p className="mb-5">{phrase}</p>
          <Loader />
        </div>
      ) : (
        <>
          <div className="position-relative">
            {isChangingName && (
              <div
                className="modal show modal-change-name"
                style={{
                  display: "block",
                  position: "absolute",
                  minHeight: "fit-content",
                }}
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
                      {alert && (
                        <p
                          className="text-danger small mb-3 mt-2 d-flex align-items-center w-75 mx-auto"
                          style={{ minWidth: "200px", maxWidth: "400px" }}
                        >
                          <BiInfoCircle
                            className="me-2"
                            style={{ width: "30px" }}
                          />{" "}
                          Don't use the name of a default mood, a country or one
                          that has already been used for anouther playlist
                        </p>
                      )}
                      {isChangedName && (
                        <p
                          className="text-white small mb-3 mt-2 d-flex align-items-center w-75 mx-auto"
                          style={{ minWidth: "200px", maxWidth: "400px" }}
                        >
                          Name of the playlist changed to {newName}! You'll be
                          redirected to the library shortly
                        </p>
                      )}
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
              // style={{ backgroundImage: `url(${picturePlaylist})` }}
            ></div>
            <div className="change-hero text-center">
              <h1 className="mb-4 pt-4">
                {specification
                  ? specification[0].toUpperCase() + specification.substring(1)
                  : "Playlist"}
              </h1>

              {songs && songs.length !== 0 && (
                <div className="player-playlist d-flex justify-content-center gap-4 align-items-center mb-3">
                  <BiShuffle
                    className={
                      isShuffle
                        ? "icons-for-playing text-white fs-3"
                        : "icons-for-playing fs-3"
                    }
                    onClick={() => {
                      dispatch(isShufflingSongs(!isShuffle));
                    }}
                  />
                  <div className="my-bg-container rounded-circle d-inline-block d-flex justify-content-center align-items-center play-button">
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
                  {allPlaylistsNames.includes(specification as string) &&
                    (specification as string).toLocaleLowerCase() !==
                      "favourite" && (
                      <span ref={iconRef} className="position-relative">
                        <BiDotsVerticalRounded
                          className="icons-for-playing fs-3"
                          onClick={() => setShowDropdown(!showDropdown)}
                        />
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
                                  setIsDeleted(true);
                                  dispatch(
                                    deletePlaylist(specification as string)
                                  );
                                  setTimeout(() => navigate("/library"), 2000);
                                }}
                              >
                                Delete playlist
                              </li>
                            </ul>
                          </div>
                        )}
                      </span>
                    )}
                </div>
              )}
            </div>
            {isDeleted && (
              <p className="pt-5 text-center mx-auto">
                You'll be redirected to the library in a couple of seconds
              </p>
            )}
            {/* <section className="pt-4 pb-5 bg-transparent z-1 position-relative"> */}
            <section className="pt-4 pb-5 bg-transparent position-relative">
              {songs &&
                songs.length === 0 &&
                allPlaylistsNames.includes(specification as string) &&
                (specification as string).toLocaleLowerCase() !==
                  "favourite" && (
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
              {songs && songs.length === 0 && !isDeleted && (
                <>
                  <p className="w-75 mx-auto mt-3 text-center">
                    {specification === "favourite"
                      ? "It's time to save your favourite songs or to look for new ones!"
                      : !allMoods.includes(specification as string)
                      ? `Your feelings are amazing, but our system isn't smart enough
                  yet to understand which songs are fitted for "${specification}
                  ". Want to give it another try with a more generic word?`
                      : "Uhm, the muses have decided to take away our inspiration. Can you give us a couple of seconds to convince them we're worth it?"}
                  </p>
                </>
              )}
              <div className="mx-3">
                {songs &&
                  (songs as ShowSongType[]).map((song) => (
                    <Song
                      key={song.id}
                      song={song}
                      playlist={songs as ShowSongType[]}
                      namePlaylist={specification as string}
                    />
                  ))}
              </div>
            </section>
            {showModal && <CustomModal />}
          </div>
        </>
      )}
    </>
  );
};

export default Playlist;
