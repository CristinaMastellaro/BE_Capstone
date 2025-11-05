import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import MoodType from "../types/MoodType";
const Homepage = () => {
  const [mood, setMood] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const token = localStorage.getItem("token");

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

  useEffect(() => {
    getMoods();
  }, []);

  return (
    <>
      <section className="mt-5 mx-3" style={{ height: "50vh" }}>
        {/* Emoticon? */}
        <h5>How are you feeling today? </h5>
        <Form className="h-75 d-flex flex-column">
          {/* <Form.Group className="mb-3">
          <Form.Control type="text" placeholder="I'm feeling..." />
        </Form.Group> */}
          <div className="flex-gro-1">
            <Form.Group className="mb-3">
              <Form.Select id="moodChoices">
                {options.map((option) => (
                  <option key={option} onClick={() => setMood(option)}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {mood === "Other" && (
              <Form.Group className="mb-3">
                {/* Ti prego, controlla la grammatica */}
                <Form.Label>Oh, in which special mood are you?</Form.Label>
                <Form.Control type="text" placeholder="I really feel..." />
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
