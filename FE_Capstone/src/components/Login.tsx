import { Form, Button, Container } from "react-bootstrap";
import "../css/login.css";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <Container fluid className="vh-100">
      <Form className="d-flex flex-column align-items-center justify-content-center h-100">
        <div className="d-flex flex-column myForm">
          <h1 className="text-center mb-4">Login</h1>
          <Form.Group
            className="mb-3 d-flex flex-column align-items-center"
            controlId="formBasicEmail"
          >
            <Form.Label>Email address</Form.Label>
            <Form.Control
              className="w-75"
              type="email"
              placeholder="Enter email"
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
            />
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className=" align-self-center"
          >
            Submit
          </Button>
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
