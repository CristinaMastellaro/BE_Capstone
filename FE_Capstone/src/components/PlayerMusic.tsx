import { Col, Container, Image, Row } from "react-bootstrap";
import "../scss/musicPlayer.scss";
import "../scss/playerDetails.scss";
import { useEffect, useRef, useState } from "react";
import {
  BiShuffle,
  BiSkipPrevious,
  BiPlay,
  BiPause,
  BiSkipNext,
  BiRepeat,
  BiVolumeFull,
  BiSolidHeart,
  BiHeart,
  BiDotsVerticalRounded,
} from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  addNewFavourite,
  changeShowModal,
  deleteFavourite,
  ENDPOINT,
  isPlayingSong,
  isRepeatingSong,
  isShufflingSongs,
  resetPlaylist,
  saveCurrentPlaylist,
  saveCurrentSong,
  savePlaylistNotToSavePermanentlyNotCountry,
  showDetails,
} from "../redux/actions";
import ShowSongType from "../types/ShowSongType";
import { GrDown } from "react-icons/gr";
import CustomModal from "./CustomModal";
import { useNavigate } from "react-router-dom";

const PlayerMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = useAppSelector(
    (state) => state.player.currentSong as ShowSongType
  );
  const currentPlaylist = useAppSelector(
    (state) => state.player.currentPlaylist as ShowSongType[]
  );
  const isPlaying = useAppSelector(
    (state) => state.player.isPlaying as boolean
  );
  const isShuffle = useAppSelector(
    (state) => state.player.isShuffled as boolean
  );
  const isOnRepeat = useAppSelector(
    (state) => state.player.isOnRepeat as boolean
  );
  const isFavourite = useAppSelector((state) => {
    const idFavouriteSongs: string[] = [];
    (
      (state.allSongs.playlists as Record<string, ShowSongType[]>)
        .favourite as ShowSongType[]
    ).forEach((fav) => idFavouriteSongs.push(fav.id));
    return idFavouriteSongs.includes(currentSong.id.toString());
  });

  const showPlayer = useAppSelector(
    (state) => (state.player.currentSong as ShowSongType).id === ""
  );
  const [classRepeat, setClassRepeat] = useState("");
  const [classShuffle, setClassShuffle] = useState("");

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isOnRepeat) {
      setClassRepeat("selected");
    } else {
      setClassRepeat("");
    }
  }, [isOnRepeat]);

  useEffect(() => {
    if (isShuffle) {
      setClassShuffle("selected");
    } else {
      setClassShuffle("");
    }
  }, [isShuffle]);

  // Elements to make the buttons and volume work
  const [valueTimeMusic, setValueTimeMusic] = useState(
    audioRef.current === null ? 0 : audioRef.current.currentTime
  );

  const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
  };

  let rAF: number;
  const whilePlaying = () => {
    setValueTimeMusic(Math.floor(audioRef.current!.currentTime));
    rAF = requestAnimationFrame(whilePlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      requestAnimationFrame(whilePlaying);
    } else {
      audioRef.current?.pause();
      cancelAnimationFrame(rAF);
    }
  }, [isPlaying, currentSong, valueTimeMusic]);

  const goNext = () => {
    let index = currentPlaylist.indexOf(currentSong);
    if (index === currentPlaylist.length - 1) {
      index = 0;
    } else index++;
    const newSong = currentPlaylist[index];
    dispatch(saveCurrentSong(newSong));
  };

  // For shuffling
  const playlistNormalOrder = useAppSelector(
    (state) => state.allSongs.playlistNotPermanentlySaved
  );

  const shuffleSongs = () => {
    if (!isShuffle) {
      const shuffledPlaylist: ShowSongType[] = [];
      const indexesAlreadyInShuffledPlaylist: number[] = [];
      while (shuffledPlaylist.length !== playlistNormalOrder.length) {
        const randomIndex = Math.floor(
          Math.random() * playlistNormalOrder.length
        );
        if (!indexesAlreadyInShuffledPlaylist.includes(randomIndex)) {
          shuffledPlaylist.push(playlistNormalOrder[randomIndex]);
          indexesAlreadyInShuffledPlaylist.push(randomIndex);
        }
      }
      dispatch(resetPlaylist());
      shuffledPlaylist.forEach((song) => dispatch(saveCurrentPlaylist(song)));
    } else {
      dispatch(resetPlaylist());
      playlistNormalOrder.forEach((song) =>
        dispatch(saveCurrentPlaylist(song))
      );
    }
  };

  // Volume
  const [volumeValue, setVolumeValue] = useState(80);

  // For details song
  const doShowDetails = useAppSelector((state) => state.player.showDetails);

  // Add to playlist
  const showModal = useAppSelector((state) => state.options.showModal);
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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search by artist
  const navigate = useNavigate();
  const TOKEN = useAppSelector((state) => state.user.token);

  const searchArtist = () => {
    fetch(ENDPOINT + "/api/search?query=" + currentSong.author, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    })
      .then((res) => {
        if (!res.ok) {
          {
            throw new Error("Error while searching for your query");
          }
        } else {
          return res.json();
        }
      })
      .then((data) => {
        const songsToAdd: ShowSongType[] = [];
        let singleSong;

        for (let i = 0; i < data.data.length; i++) {
          singleSong = data.data[i];
          songsToAdd.push({
            id: singleSong.id,
            cover: singleSong.album.cover_xl,
            title: singleSong.title,
            author: singleSong.artist.name,
            preview: singleSong.preview,
          });
        }
        dispatch(savePlaylistNotToSavePermanentlyNotCountry(songsToAdd));
        dispatch(showDetails(false));
        navigate("/playlist/" + currentSong.author);
      })
      .catch((err) => {
        console.log("Error!", err);
      });
  };

  return (
    <>
      <audio
        className="d-none"
        ref={audioRef}
        src={currentSong.preview}
        controls
        onEnded={() => {
          setValueTimeMusic(0);
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
          if (!isOnRepeat) goNext();
        }}
      />
      {currentSong && !doShowDetails ? (
        <Container
          fluid
          className={
            showPlayer
              ? "music-player justify-content-between d-none"
              : "music-player justify-content-between"
          }
        >
          {/* Info songs */}
          <Row className="p-2 justify-content-between justify-content-lg-start align-items-center flex-nowrap w-100">
            <Col
              className="d-flex"
              xs={5}
              lg={5}
              onClick={() => {
                dispatch(showDetails(true));
              }}
            >
              <img
                src={currentSong.cover}
                alt="Cover of the song"
                className="me-3 img-player-music"
              />
              <div className="flex-grow-1 d-flex flex-column justify-content-center w-100">
                <p className="mb-0 fw-bold song-info-player">
                  {currentSong.title}
                </p>
                <p className="mb-0 song-info-player">{currentSong.author}</p>
              </div>
            </Col>
            {/* Player buttons */}
            <Col xs={4} lg={4}>
              <div className="d-flex gap-2 align-items-center justify-content-end justify-content-md-center opacity-50">
                <BiShuffle
                  className={" d-none d-md-block icon " + classShuffle}
                  onClick={() => {
                    dispatch(isShufflingSongs(!isShuffle));
                    shuffleSongs();
                  }}
                />
                <BiSkipPrevious
                  className="fs-3 icon"
                  onClick={() => {
                    let index = currentPlaylist.indexOf(currentSong);
                    if (isShuffle) {
                      index = Math.floor(
                        Math.random() * currentPlaylist.length
                      );
                    } else {
                      if (index === 0) {
                        index = currentPlaylist.length - 1;
                      } else {
                        index--;
                      }
                    }
                    const newSong = currentPlaylist[index];
                    dispatch(saveCurrentSong(newSong));
                  }}
                />
                {isPlaying ? (
                  <BiPause
                    className="fs-1 icon"
                    onClick={() => {
                      dispatch(isPlayingSong(false));
                    }}
                  />
                ) : (
                  <BiPlay
                    className="fs-1 icon"
                    onClick={() => {
                      dispatch(isPlayingSong(true));
                    }}
                  />
                )}
                <BiSkipNext className="fs-3 icon" onClick={goNext} />
                <BiRepeat
                  className={" d-none d-md-block icon " + classRepeat}
                  onClick={() => {
                    dispatch(isRepeatingSong(!isOnRepeat));
                  }}
                />
              </div>
              <div className="d-none d-lg-flex justify-content-between align-items-center">
                <span id="currentTime">{calculateTime(valueTimeMusic)}</span>
                <input
                  type="range"
                  id="timeMusic"
                  max="29"
                  value={valueTimeMusic}
                  style={{ width: "65%" }}
                  onChange={(e) => {
                    setValueTimeMusic(Number(e.currentTarget.value));
                    audioRef.current!.currentTime = Number(
                      e.currentTarget.value
                    );
                    if (!audioRef.current!.paused) {
                      requestAnimationFrame(whilePlaying);
                    }
                  }}
                />
                <span>0:29</span>
              </div>
            </Col>
            {/* Volume */}
            <Col
              sm={2}
              md={4}
              lg={3}
              className="align-items-center gap-2 justify-content-center justify-content-lg-end d-none d-sm-flex pe-0"
            >
              {isFavourite ? (
                <BiSolidHeart
                  className="d-none d-sm-block ms-auto ms-md-5 me-lg-2 my-pink"
                  onClick={() => dispatch(deleteFavourite(currentSong))}
                />
              ) : (
                <BiHeart
                  className="d-none d-sm-block ms-auto ms-md-5 me-lg-2 icon"
                  onClick={() => dispatch(addNewFavourite(currentSong))}
                />
              )}
              <BiVolumeFull className="opacity-50 d-none d-lg-block" />
              <div className="d-none d-lg-flex">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volumeValue}
                  onChange={(e) => {
                    setVolumeValue(Number(e.currentTarget.value));
                    audioRef.current!.volume =
                      Number(e.currentTarget.value) / 100;
                  }}
                  style={{
                    background: `linear-gradient(to right, white ${volumeValue}%, grey ${volumeValue}%)`,
                  }}
                />
              </div>
            </Col>
          </Row>
        </Container>
      ) : (
        <>
          <div
            className="bg-details"
            style={{ backgroundImage: `url(${currentSong.cover})` }}
          ></div>
          <div className="position-relative">
            <Container
              fluid
              className="my-bg-container container-player-details"
            >
              <Row className="row-details px-3 justify-content-between pt-4">
                <GrDown
                  className="text-white ms-4 icons-up-player"
                  onClick={() => {
                    dispatch(showDetails(false));
                  }}
                />
                <span ref={iconRef} className="icons-up-player">
                  <BiDotsVerticalRounded
                    className="text-white me-4 fs-4 icon"
                    onClick={() => setShowDropdown(!showDropdown)}
                  />
                  {showDropdown && (
                    <div
                      ref={dropdownRef}
                      className="drop-order icon drop-order-player-music text-dark small"
                    >
                      <ul>
                        <li
                          onClick={() =>
                            dispatch(changeShowModal(!showModal, currentSong))
                          }
                        >
                          Add to playlist
                        </li>
                      </ul>
                    </div>
                  )}
                </span>
              </Row>
              <Row className="px-3 flex-column row-details">
                <Col xs={12} className="text-center">
                  <Row className="position-relative">
                    <Image
                      src={currentSong.cover}
                      className="image-player-details"
                      roundedCircle
                    />
                    <div className="d-flex align-items-center container-volume">
                      <BiVolumeFull className="opacity-50 me-3 icon-volume-details" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        className="volume-details"
                        value={volumeValue}
                        onChange={(e) => {
                          setVolumeValue(Number(e.currentTarget.value));
                          audioRef.current!.volume =
                            Number(e.currentTarget.value) / 100;
                        }}
                        style={{
                          background: `linear-gradient(to right, white ${volumeValue}%, grey ${volumeValue}%)`,
                        }}
                      />
                    </div>
                  </Row>
                </Col>
                <Col
                  xs={12}
                  className="d-flex flex-column position-relative align-items-center"
                >
                  {isFavourite ? (
                    <BiSolidHeart
                      className="icons-favourite-details fs-3 my-pink"
                      onClick={() => dispatch(deleteFavourite(currentSong))}
                    />
                  ) : (
                    <BiHeart
                      className="icons-favourite-details fs-3 icon"
                      onClick={() => dispatch(addNewFavourite(currentSong))}
                    />
                  )}
                  <div
                    className="flex-grow-1 mx-auto"
                    style={{ maxWidth: "85%" }}
                  >
                    <p className="text-center fs-4 fw-semibold mb-0">
                      {currentSong.title}
                    </p>
                    <p className="text-center fs-6 icon" onClick={searchArtist}>
                      {currentSong.author}
                    </p>
                  </div>
                </Col>
              </Row>
              <Row className="px-3 text-center row-details">
                <Col
                  xs={12}
                  className="justify-content-between align-items-center mx-auto mb-4"
                >
                  <input
                    type="range"
                    id="timeMusic"
                    max="29"
                    className="mx-4"
                    value={valueTimeMusic}
                    style={{ width: "60%" }}
                    onChange={(e) => {
                      setValueTimeMusic(Number(e.currentTarget.value));
                      audioRef.current!.currentTime = Number(
                        e.currentTarget.value
                      );
                      if (!audioRef.current!.paused) {
                        requestAnimationFrame(whilePlaying);
                      }
                    }}
                  />

                  <Col xs={12} className="d-flex justify-content-center mt-1">
                    <div
                      style={{ width: "60%" }}
                      className="d-flex justify-content-between"
                    >
                      <span id="currentTime">
                        {calculateTime(valueTimeMusic)}
                      </span>
                      <span>0:29</span>{" "}
                    </div>
                  </Col>
                </Col>
              </Row>
              <Row className="px-3 pb-4 row-details">
                <div className="d-flex gap-2 align-items-center justify-content-around opacity-50 w-75 mx-auto">
                  <BiShuffle
                    className={"icon " + classShuffle}
                    onClick={() => {
                      dispatch(isShufflingSongs(!isShuffle));
                      shuffleSongs();
                    }}
                  />
                  <BiSkipPrevious
                    className="fs-3 icon"
                    onClick={() => {
                      let index = currentPlaylist.indexOf(currentSong);
                      if (isShuffle) {
                        index = Math.floor(
                          Math.random() * currentPlaylist.length
                        );
                      } else {
                        if (index === 0) {
                          index = currentPlaylist.length - 1;
                        } else {
                          index--;
                        }
                      }
                      const newSong = currentPlaylist[index];
                      dispatch(saveCurrentSong(newSong));
                    }}
                  />
                  {isPlaying ? (
                    <BiPause
                      className="fs-1 icon"
                      onClick={() => {
                        dispatch(isPlayingSong(false));
                      }}
                    />
                  ) : (
                    <BiPlay
                      className="fs-1 icon"
                      onClick={() => {
                        dispatch(isPlayingSong(true));
                      }}
                    />
                  )}
                  <BiSkipNext className="fs-3 icon" onClick={goNext} />
                  <BiRepeat
                    className={"icon " + classRepeat}
                    onClick={() => {
                      dispatch(isRepeatingSong(!isOnRepeat));
                    }}
                  />
                </div>
              </Row>
            </Container>
          </div>

          {showModal && <CustomModal />}
        </>
      )}
    </>
  );
};

export default PlayerMusic;
