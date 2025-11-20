import { Col, Container, Row } from "react-bootstrap";
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/jsvectormap.min.css";
import "jsvectormap/dist/maps/world.js";
import { useEffect, useRef, useState } from "react";
import "../scss/searchByCountry.scss";
import Loader from "./Loader";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  ENDPOINT,
  resetNotPermanentPlaylist,
  resetPlaylist,
  saveCurrentPlaylist,
  saveCurrentSong,
  savePlaylistNotToSavePermanently,
} from "../redux/actions";
import ShowSongType from "../types/ShowSongType";
import { useNavigate } from "react-router-dom";
import { CountriesSong } from "../types/ResponseFetchDeezerSearch";

interface selectedRegionType {
  title: string;
  artist: string;
  cover: string;
}

const SearchByCountry = () => {
  const TOKEN = useAppSelector((state) => state.user.token);
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedRegionCode, setSelectedRegionCode] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedRegionSongs, setSelectedRegionSongs] = useState<
    selectedRegionType[]
  >([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const map = new jsVectorMap({
      selector: "#map",
      map: "world",
      // @ts-expect-error: The library is not meant for TypeScript
      regionsSelectable: true,
      regionStyle: {
        selected: { fill: "rgb(241, 156, 193)" },
        selectedHover: { fill: "rgb(241, 156, 193)" },
      },
      regionsSelectableOne: true,
      onRegionClick: function (_: MouseEvent, code: string) {
        setLoading(true);
        setSelectedRegionSongs([]);
        setSelectedRegionCode(code);
      },
    });
    window.addEventListener("resize", () => {
      map.updateSize();
    });
  }, []);

  useEffect(() => {
    fetch(ENDPOINT + "/api/country?code=" + selectedRegionCode, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Couldn't retrieve the name of the region!");
        else return res.json();
      })
      .then(async (data) => {
        setSelectedRegion(data[0].body.name.common);
        const songs: selectedRegionType[] = [];

        try {
          const res2 = await fetch(
            ENDPOINT +
              "/api/songs/country?country=" +
              data[0].body.name.common.replaceAll(" ", ""),
            {
              headers: { Authorization: `Bearer ${TOKEN}` },
            }
          );

          if (!res2.ok) {
            const resJson = await res2.json();
            console.log("resJson", resJson);
            if (resJson.message.includes("because the return value of")) {
              setError(true);
            }
            throw new Error("Error while searching for top music");
          }
          const data2 = await res2.json();

          const artists: string[] = [];
          if (data2.error === 6) {
            setLoading(false);
            setError(true);
            setSelectedRegionSongs([]);
            throw new Error("Error while searching for songs!");
          } else {
            data2.forEach((topSong: CountriesSong) => {
              if (songs.length < 4) {
                if (
                  artists.filter((artist) => artist === topSong.artist.name)
                    .length < 2
                ) {
                  songs.push({
                    title: topSong.name,
                    artist: topSong.artist.name,
                    cover: data[0].body.flags.png,
                  });
                  artists.push(topSong.artist.name);
                }
              }
            });
            setError(false);
            setSelectedRegionSongs(songs);
            setLoading(false);
          }
        } catch (err) {
          setLoading(false);
          console.log("Error!", err);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error!", err);
      });
  }, [selectedRegionCode]);

  const dispatch = useAppDispatch();

  const searchPreviewSong = (song: selectedRegionType) => {
    let songToSave: ShowSongType = {
      id: "",
      cover: "",
      author: "",
      preview: "",
      title: "",
    };
    fetch(
      ENDPOINT +
        `/api/search?query=${song.title
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replaceAll(" ", "")}`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Error while searching for the song");
        return res.json();
      })
      .then((data) => {
        for (let i = 0; i < data.data.length; i++) {
          if (
            data.data[i].title_short
              .toLowerCase()
              .includes(song.title.toLowerCase()) &&
            data.data[i].artist.name
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase() ===
              song.artist
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
          ) {
            songToSave = {
              id: data.data[i].id.toString(),
              cover: data.data[i].album.cover_xl,
              title: data.data[i].title,
              author: data.data[i].artist.name,
              preview: data.data[i].preview,
            };
            i = data.data.length;
          }
        }
        if (songToSave.id !== "") {
          dispatch(resetPlaylist());
          dispatch(saveCurrentPlaylist(songToSave));
          dispatch(saveCurrentSong(songToSave));
        } else alert("We couldn't load a preview of the song, sorry");
      })
      .catch(() => {
        alert("We couldn't load a preview of the song, sorry");
      });
  };

  const navigate = useNavigate();

  const goToPlaylist = () => {
    dispatch(resetNotPermanentPlaylist());
    dispatch(savePlaylistNotToSavePermanently(selectedRegion));
    navigate("/playlist/" + selectedRegion);
  };

  return (
    <>
      <Container fluid>
        <h1 className="pt-5 mb-5 ms-4 fw-bold">Countries</h1>
        <p className="text-center mb-5">
          Choose a country to explore its top list of the week!
        </p>
        <div ref={mapRef} id="map"></div>
        <Row className="p-4 pb-1 justify-content-center">
          {selectedRegionSongs.length > 0 && !loading && (
            <h2 className="text-center">{selectedRegion}</h2>
          )}
          {loading && (
            <>
              <p className="text-center mt-3">Searching for the top songs...</p>
              <Loader />
            </>
          )}
          {selectedRegionSongs &&
            !loading &&
            selectedRegionSongs.map((song, i) => {
              return (
                <Col
                  xs={5}
                  md={3}
                  lg={3}
                  key={i}
                  className="d-flex flex-column align-items-center mb-2 mt-3"
                  onClick={() => searchPreviewSong(song)}
                >
                  <img
                    src={song.cover}
                    alt="Cover song"
                    className="img-top-song"
                    style={{ cursor: "pointer" }}
                  />
                  <div className="d-flex flex-column mt-1">
                    <p className="mb-0 text-center fw-semibold">{song.title}</p>
                    <p className="mb-0 text-center small">{song.artist}</p>
                  </div>
                </Col>
              );
            })}
          {selectedRegionSongs.length > 0 && !loading && (
            <div className="text-center pb-3">
              <p className="mt-3">
                Here are the first four songs listened to in {selectedRegion}!
                Would you like to listen some more?
              </p>
              <button
                className="my-btn-blue text-decoration-none"
                onClick={() => goToPlaylist()}
              >
                Go to {selectedRegion}!
              </button>
            </div>
          )}
          {error && !loading && (
            <p className="mt-4 text-center">
              {selectedRegion} didn't want to share their music preferences, so
              we don't know their favourite songs.{" "}
            </p>
          )}
        </Row>
      </Container>
    </>
  );
};

export default SearchByCountry;
