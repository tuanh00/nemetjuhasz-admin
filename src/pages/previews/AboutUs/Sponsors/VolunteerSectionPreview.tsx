import React from "react";
import { Volunteer } from "../../../../firebase/types";
//import "../../styles/previews/_volunteerPreview.scss";

interface VolunteerSectionPreviewProps {
  volunteers: Volunteer[];
}

const VolunteerSectionPreview: React.FC<VolunteerSectionPreviewProps> = ({ volunteers }) => {
  return (
    <div className="volunteer-preview container-fluid py-5">
      <h2>Volunteers</h2>
      <div className="row justify-content-center">
        {volunteers.map((volunteer, index) => (
          <div className="col-md-2 text-center mb-4" key={index}>
            <img src={volunteer.imageUrl} alt={volunteer.volunteerName} className="volunteer-image" />
            <p>{volunteer.volunteerName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VolunteerSectionPreview;
