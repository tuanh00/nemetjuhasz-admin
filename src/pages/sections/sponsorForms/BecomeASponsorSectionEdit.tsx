import React, { useState, useEffect } from "react";
import "../../../styles/aboutus/sponsors/_editsponsorsection.scss";
import { BecomeASponsor } from "../../../firebase/types";

interface BecomeASponsorSectionEditProps {
  sectionData: BecomeASponsor[];
  onUpdate: (updatedData: BecomeASponsor[]) => void;
  onUploadImage: (file: File, index: number) => void;
  onRemoveImage: (index: number) => void;
}

const BecomeASponsorSectionEdit: React.FC<BecomeASponsorSectionEditProps> = ({
  sectionData,
  onUpdate,
  onUploadImage,
  onRemoveImage,
}) => {
  const [localData, setLocalData] = useState<BecomeASponsor[]>([]);

  useEffect(() => {
    setLocalData(sectionData);
  }, [sectionData]);

  const handleInputChange = (
    index: number,
    field: keyof BecomeASponsor,
    value: string
  ) => {
    const updatedData = [...localData];
    updatedData[index][field] = value;
    setLocalData(updatedData);
    onUpdate(updatedData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      onUploadImage(file, index);
    }
  };

  const handleRemoveImageClick = (index: number) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      onRemoveImage(index);
    }
  };

  return (
    <div className="edit-our-sponsor-container">
      <h3>Edit Become A Sponsor Section</h3>
      {localData.map((sponsor, index) => (
        <div key={index} className="sponsor-item">
          <div className="input-box">
            <label htmlFor={`titleEnglish-${index}`}>Title (English)</label>
            <input
              type="text"
              id={`titleEnglish-${index}`}
              value={sponsor.titleEnglish}
              onChange={(e) => handleInputChange(index, "titleEnglish", e.target.value)}
            />
          </div>
          <div className="input-box">
            <label htmlFor={`titleHungarian-${index}`}>Title (Hungarian)</label>
            <input
              type="text"
              id={`titleHungarian-${index}`}
              value={sponsor.titleHungarian}
              onChange={(e) => handleInputChange(index, "titleHungarian", e.target.value)}
            />
          </div>
          <div className="input-box">
            <label htmlFor={`contentEnglish-${index}`}>Content (English)</label>
            <textarea
              id={`contentEnglish-${index}`}
              value={sponsor.contentEnglish}
              onChange={(e) => handleInputChange(index, "contentEnglish", e.target.value)}
            />
          </div>
          <div className="input-box">
            <label htmlFor={`contentHungarian-${index}`}>Content (Hungarian)</label>
            <textarea
              id={`contentHungarian-${index}`}
              value={sponsor.contentHungarian}
              onChange={(e) => handleInputChange(index, "contentHungarian", e.target.value)}
            />
          </div>
          <div className="image-preview-grid">
            <label>Image</label>
            {sponsor.imageUrl ? (
              <div className="image-preview">
                <img src={sponsor.imageUrl} alt={`Sponsor ${index}`} />
                <button
                  className="remove-btn"
                  onClick={() => handleRemoveImageClick(index)}
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
    </div>
  );
};

export default BecomeASponsorSectionEdit;
