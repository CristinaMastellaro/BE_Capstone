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

const CustomModal = () => {
  const namePlaylists = useAppSelector((state) => state.allSongs.playlists);
  const song = useAppSelector((state) => state.options.songToSave);
  const [showForm, setShowForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [namePlaylist, setNamePlaylist] = useState("");

  const dispatch = useAppDispatch();

  const create = (namePlaylist: string) => {
    dispatch(createNewPlaylist(namePlaylist));
    setShowForm(false);
  };

  useEffect(() => {
    setTimeout(() => setIsAdded(false), 2000);
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
            <Alert variant="danger" className="my-2">
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
          {namePlaylists &&
            Object.keys(namePlaylists).map((title) => {
              return (
                <p
                  key={title}
                  onClick={() => {
                    setNamePlaylist(title);
                    setIsAdded(true);
                    dispatch(addSongToPlaylist(song, title));
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
