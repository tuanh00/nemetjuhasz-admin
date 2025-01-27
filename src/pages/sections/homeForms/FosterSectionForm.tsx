// FosterSectionForm.tsx
import React, { useState } from "react";
import { FosterSection } from "../../../firebase/types";

interface FosterSectionFormProps {
  section: FosterSection;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageFileChange: (file: File | null) => void;
}

const FosterSectionForm: React.FC<FosterSectionFormProps> = ({ section, handleChange, handleImageFileChange }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      handleImageFileChange(file);
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
      <input type="text" name="title" placeholder="Title" value={section.title} onChange={handleChange} required/>
    </div>
    <div className="input-box">
      <label>Hungarian Title:</label>
      <input type="text" name="hungarianTitle" placeholder="Hungarian Title" value={section.hungarianTitle} onChange={handleChange} required/>
    </div>
    <div className="input-box">
      <label>English Description:</label>
      <textarea name="content" placeholder="Content" value={section.content} onChange={handleChange} required></textarea>
    </div>
    <div className="input-box">
      <label>Hungarian Description:</label>
      <textarea name="hungarianContent" placeholder="Hungarian Content" value={section.hungarianContent} onChange={handleChange} required></textarea>
    </div>

      <div className="input-box">
        <label>Image (Max 1):</label>
        {imagePreview ? (
          <div className="image-preview">
            <img src={imagePreview} alt="Foster Section Preview" />
            <button className="remove-btn" onClick={handleRemoveImage}>X</button>
          </div>
        ) : (
          <input type="file" accept="image/*" onChange={handleImageChange} required/>
        )}
      </div>
    </>
  );
};

export default FosterSectionForm;
