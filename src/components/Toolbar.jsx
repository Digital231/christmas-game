import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import useStore from "../context/useStore";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";

function Toolbar() {
  const { username, logout } = useStore();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  function confirmLogout() {
    setShow(true);
  }

  function handleLogout() {
    logout();
    setShow(false);
    navigate("/");
  }

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Nav className="me-auto cursor-pointer">
            <Nav.Link
              className="cursor-pointer"
              onClick={username ? confirmLogout : null}
              as={username ? "span" : Link}
              to={username ? undefined : "/"}
              style={{ cursor: "pointer" }}
            >
              {username ? "Atsijungti" : "Prisijungti"}
            </Nav.Link>
          </Nav>
          <Navbar.Brand>{username}</Navbar.Brand>
        </Container>
      </Navbar>

      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Atsijungti ? </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Ar tikrai norite atsijungti?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={() => setShow(false)}>
            Nenoriu
          </Button>
          <Button variant="success" onClick={handleLogout}>
            Labai noriu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Toolbar;
