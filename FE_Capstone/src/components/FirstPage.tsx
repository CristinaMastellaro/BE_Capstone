import { Container } from "react-bootstrap";
import "../scss/firstPage.scss";
import { useEffect, useState } from "react";
// import musa from "../assets/musa.png";
// import euterpe from "../assets/euterpe-transparent.png";
import euterpe from "../assets/euterpe2.png";

const FirstPage = () => {
  const [secondAnimation, setSecondAnimation] = useState(false);
  const [firstAnimation, setFirstAnimation] = useState(false);

  useEffect(() => {
    setTimeout(() => setFirstAnimation(true), 1500);
    setTimeout(() => setSecondAnimation(true), 3500);
  }, []);

  return (
    <>
      <Container
        fluid
        className="d-flex flex-column vh-100 vw-100 justify-content-center align-items-center"
        style={{ maxHeight: "100vh" }}
      >
        {/* <div className="d-flex position-fixed vh-100 vw-100 justify-content-center"> */}
        <div className="d-flex position-fixed vw-100 justify-content-center bg-first-page z-n1">
          <img src={euterpe} alt="Muse" className="picture-first-pg" />
        </div>
        <h1
          className={
            firstAnimation
              ? "title-first-page animation-title-first-page"
              : "opacity-0"
          }
        >
          Muse
        </h1>
        <p className={secondAnimation ? "fs-5 p-first-page" : "opacity-0"}>
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
      </Container>
    </>
  );
};

export default FirstPage;
