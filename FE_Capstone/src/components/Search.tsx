import { useEffect, useRef, useState } from "react";
import { Alert, Container, Form, Row } from "react-bootstrap";
import { BiSearch } from "react-icons/bi";
import ShowSongType from "../types/ShowSongType";
import Song from "./Song";
import { RiOrderPlayFill } from "react-icons/ri";
import "../scss/search.scss";
import Loader from "./Loader";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [songs, setSongs] = useState<ShowSongType[]>([]);

  const [alert, setAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => setAlert(false), 5000);
  }, [alert]);

  const [typeOfSearch, setTypeOfSearch] = useState("Normal");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      iconRef.current &&
      !iconRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const search = (type: string, addToPreviousSongs: boolean) => {
    setIsLoading(true);
    fetch(
      "https://striveschool-api.herokuapp.com/api/deezer/search?q=" +
        searchQuery
    )
      .then((res) => {
        if (!res.ok) {
          {
            setIsLoading(false);
            throw new Error("Error while searching for your query");
          }
        } else {
          return res.json();
        }
      })
      .then((data) => {
        let songsToAdd: ShowSongType[];
        const idsPresent: string[] = [];
        let singleSong;

        if (addToPreviousSongs) {
          songsToAdd = [...songs];
          songs.forEach((s) => idsPresent.push(s.id));
        } else songsToAdd = [];

        let length = 0;
        if (addToPreviousSongs) length = songs.length;

        if (type === "Discovery") {
          const indexesDone: number[] = [];
          while (songsToAdd.length < length + 5) {
            let index: number;
            do {
              index = Math.floor(Math.random() * data.data.length);
              if (!indexesDone.includes(index)) {
                indexesDone.push(index);
                singleSong = data.data[index];
                break;
              }
            } while (indexesDone.includes(index));
            if (!idsPresent.includes(singleSong.id)) {
              songsToAdd.push({
                id: singleSong.id,
                cover: singleSong.album.cover_small,
                title: singleSong.title,
                author: singleSong.artist.name,
                preview: singleSong.preview,
              });
            }
          }
        } else {
          for (let i = length; i < length + 5; i++) {
            singleSong = data.data[i];
            songsToAdd.push({
              id: singleSong.id,
              cover: singleSong.album.cover_small,
              title: singleSong.title,
              author: singleSong.artist.name,
              preview: singleSong.preview,
            });
          }
        }
        setSongs(songsToAdd);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("Error!", err);
      });
  };

  const searchThroughForm = (e: React.FormEvent) => {
    e.preventDefault();
    search(typeOfSearch, false);
  };

  return (
    <Container fluid>
      <h1 className="mt-5 ms-4 fw-bold">Search</h1>
      <Row className="ms-3 mt-5">
        <Form className="w-75 mx-auto" onSubmit={searchThroughForm}>
          <p>What would you like to look for?</p>
          <Form.Group
            className="mb-3 d-flex align-items-end position-relative"
            controlId="exampleForm.ControlInput1"
          >
            <div className="flex-grow-1 me-2 me-md-4">
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
              <span ref={iconRef}>
                <RiOrderPlayFill
                  className="fs-3 mb-1"
                  onClick={() => setShowDropdown(!showDropdown)}
                />
              </span>
            </button>
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="drop-order-playlist drop-order-search text-dark small"
              >
                <p className="mb-1 text-white fw-bold p-2 border-bottom">
                  Type of search
                </p>
                <ul>
                  <li
                    onClick={() => {
                      setTypeOfSearch("Discovery");
                      setShowDropdown(false);
                      if (songs.length !== 0) search("Discovery", false);
                    }}
                  >
                    Discovery
                  </li>
                  <li
                    onClick={() => {
                      setTypeOfSearch("Normal");
                      setShowDropdown(false);
                      if (songs.length !== 0) search("Normal", false);
                    }}
                  >
                    Normal
                  </li>
                </ul>
              </div>
            )}
          </Form.Group>
        </Form>
      </Row>
      <Row className=" d-flex flex-column mt-1 row-found-songs">
        {isLoading && (!songs || songs.length === 0) && (
          <div className="mt-3">
            <Loader />
          </div>
        )}
        {songs && songs.length > 0 && (
          <button
            className="my-btn-blue mx-auto mb-3"
            onClick={() => {
              if (songs.length < 25) {
                search(typeOfSearch, true);
              } else {
                setAlert(true);
              }
            }}
          >
            {isLoading ? <Loader /> : "See more"}
          </button>
        )}
        {alert && (
          <Alert variant="danger" className="mx-auto my-2 alert-search">
            You've reached the maximum number of songs
          </Alert>
        )}
        <div className="container-found-songs">
          {songs &&
            songs.length > 0 &&
            songs.map((song) => {
              const thisPlaylist = [song];
              return (
                <Song
                  key={song.id}
                  song={song}
                  playlist={thisPlaylist}
                  namePlaylist=""
                  dontShow={true}
                />
              );
            })}
        </div>
      </Row>
    </Container>
  );
};

export default Search;
