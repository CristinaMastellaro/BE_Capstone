import { Alert, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../redux/store";
import "../scss/customModal.scss";
import {
  addSongToPlaylist,
  changeShowModal,
  createNewPlaylist,
} from "../redux/actions";
import { useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import ShowSongType from "../types/ShowSongType";

const CustomModal = () => {
  const song = useAppSelector((state) => state.options.songToSave);
  const namePlaylists = useAppSelector(
    (state) => state.allSongs.playlists as Record<string, ShowSongType[]>
  );
  const [playlistsWithoutTheSongToSave, setPlaylistsWithoutTheSongToSave] =
    useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [namePlaylist, setNamePlaylist] = useState("");

  useEffect(() => {
    const keys = Object.keys(namePlaylists);
    const playlistsToUse: string[] = [];
    keys.forEach((key) => {
      let isSongInsidePlaylist = false;
      namePlaylists[key].forEach((songInsidePlaylist) => {
        if (songInsidePlaylist.id === song.id) {
          isSongInsidePlaylist = true;
        }
      });
      if (!isSongInsidePlaylist) {
        playlistsToUse.push(key);
      }
    });
    setPlaylistsWithoutTheSongToSave(playlistsToUse);
  }, []);

  const dispatch = useAppDispatch();

  const create = (namePlaylist: string) => {
    dispatch(createNewPlaylist(namePlaylist));
    const addToPlaylistsNames = [...playlistsWithoutTheSongToSave];
    addToPlaylistsNames.push(namePlaylist);
    setPlaylistsWithoutTheSongToSave(addToPlaylistsNames);
    setShowForm(false);
  };

  useEffect(() => {
    setTimeout(() => setIsAdded(false), 3000);
  }, [isAdded]);

  return (
    <div className="modal show custom-modal">
      <Modal.Dialog>
        <Modal.Header
          closeButton
          closeVariant="white"
          onClick={() => dispatch(changeShowModal(false, song))}
        >
          <Modal.Title>Choose the playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <button
            className="my-btn-blue mb-2"
            onClick={() => {
              setShowForm(true);
            }}
          >
            New playlist
          </button>
          {isAdded && (
            <Alert
              variant="success"
              className="my-2 mx-auto"
              style={{ width: "fit-content", maxWidth: "75%" }}
            >
              {song.title + " added to the playlist " + namePlaylist}
            </Alert>
          )}
          {showForm && (
            <form
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                create(newPlaylistName);
              }}
            >
              <legend className="small fs-7">Name of the new playlist:</legend>
              <div className="d-flex gap-2 justify-content-center">
                <input
                  type="text"
                  className="rounded-2"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
                <button type="submit" className="my-btn-blue">
                  <BiPlus />
                </button>
              </div>
            </form>
          )}
          {playlistsWithoutTheSongToSave &&
            playlistsWithoutTheSongToSave.map((title) => {
              return (
                <p
                  key={title}
                  onClick={() => {
                    setNamePlaylist(title);
                    setIsAdded(true);
                    dispatch(addSongToPlaylist(song, title));
                    const index = playlistsWithoutTheSongToSave.indexOf(title);
                    delete playlistsWithoutTheSongToSave[index];
                  }}
                  className="options-add-to-playlist mt-2"
                >
                  {title}
                </p>
              );
            })}
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
};

export default CustomModal;
