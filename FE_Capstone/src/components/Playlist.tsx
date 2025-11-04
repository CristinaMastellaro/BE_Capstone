import { Container } from "react-bootstrap";
import "../scss/playlist.scss";
import { useState } from "react";
import SongType from "../types/SongType";
import Song from "./Song";

const Playlist = () => {
  const [songs, setSongs] = useState<SongType[]>([
    {
      cover:
        "https://wallpapers.com/images/hd/clouds-worship-hour-spotify-playlist-cover-q34fwvw4daewoopr.jpg",
      title: "title",
      author: "author",
    },
    {
      cover:
        "https://wallpapers.com/images/hd/clouds-worship-hour-spotify-playlist-cover-q34fwvw4daewoopr.jpg",
      title: "Bellissiom",
      author: "Gino Vespa",
    },
  ]);

  return (
    <>
      <Container fluid>
        <section className="hero"></section>
        <section>
          <h1 className="my-4 ms-5">Mood name</h1>
          {songs.map((song) => (
            <Song cover={song.cover} author={song.author} title={song.title} />
          ))}
        </section>
      </Container>
    </>
  );
};

export default Playlist;
