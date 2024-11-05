import { useState, useEffect } from "react";
import {
  Button,
  Form,
  ListGroup,
  Alert,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import useStore from "../context/useStore";
import { useNavigate } from "react-router-dom";
import API_URL from "../utils/host";

function WelcomePage() {
  const [wishlist, setWishlist] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isListConfirmed, setIsListConfirmed] = useState(false);
  const [wishlistExists, setWishlistExists] = useState(false);
  const username = useStore((state) => state.username);
  const navigate = useNavigate();

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const response = await fetch(`${API_URL}/wishlist/check/${username}`);
        if (!response.ok) {
          throw new Error("Nepavyko patikrinti norų sąrašo");
        }
        const data = await response.json();
        if (data.wishlist && data.wishlist.length > 0) {
          setWishlistExists(true);
          setWishlist(data.wishlist);
        }
      } catch (error) {
        console.error("Klaida tikrinant norų sąrašą:", error);
      }
    };

    checkWishlist();
  }, [username]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newItem.trim()) {
      setError("Įveskite dovaną");
      return;
    }

    if (wishlist.length >= 10) {
      setError("Leidžiama tik iki 10 dovanų!");
      return;
    }

    setWishlist([...wishlist, newItem.trim()]);
    setNewItem("");
    setError("");
  };

  const removeItem = (index) => {
    setWishlist(wishlist.filter((_, i) => i !== index));
  };

  const handleConfirmList = () => {
    setShowConfirmModal(true);
  };

  const finalizeList = async () => {
    try {
      const response = await fetch(`${API_URL}/wishlist`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username, wishlist }),
      });

      if (response.ok) {
        setIsListConfirmed(true);
        setShowConfirmModal(false);
        navigate("/game");
      } else {
        console.error("Nepavyko atnaujinti norų sąrašo");
      }
    } catch (error) {
      console.error("Klaida:", error);
    }
  };

  if (wishlistExists) {
    return (
      <div className="container mt-5 text-center">
        <h1 className="display-4 mb-4">Jūsų norų sąrašas jau sukurtas!</h1>
        <Button variant="primary" onClick={() => navigate("/game")}>
          Eiti į žaidimą
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="display-4 text-center mb-4">
            🎄 Mano Kalėdų Norų Sąrašas 🎅
          </h1>

          <div className="card shadow-sm">
            <div className="card-body">
              {!isListConfirmed && (
                <Form onSubmit={handleSubmit} className="mb-4">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Pridėti dovaną (liko {10 - wishlist.length} vietų)
                    </Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Įveskite norimą dovaną..."
                        className="shadow-sm"
                        disabled={isListConfirmed}
                      />
                      <Button
                        type="submit"
                        variant="success"
                        className="shadow-sm"
                        disabled={wishlist.length >= 10 || isListConfirmed}
                      >
                        Pridėti
                      </Button>
                    </div>
                  </Form.Group>
                </Form>
              )}

              {error && (
                <Alert variant="danger" className="py-2 mb-3">
                  {error}
                </Alert>
              )}

              {wishlist.length > 0 ? (
                <>
                  <ListGroup className="shadow-sm">
                    {wishlist.map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id={`tooltip-${index}`}>{item}</Tooltip>
                          }
                        >
                          <span
                            className="me-3 text-truncate"
                            style={{ maxWidth: "80%" }}
                          >
                            {index + 1}. {item}
                          </span>
                        </OverlayTrigger>
                        {!isListConfirmed && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            ✕
                          </Button>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>

                  {!isListConfirmed && wishlist.length >= 2 && (
                    <div className="d-grid mt-3">
                      <Button
                        variant="primary"
                        onClick={handleConfirmList}
                        className="shadow-sm"
                      >
                        Patvirtinti sąrašą
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-muted py-4">
                  <p className="mb-0">Jūsų norų sąrašas tuščias</p>
                  <small>
                    Pridėkite iki 10 dovanų, kurias norite gauti Kalėdoms!
                  </small>
                </div>
              )}
            </div>
          </div>

          {isListConfirmed && (
            <Alert variant="success" className="mt-3">
              🎉 Jūsų norų sąrašas patvirtintas!
            </Alert>
          )}
        </div>
      </div>

      {/* Patvirtinimo modalas */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Patvirtinti norų sąrašą</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Ar tikrai norite patvirtinti savo norų sąrašą su {wishlist.length}{" "}
            elementais?
          </p>
          <Alert variant="warning">
            ⚠️ Po patvirtinimo sąrašas nebegalės būti keičiamas!
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Redaguoti toliau
          </Button>
          <Button variant="success" onClick={finalizeList}>
            Taip, patvirtinti sąrašą
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default WelcomePage;
