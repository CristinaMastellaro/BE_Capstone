import { Col, Container, Row } from "react-bootstrap";
import "../scss/musicPlayer.scss";
import { useEffect, useRef, useState } from "react";
import {
  BiShuffle,
  BiSkipPrevious,
  BiPlay,
  BiPause,
  BiSkipNext,
  BiRepeat,
  BiVolumeFull,
} from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "../redux/store";
import Loader from "./Loader";
import {
  isPlayingSong,
  isRepeatingSong,
  isShufflingSongs,
  saveCurrentSong,
} from "../redux/actions";
import ShowSongType from "../types/ShowSongType";

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
    // setStyleRange(true)
    // elementsPlayer.style.setProperty(
    //   "--seek-before-width",
    //   `${(timeMusic.value / timeMusic.max) * 100}%`
    // );
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
    <Container
      fluid
      className={
        showPlayer
          ? "music-player justify-content-between d-none"
          : "music-player justify-content-between"
      }
    >
      {/* Info songs */}
      {currentSong ? (
        <Row className=" p-2 justify-content-between justify-content-lg-start align-items-center flex-nowrap w-100">
          <Col className="d-flex" xs={8} lg={5}>
            <img
              src={currentSong.cover}
              alt="Cover of the song"
              className="me-3 img-player-music"
            />
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
                className="w-75"
                onChange={() => {
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
            md={4}
            lg={3}
            className="align-items-center gap-2 justify-content-end d-none d-md-flex"
          >
            <BiVolumeFull className="opacity-50" />
            <div className="d-flex">
              <input
                type="range"
                min="0"
                max="100"
                value={volumeValue}
                onChange={(e) => {
                  setVolumeValue(Number(e.currentTarget.value) / 100);
                }}
                style={{
                  background: `linear-gradient(to right, white ${volumeValue}%, grey ${volumeValue}%)`,
                }}
              />
            </div>
          </Col>
        </Row>
      ) : (
        <Loader />
      )}
    </Container>
  );
};

export default PlayerMusic;
