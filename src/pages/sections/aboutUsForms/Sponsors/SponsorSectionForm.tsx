import React, { useState, useEffect } from "react";
import { Sponsor } from "../../../../firebase/types";

interface SponsorSectionFormProps {
  sponsors: Sponsor[];
  onUpdate: (updatedSponsors: Sponsor[]) => void;
  onImageFileChange: (file: File | null, index: number) => void; // Pass file handler from parent
}

const SponsorSectionForm: React.FC<SponsorSectionFormProps> = ({
  sponsors,
  onUpdate,
  onImageFileChange,
}) => {
  const [localSponsors, setLocalSponsors] = useState<Sponsor[]>(sponsors);
  const [imagePreviews, setImagePreviews] = useState<string[]>(Array(4).fill("")); // Initialize previews for up to 4 sponsors
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLocalSponsors(sponsors);
  }, [sponsors]);

  const handleInputChange = (index: number, field: keyof Sponsor, value: string) => {
    const updatedSponsors = [...localSponsors];
    updatedSponsors[index] = { ...updatedSponsors[index], [field]: value };
    setLocalSponsors(updatedSponsors);
    onUpdate(updatedSponsors);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);

      const updatedPreviews = [...imagePreviews];
      updatedPreviews[index] = previewUrl; // Update preview for UI
      setImagePreviews(updatedPreviews);

      // Inform parent component about the new file
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

    const updatedSponsors = [...localSponsors];
    updatedSponsors[index] = { ...updatedSponsors[index], imageUrl: "" }; // Reset the imageUrl
    setLocalSponsors(updatedSponsors);
    onUpdate(updatedSponsors);

    onImageFileChange(null, index); // Clear file in parent

    setMessage("Image removed successfully!");
    setTimeout(() => setMessage(null), 3000); // Clear message after 3 seconds
  };

  return (
    <div>
      {message && <div className={`message-box ${message.includes("removed") ? "error" : "success"}`}>{message}</div>}

      {Array(4)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="sponsor-item">
            <h3>Sponsor {index + 1}</h3>
            <div className="input-box">
              <label>Link Title:</label>
              <input
                type="text"
                placeholder="Link Title"
                value={localSponsors[index]?.linkTitle || ""}
                onChange={(e) => handleInputChange(index, "linkTitle", e.target.value)}
              />
            </div>

            <div className="input-box">
              <label>Link:</label>
              <input
                type="text"
                placeholder="Link"
                value={localSponsors[index]?.link || ""}
                onChange={(e) => handleInputChange(index, "link", e.target.value)}
              />
            </div>

            <div className="input-box">
              <label>Image (Max 1):</label>
              {imagePreviews[index] ? (
                <div className="image-preview-grid">
                  <div className="image-preview">
                    <img src={imagePreviews[index]} alt={`Sponsor ${index + 1} Preview`} />
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

export default SponsorSectionForm;
