import { Button, Col, Container, Image, Modal, Row } from "react-bootstrap";
import "../scss/settings.scss";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  isPlayingSong,
  saveCurrentSong,
  setLoginEmail,
  setLoginName,
  setLoginSurname,
  setLoginUsername,
} from "../redux/actions";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Settings = () => {
  const name = useAppSelector((state) => state.user.name);
  const surname = useAppSelector((state) => state.user.surname);
  const email = useAppSelector((state) => state.user.email);
  const username = useAppSelector((state) => state.user.username);

  const [showModal, setShowModal] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const disconnect = () => {
    dispatch(setLoginUsername(""));
    dispatch(setLoginName(""));
    dispatch(setLoginSurname(""));
    dispatch(setLoginEmail(""));
    dispatch(isPlayingSong(false));
    dispatch(
      saveCurrentSong({ id: "", cover: "", preview: "", author: "", title: "" })
    );
    localStorage.setItem("token", "");
    localStorage.setItem("tokenLastFm", "");
    localStorage.setItem("tokenPexel", "");
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <Container fluid>
      <h1 className="mt-5 ms-4 fw-bold">Settings</h1>
      <Row className="ms-3 mt-5">
        <h2 className="mb-5">Personal information</h2>
        <Col xs={3} md={2}>
          <Image
            src={
              "https://ui-avatars.com/api/?name=" +
              name.substring(0) +
              "+" +
              surname.substring(0)
            }
            className="img-settings"
            roundedCircle
          />
        </Col>
        <Col xs={9} md={10}>
          <Row className="mb-3">
            <Col xs={4} className="fw-semibold">
              Full name
            </Col>
            <Col xs={8}>
              {name} {surname}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col xs={4} className="fw-semibold">
              Username
            </Col>
            <Col xs={8}>{username}</Col>
          </Row>
          <Row className="mb-4">
            <Col xs={4} className="fw-semibold">
              Email
            </Col>
            <Col xs={8}>{email}</Col>
          </Row>
          <Row className="mb-3">
            <span className="text-decoration-underline change-psw">
              Change password
            </span>
          </Row>
        </Col>
      </Row>
      <Row className="ms-3 mt-5 d-flex justify-content-center">
        <Col xs={4} md={2}>
          <Button
            variant="danger"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Disconnect
          </Button>
        </Col>
      </Row>
      {showModal && (
        <div className="modal show custom-modal">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title className="flex-grow-1 text-center">
                Warning
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="border-bottom-0 pb-0 pt-2">
              <p className="mb-0">Are you sure you want to disconnect?</p>
            </Modal.Body>
            <Modal.Footer className="border-top-0 d-flex justify-content-center gap-2">
              <Button variant="primary" onClick={disconnect}>
                Yes
              </Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                No
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </div>
      )}
    </Container>
  );
};

export default Settings;
