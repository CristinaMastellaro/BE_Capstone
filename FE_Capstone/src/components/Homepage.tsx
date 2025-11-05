import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
const Homepage = () => {
  const [mood, setMood] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  const getMoods = () => {
    fetch("http://localhost:8888/moods")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Error in the first then!");
        }
      })
      .then((data) => {
        console.log("data", data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getMoods();
  }, []);

  return (
    <>
      {/* Emoticon? */}
      <h5>How are you feeling today? </h5>
      <Form>
        <Form.Group className="mb-3">
          <Form.Control type="text" placeholder="I'm feeling..." />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Select>
            {options.map((mood) => (
              <option onClick={() => setMood(mood)}>{mood}</option>
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
        <Button variant="primary" type="submit">
          Music time!
        </Button>
      </Form>
    </>
  );
};

export default Homepage;
