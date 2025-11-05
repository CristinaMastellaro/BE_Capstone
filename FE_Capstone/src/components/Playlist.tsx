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
  // const [songs, setSongs] = useState<ShowSongType[]>([
  //   {
  //     id: "1232",
  //     cover:
  //       "https://wallpapers.com/images/hd/clouds-worship-hour-spotify-playlist-cover-q34fwvw4daewoopr.jpg",
  //     title: "title",
  //     author: "author",
  //     preview: "",
  //   },
  //   {
  //     id: "14214",
  //     cover:
  //       "https://wallpapers.com/images/hd/clouds-worship-hour-spotify-playlist-cover-q34fwvw4daewoopr.jpg",
  //     title: "Bellissiom",
  //     author: "Gino Vespa",
  //     preview: "",
  //   },
  // ]);

  // const findMusic = () => {
  //   fetch("https://striveschool-api.herokuapp.com/api/deezer/search?q=sea")
  //     .then((res) => {
  //       if (res.ok) {
  //         return res.json();
  //       } else {
  //         throw new Error("Errore!");
  //       }
  //     })
  //     .then((data) => {
  //       console.log("data", data);
  //       const songsToSet: ShowSongType[] = [];
  //       // console.log(data.results.trackmatches.track[0].url);
  //       for (let i = 0; i < 15; i++) {
  //         //   const songToAdd = {
  //         //     id: data.data[i].id,
  //         //     cover: data.data[i].album.cover_big,
  //         //     title: data.data[i].title,
  //         //     author: data.data[i].artist.name,
  //         //     preview: data.data[i].preview,
  //         //   };
  //         //   const songsForNow = songs;
  //         //   songs.push(songToAdd);
  //         songsToSet.push({
  //           id: data.data[i].id,
  //           cover: data.data[i].album.cover_big,
  //           title: data.data[i].title,
  //           author: data.data[i].artist.name,
  //           preview: data.data[i].preview,
  //         });
  //         console.log("data.data[i].preview", data.data[i].preview);
  //         //   setSongs([
  //         //     ...songs,
  //         //     {
  //         //       id: data.data[i].id,
  //         //       cover: data.data[i].album.cover_big,
  //         //       title: data.data[i].title,
  //         //       author: data.data[i].artist.name,
  //         //       preview: data.data[i].preview,
  //         //     },
  //         //   ]);
  //         //   setSongs(songsForNow);
  //       }
  //       setSongs(songsToSet);
  //       console.log("songs", songs);
  //     })
  //     .catch((err) => console.log("Errore!", err));
  // };

  // useEffect(() => {
  //   findMusic();
  // }, []);

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
