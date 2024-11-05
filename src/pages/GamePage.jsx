import { useState, useEffect } from "react";
import API_URL from "../utils/host";
import RollDice from "../components/RollDice";

function GamePage() {
  const [incompleteUsers, setIncompleteUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIncompleteUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/wishlist/incomplete`);
        if (!response.ok) {
          throw new Error("Nepavyko gauti neužbaigtų vartotojų");
        }
        const data = await response.json();
        setIncompleteUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIncompleteUsers();
  }, []);

  return (
    <div className="container my-5 p-4 shadow-lg rounded game-page">
      <h1 className="display-4 text-center mb-4">Žaidimo puslapis</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Įkeliama...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center">{error}</div>
          ) : incompleteUsers.length === 0 ? (
            <RollDice users={incompleteUsers} />
          ) : (
            <div className="alert alert-success text-center">
              <h4 className="mb-3">
                Asmenys, kurie neužbaigė savo pageidavimų sąrašo:
              </h4>
              <ul className="list-group">
                {incompleteUsers.map((user) => (
                  <li key={user.name} className="list-group-item">
                    {user.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GamePage;
