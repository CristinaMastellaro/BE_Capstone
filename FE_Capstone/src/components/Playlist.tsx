import { Container } from "react-bootstrap";
import "../scss/playlist.scss";
import { useEffect, useState } from "react";
import SongType from "../types/SongType";
import Song from "./Song";

const Playlist = () => {
  const [songs, setSongs] = useState<SongType[]>([
    {
      id: "1232",
      cover:
        "https://wallpapers.com/images/hd/clouds-worship-hour-spotify-playlist-cover-q34fwvw4daewoopr.jpg",
      title: "title",
      author: "author",
      preview: "",
    },
    {
      id: "14214",
      cover:
        "https://wallpapers.com/images/hd/clouds-worship-hour-spotify-playlist-cover-q34fwvw4daewoopr.jpg",
      title: "Bellissiom",
      author: "Gino Vespa",
      preview: "",
    },
  ]);

  const findMusic = () => {
    fetch("https://striveschool-api.herokuapp.com/api/deezer/search?q=sea")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Errore!");
        }
      })
      .then((data) => {
        console.log("data", data);
        const songsToSet: SongType[] = [];
        // console.log(data.results.trackmatches.track[0].url);
        for (let i = 0; i < 15; i++) {
          //   const songToAdd = {
          //     id: data.data[i].id,
          //     cover: data.data[i].album.cover_big,
          //     title: data.data[i].title,
          //     author: data.data[i].artist.name,
          //     preview: data.data[i].preview,
          //   };
          //   const songsForNow = songs;
          //   songs.push(songToAdd);
          songsToSet.push({
            id: data.data[i].id,
            cover: data.data[i].album.cover_big,
            title: data.data[i].title,
            author: data.data[i].artist.name,
            preview: data.data[i].preview,
          });
          console.log("data.data[i].preview", data.data[i].preview);
          //   setSongs([
          //     ...songs,
          //     {
          //       id: data.data[i].id,
          //       cover: data.data[i].album.cover_big,
          //       title: data.data[i].title,
          //       author: data.data[i].artist.name,
          //       preview: data.data[i].preview,
          //     },
          //   ]);
          //   setSongs(songsForNow);
        }
        setSongs(songsToSet);
        console.log("songs", songs);
      })
      .catch((err) => console.log("Errore!", err));
  };

  useEffect(() => {
    findMusic();
  }, []);

  return (
    <>
      <Container fluid className="p-0">
        <section className="hero"></section>
        <section>
          <h1 className="my-4 ms-5">Mood name</h1>
          {songs.map((song) => (
            <Song
              key={song.id}
              id={song.id}
              cover={song.cover}
              author={song.author}
              title={song.title}
              preview={song.preview}
            />
          ))}
        </section>
      </Container>
    </>
  );
};

export default Playlist;
