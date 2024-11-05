import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import useStore from "../context/useStore";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";

function LoginPage() {
  const [selectedName, setSelectedName] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  function setUsername(username) {
    useStore.setState({ username });
  }

  function confirmHandler() {
    setShow(false);
    setUsername(selectedName);
    navigate("/welcome");
  }

  function handleClose() {
    setShow(false);
  }

  function handleShow() {
    setShow(true);
  }

  const allNames = [
    "Vaida",
    "Šarūnas",
    "Inga",
    "Virginijus",
    "Neringa",
    "Vitalijus",
    "Mama",
    "Tėtis",
  ];

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h1 className="display-6 mb-4">
            {selectedName ? (
              <>
                Pasirinktas vardas:
                <span className="text-info ms-2">{selectedName}</span>
              </>
            ) : (
              "Prašome pasirinkti vardą"
            )}
          </h1>

          <div className="d-flex justify-content-center gap-3">
            <DropdownButton
              id="dropdown-item-button"
              title="Choose name"
              variant="outline-dark"
              className="shadow-sm"
            >
              {allNames.map((name) => (
                <Dropdown.Item
                  key={name}
                  as="button"
                  onClick={() => setSelectedName(name)}
                  active={selectedName === name}
                >
                  {name}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <Button
              disabled={!selectedName}
              variant="warning"
              onClick={handleShow}
              className="shadow-sm"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton className="border-bottom">
          <Modal.Title className="text-danger">Perspėjimas</Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          Ar tikrai jūsų vardas <strong>{selectedName}</strong>?
        </Modal.Body>
        <Modal.Footer className="border-top">
          <Button variant="outline-secondary" onClick={handleClose}>
            Oj ne!
          </Button>
          <Button variant="success" onClick={confirmHandler}>
            100% taip yra
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LoginPage;
