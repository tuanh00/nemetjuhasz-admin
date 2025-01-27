import React, { useState, useEffect } from "react";
import { Volunteer } from "../../../../firebase/types";

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
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    Array(volunteers.length).fill("")
  );
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLocalVolunteers(volunteers);
  }, [volunteers]);

  const handleInputChange = (
    index: number,
    field: keyof Volunteer,
    value: string
  ) => {
    const updatedVolunteers = [...localVolunteers];
    updatedVolunteers[index] = { ...updatedVolunteers[index], [field]: value };
    setLocalVolunteers(updatedVolunteers);
    onUpdate(updatedVolunteers);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);

      const updatedPreviews = [...imagePreviews];
      updatedPreviews[index] = previewUrl; // Update preview for UI
      setImagePreviews(updatedPreviews);

      onImageFileChange(file, index);

      setMessage("Image added successfully!");
      setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
    }
  };

  const handleRemoveImage = (index: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    const updatedPreviews = [...imagePreviews];
    updatedPreviews[index] = ""; // Clear the preview
    setImagePreviews(updatedPreviews);

    const updatedVolunteers = [...localVolunteers];
    updatedVolunteers[index] = { ...updatedVolunteers[index], imageUrl: "" };
    setLocalVolunteers(updatedVolunteers);
    onUpdate(updatedVolunteers);

    onImageFileChange(null, index);

    setMessage("Image removed successfully!");
    setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
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
            <label>Image (Max 1):</label>
            {imagePreviews[index] ? (
              <div className="image-preview-grid">
                <div className="image-preview">
                  <img
                    src={imagePreviews[index]}
                    alt={`Volunteer ${index + 1} Preview`}
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
