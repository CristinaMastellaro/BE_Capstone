import { useState } from "react";
import { Container, Form, Row } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import ShowSongType from "../types/ShowSongType";
import Song from "./Song";
import { RiOrderPlayFill } from "react-icons/ri";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<ShowSongType[]>([]);

  const search = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/search?q=" +
        searchQuery
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error while searching for your query");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        console.log("data", data);
        const indexesDone: number[] = [];
        const songsToAdd: ShowSongType[] = [];
        let singleSong;
        while (songsToAdd.length < 5) {
          let index: number;
          do {
            index = Math.floor(Math.random() * data.data.length);
            if (!indexesDone.includes(index)) {
              indexesDone.push(index);
              singleSong = data.data[index];
              break;
            }
          } while (indexesDone.includes(index));
          songsToAdd.push({
            id: singleSong.id,
            cover: singleSong.album.cover_small,
            title: singleSong.title,
            author: singleSong.artist.name,
            preview: singleSong.preview,
          });
        }
        setSongs(songsToAdd);
      })
      .catch((err) => console.log("Error!", err));
  };

  return (
    // Aggiungi il filtro per rendere la ricerca facile
    <Container fluid>
      <h1 className="mt-5 ms-4 fw-bold">Search</h1>
      <Row className="ms-3 mt-5">
        <Form className="w-75 mx-auto" onSubmit={search}>
          <Form.Group
            className="mb-3 d-flex align-items-end"
            controlId="exampleForm.ControlInput1"
          >
            <div className="flex-grow-1 me-2 me-md-4">
              <Form.Label className="mb-3">
                What would you like to look for?
              </Form.Label>
              <Form.Control
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Seashells"
              />
            </div>
            <button
              type="submit"
              className="bg-transparent border-0 text-white"
            >
              <BiSearch className="fs-3 mb-1" />
            </button>
            <button
              type="button"
              className="bg-transparent border-0 text-white"
            >
              <RiOrderPlayFill className="fs-3 mb-1" />
            </button>
          </Form.Group>
        </Form>
      </Row>
      <Row className="w-100 px-sm-3">
        {songs &&
          songs.length > 0 &&
          songs.map((song) => (
            <Song
              key={song.id}
              song={song}
              playlist={[song]}
              namePlaylist=""
              dontShow={true}
            />
          ))}
      </Row>
    </Container>
  );
};

export default Search;
