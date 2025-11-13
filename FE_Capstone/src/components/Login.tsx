import { Form, Container } from "react-bootstrap";
import "../scss/login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import Loader from "./Loader";
import { useAppDispatch } from "../redux/store";
import {
  ENDPOINT,
  findAllPlaylists,
  setFavFromDb,
  setLoginUsername,
} from "../redux/actions";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(ENDPOINT + "/auth/login", {
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("tokenLastFm", data.tokenLastFm);
        localStorage.setItem("tokenPexel", data.apikeyPexels);
        dispatch(setLoginUsername(data.username));
        dispatch(findAllPlaylists());
        dispatch(setFavFromDb());
        setIsLoading(false);
        navigate("/homepage");
      })
      .catch(() => {
        setIsLoading(false);
        console.log("Error");
      });
  };

  return (
    <Container fluid className="vh-100">
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
          {error != "" && (
            <p className="ms-4 text-danger small mb-3 d-flex align-items-center">
              <BiInfoCircle className="me-2" /> {error}
            </p>
          )}
          <button
            type="submit"
            className="my-btn-blue align-self-center rounded-pill"
          >
            {isLoading ? <Loader /> : "Login"}
          </button>
          <hr className="my-4" />
          <p>
            If you don't have an account,{" "}
            <Link to="/register">sign up here</Link>.
          </p>
        </div>
      </Form>
    </Container>
  );
};

export default Login;
