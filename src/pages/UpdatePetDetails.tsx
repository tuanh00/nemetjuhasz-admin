import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pet } from "../firebase/types";
import { getPets, updatePet, updatePetWithImage } from "../firebase/petservice";
import Sidebar from "../components/Sidebar";

const UpdatePetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Partial<Pet> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Added image preview state
  const navigate = useNavigate();

  //   useEffect(() => {
  //     const fetchPet = async () => {
  //       try {
  //         const pets = await getPets();
  //         const currentPet = pets.find((pet) => pet.id === id);
  //         if (currentPet) {
  //           setPet(currentPet);
  //         } else {
  //           setError("Pet not found.");
  //         }
  //       } catch (e) {
  //         setError("Failed to fetch pet details.");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     if (id) {
  //       fetchPet();
  //     }
  //   }, [id]);

  //   useEffect(() => {
  //     const fetchPet = async () => {
  //       try {
  //         const pets = await getPets();
  //         const currentPet = pets.find((pet) => pet.id === id);
  //         if (currentPet) {
  //           setPet(currentPet);
  //           // Set image preview if there's an image URL
  //           if (currentPet.img_url) {
  //             setImagePreview(currentPet.img_url);
  //           }
  //         } else {
  //           setError("Pet not found.");
  //         }
  //       } catch (e) {
  //         setError("Failed to fetch pet details.");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     if (id) {
  //       fetchPet();
  //     }
  //   }, [id]);

  //   const handleChange = (
  //     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  //   ) => {
  //     const { name, value } = e.target;
  //     setPet((prevPet) => ({
  //       ...prevPet,
  //       [name]: name === "age" ? Number(value) : value,
  //     }));
  //   };

  //   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     if (e.target.files && e.target.files[0]) {
  //       setImage(e.target.files[0]);

  //       // Generate and set image preview URL
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setImagePreview(reader.result as string);
  //       };
  //       reader.readAsDataURL(e.target.files[0]);
  //     }
  //   };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (id && pet) {
  //       try {
  //         await updatePet(id, { ...pet, img_url: imagePreview || pet.img_url });
  //         setMessage("Pet updated successfully!");
  //         setImage(null);
  //         setImagePreview(null); // Clear the image preview after successful submission
  //       } catch (error) {
  //         setMessage("Failed to update pet.");
  //       }
  //     }
  //   };

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const pets = await getPets();
        const currentPet = pets.find((pet) => pet.id === id);
        if (currentPet) {
          setPet(currentPet);
          // Set image preview if there's an image URL
          if (currentPet.img_url) {
            setImagePreview(currentPet.img_url);
          }
        } else {
          setError("Pet not found.");
        }
      } catch (e) {
        setError("Failed to fetch pet details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPet();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPet((prevPet) => ({
      ...prevPet,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);

      // Generate and set image preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (id && pet) {
      try {
        if (image) {
          await updatePetWithImage(
            id,
            { ...pet, img_url: imagePreview || pet.img_url },
            image
          );
        } else {
          await updatePet(id, { ...pet, img_url: imagePreview || pet.img_url });
        }
        setMessage("Pet updated successfully!");
        setImage(null);
        setImagePreview(null); // Clear the image preview after successful submission
      } catch (error) {
        setMessage("Failed to update pet.");
      }
    }
  };

  //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setPet((prevPet) => ({
  //       ...prevPet,
  //       [name]: name === "age" ? Number(value) : value,
  //     }));
  //   };

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (id && pet) {
  //       try {
  //         await updatePet(id, pet);
  //         setMessage("Pet updated successfully!");
  //       } catch (error) {
  //         setMessage("Failed to update pet.");
  //       }
  //     }
  //   };

  //   return (
  //     <div className="admin-container">
  //       <Sidebar />
  //       <main>
  //         <h2>Edit Pet Details</h2>
  //         {loading && <p>Loading...</p>}
  //         {error && <p>{error}</p>}
  //         {pet && (
  //           <form onSubmit={handleSubmit}>
  //             <div>
  //               <label>Name:</label>
  //               <input
  //                 type="text"
  //                 name="name"
  //                 value={pet.name || ""}
  //                 onChange={handleChange}
  //                 required
  //               />
  //             </div>
  //             <div>
  //               <label>Age:</label>
  //               <input
  //                 type="number"
  //                 name="age"
  //                 value={pet.age || ""}
  //                 onChange={handleChange}
  //                 required
  //               />
  //             </div>
  //             <div>
  //               <label>Type:</label>
  //               <input
  //                 type="text"
  //                 name="type"
  //                 value={pet.type || ""}
  //                 onChange={handleChange}
  //                 required
  //               />
  //             </div>
  //             <div>
  //               <label>Status:</label>
  //               <input
  //                 type="checkbox"
  //                 name="status"
  //                 checked={pet.status || false}
  //                 onChange={(e) =>
  //                   setPet((prevPet) => ({
  //                     ...prevPet,
  //                     status: e.target.checked,
  //                   }))
  //                 }
  //               />
  //             </div>
  //             <button type="submit">Update Pet</button>
  //           </form>
  //         )}
  //         {message && <p>{message}</p>}
  //         <button onClick={() => navigate(-1)}>Back to Pets List</button>
  //       </main>
  //     </div>
  //   );

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="add-pet-container">
        <h2>Edit Pet Details</h2>
        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}
        {pet && (
          <form onSubmit={handleSubmit}>
            {/* Image Preview */}
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Pet Preview" />
              </div>
            )}
            <div className="first-box">
              <div className="pet-input-box">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={pet.name || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="pet-input-box">
                <label>Age:</label>
                <input
                  type="number"
                  name="age"
                  value={pet.age || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="second-box">
              <div className="drop-down">
                <label>Age Type:</label>
                <select
                  name="age_type"
                  value={pet.age_type || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Age Type</option>
                  <option value="year">Year</option>
                  <option value="month">Month</option>
                </select>
              </div>
            </div>
            <div className="second-box">
              <div className="drop-down">
                <label>Type:</label>
                <select
                  name="type"
                  value={pet.type || ""}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="cat">Cat</option>
                  <option value="dog">Dog</option>
                  <option value="hamster">Hamster</option>
                  <option value="fish">Fish</option>
                </select>
              </div>
            </div>
            <div className="second-box">
              <div className="drop-down-image">
                <label>Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <button type="submit">Update Pet</button>
          </form>
        )}
        {message && <p className="message-box">{message}</p>}
        <button onClick={() => navigate(-1)}>Back to Pets List</button>
      </main>
    </div>
  );
};

export default UpdatePetDetails;
