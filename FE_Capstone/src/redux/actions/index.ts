import ShowSongType from "../../types/ShowSongType";
import { AppDispatchFunction } from "../store";

export const ALL_SONGS_MOOD = "ALL_SONGS_MOOD";
export const ALL_SONGS_SAD = "ALL_SONGS_SAD";
export const ALL_SONGS_HAPPY = "ALL_SONGS_HAPPY";
export const ALL_SONGS_ANGRY = "ALL_SONGS_ANGRY";
export const ALL_SONGS_ANNOYED = "ALL_SONGS_ANNOYED";
export const ALL_SONGS_ENERGETIC = "ALL_SONGs_ENERGETIC";
export const ALL_SONGS_IN_LOVE = "ALL_SONGS_IN_LOVE";
export const ALL_SONGS_QUIET = "ALL_SONGS_QUIET";
export const ALL_SONGS_RELAXED = "ALL_SONGS_RELAXED";
export const ALL_SONGS_IDONTKNOW = "ALL_SONGS_IDONTKNOW";

export interface Root {
  tracks: Tracks;
}

export interface Tracks {
  track: Track[];
  "@attr": Attr2;
}

export interface Track {
  name: string;
  duration: string;
  mbid?: string;
  url: string;
  streamable: Streamable;
  artist: Artist;
  image: Image[];
  "@attr": Attr;
}

export interface Streamable {
  "#text": string;
  fulltrack: string;
}

export interface Artist {
  name: string;
  mbid?: string;
  url: string;
}

export interface Image {
  "#text": string;
  size: string;
}

export interface Attr {
  rank: string;
}

export interface Attr2 {
  tag: string;
  page: string;
  perPage: string;
  totalPages: string;
  total: string;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const findSongs = (mood: string) => {
  //   return async (dispatch: any) => {
  //     const token = "61e0428b8968ad6b102f45b29277ba45";

  //     try {
  //       const res = await fetch(
  //         `http://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=${mood}&api_key=${token}&format=json`
  //       );
  //       if (!res.ok) throw new Error("Errore nella chiamata Last.fm");

  //       const data: Root = await res.json();

  //       const allFoundSongs: ShowSongType[] = [];

  //       // Ciclo su ogni traccia trovata su Last.fm
  //       for (let i = 0; i < data.tracks.track.length; i++) {
  //         const title = data.tracks.track[i].name;
  //         const artist = data.tracks.track[i].artist.name;

  //         const res2 = await fetch(
  //           `https://striveschool-api.herokuapp.com/api/deezer/search?q=${title}`
  //         );
  //         if (!res2.ok) throw new Error("Errore nella chiamata Deezer");

  //         const data2 = await res2.json();

  //         // Trova la canzone corrispondente
  //         const match = data2.data.find(
  //           (song: SongDeezer) =>
  //             song.title.toLowerCase() === title.toLowerCase() &&
  //             song.artist.name.toLowerCase() === artist.toLowerCase()
  //         );

  //         if (match) {
  //           allFoundSongs.push({
  //             id: match.id.toString(),
  //             cover: match.album.cover_xl,
  //             title: match.title,
  //             author: match.artist.name,
  //             preview: match.preview,
  //           });
  //         }
  //       }

  //       // ✅ Dispatch solo dopo che tutti i fetch sono completati
  //       dispatch({
  //         type: ALL_SONGS_MOOD,
  //         payload: allFoundSongs,
  //       });
  //     } catch (error) {
  //       console.error("Errore nel fetch delle canzoni:", error);
  //     }
  //   };
  return async (dispatch: AppDispatchFunction) => {
    // const allSongs: Track[] = [];

    //TODO: cancella questo token e mettilo da un'altra parte!
    const token = "61e0428b8968ad6b102f45b29277ba45";
    const AllFoundSongs: ShowSongType[] = [];
    // const totalSongs: ShowSongType[] = [];

    // fetch(
    //   `http://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=${mood}&api_key=${token}&format=json`
    // )
    try {
      const res = await fetch(
        `http://ws.audioscrobbler.com/2.0/?method=tag.getTopTracks&tag=${mood}&api_key=${token}&format=json`
      );

      if (!res.ok) {
        throw new Error("Response status: " + res.status);
      }
      //   .then((res) => {
      //     if (res.ok) {
      //       return res.json();
      //     } else {
      //       throw new Error("There was an error in the first then!");
      //     }
      //   })
      const data = await res.json();
      //   .then((data: Root) => {
      //   const AllFoundSongs: ShowSongType[] = [];
      //   console.log("data", data);
      for (let i = 0; i < data.tracks.track.length; i++) {
        if (AllFoundSongs.length < 30) {
          if (i === 15) await delay(4000);
          // data.tracks.track.forEach((singleTrack) => {
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
            //   fetch(
            //     "https://striveschool-api.herokuapp.com/api/deezer/search?q=" +
            //       basicInfo[0]
            //   )
            // .then((res) => {
            if (!secondRes.ok) {
              throw new Error("Response status: " + secondRes.status);
            }
            //   } else {
            //     throw new Error("Errore!");
            //   }
            // })
            // .then((data) => {
            //   console.log("basicInfo", basicInfo);
            //   console.log("data2", data);
            const data2 = await secondRes.json();
            console.log("data2", data2);
            for (let j = 0; j < data2.data.length; j++) {
              // data2.data.forEach((song: SongDeezer) => {
              if (
                data2.data[j].title.includes(basicInfo[0]) &&
                data2.data[j].artist.name === basicInfo[1]
              ) {
                foundSong = {
                  id: data2.data[j].id.toString(),
                  cover: data2.data[j].album.cover_xl,
                  title: data2.data[j].title,
                  author: data2.data[j].artist.name,
                  preview: data2.data[j].preview,
                };
                console.log("foundSong", foundSong);
                // foundSongs.push(oneSong);
              }
            }
            // });
            if (foundSong.id !== "") AllFoundSongs.push(foundSong);
          } catch (err) {
            console.log(err);
          } // console.log("foundSong", AllFoundSongs);+
          // })
          // .catch((err) => console.log("Errore!", err));
          // });
        }
        // totalSongs.concat(AllFoundSongs);
        console.log("AllFoundSongs", AllFoundSongs);
      }
    } catch (err) {
      console.log(err);
    }
    //   })
    //   .catch((err) => console.log(err));
    dispatch({
      type: ALL_SONGS_MOOD,
      payload: AllFoundSongs,
    });
  };
};

// export const findSadSongs = () => {
//   const songs = findSongs("Happy");
//   console.log("happy", songs);
//   return {
//     type: "something",
//     payload: songs,
//   };
// };
