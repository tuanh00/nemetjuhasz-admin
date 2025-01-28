import React, { useState, useEffect } from "react";
import "../../../styles/aboutus/sponsors/_editsponsorsection.scss";
import { Foster } from "../../../firebase/types";

interface FosterSectionEditProps {
  sectionData: Foster[];
  onUpdate: (updatedData: Foster[]) => void;
  onUploadImage: (file: File, index: number) => void;
  onRemoveImage: (index: number) => void;
}

const FosterSectionEdit: React.FC<FosterSectionEditProps> = ({
  sectionData,
  onUpdate,
  onUploadImage,
  onRemoveImage,
}) => {
  const [localData, setLocalData] = useState<Foster[]>([]);

  useEffect(() => {
    setLocalData(sectionData);
  }, [sectionData]);

  const handleInputChange = (
    index: number,
    field: keyof Foster,
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
      <h3>Edit Foster Section</h3>
      {localData.map((foster, index) => (
        <div key={index} className="foster-item">
          <div className="input-box">
            <label htmlFor={`fosterName-${index}`}>Foster Name</label>
            <input
              type="text"
              id={`fosterName-${index}`}
              value={foster.fosterName}
              onChange={(e) => handleInputChange(index, "fosterName", e.target.value)}
            />
          </div>
          <div className="image-preview-grid">
            <label>Image</label>
            {foster.imageUrl ? (
              <div className="image-preview">
                <img src={foster.imageUrl} alt={`Foster ${index}`} />
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

export default FosterSectionEdit;
