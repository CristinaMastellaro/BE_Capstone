import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import MoodType from "../types/MoodType";
import { findSongs } from "../redux/actions";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";

const Homepage = () => {
  const [mood, setMood] = useState("Relaxed");
  const [options, setOptions] = useState<string[]>([]);
  const token = localStorage.getItem("token");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const savedMoodInStore = useAppSelector((state) => state.allSongs.moodName);
  const songs = useAppSelector((state) => {
    console.log(
      "state.allSongs.moods[mood].length",
      state.allSongs.moods[mood]
    );
    if (mood !== undefined) {
      return state.allSongs.moods[mood];
    }
  });

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
        console.log("data", data);
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
      <section className="mt-5 mx-3" style={{ height: "50vh" }}>
        {/* Emoticon? */}
        <h5>How are you feeling today? </h5>
        <Form className="h-75 d-flex flex-column" onSubmit={findMoodSongs}>
          {/* <Form.Group className="mb-3">
          <Form.Control type="text" placeholder="I'm feeling..." />
        </Form.Group> */}
          <div>
            <Form.Group className="mb-3">
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
              <Form.Group className="mb-3">
                {/* Ti prego, controlla la grammatica */}
                <Form.Label>Oh, in which special mood are you?</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="I really feel..."
                  onChange={handleChange}
                />
              </Form.Group>
            )}
          </div>
          <Button variant="primary" type="submit">
            Music time!
          </Button>
        </Form>
      </section>
    </>
  );
};

export default Homepage;
