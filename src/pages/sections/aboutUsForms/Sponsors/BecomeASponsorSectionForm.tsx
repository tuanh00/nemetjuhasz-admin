import React from "react";
import { BecomeASponsor } from "../../../../firebase/types";

interface BecomeASponsorSectionFormProps {
  data: BecomeASponsor;
  onUpdate: (updatedData: BecomeASponsor) => void;
}

const BecomeASponsorSectionForm: React.FC<BecomeASponsorSectionFormProps> = ({ data, onUpdate }) => {
  const handleChange = (field: keyof BecomeASponsor, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  return (
    <div>
      <div className="input-box">
        <label>English Title:</label>
        <input
          type="text"
          value={data.titleEnglish}
          onChange={(e) => handleChange("titleEnglish", e.target.value)}
          placeholder="English Title"
          required
        />
      </div>
      <div className="input-box">
        <label>Hungarian Title:</label>
        <input
          type="text"
          value={data.titleHungarian}
          onChange={(e) => handleChange("titleHungarian", e.target.value)}
          placeholder="Hungarian Title"
          required
        />
      </div>
      <div className="input-box">
        <label>English Content:</label>
        <textarea
          value={data.contentEnglish}
          onChange={(e) => handleChange("contentEnglish", e.target.value)}
          placeholder="English Content"
          required
        />
      </div>
      <div className="input-box">
        <label>Hungarian Content:</label>
        <textarea
          value={data.contentHungarian}
          onChange={(e) => handleChange("contentHungarian", e.target.value)}
          placeholder="Hungarian Content"
          required
        />
      </div>
    </div>
  );
};

export default BecomeASponsorSectionForm;
