import { Alert, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../redux/store";
import "../scss/customModal.scss";
import {
  addSongToPlaylist,
  changeShowModal,
  createNewPlaylist,
  ENDPOINT,
} from "../redux/actions";
import { useEffect, useState } from "react";
import { BiInfoCircle, BiPlus } from "react-icons/bi";
import ShowSongType from "../types/ShowSongType";

const CustomModal = () => {
  const song = useAppSelector((state) => state.options.songToSave);
  const allPlaylists = useAppSelector(
    (state) => state.allSongs.playlists as Record<string, ShowSongType[]>
  );
  const [playlistsWithoutTheSongToSave, setPlaylistsWithoutTheSongToSave] =
    useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [namePlaylist, setNamePlaylist] = useState("");
  const [nameCountries, setNameCountries] = useState<string[]>([]);
  const nameMoods = useAppSelector(
    (state) => state.allSongs.allMoodsName as string[]
  );
  const token = useAppSelector((state) => state.user.token);
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    // When I want to add a song to a playlist, I don't need the names of the playlists in which the song already is in
    const keys = Object.keys(allPlaylists);
    const playlistsToUse: string[] = [];
    keys.forEach((key) => {
      let isSongInsidePlaylist = false;
      allPlaylists[key].forEach((songInsidePlaylist) => {
        if (songInsidePlaylist.id === song.id) {
          isSongInsidePlaylist = true;
        }
      });
      if (!isSongInsidePlaylist) {
        playlistsToUse.push(key);
      }
    });
    setPlaylistsWithoutTheSongToSave(playlistsToUse);

    // I don't want the name of the new playlist be the same as one of the countries, because it creates issues
    fetch(ENDPOINT + "/api/nameCountries", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Couldn't find the name of the countries");
        else return res.json();
      })
      .then((data) => {
        console.log("data countries", data);
        setNameCountries(data.allCountriesNames);
      })
      .catch((err) => console.log("Error!", err));
  }, []);

  const dispatch = useAppDispatch();

  const create = (namePlaylist: string) => {
    if (
      !nameCountries.includes(namePlaylist) &&
      !nameMoods.includes(namePlaylist) &&
      !Object.keys(allPlaylists).includes(namePlaylist)
    ) {
      dispatch(createNewPlaylist(namePlaylist));
      const addToPlaylistsNames = [...playlistsWithoutTheSongToSave];
      addToPlaylistsNames.push(namePlaylist);
      setPlaylistsWithoutTheSongToSave(addToPlaylistsNames);
      setShowForm(false);
    } else {
      setAlert(true);
    }
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
            <>
              <form
                onSubmit={(e: React.FormEvent) => {
                  e.preventDefault();
                  create(newPlaylistName);
                }}
              >
                <legend className="small fs-7">
                  Name of the new playlist:
                </legend>
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
              {alert && (
                <p
                  className="text-danger small mb-3 mt-2 d-flex align-items-center w-75 mx-auto"
                  style={{ minWidth: "200px", maxWidth: "400px" }}
                >
                  <BiInfoCircle className="me-2" style={{ width: "30px" }} />{" "}
                  Don't use the name of a default mood, a country or one that
                  has already been used for anouther playlist
                </p>
              )}
            </>
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
