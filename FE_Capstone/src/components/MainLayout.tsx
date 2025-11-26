import { Col, Container, Row } from "react-bootstrap";
import CustomNavbar from "./CustomNav";
import PlayerMusic from "./PlayerMusic";
import { Outlet, useNavigate } from "react-router-dom";
import "../scss/customNav.scss";
import CustomFooter from "./CustomFooter";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { useEffect } from "react";
import {
  findAllPlaylists,
  getCoutriesNames,
  setFavFromDb,
  setLoginAvatar,
  setLoginEmail,
  setLoginName,
  setLoginSurname,
  setLoginUsername,
  setToken,
} from "../redux/actions";

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const token = localStorage.getItem("token") || "";
  const username = localStorage.getItem("username") || "";
  const name = localStorage.getItem("name") || "";
  const surname = localStorage.getItem("surname") || "";
  const email = localStorage.getItem("email") || "";
  const avatar = localStorage.getItem("avatar") || "";
  const isAlreadySavedInRedux = useAppSelector(
    (state) => state.user.token !== ""
  );

  useEffect(() => {
    // If a user isn't logged in, it's redirected to the login page
    if (token === "" || username === "") {
      navigate("/");
    } else {
      // If the user didn't come from the login page, it can still enter, if there's a token saved in the localStorage
      if (!isAlreadySavedInRedux) {
        dispatch(setToken(token));
        dispatch(setLoginUsername(username));
        dispatch(setLoginName(name));
        dispatch(setLoginSurname(surname));
        dispatch(setLoginEmail(email));
        dispatch(setLoginAvatar(avatar));
        dispatch(findAllPlaylists());
        dispatch(setFavFromDb());
        dispatch(getCoutriesNames());
      }
    }
  }, []);

  return (
    <>
      <Container fluid className="my-bg-container">
        <Row>
          <Col
            xs={12}
            lg={3}
            xl={2}
            className="py-2 p-lg-0 bg-black px-lg-3 pt-lg-4 position-fixed bottom-0 custom-nav z-1"
          >
            <CustomNavbar />
          </Col>
          <Col
            xs={12}
            lg={9}
            xl={10}
            className={"px-0 ms-auto d-flex flex-column"}
            style={{ minHeight: "100vh" }}
          >
            <div className="flex-grow-1 px-0 mx-0">
              <Outlet />
            </div>
            <div className="z-0 position-relative">
              <CustomFooter />
            </div>
          </Col>
        </Row>
      </Container>
      <div className="position-relative z-2">
        <PlayerMusic />
      </div>
    </>
  );
};

export default MainLayout;
