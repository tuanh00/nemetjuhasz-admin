// BreedSectionForm.tsx
import React, { useState } from "react";
import { BreedSection } from "../../../firebase/types";

interface BreedSectionFormProps {
  section: BreedSection;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageFileChange: (file: File | null) => void;
}

const BreedSectionForm: React.FC<BreedSectionFormProps> = ({ section, handleChange, handleImageFileChange }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      handleImageFileChange(file); // Pass the file back to parent
    } else {
      setImagePreview(null);
      handleImageFileChange(null);
    }
  };

  const handleRemoveImage = () => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      setImagePreview(null);
      handleImageFileChange(null);
    }
  };

  return (
    <>
    <div className="input-box">
      <label>English Title:</label>
      <input
        type="text"
        name="title"
        placeholder="English Title"
        value={section.title}
        onChange={handleChange}
        required
      />
    </div>
    <div className="input-box">
      <label>Hungarian Title:</label>
      <input
        type="text"
        name="hungarianTitle"
        placeholder="Hungarian Title"
        value={section.hungarianTitle}
        onChange={handleChange}
        required
      />
    </div>
    <div className="input-box">
      <label>English Description:</label>
      <textarea
        name="content"
        placeholder="English Description"
        value={section.content}
        onChange={handleChange}
        required
      ></textarea>
    </div>
    <div className="input-box">
      <label>Hungarian Description:</label>
      <textarea
        name="hungarianContent"
        placeholder="Hungarian Description"
        value={section.hungarianContent}
        onChange={handleChange}
        required
      ></textarea>
    </div>
      <div className="input-box">
        <label>Image (Max 1):</label>
        {imagePreview ? (
          <div className="image-preview">
            <img src={imagePreview} alt="Breed Section Preview" />
            <button className="remove-btn" onClick={handleRemoveImage}>X</button>
          </div>
        ) : (
          <input type="file" accept="image/*" onChange={handleImageChange} />
        )}
      </div>
    </>
  );
};

export default BreedSectionForm;
