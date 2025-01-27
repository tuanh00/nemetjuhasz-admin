import React, { useState, useEffect } from "react";
import { BecomeASponsor } from "../../../../firebase/types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../../../firebase/Firebase"; // Ensure you import your Firebase storage

interface BecomeASponsorSectionFormProps {
  becomeASponsor: BecomeASponsor[];
  onUpdate: (updatedSponsors: BecomeASponsor[]) => void;
  onImageFileChange: (file: File | null, index: number) => void;
}

const BecomeASponsorSectionForm: React.FC<BecomeASponsorSectionFormProps> = ({
  becomeASponsor,
  onUpdate,
  onImageFileChange,
}) => {
  const [localSponsors, setLocalSponsors] = useState<BecomeASponsor[]>(becomeASponsor);
  const [imagePreviews, setImagePreviews] = useState<string[]>(Array(becomeASponsor.length).fill(""));
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setLocalSponsors(becomeASponsor);
  }, [becomeASponsor]);

  const handleInputChange = (index: number, field: keyof BecomeASponsor, value: string) => {
    const updatedSponsors = [...localSponsors];
    updatedSponsors[index] = { ...updatedSponsors[index], [field]: value };
    setLocalSponsors(updatedSponsors);
    onUpdate(updatedSponsors);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onImageFileChange(file, index);

      try {
        // Upload the file to Firebase Storage
        const storageRef = ref(storage, `become_a_sponsor/${file.name}`);
        await uploadBytes(storageRef, file);

        // Get the public URL of the uploaded file
        const uploadedUrl = await getDownloadURL(storageRef);

        // Update image previews and local sponsors with the Firebase URL
        const updatedPreviews = [...imagePreviews];
        updatedPreviews[index] = uploadedUrl;
        setImagePreviews(updatedPreviews);

        const updatedSponsors = [...localSponsors];
        updatedSponsors[index] = { ...updatedSponsors[index], imageUrl: uploadedUrl };
        setLocalSponsors(updatedSponsors);
        onUpdate(updatedSponsors);

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

    const updatedSponsors = [...localSponsors];
    updatedSponsors[index] = { ...updatedSponsors[index], imageUrl: "" };
    setLocalSponsors(updatedSponsors);
    onUpdate(updatedSponsors);

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

      {localSponsors.map((sponsor, index) => (
        <div key={index} className="sponsor-item">
          <h3>Become a Sponsor {index + 1}</h3>
          <div className="input-box">
            <label>Title (English):</label>
            <input
              type="text"
              placeholder="Title in English"
              value={sponsor.titleEnglish}
              onChange={(e) => handleInputChange(index, "titleEnglish", e.target.value)}
            />
          </div>

          <div className="input-box">
            <label>Title (Hungarian):</label>
            <input
              type="text"
              placeholder="Title in Hungarian"
              value={sponsor.titleHungarian}
              onChange={(e) => handleInputChange(index, "titleHungarian", e.target.value)}
            />
          </div>

          <div className="input-box">
            <label>Content (English):</label>
            <textarea
              rows={4}
              placeholder="Content in English"
              value={sponsor.contentEnglish}
              onChange={(e) => handleInputChange(index, "contentEnglish", e.target.value)}
            />
          </div>

          <div className="input-box">
            <label>Content (Hungarian):</label>
            <textarea
              rows={4}
              placeholder="Content in Hungarian"
              value={sponsor.contentHungarian}
              onChange={(e) => handleInputChange(index, "contentHungarian", e.target.value)}
            />
          </div>

          <div className="input-box">
            <label>Image:</label>
            {imagePreviews[index] ? (
              <div className="image-preview-grid">
                <div className="image-preview">
                  <img
                    src={imagePreviews[index]}
                    alt={`Sponsor ${index + 1} Preview`}
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

export default BecomeASponsorSectionForm;
