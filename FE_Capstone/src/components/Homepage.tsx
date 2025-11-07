import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import MoodType from "../types/MoodType";
import { findSongs } from "../redux/actions";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import PlayerMusic from "./PlayerMusic";
import { Container } from "react-bootstrap";

const Homepage = () => {
  const [mood, setMood] = useState("Relaxed");
  const [options, setOptions] = useState<string[]>([]);
  const token = localStorage.getItem("token");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const savedMoodInStore = useAppSelector((state) => state.allSongs.moodName);
  const songs = useAppSelector((state) => {
    if (mood !== undefined) {
      return state.allSongs.moods[mood];
    }
  });

  const username = useAppSelector((state) => state.user.name);

  const findMoodSongs = (e: React.FormEvent) => {
    e.preventDefault();
    if (savedMoodInStore !== mood) {
      if (mood === "I don't know") setMood("Confused");
      if (songs === undefined) {
        dispatch(findSongs(mood));
      }
    }
    navigate("/playlist/" + mood);
  };

  const getMoods = () => {
    fetch("http://localhost:8888/moods", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Error in the first then!");
        }
      })
      .then((data: MoodType[]) => {
        const moods: string[] = [];
        data.forEach((singleMood) => moods.push(singleMood.name));
        setOptions(moods);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (event: React.ChangeEvent<{ value: string }>): void => {
    setMood(event.target.value);
  };

  useEffect(() => {
    getMoods();
  }, []);

  return (
    <>
      <Container fluid>
        <section
          className="pt-5  vh-100 text-center d-flex flex-column align-items-center"
          // style={{ height: "50vh" }}
        >
          {/* Emoticon? */}
          <h3>Hi {username || "gorgeous"}!</h3>
          <h1 className="mb-4">How are you feeling today? </h1>
          <Form
            className="w-50 d-flex flex-column flex-lg-row"
            onSubmit={findMoodSongs}
          >
            <div className="flex-grow-1 me-3">
              <Form.Group>
                <Form.Select
                  id="moodChoices"
                  name="moodChoices"
                  defaultValue="Relaxed"
                  onChange={handleChange}
                >
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              {(!options.includes(mood) || mood === "Other") && (
                <Form.Group className="mt-3 flex-grow-1">
                  {/* Ti prego, controlla la grammatica */}
                  <Form.Label className="text-start">
                    Oh, in which special mood are you?
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="I really feel..."
                    onChange={handleChange}
                  />
                </Form.Group>
              )}
            </div>
            <button
              type="submit"
              className="mt-3 mt-lg-0 w-auto align-self-center my-btn-blue"
            >
              Music time!
            </button>
          </Form>
        </section>
        {/* {(currentSong as ShowSongType).id !== "" && <PlayerMusic />} */}
        <PlayerMusic />
      </Container>
    </>
  );
};

export default Homepage;
