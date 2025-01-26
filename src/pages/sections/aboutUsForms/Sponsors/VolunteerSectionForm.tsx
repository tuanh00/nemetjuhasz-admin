import React, { useState } from "react";
import { Volunteer } from "../../../../firebase/types";

interface VolunteerSectionFormProps {
  volunteers: Volunteer[];
  onUpdate: (updatedVolunteers: Volunteer[]) => void;
}

const VolunteerSectionForm: React.FC<VolunteerSectionFormProps> = ({ volunteers, onUpdate }) => {
  const [localVolunteers, setLocalVolunteers] = useState<Volunteer[]>(volunteers);

  const handleInputChange = (index: number, field: keyof Volunteer, value: string) => {
    const updatedVolunteers = [...localVolunteers];
    updatedVolunteers[index] = { ...updatedVolunteers[index], [field]: value };
    setLocalVolunteers(updatedVolunteers);
    onUpdate(updatedVolunteers);
  };

  const handleImageChange = (index: number, file: File | null) => {
    if (file) {
      const updatedVolunteers = [...localVolunteers];
      const newImageUrl = URL.createObjectURL(file);

      if (!updatedVolunteers[index].imageUrls) {
        updatedVolunteers[index].imageUrls = [];
      }

      updatedVolunteers[index].imageUrls.push(newImageUrl);
      setLocalVolunteers(updatedVolunteers);
      onUpdate(updatedVolunteers);
    }
  };

  return (
    <div>
      {localVolunteers.map((volunteer, index) => (
        <div key={index} className="input-box">
          <label>Volunteer Name:</label>
          <input
            type="text"
            value={volunteer.volunteerName}
            onChange={(e) => handleInputChange(index, "volunteerName", e.target.value)}
            placeholder="Volunteer Name"
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

export default VolunteerSectionForm;
