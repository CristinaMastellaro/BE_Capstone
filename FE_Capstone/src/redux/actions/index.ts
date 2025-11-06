import ShowSongType from "../../types/ShowSongType";
import { AppDispatchFunction } from "../store";

// For mood playlist
export const ALL_SONGS_MOOD = "ALL_SONGS_MOOD";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const findSongs = (mood: string) => {
  return async (dispatch: AppDispatchFunction) => {
    //TODO cancella questo token e mettilo da un'altra parte!
    const token = localStorage.getItem("tokenLastFm");
    const AllFoundSongs: ShowSongType[] = [];

    try {
      const res = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=${mood.toLowerCase()}&api_key=${token}&format=json`
      );

      if (!res.ok) {
        throw new Error("Response status: " + res.status);
      }
      const data = await res.json();
      for (let i = 0; i < data.tracks.track.length; i++) {
        if (AllFoundSongs.length < 30) {
          if (i === 15) await delay(2000);
          const basicInfo = [
            data.tracks.track[i].name,
            data.tracks.track[i].artist.name,
          ];
          console.log("basicInfo", basicInfo);
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
                basicInfo[0] +
                basicInfo[1]
            );
            if (!secondRes.ok) {
              throw new Error("Response status: " + secondRes.status);
            }
            const data2 = await secondRes.json();
            console.log("data2", data2);
            for (let j = 0; j < data2.data.length; j++) {
              if (j === 8 || j === 16) await delay(2000);
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
                console.log("foundSong", foundSong);
              }
            }
            if (foundSong.id !== "") AllFoundSongs.push(foundSong);
          } catch (err) {
            console.log(err);
          }
        }
        console.log("AllFoundSongs", AllFoundSongs);
      }
    } catch (err) {
      console.log(err);
    }
    dispatch({
      type: ALL_SONGS_MOOD,
      payload: [mood, AllFoundSongs],
    });
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
