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
} from "../redux/actions";
import ShowSongType from "../types/ShowSongType";

const PlayerMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = useAppSelector(
    (state) => state.player.currentSong as ShowSongType
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

  const [shuffle, setShuffle] = useState(isShuffle);
  const [repeat, setRepeat] = useState(isOnRepeat);
  const [classRepeat, setClassRepeat] = useState("");
  const [classShuffle, setClassShuffle] = useState("");

  const [play, setPlay] = useState(isPlaying);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(isPlayingSong(play));
  }, [play]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (repeat) {
      setClassRepeat("selected");
    } else {
      setClassRepeat("");
    }
    dispatch(isRepeatingSong(repeat));
  }, [repeat]);

  useEffect(() => {
    if (shuffle) {
      setClassShuffle("selected");
    } else {
      setClassShuffle("");
    }
    dispatch(isShufflingSongs(shuffle));
  }, [shuffle]);

  return (
    <Container fluid className="music-player justify-content-between">
      {/* Info songs */}
      {currentSong ? (
        <Row className="p-2 justify-content-between justify-content-lg-start align-items-center flex-nowrap w-100">
          <Col className="d-flex">
            <img
              src={currentSong.cover}
              alt="Cover of the song"
              className="me-3 img-player-music"
            />
            <audio className="d-none" ref={audioRef} src={"preview"} controls />
            <div className="flex-grow-1 d-flex flex-column justify-content-center">
              <p className="mb-0 fw-bold">{currentSong.title}</p>
              <p className="mb-0">{currentSong.author}</p>
            </div>
          </Col>
          {/* Player buttons */}
          <Col>
            <div className="d-flex gap-2 align-items-center justify-content-end justify-content-md-center opacity-50">
              <BiShuffle
                className={" d-none d-md-block icon " + classShuffle}
                onClick={() => {
                  setShuffle(!shuffle);
                }}
              />
              <BiSkipPrevious className="fs-3 icon" />
              {play ? (
                <BiPause
                  className="fs-1 icon"
                  onClick={() => {
                    setPlay(false);
                  }}
                />
              ) : (
                <BiPlay
                  className="fs-1 icon"
                  onClick={() => {
                    setPlay(true);
                  }}
                />
              )}
              <BiSkipNext className="fs-3 icon" />
              <BiRepeat
                className={" d-none d-md-block icon " + classRepeat}
                onClick={() => {
                  setRepeat(!repeat);
                }}
              />
            </div>
            <div className="d-none d-lg-flex justify-content-between align-items-center">
              <span id="currentTime">0:00</span>
              <input
                type="range"
                id="timeMusic"
                max="29"
                value="0"
                className="w-75"
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
              <input type="range" min="0" max="100" />
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
