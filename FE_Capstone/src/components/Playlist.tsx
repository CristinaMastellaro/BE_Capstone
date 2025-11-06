import { Container } from "react-bootstrap";
import "../scss/playlist.scss";
import Song from "./Song";
import { IRootState, useAppSelector } from "../redux/store";
import { useParams } from "react-router-dom";

const Playlist = () => {
  const songs = useAppSelector((state: IRootState) => {
    return state.allSongs.Mood;
  });
  const { specification } = useParams();

  return (
    <>
      <Container fluid className="p-0 playlist">
        <section className="hero"></section>
        <section>
          <h1 className="my-4 ms-5">{specification}</h1>
          {songs &&
            songs.map((song) => (
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
