import { Form, Button, Container } from "react-bootstrap";
import "../css/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { BiInfoCircle } from "react-icons/bi";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

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
              placeholder="Enter email"
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
            Submit
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
