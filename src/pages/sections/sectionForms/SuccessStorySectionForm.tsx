// SuccessStorySectionForm.tsx
import React, { useState, useEffect } from "react";
import { SuccessStorySection } from "../../../firebase/types";
import "../../../styles/previews/_successpreview.scss";
import "bootstrap/dist/css/bootstrap.min.css";

interface SuccessStorySectionFormProps {
  section: SuccessStorySection;
  handleChange: (updatedSection: SuccessStorySection) => void;
  handleImageFilesChange: (files: Array<File | undefined>) => void;
}

const SuccessStorySectionForm: React.FC<SuccessStorySectionFormProps> = ({
  section,
  handleChange,
  handleImageFilesChange,
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>(["", ""]);
  const [imageFiles, setImageFiles] = useState<Array<File | undefined>>([undefined, undefined]);

  useEffect(() => {
    // Initialize imgUrls with two empty strings if not already set
    if (!section.imgUrls || section.imgUrls.length !== 2) {
      handleChange({ ...section, imgUrls: ["", ""] });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange({ ...section, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);

      // Update image files
      const updatedFiles = [...imageFiles];
      updatedFiles[index] = file;
      setImageFiles(updatedFiles);
      handleImageFilesChange(updatedFiles);

      // Update image previews
      const updatedPreviews = [...imagePreviews];
      updatedPreviews[index] = previewUrl;
      setImagePreviews(updatedPreviews);

      // Update imgUrls in section state
      const updatedImgUrls = [...section.imgUrls];
      updatedImgUrls[index] = previewUrl;
      handleChange({ ...section, imgUrls: updatedImgUrls });
    }
  };

  const handleRemoveImage = (index: number) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      // Remove image file
      const updatedFiles = [...imageFiles];
      updatedFiles[index] = undefined;
      setImageFiles(updatedFiles);
      handleImageFilesChange(updatedFiles);

      // Remove image preview
      const updatedPreviews = [...imagePreviews];
      updatedPreviews[index] = "";
      setImagePreviews(updatedPreviews);

      // Remove imgUrl from section state
      const updatedImgUrls = [...section.imgUrls];
      updatedImgUrls[index] = "";
      handleChange({ ...section, imgUrls: updatedImgUrls });
    }
  };

  return (
    <div className="container">
      <h3>Success Story Section</h3>
      {/* Section Title */}
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Section Title
        </label>
        <input
          id="title"
          name="title"
          className="form-control"
          value={section.title}
          onChange={handleInputChange}
        />
      </div>
      {/* First Image Titles */}
      <div className="mb-3">
        <label htmlFor="title1" className="form-label">
          First Image Title (English)
        </label>
        <input
          id="title1"
          name="title1"
          className="form-control"
          value={section.title1}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="hungarianTitle1" className="form-label">
          First Image Title (Hungarian)
        </label>
        <input
          id="hungarianTitle1"
          name="hungarianTitle1"
          className="form-control"
          value={section.hungarianTitle1}
          onChange={handleInputChange}
        />
      </div>
      {/* First Image Upload */}
      <div className="mb-3">
        <label className="form-label">First Image</label>
        {imagePreviews[0] ? (
          <div className="image-preview">
            <img src={imagePreviews[0]} alt="First Preview" className="img-thumbnail" />
            <button
              className="remove-btn"
              type="button"
              onClick={() => handleRemoveImage(0)}
            >
              X
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 0)}
            className="form-control"
          />
        )}
      </div>
      {/* Second Image Titles */}
      <div className="mb-3">
        <label htmlFor="title2" className="form-label">
          Second Image Title (English)
        </label>
        <input
          id="title2"
          name="title2"
          className="form-control"
          value={section.title2}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="hungarianTitle2" className="form-label">
          Second Image Title (Hungarian)
        </label>
        <input
          id="hungarianTitle2"
          name="hungarianTitle2"
          className="form-control"
          value={section.hungarianTitle2}
          onChange={handleInputChange}
        />
      </div>
      {/* Second Image Upload */}
      <div className="mb-3">
        <label className="form-label">Second Image</label>
        {imagePreviews[1] ? (
          <div className="image-preview">
            <img src={imagePreviews[1]} alt="Second Preview" className="img-thumbnail" />
            <button
              className="remove-btn"
              type="button"
              onClick={() => handleRemoveImage(1)}
            >
              X
            </button>
          </div>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 1)}
            className="form-control"
          />
        )}
      </div>
    </div>
  );
};

export default SuccessStorySectionForm;
