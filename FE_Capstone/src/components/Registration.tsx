import { Form, Button, Container } from "react-bootstrap";
import "../scss/login.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiInfoCircle } from "react-icons/bi";
import Loader from "./Loader";

const Registration = () => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const registration = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    fetch("http://localhost:8888/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        surname: surname,
        email: email,
        username: username,
        password: password,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setLoading(false);
          navigate("/");
        } else {
          setLoading(false);
          res.json().then((data) => {
            const stringError: string[] = [];
            if (data.listErrors) {
              data.listErrors.forEach((e: string) => stringError.push(e + " "));
            } else {
              stringError.push(data.message);
            }
            setErrors(stringError);
          });
          throw new Error("Error!");
        }
      })
      .catch(() => {
        console.error("Error!");
      });
  };

  return (
    <Container fluid>
      <Form
        className="d-flex flex-column align-items-center justify-content-center h-100"
        onSubmit={registration}
      >
        <div className="d-flex flex-column myForm registrationForm">
          <h1 className="text-center mb-4">Sign up</h1>
          <Form.Group
            className="mb-3 d-flex flex-column align-items-center"
            controlId="formName"
          >
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group
            className="mb-3 d-flex flex-column align-items-center"
            controlId="formSurname"
          >
            <Form.Label>Surname</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </Form.Group>

          <Form.Group
            className="mb-3 d-flex flex-column align-items-center"
            controlId="formBasicEmail"
          >
            <Form.Label>Email (*)</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group
            className="mb-3 d-flex flex-column align-items-center"
            controlId="formUsername"
          >
            <Form.Label>Username (*)</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group
            className="mb-3 d-flex flex-column align-items-center"
            controlId="formBasicPassword"
          >
            <Form.Label>Password (*)</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <div>
            {errors.length != 0 &&
              errors.map((error, i) => (
                <div
                  key={i}
                  className="text-danger small mb-0 d-flex align-items-center mb-1 justify-content-center"
                >
                  <BiInfoCircle className="me-2 text-danger" />
                  <p className="w-75 mb-0">{error}</p>
                </div>
              ))}
          </div>
          <p className="small text-secondary mb-4">
            The fields with (*) are mandatory.
          </p>
          <Button
            variant="primary"
            type="submit"
            className=" align-self-center w-50"
          >
            {loading ? <Loader /> : "Register"}
          </Button>
          {/* {loading && <Loader />} */}
        </div>
      </Form>
    </Container>
  );
};

export default Registration;
