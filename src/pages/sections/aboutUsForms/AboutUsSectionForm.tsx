import React, { useEffect, useState } from "react";
import { AboutUsSection } from "../../../firebase/types";

interface AboutUsSectionFormProps {
  section: AboutUsSection;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleImageFileChange: (file: File | null) => void;
  fileInputRef?: React.RefObject<HTMLInputElement>;
}

const AboutUsSectionForm: React.FC<AboutUsSectionFormProps> = ({
  section,
  handleChange,
  handleImageFileChange,
  fileInputRef,
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview); // Clean up previous blob URL
      }

      setImagePreview(previewUrl);
      handleImageFileChange(file);
    } else {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
      handleImageFileChange(null);
    }
  };

  const handleRemoveImage = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;
  
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview); // Revoke the object URL to free memory
    }
    setImagePreview(null);
    handleImageFileChange(null);
  
    if (fileInputRef?.current) {
      fileInputRef.current.value = ""; // Reset the file input
    }
  };
  
  return (
    <>
      <div className="input-box">
        <label>English Title:</label>
        <input
          type="text"
          name="englishTitle"
          placeholder="English Title"
          value={section.englishTitle}
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
        <label>Sub English Title:</label>
        <input
          type="text"
          name="subEnglishTitle"
          placeholder="Sub English Title"
          value={section.subEnglishTitle || ""}
          onChange={handleChange}
        />
      </div>
      <div className="input-box">
        <label>Sub Hungarian Title:</label>
        <input
          type="text"
          name="subHungarianTitle"
          placeholder="Sub Hungarian Title"
          value={section.subHungarianTitle || ""}
          onChange={handleChange}
        />
      </div>
      <div className="input-box">
        <label>English Content:</label>
        <textarea
          name="contentEnglish"
          placeholder="English Content"
          value={section.contentEnglish}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <div className="input-box">
        <label>Hungarian Content:</label>
        <textarea
          name="contentHungarian"
          placeholder="Hungarian Content"
          value={section.contentHungarian}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <div className="input-box">
        <label>Image:</label>
        {imagePreview ? (
         <div className="image-preview-grid">
         <div className="image-preview">
           <img src={imagePreview} alt="Preview" />
           <button type="button" className="remove-btn" onClick={handleRemoveImage}>
             X
           </button>
         </div>
       </div>       
        ) : (
          <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
        )}
      </div>
    </>
  );
};

export default AboutUsSectionForm;
