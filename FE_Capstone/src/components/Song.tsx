import { BiDotsVerticalRounded } from "react-icons/bi";
import "../scss/song.scss";
import ShowSongType from "../types/ShowSongType";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  resetPlaylist,
  saveCurrentPlaylist,
  saveCurrentSong,
} from "../redux/actions";

interface SongProps {
  song: ShowSongType;
  playlist: ShowSongType[];
}

const Song = ({ song, playlist }: SongProps) => {
  const dispatch = useAppDispatch();

  const savedPlaylist = useAppSelector((state) => state.player.currentPlaylist);

  return (
    <div className="my-1 song mx-3 d-flex align-items-center">
      <button
        data-audio-id={song.id}
        title="Play preview"
        onClick={() => {
          // dispatch(isPlayingSong(false));
          dispatch(saveCurrentSong(song));
          // dispatch(isPlayingSong(true));
          const rememberStartingPlaylist = savedPlaylist;
          if (rememberStartingPlaylist !== playlist) {
            dispatch(resetPlaylist);
            playlist.forEach((singleSong) =>
              dispatch(saveCurrentPlaylist(singleSong))
            );
          }
        }}
      >
        <img src={song.cover} alt="Cover of the song" className="me-3" />
      </button>
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
