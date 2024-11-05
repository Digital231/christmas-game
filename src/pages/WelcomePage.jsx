import { useState } from "react";
import {
  Button,
  Form,
  ListGroup,
  Alert,
  Modal,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

function WelcomePage() {
  const [wishlist, setWishlist] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isListConfirmed, setIsListConfirmed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newItem.trim()) {
      setError("Please enter an item");
      return;
    }

    if (wishlist.length >= 10) {
      setError("Maximum 10 items allowed!");
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

  const finalizeList = () => {
    setIsListConfirmed(true);
    setShowConfirmModal(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h1 className="display-4 text-center mb-4">
            🎄 My Christmas Wishlist 🎅
          </h1>

          <div className="card shadow-sm">
            <div className="card-body">
              {!isListConfirmed && (
                <Form onSubmit={handleSubmit} className="mb-4">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">
                      Add Gift ({10 - wishlist.length} slots remaining)
                    </Form.Label>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder="Enter gift wish..."
                        className="shadow-sm"
                        disabled={isListConfirmed}
                      />
                      <Button
                        type="submit"
                        variant="success"
                        className="shadow-sm"
                        disabled={wishlist.length >= 10 || isListConfirmed}
                      >
                        Add
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
                        Confirm Wishlist
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-muted py-4">
                  <p className="mb-0">Your wishlist is empty</p>
                  <small>Add up to 10 items you want for Christmas!</small>
                </div>
              )}
            </div>
          </div>

          {isListConfirmed && (
            <Alert variant="success" className="mt-3">
              🎉 Your wishlist has been confirmed!
            </Alert>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Wishlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to confirm your wishlist with these{" "}
            {wishlist.length} items?
          </p>
          <Alert variant="warning">
            ⚠️ No changes can be made after confirmation!
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Keep Editing
          </Button>
          <Button variant="success" onClick={finalizeList}>
            Yes, Confirm List
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default WelcomePage;
