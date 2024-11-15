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
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={section.title}
        onChange={handleChange}
      />
      <input
        type="text"
        name="hungarianTitle"
        placeholder="Hungarian Title"
        value={section.hungarianTitle}
        onChange={handleChange}
      />
      <textarea
        name="content"
        placeholder="Content"
        value={section.content}
        onChange={handleChange}
      ></textarea>
      <textarea
        name="hungarianContent"
        placeholder="Hungarian Content"
        value={section.hungarianContent}
        onChange={handleChange}
      ></textarea>

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
