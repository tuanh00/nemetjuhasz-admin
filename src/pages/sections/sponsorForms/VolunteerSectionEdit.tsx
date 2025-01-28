import React, { useState, useEffect } from "react";
import "../../../styles/aboutus/sponsors/_editsponsorsection.scss";
import { Volunteer } from "../../../firebase/types";


interface VolunteerSectionEditProps {
  sectionData: Volunteer[]; // Accept an array of volunteers
  onUpdate: (volunteers: Volunteer[]) => void; // Handle an array of volunteers
  onRemoveImage: (index: number) => void; // Handle image removal
  onUploadImage: (file: File, index: number) => void; // Handle image upload
}

const VolunteerSectionEdit: React.FC<VolunteerSectionEditProps> = ({
  sectionData,
  onUpdate,
  onRemoveImage,
  onUploadImage,
}) => {
  const [localData, setLocalData] = useState<Volunteer[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    setLocalData(sectionData); // Initialize with section data
  }, [sectionData]);

  // Auto-hide message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000); // Clear the message after 3 seconds
      return () => clearTimeout(timer); // Cleanup timeout on unmount or message change
    }
  }, [message]);

  const handleInputChange = (index: number, field: keyof Volunteer, value: string) => {
    const updatedVolunteers = [...localData];
    updatedVolunteers[index][field] = value;
    setLocalData(updatedVolunteers);
    onUpdate(updatedVolunteers);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUploadImage(file, index);
    }
  };

  const handleRemoveImage = (index: number) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      const updatedVolunteers = [...localData];
      updatedVolunteers[index].imageUrl = ""; // Remove image
      setLocalData(updatedVolunteers);
      onRemoveImage(index);

      setMessage("Image removed successfully.");
      setIsSuccess(true);
    }
  };

  return (
    <div className="edit-our-sponsor-container">
      <h3>Edit Volunteers</h3>

      {localData.map((volunteer, index) => (
        <div key={index} className="volunteer-item">
          <div className="input-box">
            <h3>Volunteer {index + 1}</h3>
            <input
              type="text"
              value={volunteer.volunteerName}
              onChange={(e) => handleInputChange(index, "volunteerName", e.target.value)}
            />
          </div>
          <div className="image-preview-grid">
            {volunteer.imageUrl ? (
              <div className="image-preview">
                <img src={volunteer.imageUrl} alt={`Volunteer ${index + 1}`} />
                <button
                  className="remove-btn"
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                >
                  X
                </button>
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

      {/* Message Box */}
      {message && (
        <div className={`message-box ${isSuccess ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default VolunteerSectionEdit;
