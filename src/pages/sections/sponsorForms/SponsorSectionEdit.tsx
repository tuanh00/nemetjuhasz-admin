import React, { useState, useEffect } from "react";
import "../../../styles/aboutus/sponsors/_editsponsorsection.scss";
import { Sponsor } from "../../../firebase/types";

interface SponsorSectionEditProps {
  sectionData: Sponsor[];
  onUpdate: (updatedData: Sponsor[]) => void;
  onUploadImage: (file: File, index: number) => void;
  onRemoveImage: (index: number) => void;
}

const SponsorSectionEdit: React.FC<SponsorSectionEditProps> = ({
  sectionData,
  onUpdate,
  onUploadImage,
  onRemoveImage,
}) => {
  const [localData, setLocalData] = useState<Sponsor[]>([]);

  useEffect(() => {
    setLocalData(sectionData);
  }, [sectionData]);

  const handleInputChange = (
    index: number,
    field: keyof Sponsor,
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
      <h3>Edit Sponsors Section</h3>
      {localData.map((sponsor, index) => (
        <div key={index} className="sponsor-item">
          <div className="input-box">
            <label htmlFor={`link-${index}`}>Link</label>
            <input
              type="text"
              id={`link-${index}`}
              value={sponsor.link}
              onChange={(e) => handleInputChange(index, "link", e.target.value)}
            />
          </div>
          <div className="input-box">
            <label htmlFor={`linkTitle-${index}`}>Link Title</label>
            <input
              type="text"
              id={`linkTitle-${index}`}
              value={sponsor.linkTitle}
              onChange={(e) => handleInputChange(index, "linkTitle", e.target.value)}
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

export default SponsorSectionEdit;
