import ShowSongType from "../../types/ShowSongType";
import { AppDispatchFunction } from "../store";

export const ENDPOINT = "http://localhost:8888";

// For login
export const SET_USERNAME = "SET_USERNAME";
export const TOKEN = localStorage.getItem("token");
export const TOKEN_LAST_FM = localStorage.getItem("tokenLastFm");

export const setLoginUsername = (username: string) => {
  return {
    type: SET_USERNAME,
    payload: username,
  };
};

// For mood playlist
export const ALL_SONGS_MOOD = "ALL_SONGS_MOOD";
export const ALL_MOODS_NAME = "ALL_MOODS_NAME";
export const ADD_SINGLE_MOOD = "ADD_SINGLE_MOOD";

export const findSongs = (mood: string) => {
  return async (dispatch: AppDispatchFunction) => {
    //TODO cancella questo token e mettilo da un'altra parte!
    const token = localStorage.getItem("tokenLastFm");
    const AllFoundSongs: ShowSongType[] = [];

    let i = 0;

    try {
      const res = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=${mood.toLowerCase()}&api_key=${token}&format=json`
      );

      if (!res.ok) {
        throw new Error("Response status: " + res.status);
      }
      const data = await res.json();
      for (i; i < data.tracks.track.length; i++) {
        if (AllFoundSongs.length < 30) {
          const basicInfo = [
            data.tracks.track[i].name,
            data.tracks.track[i].artist.name,
          ];
          let foundSong: ShowSongType = {
            id: "",
            cover: "",
            title: "",
            author: "",
            preview: "",
          };

          let j = 0;

          try {
            const secondRes = await fetch(
              "https://striveschool-api.herokuapp.com/api/deezer/search?q=" +
                basicInfo[0] +
                basicInfo[1]
            );
            if (!secondRes.ok) {
              throw new Error("Response status: " + secondRes.status);
            }
            const data2 = await secondRes.json();

            for (j; j < data2.data.length; j++) {
              if (
                data2.data[j].title_short
                  .toLowerCase()
                  .includes(basicInfo[0].toLowerCase()) &&
                data2.data[j].artist.name.toLowerCase() ===
                  basicInfo[1].toLowerCase() &&
                foundSong.id === ""
              ) {
                foundSong = {
                  id: data2.data[j].id.toString(),
                  cover: data2.data[j].album.cover_xl,
                  title: data2.data[j].title,
                  author: data2.data[j].artist.name,
                  preview: data2.data[j].preview,
                };
                j = data2.data.length;
              }
            }
            if (foundSong.id !== "") AllFoundSongs.push(foundSong);
          } catch (e: unknown) {
            // console.log(err);
            console.log("This is the error: ", e);
            let result;
            if (typeof e === "string") {
              result = e.toUpperCase(); // works, `e` narrowed to string
            } else if (e instanceof Error) {
              result = e.message;
            }
            console.log("result", result);
            if (result?.includes("Response status: 429")) {
              break;
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    dispatch({
      type: ALL_SONGS_MOOD,
      payload: [mood, AllFoundSongs],
    });
  };
};

export const saveAllMoodsNames = (allMoodsName: string[]) => {
  return {
    type: ALL_MOODS_NAME,
    payload: allMoodsName,
  };
};

export const addSingleMood = (singleMood: string) => {
  return {
    type: ADD_SINGLE_MOOD,
    payload: singleMood,
  };
};

// For music player
export const CURRENT_SONG = "CURRENT_SONG";
export const CURRENT_PLAYLIST = "CURRENT_PLAYLIST";
export const RESET_PLAYLIST = "RESET_PLAYLIST";
export const IS_PLAYING = "IS_PLAYING";
export const IS_ON_REPEAT = "IS_ON_REPEAT";
export const IS_SHUFFLED = "IS_SHUFFLED";
// Attenta che se la canzone non è in una playlist... Cosa succede?

export const saveCurrentSong = (song: ShowSongType) => {
  return {
    type: CURRENT_SONG,
    payload: song,
  };
};

export const resetPlaylist = () => {
  return {
    type: RESET_PLAYLIST,
  };
};

export const saveCurrentPlaylist = (playlist: ShowSongType) => {
  return {
    type: CURRENT_PLAYLIST,
    payload: playlist,
  };
};

export const isPlayingSong = (isPlaying: boolean) => {
  return {
    type: IS_PLAYING,
    payload: isPlaying,
  };
};

export const isRepeatingSong = (isRepeating: boolean) => {
  return {
    type: IS_ON_REPEAT,
    payload: isRepeating,
  };
};

export const isShufflingSongs = (isShuffle: boolean) => {
  return {
    type: IS_SHUFFLED,
    payload: isShuffle,
  };
};

// For favourites
export const ADD_NEW_FAVOURITE = "ADD_NEW_FAVOURITE";
export const DELETE_FAVOURITE = "DELETE_FAVOURITE";
export const SET_FAVOURITES_FROM_DB = "SET_FAVOURITES_FROM_DB";

export const addNewFavourite = (newFav: ShowSongType) => {
  return async (dispatch: AppDispatchFunction) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8888/playlists/favourite", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newFav),
      });
      if (!res.ok)
        throw new Error("There was an issue while connecting to the db");
    } catch (err) {
      console.log("Error while saving favourite song!", err);
    }

    dispatch({ type: ADD_NEW_FAVOURITE, payload: newFav });
  };
};

export const deleteFavourite = (favToDel: ShowSongType) => {
  return async (dispatch: AppDispatchFunction) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8888/playlists/favourite/${favToDel.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Issue while deleting");
    } catch (err) {
      console.log("Error!", err);
    }
    dispatch({ type: DELETE_FAVOURITE, payload: favToDel });
  };
};

export const setFavFromDb = () => {
  return async (dispatch: AppDispatchFunction) => {
    const favourites: ShowSongType[] = [];
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:8888/playlists/favourite",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Response status: " + response.status);

      const data = await response.json();

      data.songs.forEach((song: ShowSongType) => favourites.push(song));
    } catch (err) {
      console.log("Error! ", err);
    }

    dispatch({
      type: SET_FAVOURITES_FROM_DB,
      payload: favourites,
    });
  };
};

// General playlists
export const ALL_PLAYLISTS = "ALL_PLAYLISTS";
export const CREATE_NEW_PLAYLIST = "CREATE_NEW_PLAYLIST";

type PlaylistType = {
  id: string;
  name: string;
  songs: ShowSongType[];
};

export const findAllPlaylists = () => {
  return async (dispatch: AppDispatchFunction) => {
    const playlists: Record<string, ShowSongType[]> = {};
    try {
      const res = await fetch(ENDPOINT + "/playlists", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      });
      if (!res.ok) throw new Error("Error!");

      const data: PlaylistType[] = await res.json();
      data.forEach((playlist) => (playlists[playlist.name] = playlist.songs));
    } catch (err) {
      console.log("Error while finding names of playlists", err);
    }
    dispatch({
      type: ALL_PLAYLISTS,
      payload: playlists,
    });
  };
};

export const createNewPlaylist = (namePlaylist: string) => {
  return async (dispatch: AppDispatchFunction) => {
    try {
      const res = await fetch(ENDPOINT + "/playlists", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: namePlaylist, songs: [] }),
      });
      if (!res.ok) throw new Error("Who knows");
    } catch (err) {
      console.log("Error!", err);
    }

    dispatch({ type: CREATE_NEW_PLAYLIST, payload: namePlaylist });
  };
};

export const ADD_SONG_TO_PLAYLIST = "ADD_SONG_TO_PLAYLIST";
export const DELETE_SONG_FROM_PLAYLIST = "DELETE_SONG_FROM_PLAYLIST";

export const addSongToPlaylist = (
  newSong: ShowSongType,
  playlistName: string
) => {
  return async (dispatch: AppDispatchFunction) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "http://localhost:8888/playlists/" + playlistName,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newSong),
        }
      );
      if (!res.ok)
        throw new Error("There was an issue while connecting to the db");
    } catch (err) {
      console.log("Error while saving favourite song!", err);
    }

    dispatch({
      type: ADD_SONG_TO_PLAYLIST,
      payload: [playlistName, newSong],
    });
  };
};

export const deleteSongFromPlaylist = (
  namePlaylist: string,
  song: ShowSongType
) => {
  return async (dispatch: AppDispatchFunction) => {
    try {
      const res = await fetch(
        ENDPOINT + `/playlists/${namePlaylist}/${song.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        }
      );
      if (!res.ok) throw new Error("Error while sending fetch");
    } catch (err) {
      console.log("Error!", err);
    }

    dispatch({
      type: DELETE_SONG_FROM_PLAYLIST,
      payload: [namePlaylist, song],
    });
  };
};

export const PLAYLIST_NOT_TO_SAVE = "PLAYLIST_NOT_TO_SAVE";

export const savePlaylistNotToSavePermanently = (country: string) => {
  return async (dispatch: AppDispatchFunction) => {
    const AllFoundSongs: ShowSongType[] = [];

    try {
      const res = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${country}&api_key=${TOKEN_LAST_FM}&format=json`
      );

      if (!res.ok) {
        throw new Error("Response status: " + res.status);
      }
      const data = await res.json();
      for (let i = 0; i < data.tracks.track.length; i++) {
        if (AllFoundSongs.length < 30) {
          const basicInfo = [
            data.tracks.track[i].name,
            data.tracks.track[i].artist.name,
          ];
          let foundSong: ShowSongType = {
            id: "",
            cover: "",
            title: "",
            author: "",
            preview: "",
          };

          try {
            const secondRes = await fetch(
              "https://striveschool-api.herokuapp.com/api/deezer/search?q=" +
                basicInfo[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "") +
                basicInfo[1].normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            );
            if (!secondRes.ok) {
              throw new Error("Response status: " + secondRes.status);
            }
            const data2 = await secondRes.json();

            for (let j = 0; j < data2.data.length; j++) {
              if (
                data2.data[j].title_short
                  .toLowerCase()
                  .includes(basicInfo[0].toLowerCase()) &&
                data2.data[j].artist.name
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase() ===
                  basicInfo[1]
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase() &&
                foundSong.id === ""
              ) {
                foundSong = {
                  id: data2.data[j].id.toString(),
                  cover: data2.data[j].album.cover_xl,
                  title: data2.data[j].title,
                  author: data2.data[j].artist.name,
                  preview: data2.data[j].preview,
                };
                j = data2.data.length;
              }
            }
            if (foundSong.id !== "") AllFoundSongs.push(foundSong);
          } catch (e: unknown) {
            console.log("This is the error: ", e);
            let result;
            if (typeof e === "string") {
              result = e.toUpperCase();
            } else if (e instanceof Error) {
              result = e.message;
            }
            if (result?.includes("Response status: 429")) {
              break;
            }
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
    dispatch({
      type: PLAYLIST_NOT_TO_SAVE,
      payload: AllFoundSongs,
    });
  };
};

export const RESET_NOT_PERMANENT_PLAYLIST = "RESET_NOT_PERMANENT_PLAYLIST";

export const resetNotPermanentPlaylist = () => {
  return {
    type: RESET_NOT_PERMANENT_PLAYLIST,
  };
};

// Modal that adds a song to a playlist
export const SHOW_MODAL = "SHOW_MODAL";

export const changeShowModal = (
  showModal: boolean,
  songToSave: ShowSongType
) => {
  return {
    type: SHOW_MODAL,
    payload: [showModal, songToSave],
  };
};
