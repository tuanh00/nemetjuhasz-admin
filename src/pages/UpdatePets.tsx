import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import { Pet } from "../firebase/types";
import { getPets } from "../firebase/petservice";

const UpdatePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsList = await getPets();
        setPets(petsList);
      } catch (e) {
        setError("Failed to fetch pets.");
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleCardClick = (id: string) => {
    navigate(`/update-pet/${id}`);
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main>
        <h2>Update Pets</h2>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <div className="pets-grid">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="pet-card"
              onClick={() => handleCardClick(pet.id ?? "")}
            >
              <img src={pet.img_url} alt={pet.name} />
              <div className="pet-info">
                <h3>{pet.name}</h3>
                <p>Age: {pet.age}</p>
                <p>Type: {pet.type}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UpdatePets;
