import { Container } from "react-bootstrap";
import image from "../assets/woman-6810514_640.png";
import "../scss/page404.scss";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <>
      <Container
        fluid
        className="my-bg-container w-100 h-100 position-relative"
      >
        <div
          style={{ backgroundImage: `url(${image})` }}
          className="img-not-found"
        >
          <p>
            Picture by{" "}
            <a href="https://pixabay.com/it/users/gdj-1086657/" target="blank">
              GDJ
            </a>
          </p>
        </div>
        <div className="message-not-found">
          <p>Did you get lost?</p>
          <p>
            Let us help! You'll find your way back home{" "}
            <Link to="/homepage" className="text-white">
              here
            </Link>
          </p>
        </div>
      </Container>
    </>
  );
};

export default Page404;
