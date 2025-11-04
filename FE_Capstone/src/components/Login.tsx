import { Form, Button, Container } from "react-bootstrap";
import "../scss/login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [token, setToken] = useState("");

  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [music, setMusic] = useState("");
  const searchMusic = () => {
    fetch("https://striveschool-api.herokuapp.com/api/deezer/search?q=sea")
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Errore!");
        }
      })
      .then((data) => {
        console.log(data);
        // console.log(data.results.trackmatches.track[0].url);
        setMusic(data.data[0].preview);
        console.log("data", data.data[0].preview);
      })
      .catch(() => console.log("Errore!"));
  };

  useEffect(() => {
    searchMusic();
    console.log("music", music);
  }, []);

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("http://localhost:8888/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          res.json().then((data) => {
            setError(data.message);
          });
          throw new Error("Error!");
        }
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem("token", data.token);
        navigate("/homepage");
      })
      .catch(() => {
        console.log("Error");
      });
  };

  return (
    <Container fluid className="vh-100">
      {music && (
        <>
          <button
            data-audio-id="150"
            title="Play preview"
            onClick={() => {
              audioRef.current?.play();
            }}
          >
            <i className="bi bi-play-fill"></i>
          </button>
          <audio ref={audioRef} src={music} controls />
          {/* <audio
            id="150"
            src={music}
            onClick={() => {
              const audio = new Audio(
                "https://cdnt-preview.dzcdn.net/api/1/1/b/7/4/0/b7419e01790c48b04399022b697e8db2.mp3?hdnea=exp=1762254216~acl=/api/1/1/b/7/4/0/b7419e01790c48b04399022b697e8db2.mp3"
              );
              audioRef.current?.play();
            }}
          ></audio> */}
        </>
      )}
      <Form
        className="d-flex flex-column align-items-center justify-content-center h-100"
        onSubmit={login}
      >
        <div className="d-flex flex-column myForm">
          <h1 className="text-center mb-4">Login</h1>
          <Form.Group
            className="mb-3 d-flex flex-column align-items-center"
            controlId="formBasicEmail"
          >
            <Form.Label>Username</Form.Label>
            <Form.Control
              className="w-75"
              type="text"
              placeholder="Enter username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
          </Form.Group>

          <Form.Group
            className="mb-3 d-flex flex-column align-items-center"
            controlId="formBasicPassword"
          >
            <Form.Label>Password</Form.Label>
            <Form.Control
              className="w-75"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className=" align-self-center"
          >
            Login
          </Button>
          {error != "" && (
            <p className="ms-4 text-danger small mt-3 mb-0 d-flex align-items-center">
              <BiInfoCircle className="me-2" /> {error}
            </p>
          )}
          <hr className="my-4" />
          <p>
            If you don't have an account,{" "}
            <Link to="/register">register here</Link>.
          </p>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
