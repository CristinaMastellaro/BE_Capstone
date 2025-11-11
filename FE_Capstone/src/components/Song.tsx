import { BiDotsVerticalRounded, BiHeart, BiSolidHeart } from "react-icons/bi";
import "../scss/song.scss";
import ShowSongType from "../types/ShowSongType";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  addNewFavourite,
  changeShowModal,
  deleteFavourite,
  resetPlaylist,
  saveCurrentPlaylist,
  saveCurrentSong,
} from "../redux/actions";
import { useEffect, useRef, useState } from "react";

interface SongProps {
  song: ShowSongType;
  playlist: ShowSongType[];
}

const Song = ({ song, playlist }: SongProps) => {
  const dispatch = useAppDispatch();
  const isFavourite = useAppSelector((state) =>
    (
      (state.allSongs.playlists as Record<string, ShowSongType[]>)
        .favourite as ShowSongType[]
    ).includes(song)
  );
  const showModal = useAppSelector((state) => state.options.showModal);
  const [showDropdown, setShowDropdown] = useState(false);

  const savedPlaylist = useAppSelector((state) => state.player.currentPlaylist);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    // Verifica che il click non sia sul dropdown o sul bottone
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

  return (
    <div className="my-1 song mx-3 d-flex align-items-center">
      <button
        data-audio-id={song.id}
        title="Play preview"
        onClick={() => {
          // dispatch(isPlayingSong(false));
          dispatch(saveCurrentSong(song));
          // dispatch(isPlayingSong(true));
          // const rememberStartingPlaylist = { ...savedPlaylist };
          console.log("savedPlaylist", savedPlaylist);
          console.log("playlist", playlist);
          if (savedPlaylist !== playlist) {
            dispatch(resetPlaylist());
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
        {isFavourite ? (
          <BiSolidHeart
            className="me-2 my-pink"
            onClick={() => dispatch(deleteFavourite(song))}
          />
        ) : (
          <BiHeart
            className="me-2"
            onClick={() => dispatch(addNewFavourite(song))}
          />
        )}
        <span ref={iconRef}>
          <BiDotsVerticalRounded
            onClick={() => setShowDropdown(!showDropdown)}
          />
        </span>
        {showDropdown && (
          <div ref={dropdownRef} className="drop-order text-dark small">
            <ul>
              <li onClick={() => dispatch(changeShowModal(!showModal, song))}>
                Add to playlist
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Song;
