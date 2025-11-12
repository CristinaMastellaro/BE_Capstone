import { BiDotsVerticalRounded, BiHeart, BiSolidHeart } from "react-icons/bi";
import "../scss/song.scss";
import ShowSongType from "../types/ShowSongType";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  addNewFavourite,
  changeShowModal,
  deleteFavourite,
  deleteSongFromPlaylist,
  resetPlaylist,
  saveCurrentPlaylist,
  saveCurrentSong,
} from "../redux/actions";
import { useEffect, useRef, useState } from "react";

interface SongProps {
  song: ShowSongType;
  playlist: ShowSongType[];
  namePlaylist: string;
}

const Song = ({ song, playlist, namePlaylist }: SongProps) => {
  const dispatch = useAppDispatch();

  // Handle favourite songs
  const isFavouriteAtTheBeginning = useAppSelector((state) => {
    const idFavouriteSongs: string[] = [];
    (
      (state.allSongs.playlists as Record<string, ShowSongType[]>)
        .favourite as ShowSongType[]
    ).forEach((fav) => idFavouriteSongs.push(fav.id));
    return idFavouriteSongs.includes(song.id);
  });
  const [isFavourite, setIsFavourite] = useState(isFavouriteAtTheBeginning);

  // To save the song in a playlist
  // TODO: What happens if a song is already saved in the playlist?
  const showModal = useAppSelector((state) => state.options.showModal);
  const [showDropdown, setShowDropdown] = useState(false);

  const savedPlaylist = useAppSelector((state) => state.player.currentPlaylist);
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

  // Remove song from playlist

  const isNamePlaylistInSavedPlaylist = useAppSelector((state) =>
    Object.keys(state.allSongs.playlists).includes(namePlaylist)
  ); // To see if the playlist is saved in the library (the playlist could be used to show the songs connected to a mood: in this case, the playlist is not saved in the library)

  // If this is true, than you can remove the song from the current playlist

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
      <div className="flex-grow-1 d-flex flex-column justify-content-center container-info">
        <p className="mb-0 fw-bold">{song.title}</p>
        <p className="mb-0">{song.author}</p>
      </div>
      <div className="dots-menu fs-4 me-4 ms-auto">
        {isFavourite ? (
          <BiSolidHeart
            className="me-2 my-pink"
            onClick={() => {
              setIsFavourite(false);
              dispatch(deleteFavourite(song));
            }}
          />
        ) : (
          <BiHeart
            className="me-2"
            onClick={() => {
              setIsFavourite(true);
              dispatch(addNewFavourite(song));
            }}
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
              {isNamePlaylistInSavedPlaylist && (
                <li
                  onClick={() => {
                    dispatch(deleteSongFromPlaylist(namePlaylist, song));
                  }}
                >
                  Remove from playlist
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Song;
