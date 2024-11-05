import { useState, useEffect } from "react";
import useStore from "../context/useStore";
import API_URL from "../utils/host";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

function RollDice() {
  const [rolledResult, setRolledResult] = useState("");
  const [pickedWishlist, setPickedWishlist] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const username = useStore((state) => state.username);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) {
          throw new Error("Nepavyko gauti vartotojų");
        }
        const data = await response.json();
        setUsers(data);

        // Surasti dabartinį vartotoją
        const user = data.find((user) => user.name === username);
        setCurrentUser(user);

        // Jei vartotojas jau rideno kauliuką, gauti pasirinkto asmens pageidavimų sąrašą
        if (user && user.rolledPerson) {
          const wishlistResponse = await fetch(
            `${API_URL}/wishlist/${user.rolledPerson}`
          );
          if (wishlistResponse.ok) {
            const { wishlist } = await wishlistResponse.json();
            setPickedWishlist(wishlist);
          } else {
            throw new Error("Nepavyko gauti pageidavimų sąrašo");
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllUsers();
  }, [username]);

  const rollDice = async () => {
    if (currentUser && currentUser.rolledPerson) {
      setRolledResult(
        `Jūs jau ridenote ir pasirinkote "${currentUser.rolledPerson}".`
      );
      return;
    }

    const availableUsers = users.filter(
      (user) => user.name !== username && !user.wasPicked
    );

    if (availableUsers.length === 0) {
      setRolledResult("Nėra galimų vartotojų ridenimui.");
      return;
    }

    const randomUser =
      availableUsers[Math.floor(Math.random() * availableUsers.length)];

    try {
      const response = await fetch(`${API_URL}/roll`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rollerName: username,
          pickedName: randomUser.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Nepavyko atnaujinti ridenimo");
      }

      //   setRolledResult(`Jūs ridenote "${randomUser.name}"`);
      setCurrentUser({ ...currentUser, rolledPerson: randomUser.name });

      const wishlistResponse = await fetch(
        `${API_URL}/wishlist/${randomUser.name}`
      );
      if (wishlistResponse.ok) {
        const { wishlist } = await wishlistResponse.json();
        setPickedWishlist(wishlist);
      } else {
        throw new Error("Nepavyko gauti pageidavimų sąrašo");
      }
    } catch (error) {
      console.error("Klaida:", error);
      setRolledResult("Įvyko klaida ridenant kauliuką.");
    }
  };

  if (loading) {
    return <p className="text-center">Įkeliama...</p>;
  }

  if (error) {
    return <p className="text-center text-danger">{error}</p>;
  }

  return (
    <div className="container text-center mt-5 p-4 shadow-sm rounded bg-light">
      {currentUser && currentUser.rolledPerson ? (
        <div className="alert alert-success">
          Išridenote &quot;{currentUser.rolledPerson}&quot;.
        </div>
      ) : (
        <button className="btn btn-primary" onClick={rollDice}>
          Ridenti kauliuką
        </button>
      )}
      {rolledResult && <p className="mt-3">{rolledResult}</p>}
      {pickedWishlist.length > 0 && (
        <div className="mt-4">
          <h4>Pageidavimų sąrašas: {currentUser?.rolledPerson}</h4>
          <ul className="list-group mt-3">
            {pickedWishlist.map((item, index) => (
              <OverlayTrigger
                key={index}
                placement="top"
                overlay={<Tooltip id={`tooltip-${index}`}>{item}</Tooltip>}
              >
                <li className="list-group-item wishlist-item">{item}</li>
              </OverlayTrigger>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default RollDice;
