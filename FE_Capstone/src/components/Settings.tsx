import { Button, Col, Form, Image, Modal, Row } from "react-bootstrap";
import "../scss/settings.scss";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  ENDPOINT,
  isPlayingSong,
  resetPlaylists,
  saveCurrentSong,
  setLoginAvatar,
  setLoginEmail,
  setLoginName,
  setLoginSurname,
  setLoginUsername,
  setToken,
} from "../redux/actions";
import { useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";
import { BiEdit, BiInfoCircle } from "react-icons/bi";

const Settings = () => {
  const name = useAppSelector((state) => state.user.name);
  const surname = useAppSelector((state) => state.user.surname);
  const email = useAppSelector((state) => state.user.email);
  const username = useAppSelector((state) => state.user.username);
  const avatar = useAppSelector((state) => state.user.avatar);

  // To change password

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
    localStorage.setItem("token", "");
    localStorage.setItem("name", "");
    localStorage.setItem("username", "");
    localStorage.setItem("surname", "");
    localStorage.setItem("email", "");
    localStorage.setItem("avatar", "");
    dispatch(
      saveCurrentSong({ id: "", cover: "", preview: "", author: "", title: "" })
    );
    dispatch(isPlayingSong(false));
    localStorage.setItem("token", "");
    setTimeout(() => navigate("/"), 2000);
  };

  // To update info
  const TOKEN = useAppSelector((state) => state.user.token);
  const [isChangingInfo, setIsChangingInfo] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSurname, setNewSurname] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [formData, setFormData] = useState<{ avatarUrl: File | null }>({
    avatarUrl: null,
  });
  const [nameFile, setNameFile] = useState("");

  const [isError, setIsError] = useState(false);
  const [messagesError, setMessagesError] = useState<string[]>([]);

  useEffect(() => {
    if (isError) {
      setTimeout(() => {
        setIsError(false);
      }, 3500);
    }
  }, [isError]);

  const requestChangeInfo = (e: FormEvent) => {
    e.preventDefault();

    setIsWrong(false);
    setIsError(false);

    const finalName = newName === "" ? name : newName;
    const finalSurname = newSurname === "" ? surname : newSurname;
    const finalEmail = newEmail === "" ? email : newEmail;
    const finalUsername = newUsername === "" ? username : newUsername;

    fetch(ENDPOINT + "/user/changeInfo", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: finalName,
        surname: finalSurname,
        username: finalUsername,
        email: finalEmail,
        oldUsername: username,
      }),
    })
      .then(async (res) => {
        setIsChangingInfo(false);
        if (!res.ok) {
          console.log("res error", res);
          const data = await res.json();
          if (data.message) {
            setMessagesError(data.message);
          } else {
            setMessagesError(data.listErrors);
          }
          throw new Error("Error while changing the info!");
        } else {
          return res.json();
        }
      })
      .then((data) => {
        dispatch(setLoginUsername(data.username));
        dispatch(setLoginName(data.name));
        dispatch(setLoginSurname(data.surname));
        dispatch(setLoginEmail(data.email));
      })
      .catch((err) => {
        setIsError(true);
        console.log("Error!", err);
      });

    if (formData.avatarUrl !== null) {
      const data = new FormData();
      data.append("avatarUrl", formData.avatarUrl);
      fetch(ENDPOINT + "/user/upload", {
        method: "PATCH",
        body: data,
        headers: { Authorization: `Bearer ${TOKEN}` },
      })
        .then((res) => {
          console.log("res", res);
          if (!res.ok) throw new Error("Error while changing picture");
          else return res.json();
        })
        .then((res2) => dispatch(setLoginAvatar(res2.avatar)))
        .catch((err) => console.log("Error!", err));
    }
  };

  return (
    // <Container fluid className="position-relative">
    <>
      <div className="change-hero">
        <h1 className="fw-semibold">Settings</h1>
      </div>
      <Row className="mx-0 mt-5 px-3">
        <div className="d-flex flex-column flex-md-row align-items-center mb-4">
          <h2 className="text-center flex-grow-1">Personal information</h2>
          {!isChangingInfo && (
            <BiEdit
              className="fs-4 mt-3 mt-md-0 icon"
              onClick={() => setIsChangingInfo(true)}
            />
          )}
        </div>
        <Col xs={12} className="text-center mb-4">
          <div className="mx-auto container-avatar">
            <Image
              src={
                avatar
                  ? avatar
                  : "https://ui-avatars.com/api/?name=" +
                    name.substring(0) +
                    "+" +
                    surname.substring(0)
              }
              className="img-settings"
              roundedCircle
            />
            {isChangingInfo && (
              <>
                <input
                  type="file"
                  className="form-control-file rounded-pill"
                  // placeholder="Crea un post"
                  // value={formData.text}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFormData({ avatarUrl: e.target.files[0] });
                      setNameFile(e.target.files[0].name);
                    }
                  }}
                  // style={{ backgroundColor: "#f3f2ef", border: "none" }}
                />
                <BiEdit className="edit-image-icon" />
                <p className="pt-2 mb-0">{nameFile}</p>
              </>
            )}
          </div>
        </Col>
        <Col xs={12} sm={11} md={6} xl={4} className="mx-auto">
          <Form onSubmit={requestChangeInfo}>
            <Row className="mb-1 justify-content-center">
              <Col xs={4} md={3} className="fw-semibold text-end">
                Name
              </Col>
              <Col xs={8} md={6}>
                {isChangingInfo ? (
                  <input
                    value={newName}
                    placeholder={name}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                ) : (
                  name
                )}
              </Col>
            </Row>
            <Row className="mb-1 justify-content-center">
              <Col xs={4} md={3} className="fw-semibold text-end">
                Surname
              </Col>
              <Col xs={8} md={6}>
                {isChangingInfo ? (
                  <input
                    value={newSurname}
                    placeholder={surname}
                    onChange={(e) => setNewSurname(e.target.value)}
                  />
                ) : (
                  surname
                )}
              </Col>
            </Row>
            <Row className="mb-3 justify-content-center">
              <Col xs={4} md={3} className="fw-semibold text-end">
                Username
              </Col>
              <Col xs={8} md={6}>
                {isChangingInfo ? (
                  <input
                    value={newUsername}
                    placeholder={username}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                ) : (
                  username
                )}
              </Col>
            </Row>
            <Row className="mb-4 justify-content-center">
              <Col xs={4} md={3} className="fw-semibold text-end">
                Email
              </Col>
              <Col xs={8} md={6}>
                {isChangingInfo ? (
                  <input
                    value={newEmail}
                    placeholder={email}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                ) : (
                  email
                )}
              </Col>
            </Row>
            {isError && (
              <p className="text-danger">
                <BiInfoCircle className="me-2" />
                {messagesError}
              </p>
            )}
            {isChangingInfo && (
              <div
                className="d-flex flex-column flex-sm-row gap-3 my-2 mx-auto"
                style={{ width: "fit-content" }}
              >
                <button className="my-btn-blue" type="submit">
                  Change
                </button>
                <button
                  className="my-btn-blue bg-body-secondary"
                  onClick={() => setIsChangingInfo(false)}
                >
                  Back
                </button>
              </div>
            )}
          </Form>
          <Row className="mb-3 justify-content-center">
            <Col xs={10}>
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
                    <Button variant="primary" type="submit" className="me-2">
                      Check
                    </Button>
                    <Button
                      variant="secondary"
                      type="button"
                      onClick={() => setIsRequestChangePassword(false)}
                    >
                      Back
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
            </Col>
            {/* <span
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
            )} */}
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
