import { useEffect, useState } from "react";
import "../scss/periods.scss";
import "../App.scss";
import {
  ENDPOINT,
  resetNotPermanentPlaylist,
  resetPlaylist,
  saveCurrentPlaylist,
  saveCurrentSong,
  savePlaylistNotToSavePermanently,
} from "../redux/actions";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { CountriesSong } from "../types/ResponseFetchDeezerSearch";
import { selectedRegionType } from "./SearchByCountry";
import Loader from "./Loader";
import ShowSongType from "../types/ShowSongType";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Periods = () => {
  const [activePeriod, setActivePeriod] = useState("");
  const [years, setYears] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [backgroundColorSong, setBackgroundColorSong] = useState("");
  const [periodSongs, setPeriodSongs] = useState<selectedRegionType[]>([]);

  const [loading, setLoading] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [couldNotFindSongs, setCouldNotFindSongs] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsAlert(false);
    }, 2500);
  }, [isAlert]);

  const token = useAppSelector((state) => state.user.token);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const searchSongsFromPeriod = (periodToSearch: string) => {
    setCouldNotFindSongs(false);
    setLoading(true);
    setPeriodSongs([]);
    fetch(ENDPOINT + "/api/songs/period?period=" + periodToSearch, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          setCouldNotFindSongs(true);
          throw new Error("Couldn't retrieve songs");
        } else return res.json();
      })
      .then((data) => {
        const artists: string[] = [];
        const songs: selectedRegionType[] = [];

        if (data.length === 0) setCouldNotFindSongs(true);

        data.forEach((topSong: CountriesSong) => {
          if (songs.length < 6) {
            if (
              artists.filter((artist) => artist === topSong.artist.name)
                .length < 2
            ) {
              songs.push({
                title: topSong.name,
                artist: topSong.artist.name,
              });
              artists.push(topSong.artist.name);
            }
          }
        });
        setPeriodSongs(songs);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log("Error!", err);
      });
  };

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
        headers: { Authorization: `Bearer ${token}` },
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
        } else setIsAlert(true);
      })
      .catch(() => {
        setIsAlert(true);
      });
  };

  const goToPlaylist = () => {
    dispatch(resetNotPermanentPlaylist());
    dispatch(savePlaylistNotToSavePermanently(years, true));
    navigate("/playlist/" + years);
  };

  return (
    <>
      <div className="change-hero">
        <h1 className="fw-semibold">Periods</h1>
      </div>
      <div className="container-timeline">
        <div className="timeline">
          <div className="point-time year-active"></div>
          <div
            className={
              activePeriod === "second"
                ? "point-time year-active"
                : "point-time"
            }
            id="second"
            onClick={() => {
              setActivePeriod("second");
              setYears("1920s");
              setBackgroundColor("#007B75");
              setBackgroundColorSong("#AC3235");
              searchSongsFromPeriod("1920s");
            }}
          >
            <span className="year-span">1920</span>
          </div>
          <div
            className={
              activePeriod === "third" ? "point-time year-active" : "point-time"
            }
            id="third"
            onClick={() => {
              setActivePeriod("third");
              setYears("1930s");
              setBackgroundColor("#85A087");
              setBackgroundColorSong("#CDA894");
              searchSongsFromPeriod("30s");
            }}
          >
            <span className="year-span">1930</span>
          </div>
          <div
            className={
              activePeriod === "forth" ? "point-time year-active" : "point-time"
            }
            id="forth"
            onClick={() => {
              setActivePeriod("forth");
              setYears("1940s");
              setBackgroundColor("#495A4C");
              setBackgroundColorSong("#91433E");
              searchSongsFromPeriod("40s");
            }}
          >
            <span className="year-span">1940</span>
          </div>
          <div
            className={
              activePeriod === "fifth" ? "point-time year-active" : "point-time"
            }
            id="fifth"
            onClick={() => {
              setActivePeriod("fifth");
              setYears("1950s");
              setBackgroundColor("#FFDADC");
              setBackgroundColorSong("#C5E6D1");
              searchSongsFromPeriod("50s");
            }}
          >
            <span className="year-span">1950</span>
          </div>
          <div
            className={
              activePeriod === "sixth" ? "point-time year-active" : "point-time"
            }
            id="sixth"
            onClick={() => {
              setActivePeriod("sixth");
              setYears("1960s");
              setBackgroundColor("#56ACCA");
              setBackgroundColorSong("#FFDC00");
              searchSongsFromPeriod("60s");
            }}
          >
            <span className="year-span">1960</span>
          </div>
          <div
            className={
              activePeriod === "seventh"
                ? "point-time year-active"
                : "point-time"
            }
            id="seventh"
            onClick={() => {
              setActivePeriod("seventh");
              setYears("1970s");
              setBackgroundColor("#5E3C55");
              setBackgroundColorSong("#3FA3A0");
              searchSongsFromPeriod("70s");
            }}
          >
            <span className="year-span">1970</span>
          </div>
          <div
            className={
              activePeriod === "eight" ? "point-time year-active" : "point-time"
            }
            id="eight"
            onClick={() => {
              setActivePeriod("eight");
              setYears("1980s");
              setBackgroundColor("#B9F5DF");
              setBackgroundColorSong("#EE895E");
              searchSongsFromPeriod("80s");
            }}
          >
            <span className="year-span">1980</span>
          </div>
          <div
            className={
              activePeriod === "nineth"
                ? "point-time year-active"
                : "point-time"
            }
            id="nineth"
            onClick={() => {
              setActivePeriod("nineth");
              setYears("1990s");
              setBackgroundColor("#287E9F");
              setBackgroundColorSong("#822C75");
              searchSongsFromPeriod("90s");
            }}
          >
            <span className="year-span">1990</span>
          </div>
          <div
            className={
              activePeriod === "tenth" ? "point-time year-active" : "point-time"
            }
            id="tenth"
            onClick={() => {
              setActivePeriod("tenth");
              setYears("2000s");
              setBackgroundColor("#007499");
              setBackgroundColorSong("#DF6E99");
              searchSongsFromPeriod("00s");
            }}
          >
            <span className="year-span">2000</span>
          </div>
          <div className="point-time year-active" id="end"></div>
        </div>
      </div>
      <section
        className="container-songs-period"
        style={{
          background: `linear-gradient(0deg,${backgroundColor} 0%, ${backgroundColorSong} 100%)`,
        }}
      >
        {loading && (
          <div className="pt-3">
            <Loader />
          </div>
        )}
        {periodSongs && periodSongs.length > 0 && (
          <h3 className="text-center py-4 fs-2 fw-semibold">{years}</h3>
        )}
        {isAlert && (
          <Alert variant="danger" className="mb-3 custom-alert">
            The preview is not available
          </Alert>
        )}
        {periodSongs &&
          !loading &&
          periodSongs.length > 0 &&
          !couldNotFindSongs &&
          periodSongs.map((song, i) => (
            <div
              key={i}
              className="my-2 mx-3 p-3 bg-dark border-1 text-white rounded-2 icon text-center"
              onClick={() => searchPreviewSong(song)}
            >
              <p className="mb-0 fw-semibold">{song.title}</p>
              <p className="mb-0">{song.artist}</p>
            </div>
          ))}
        {periodSongs &&
          !loading &&
          periodSongs.length === 0 &&
          !couldNotFindSongs && (
            <p className="mt-3 text-white text-center">
              We'll take you back to relive some of the best songs of the past
              years! When would you like to go?
            </p>
          )}
        {periodSongs && !loading && periodSongs.length > 0 && (
          <div className="w-100 text-center">
            <button
              className="my-btn-blue my-3 mx-auto"
              style={{
                backgroundColor: backgroundColorSong,
                width: "fit-content",
              }}
              onClick={() => {
                goToPlaylist();
              }}
            >
              Love the {years}!
            </button>
          </div>
        )}
        {couldNotFindSongs && (
          <div
            className="text-white text-center p-4 pb-0"
            style={{ mixBlendMode: "difference" }}
          >
            <p>Our time machine is not working right now.</p>
            <p>
              Give us a couple of minutes to find some electricity, here in{" "}
              {years || new Date().getFullYear()}.
            </p>
          </div>
        )}
      </section>
    </>
  );
};

export default Periods;
