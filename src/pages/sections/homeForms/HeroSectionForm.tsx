// HeroSectionForm.tsx
import React, { useState, useEffect } from "react";
import { HeroSection } from "../../../firebase/types";

interface HeroSectionFormProps {
  section: HeroSection;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageFileChange: (file: File | null) => void;
}

const HeroSectionForm: React.FC<HeroSectionFormProps> = ({
  section,
  handleChange,
  handleImageFileChange,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(section.imgUrl || null);

  // Synchronize imagePreview with section.imgUrl from the parent
  useEffect(() => {
    setImagePreview(section.imgUrl || null);
  }, [section.imgUrl]);

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
      <input type="text" name="title" placeholder="English Title" value={section.title} onChange={handleChange} required />
    </div>
    <div className="input-box">
      <label>Hungarian Title:</label>
      <input type="text" name="hungarianTitle" placeholder="Hungarian Title" value={section.hungarianTitle} onChange={handleChange} required />
    </div>
      <div className="input-box">
        <label>Image (Max 1):</label>
        {imagePreview ? (
          <div className="image-preview">
            <img src={imagePreview} alt="Hero Section Preview" />
            <button className="remove-btn" onClick={handleRemoveImage}>X</button>
          </div>
        ) : (
          <input type="file" accept="image/*" onChange={handleImageChange} required />
        )}
      </div>
    </>
  );
};

export default HeroSectionForm;
