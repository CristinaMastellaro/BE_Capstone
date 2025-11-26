import { Form, Container } from "react-bootstrap";
import "../scss/login.scss";
import "../scss/firstPage.scss";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";
import Loader from "./Loader";
import { useAppDispatch } from "../redux/store";
import {
  ENDPOINT,
  findAllPlaylists,
  getCoutriesNames,
  setFavFromDb,
  setLoginEmail,
  setLoginName,
  setLoginSurname,
  setLoginUsername,
  setToken,
} from "../redux/actions";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import euterpe from "../assets/euterpe2.png";

const Login = () => {
  const [firstAnimation, setFirstAnimation] = useState(true);
  const [thirdAnimation, setThirdAnimation] = useState(false);

  useEffect(() => {
    // setTimeout(() => setFirstAnimation(true), 1500);
    setTimeout(() => setThirdAnimation(true), 9000);
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [typePassword, setTypePassword] = useState("password");

  useEffect(() => {
    if (typePassword === "text") {
      setTimeout(() => {
        setTypePassword("password");
        setShowPassword(false);
      }, 8000);
    }
  }, [typePassword]);

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
        dispatch(setToken(data.token));
        dispatch(setLoginUsername(data.username));
        dispatch(setLoginName(data.name));
        dispatch(setLoginSurname(data.surname));
        dispatch(setLoginEmail(data.email));
        dispatch(findAllPlaylists());
        dispatch(setFavFromDb());
        dispatch(getCoutriesNames());
        setIsLoading(false);
        navigate("/homepage");
      })
      .catch(() => {
        setIsLoading(false);
        console.log("Error");
      });
  };

  useEffect(() => {
    document.addEventListener("click", () => {
      setFirstAnimation(false);
      setThirdAnimation(true);
    });
  }, [thirdAnimation]);

  return (
    // <Container fluid className="vh-100 colored-bg-container">
    <Container
      fluid
      className="d-flex flex-column vh-100 vw-100 justify-content-center align-items-center"
      style={{ maxHeight: "100vh" }}
    >
      <div className="d-flex position-fixed vw-100 justify-content-center bg-first-page z-n1">
        <img src={euterpe} alt="Muse" className="picture-first-pg" />
      </div>
      <h1
        className={
          firstAnimation
            ? "title-first-page animation-title-first-page"
            : "opacity-0 d-none"
        }
      >
        Muse
      </h1>
      <p className={firstAnimation ? "fs-5 p-first-page" : "opacity-0 d-none"}>
        Inspiration for a musical odyssey
      </p>
      <p className="opacity-25 small position-absolute bottom-0">
        Picture from{" "}
        <a
          href="https://it.pinterest.com/pin/76701999895894032/"
          target="_blank"
          className="text-white"
        >
          Pinterest
        </a>
      </p>
      {thirdAnimation && (
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
              <div className="d-flex align-items-center justify-content-between gap-3 w-75">
                <Form.Control
                  className="w-100"
                  type={typePassword}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
                {showPassword ? (
                  <BsEye
                    className="icon"
                    onClick={() => {
                      setShowPassword(!showPassword);
                      setTypePassword("password");
                    }}
                  />
                ) : (
                  <BsEyeSlash
                    className="icon"
                    onClick={() => {
                      setShowPassword(!showPassword);
                      setTypePassword("text");
                    }}
                  />
                )}
              </div>
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
      )}
    </Container>
  );
};

export default Login;
