import React, { useState, useEffect } from "react";
import { Foster } from "../../../../firebase/types";

interface FosterSectionFormProps {
  fosters: Foster[];
  onUpdate: (updatedFosters: Foster[]) => void;
  onImageFileChange: (file: File | null, index: number) => void;
}

const FosterSectionForm: React.FC<FosterSectionFormProps> = ({
  fosters,
  onUpdate,
  onImageFileChange,
}) => {
  const [localFosters, setLocalFosters] = useState<Foster[]>(fosters);
  const [imagePreviews, setImagePreviews] = useState<string[]>(Array(fosters.length).fill("")); // Initialize previews
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLocalFosters(fosters);
  }, [fosters]);

  const handleInputChange = (
    index: number,
    field: keyof Foster,
    value: string
  ) => {
    const updatedFosters = [...localFosters];
    updatedFosters[index] = { ...updatedFosters[index], [field]: value };
    setLocalFosters(updatedFosters);
    onUpdate(updatedFosters);
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

    const updatedFosters = [...localFosters];
    updatedFosters[index] = { ...updatedFosters[index], imageUrl: "" }; // Reset the imageUrl
    setLocalFosters(updatedFosters);
    onUpdate(updatedFosters);

    onImageFileChange(null, index); // Clear file in parent

    setMessage("Image removed successfully!");
    setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
  };

  return (
    <div>
      {message && <div className={`message-box ${message.includes("removed") ? "error" : "success"}`}>{message}</div>}

      {localFosters.map((foster, index) => (
        <div key={index} className="foster-item">
          <h3>Foster {index + 1}</h3>
          <div className="input-box">
            <label>Foster Name:</label>
            <input
              type="text"
              placeholder="Foster Name"
              value={foster.fosterName}
              onChange={(e) =>
                handleInputChange(index, "fosterName", e.target.value)
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
                    alt={`Foster ${index + 1} Preview`}
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

export default FosterSectionForm;
