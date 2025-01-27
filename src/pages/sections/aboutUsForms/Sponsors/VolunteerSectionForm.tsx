import React, { useState, useEffect } from "react";
import { Volunteer } from "../../../../firebase/types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../firebase/Firebase"; // Ensure you import Firebase storage

interface VolunteerSectionFormProps {
  volunteers: Volunteer[];
  onUpdate: (updatedVolunteers: Volunteer[]) => void;
  onImageFileChange: (file: File | null, index: number) => void;
}

const VolunteerSectionForm: React.FC<VolunteerSectionFormProps> = ({
  volunteers,
  onUpdate,
  onImageFileChange,
}) => {
  const [localVolunteers, setLocalVolunteers] = useState<Volunteer[]>(volunteers);
  const [imagePreviews, setImagePreviews] = useState<string[]>(Array(volunteers.length).fill(""));
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLocalVolunteers(volunteers);
  }, [volunteers]);

  const handleInputChange = (index: number, field: keyof Volunteer, value: string) => {
    const updatedVolunteers = [...localVolunteers];
    updatedVolunteers[index] = { ...updatedVolunteers[index], [field]: value };
    setLocalVolunteers(updatedVolunteers);
    onUpdate(updatedVolunteers);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageFileChange(file, index);

      try {
        // Upload the file to Firebase Storage
        const storageRef = ref(storage, `volunteers/${file.name}`);
        await uploadBytes(storageRef, file);

        // Get the public URL of the uploaded file
        const uploadedUrl = await getDownloadURL(storageRef);

        // Update image previews and local volunteers with the Firebase URL
        const updatedPreviews = [...imagePreviews];
        updatedPreviews[index] = uploadedUrl;
        setImagePreviews(updatedPreviews);

        const updatedVolunteers = [...localVolunteers];
        updatedVolunteers[index] = { ...updatedVolunteers[index], imageUrl: uploadedUrl };
        setLocalVolunteers(updatedVolunteers);
        onUpdate(updatedVolunteers);

        setMessage("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        setMessage("Failed to upload image.");
      }

      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleRemoveImage = (index: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    const updatedPreviews = [...imagePreviews];
    updatedPreviews[index] = "";
    setImagePreviews(updatedPreviews);

    const updatedVolunteers = [...localVolunteers];
    updatedVolunteers[index] = { ...updatedVolunteers[index], imageUrl: "" };
    setLocalVolunteers(updatedVolunteers);
    onUpdate(updatedVolunteers);

    onImageFileChange(null, index);

    setMessage("Image removed successfully!");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div>
      {message && (
        <div
          className={`message-box ${
            message.includes("removed") ? "error" : "success"
          }`}
        >
          {message}
        </div>
      )}

      {localVolunteers.map((volunteer, index) => (
        <div key={index} className="volunteer-item">
          <h3>Volunteer {index + 1}</h3>
          <div className="input-box">
            <label>Volunteer Name:</label>
            <input
              type="text"
              placeholder="Volunteer Name"
              value={volunteer.volunteerName}
              onChange={(e) =>
                handleInputChange(index, "volunteerName", e.target.value)
              }
            />
          </div>

          <div className="input-box">
            <label>Image:</label>
            {imagePreviews[index] ? (
              <div className="image-preview-grid">
                <div className="image-preview">
                  <img
                    src={imagePreviews[index]}
                    alt={`Volunteer ${index + 1} Preview`}
                    className="preview-img"
                  />
                  <button
                    className="remove-btn"
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                  >
                    X
                  </button>
                </div>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VolunteerSectionForm;
