import React, { useState } from "react";
import { Foster } from "../../../../firebase/types";

interface FosterSectionFormProps {
  fosters: Foster[];
  onUpdate: (updatedFosters: Foster[]) => void;
}

const FosterSectionForm: React.FC<FosterSectionFormProps> = ({ fosters, onUpdate }) => {
  const [localFosters, setLocalFosters] = useState<Foster[]>(fosters);

  const handleInputChange = (index: number, field: keyof Foster, value: string) => {
    const updatedFosters = [...localFosters];
    updatedFosters[index] = { ...updatedFosters[index], [field]: value };
    setLocalFosters(updatedFosters);
    onUpdate(updatedFosters);
  };

  const handleImageChange = (index: number, file: File | null) => {
    if (file) {
      const updatedFosters = [...localFosters];
      const newImageUrl = URL.createObjectURL(file);

      if (!updatedFosters[index].imageUrls) {
        updatedFosters[index].imageUrls = [];
      }

      updatedFosters[index].imageUrls.push(newImageUrl);
      setLocalFosters(updatedFosters);
      onUpdate(updatedFosters);
    }
  };

  return (
    <div>
      {localFosters.map((foster, index) => (
        <div key={index} className="input-box">
          <label>Foster Name:</label>
          <input
            type="text"
            value={foster.fosterName}
            onChange={(e) => handleInputChange(index, "fosterName", e.target.value)}
            placeholder="Foster Name"
            required
          />
          <label>Image Upload:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(index, e.target.files?.[0] || null)}
          />
        </div>
      ))}
    </div>
  );
};

export default FosterSectionForm;
