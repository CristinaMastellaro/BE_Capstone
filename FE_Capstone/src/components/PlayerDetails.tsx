import { Col, Container, Image, Row } from "react-bootstrap";
import {
  BiDotsVertical,
  BiHeart,
  BiPause,
  BiPlay,
  BiRepeat,
  BiShuffle,
  BiSkipNext,
  BiSkipPrevious,
  BiSolidHeart,
  BiVolumeFull,
} from "react-icons/bi";
import { GrDown } from "react-icons/gr";
import "../scss/playerDetails.scss";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useEffect, useRef, useState } from "react";
import ShowSongType from "../types/ShowSongType";
import { useNavigate } from "react-router-dom";
import {
  addNewFavourite,
  deleteFavourite,
  isPlayingSong,
  isRepeatingSong,
  isShufflingSongs,
  saveCurrentSong,
  showDetails,
} from "../redux/actions";

const PlayerDetails = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [classRepeat, setClassRepeat] = useState("");
  const [classShuffle, setClassShuffle] = useState("");

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
    if (isShuffle) {
      index = Math.floor(Math.random() * currentPlaylist.length);
    } else {
      if (index === currentPlaylist.length - 1) {
        index = 0;
      } else index++;
    }
    const newSong = currentPlaylist[index];
    dispatch(saveCurrentSong(newSong));
  };

  // Volume
  const [volumeValue, setVolumeValue] = useState(80);

  return (
    <>
      <div className="position-relative">
        <Container fluid className="my-bg-container container-player-details">
          <Row className="row-details px-3 justify-content-between pt-4">
            <GrDown
              className="text-white ms-4 icons-up-player"
              onClick={() => {
                dispatch(showDetails(false));
                setTimeout(() => navigate(-1), 2000);
              }}
            />
            <BiDotsVertical className="text-white me-4 fs-4 icons-up-player" />
          </Row>
          <Row className="px-3 flex-column row-details">
            <Col xs={12} className="text-center">
              <Row className="position-relative">
                {/* <Col xs={11}> */}
                <Image
                  // src="https://content-management-files.canva.com/cdn-cgi/image/f=auto,q=70/0b1b415d-db2c-4d8f-8d05-d60f9f5ee821/sunrise-over-snowcapped-vibrant2x.png"
                  src={currentSong.cover}
                  className="image-player-details"
                  roundedCircle
                />
                {/* </Col> */}
                <div
                  // xs={12}
                  className="d-flex align-items-center container-volume"
                >
                  {/* <div className=""> */}
                  <BiVolumeFull className="opacity-50 me-3 icon-volume-details" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    className="volume-details"
                    value={volumeValue}
                    onChange={(e) => {
                      setVolumeValue(Number(e.currentTarget.value) / 100);
                    }}
                    style={{
                      background: `linear-gradient(to right, white ${volumeValue}%, grey ${volumeValue}%)`,
                    }}
                  />

                  {/* </div> */}
                </div>
              </Row>
            </Col>
            <Col xs={12} className="d-flex position-relative">
              <div className="flex-grow-1 ms-4">
                <p className="text-center fs-3 fw-semibold mb-0">
                  {currentSong.title}
                </p>
                <p className="text-center fs-5">{currentSong.author}</p>
              </div>
              {isFavourite ? (
                <BiSolidHeart
                  className="icons-favourite-details fs-3 my-pink"
                  onClick={() => dispatch(deleteFavourite(currentSong))}
                />
              ) : (
                <BiHeart
                  className="icons-favourite-details fs-3"
                  onClick={() => dispatch(addNewFavourite(currentSong))}
                />
              )}
            </Col>
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
          </Row>
          <Row className="px-3 text-center row-details">
            <Col
              xs={12}
              className="justify-content-between align-items-center mx-auto mb-4"
            >
              {/* <div className="d-none d-lg-flex justify-content-between align-items-center"> */}

              <input
                type="range"
                id="timeMusic"
                max="29"
                className="mx-4"
                value={valueTimeMusic}
                style={{ width: "60%" }}
                onChange={() => {
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
                  <span id="currentTime">{calculateTime(valueTimeMusic)}</span>
                  <span>0:29</span>{" "}
                </div>
              </Col>
              {/* </div> */}
            </Col>
          </Row>
          <Row className="px-3 pb-4 row-details">
            <div className="d-flex gap-2 align-items-center justify-content-around opacity-50 w-75 mx-auto">
              <BiShuffle
                className={"icon " + classShuffle}
                //   className={" d-none d-md-block icon " + classShuffle}
                onClick={() => {
                  dispatch(isShufflingSongs(!isShuffle));
                }}
              />
              <BiSkipPrevious
                className="fs-3 icon"
                onClick={() => {
                  let index = currentPlaylist.indexOf(currentSong);
                  if (isShuffle) {
                    index = Math.floor(Math.random() * currentPlaylist.length);
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
                    // cancelAnimationFrame(rAF);
                  }}
                />
              ) : (
                <BiPlay
                  className="fs-1 icon"
                  onClick={() => {
                    dispatch(isPlayingSong(true));
                    // requestAnimationFrame(whilePlaying);
                  }}
                />
              )}
              <BiSkipNext className="fs-3 icon" onClick={goNext} />
              <BiRepeat
                className={"icon " + classRepeat}
                //   className={" d-none d-md-block icon " + classRepeat}
                onClick={() => {
                  dispatch(isRepeatingSong(!isOnRepeat));
                }}
              />
            </div>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default PlayerDetails;
