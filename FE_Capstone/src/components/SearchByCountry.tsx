import { Col, Container, Row } from "react-bootstrap";
import jsVectorMap from "jsvectormap";
import "jsvectormap/dist/jsvectormap.min.css";
import "jsvectormap/dist/maps/world.js";
import { useEffect, useRef, useState } from "react";
import "../scss/searchByCountry.scss";
import { TOKEN } from "../redux/actions";

interface selectedRegionType {
  title: string;
  artist: string;
  cover: string;
}

const SearchByCountry = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedRegionCode, setSelectedRegionCode] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedRegionSongs, setSelectedRegionSongs] = useState<
    selectedRegionType[]
  >([]);
  const [error, setError] = useState(false);

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
        // const countryName = map.getRegionName(code);
        console.log("Hai cliccato su:", code);
        setSelectedRegionCode(code);
      },
    });
    window.addEventListener("resize", () => {
      map.updateSize();
    });
  }, []);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/alpha/" + selectedRegionCode)
      .then((res) => {
        if (!res.ok)
          throw new Error("Couldn't retrieve the name of the region!");
        else return res.json();
      })
      .then((data) => {
        console.log("data region", data);
        setSelectedRegion(data[0].name.common);
        console.log("selectedRegion", selectedRegion);
        const songs: selectedRegionType[] = [];
        const token = localStorage.getItem("tokenLastFm");

        fetch(
          `http://ws.audioscrobbler.com/2.0/?method=geo.gettoptracks&country=${selectedRegion}&api_key=${token}&format=json&limit=8`
        )
          .then((res) => {
            if (!res.ok) throw new Error("Error while searching for top music");
            else return res.json();
          })
          .then((data) => {
            console.log("data from last.fm", data);
            if (data.error === 6) setError(true);
            data.tracks.track.forEach((topSong) =>
              songs.push({
                title: topSong.name,
                artist: topSong.artist.name,
                cover: topSong.image[3]["#text"],
              })
            );
            console.log("songs", songs);
            setError(false);
            setSelectedRegionSongs(songs);
          });
      });
  }, [selectedRegionCode]);

  return (
    <>
      <Container fluid>
        <h1 className="my-5 ms-4 fw-bold">Countries</h1>
        <div ref={mapRef} id="map"></div>
        <Row className="p-4">
          <h2>{selectedRegion}</h2>
          {selectedRegionSongs &&
            selectedRegionSongs.map((song, i) => {
              return (
                <Col
                  xs={5}
                  md={4}
                  lg={4}
                  key={i}
                  className="justify-content-center mb-3 mt-3"
                >
                  <img
                    src={song.cover}
                    alt="Cover song"
                    className="img-top-song"
                  />
                  <div className="d-flex flex-column mt-1">
                    <p className="mb-0 fw-semibold">{song.title}</p>
                    <p className="mb-0 small">{song.artist}</p>
                  </div>
                </Col>
              );
            })}
          {error && (
            <p>
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
