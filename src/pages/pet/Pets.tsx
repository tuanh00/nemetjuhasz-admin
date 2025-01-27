import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Pet } from "../../firebase/types";
import { getPetsPaginated, updatePetStatus } from "../../firebase/petservice";
import { IoSearch } from "react-icons/io5";
import { DocumentSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ToggleSwitch from "../../components/ToggleSwitch";

const Pets = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [lastVisible, setLastVisible] = useState<DocumentSnapshot | null>(null);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const navigate = useNavigate();

  const pageSize = 10; // Number of pets per page

  useEffect(() => {
    fetchPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPets = async (isNextPage: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const { petsList, lastDoc } = await getPetsPaginated(
        pageSize,
        lastVisible,
        isNextPage
      );
      if (isNextPage) {
        setPets((prevPets) => [...prevPets, ...petsList]);
      } else {
        setPets(petsList);
      }
      setLastVisible(lastDoc);
      setIsLastPage(petsList.length < pageSize);
    } catch (e) {
      setError("Failed to fetch pets.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCardClick = (id: string) => {
    navigate(`/update-pet/${id}`);
  };

  const handleStatusToggle = async (
    id: string,
    currentStatus: boolean,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.stopPropagation(); // Prevent click event from bubbling up to parent
    try {
      const newStatus = !currentStatus;
      await updatePetStatus(id, newStatus);
      setPets((prevPets) =>
        prevPets.map((pet) =>
          pet.id === id ? { ...pet, status: newStatus } : pet
        )
      );
    } catch (e) {
      setError("Failed to update pet status.");
    }
  };

  // Define the handleUploadImages function here
  const handleUploadImages = (petId: string) => {
    navigate(`/adoptable-pet-editor/${petId}`);
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="pets-container">
        <h2>Pets</h2>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <div className="search">
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter to search"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <IoSearch />
          </div>
        </div>
        {filteredPets.length === 0 && !loading && !error ? (
          <div className="no-pets-message">No pets available.</div>
        ) : (
          <div className="pets-grid">
            {filteredPets.map((pet) => (
              <div
                key={pet.id}
                className="pet-card"
                style={{
                  color: pet.status ? "" : "rgba(0,0,0,0.234)",
                  cursor: "pointer",
                  transition: "transform 0.2s ease", //smooth effect
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                } // Zoom in when hover
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                } // Reset on mouse leave
                onClick={() => handleUploadImages(pet.id ?? "")}
              >
                <img
                  style={{
                    filter: pet.status ? "grayscale(0%)" : "grayscale(100%)",
                    transition: "filter 0.3s ease", // Optional: Smooth transition effect
                  }}
                  src={
                    pet.img_urls.length > 0
                      ? pet.img_urls[0]
                      : "default_image_url"
                  } // Add a fallback if no image
                  alt={pet.name}
                />
                <div
                  className="pet-info"
                  onClick={() => handleCardClick(pet.id ?? "")}
                >
                  <h3>{pet.name}</h3>
                  <p>
                    Age: {pet.age} {pet.age_type}s
                  </p>
                  <p>Type: {pet.type}</p>
                </div>

                <div className="toggle" onClick={(e) => e.stopPropagation()}>
                  <p>Status:</p>
                  <ToggleSwitch
                    isActive={pet.status}
                    onToggle={(e) =>
                      handleStatusToggle(pet.id ?? "", pet.status, e)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="pagination-controls">
          {!isLastPage && (
            <button onClick={() => fetchPets(true)} disabled={loading}>
              Load More
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

//   const [pets, setPets] = useState<Pet[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState<string>("");

//   useEffect(() => {
//     const fetchPets = async () => {
//       try {
//         const petsList = await getPets();
//         setPets(petsList);
//       } catch (e) {
//         setError("Failed to fetch pets.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPets();
//   }, []);

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   };

//   const filteredPets = pets.filter((pet) =>
//     pet.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="admin-container">
//       <Sidebar />
//       <main className="pets-container">
//         <h2>Pets</h2>
//         {loading && <p>Loading...</p>}
//         {error && <p>{error}</p>}
//         <div className="search">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="Enter to search"
//               value={searchTerm}
//               onChange={handleSearchChange}
//             />
//             <IoSearch />
//           </div>
//         </div>
//         {filteredPets.length === 0 && !loading && !error ? (
//           <div className="no-pets-message">No pets available.</div>
//         ) : (
//           <div className="pets-grid">
//             {filteredPets.map((pet) => (
//               <div key={pet.id} className="pet-card">
//                 <img src={pet.img_url} alt={pet.name} />
//                 <div className="pet-info">
//                   <h3>{pet.name}</h3>
//                   <p>Age: {pet.age} months</p>
//                   <p>Type: {pet.type}</p>
//                   <p style={{ color: pet.status ? "green" : "red" }}>
//                     Status: {pet.status ? "Active" : "Inactive"}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );

// };

export default Pets;
