import { BiDotsVerticalRounded } from "react-icons/bi";
import "../scss/song.scss";
import { useRef } from "react";
import ShowSongType from "../types/ShowSongType";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  isPlayingSong,
  resetPlaylist,
  saveCurrentPlaylist,
  saveCurrentSong,
} from "../redux/actions";

interface SongProps {
  song: ShowSongType;
  playlist: ShowSongType[];
}

const Song = ({ song, playlist }: SongProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // const [isPlaying, setIsPlaying] = useState(false);
  const dispatch = useAppDispatch();

  const savedPlaylist = useAppSelector((state) => state.player.currentPlaylist);

  return (
    <div className="my-1 song mx-3 d-flex align-items-center">
      <button
        data-audio-id={song.id}
        title="Play preview"
        onClick={() => {
          // if (isPlaying) {
          //   setIsPlaying(false);
          // } else {
          //   setIsPlaying(true);
          // }
          dispatch(isPlayingSong(false));
          dispatch(saveCurrentSong(song));
          dispatch(isPlayingSong(true));
          const rememberStartingPlaylist = savedPlaylist;
          if (rememberStartingPlaylist !== playlist) {
            dispatch(resetPlaylist);
            playlist.forEach((singleSong) =>
              dispatch(saveCurrentPlaylist(singleSong))
            );
          }
          // if (isPlaying) {
          //   audioRef.current?.pause();
          //   setIsPlaying(false);
          // } else {
          //   audioRef.current?.play();
          //   setIsPlaying(true);
          // }
        }}
      >
        <img src={song.cover} alt="Cover of the song" className="me-3" />
      </button>
      <audio className="d-none" ref={audioRef} src={song.preview} controls />
      <div className="flex-grow-1 d-flex flex-column justify-content-center">
        <p className="mb-0 fw-bold">{song.title}</p>
        <p className="mb-0">{song.author}</p>
      </div>
      <div className="dots-menu fs-4 me-4">
        <BiDotsVerticalRounded />
      </div>
    </div>
  );
};

export default Song;
