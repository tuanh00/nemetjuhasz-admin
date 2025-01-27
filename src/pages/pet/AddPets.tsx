import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Pet } from "../../firebase/types";
import { addPet } from "../../firebase/petservice";

// const AddPets = () => {
//   const [pet, setPet] = useState<Pet>({
//     name: "",
//     age: 0,
//     age_type: "",
//     type: "",
//     status: true,
//     img_url: "", // Added img_url field
//   });
//   const [message, setMessage] = useState<string | null>(null);
//   const [image, setImage] = useState<File | null>(null);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setPet((prevPet) => ({
//       ...prevPet,
//       [name]: name === "age" ? Number(value) : value,
//     }));
//   };

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0]);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (image) {
//       try {
//         await addPet(pet, image);
//         setMessage("Pet added successfully!");
//         setPet({
//           name: "",
//           age: 0,
//           age_type: "",
//           type: "",
//           status: true,
//           img_url: "",
//         });
//         setImage(null);
//       } catch (error) {
//         setMessage("Failed to add pet.");
//       }
//     } else {
//       setMessage("Please select an image.");
//     }
//   };

//   return (
//     <div className="admin-container">
//       <Sidebar />
//       <main>
//         <h2>Add New Pet</h2>
//         <form onSubmit={handleSubmit}>
//           <div>
//             <label>Name:</label>
//             <input
//               type="text"
//               name="name"
//               value={pet.name}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Age:</label>
//             <input
//               type="number"
//               name="age"
//               value={pet.age}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Type:</label>
//             <input
//               type="text"
//               name="type"
//               value={pet.type}
//               onChange={handleChange}
//               required
//             />
//           </div>
//           <div>
//             <label>Image:</label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               required
//             />
//           </div>
//           <button type="submit">Add Pet</button>
//         </form>
//         {message && <p>{message}</p>}
//       </main>
//     </div>
//   );
// };

const AddPets = () => {
  const [pet, setPet] = useState<Pet>({
    name: "",
    age: 0,
    age_type: "",
    type: "",
    status: false,
    img_urls: [], // Use img_urls as an array
    title: "", // Initialize title with an empty string
    content: "",// Initialize content with an empty string
    hungarianContent: "",
    hungarianTitle: "",
  });

  const [message, setMessage] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Added image preview state

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
    if (image) {
      try {
        // Add image to the img_urls array
        await addPet(pet, image);
        setMessage("Pet added successfully!");
        setPet({
          name: "",
          age: 0,
          age_type: "",
          type: "",
          status: false,
          img_urls: [], // Reset img_urls
          title: "", // Keep title and content empty as intended
          content: "",
          hungarianContent: "",
          hungarianTitle: "",
        });
        setImage(null);
        setImagePreview(null); // Clear the image preview after successful submission
      } catch (error) {
        setMessage("Failed to add pet.");
      }
    } else {
      setMessage("Please select an image.");
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="add-pet-container">
        <h2>Add New Pet</h2>
        <form onSubmit={handleSubmit}>
          <div className="first-box">
            <div className="pet-input-box">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={pet.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="pet-input-box">
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={pet.age}
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
                value={pet.age_type}
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
                value={pet.type}
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
                required
              />
            </div>
          </div>
          {/* Image Preview */}
          <div className="image-box">
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Pet Preview" />
              </div>
            )}
          </div>

          <button type="submit">Add Pet</button>
        </form>
        {message && <p className="message-box">{message}</p>}
      </main>
    </div>
  );
};

export default AddPets;


