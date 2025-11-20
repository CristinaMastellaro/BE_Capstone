import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import "../scss/settings.scss";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  ENDPOINT,
  isPlayingSong,
  resetPlaylists,
  saveCurrentSong,
  setLoginEmail,
  setLoginName,
  setLoginSurname,
  setLoginUsername,
  setToken,
} from "../redux/actions";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { BiInfoCircle } from "react-icons/bi";

const Settings = () => {
  const name = useAppSelector((state) => state.user.name);
  const surname = useAppSelector((state) => state.user.surname);
  const email = useAppSelector((state) => state.user.email);
  const username = useAppSelector((state) => state.user.username);

  const [isRequestChangePassword, setIsRequestChangePassword] = useState(false);
  const [changePasswordCode, setChangePasswordCode] = useState(0);
  const [sentPasswordCode, setSentPasswordCode] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const [howManyErrors, setHowManyErrors] = useState(0);
  const [canChangePassword, setCanChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [hasChanged, setHasChanged] = useState(false);

  const requestToChangePassword = () => {
    setIsRequestChangePassword(true);
    fetch(ENDPOINT + "/auth/changePassword?email=" + email)
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            "Error while doing the request to change the password!"
          );
        } else {
          return res.json();
        }
      })
      .then((data) => {
        setChangePasswordCode(data);
      })
      .catch((err) => console.log("Error!", err));
  };

  const verifyCode = (e: FormEvent) => {
    e.preventDefault();
    if (Number(sentPasswordCode) === changePasswordCode) {
      setCanChangePassword(true);
    } else {
      setIsWrong(true);
      const totalErrors = howManyErrors + 1;
      setHowManyErrors(totalErrors);
      if (totalErrors > 2) {
        setTimeout(() => navigate("/"), 3000);
      }
    }
  };

  const changePassword = (e: FormEvent) => {
    e.preventDefault();
    fetch(ENDPOINT + "/auth/changePassword", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: newPassword,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error while changing password!");
        } else {
          console.log("Cambio password riuscito!");
          setHasChanged(true);
          setTimeout(() => disconnect(), 5000);
        }
      })
      .catch((err) => console.log("Error!", err));
  };

  const [showModal, setShowModal] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const disconnect = () => {
    dispatch(setLoginUsername(""));
    dispatch(setToken(""));
    dispatch(setLoginName(""));
    dispatch(setLoginSurname(""));
    dispatch(setLoginEmail(""));
    dispatch(resetPlaylists());
    dispatch(
      saveCurrentSong({ id: "", cover: "", preview: "", author: "", title: "" })
    );
    dispatch(isPlayingSong(false));
    localStorage.setItem("token", "");
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    // <Container fluid className="position-relative">
    <>
      <div className="change-hero">
        <h1 className="fw-semibold">Settings</h1>
      </div>
      <Row className="mx-0 mt-5 px-3">
        <h2 className="mb-5 text-center">Personal information</h2>
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
          <Row className="mb-1">
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
            <span
              className="text-decoration-underline change-psw"
              onClick={requestToChangePassword}
            >
              Change password
            </span>
            {isRequestChangePassword && !canChangePassword && (
              <div className="my-2">
                <Form onSubmit={verifyCode}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>
                      Write here the code that was sent to you via email:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      className="input-settings w-50"
                      value={sentPasswordCode}
                      onChange={(e) => {
                        setSentPasswordCode(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Check
                  </Button>
                  {isWrong && (
                    <p className="text-danger small d-flex align-items-center mb-0 mt-2">
                      <BiInfoCircle className="me-2" /> Wrong code!
                    </p>
                  )}
                  {isWrong && howManyErrors > 2 && (
                    <p className="text-danger small mt-2">
                      You made too many mistakes. You'll be redirected to the
                      login page
                    </p>
                  )}
                </Form>
              </div>
            )}
            {canChangePassword && !hasChanged && (
              <Form onSubmit={changePassword}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Write the new password here:</Form.Label>
                  <Form.Control
                    type="text"
                    className="input-settings w-50"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                    }}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Change
                </Button>
              </Form>
            )}
            {hasChanged && (
              <p className="mt-2">
                The password has been changed! You'll be redirected to the login
                page shortly.
              </p>
            )}
          </Row>
        </Col>
      </Row>
      <Row className="mx-0 mt-3 mb-2 d-flex justify-content-center">
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
    </>
  );
};

export default Settings;
