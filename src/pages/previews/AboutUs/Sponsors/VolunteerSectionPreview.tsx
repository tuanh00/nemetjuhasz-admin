import React, { useState } from "react";
import { Volunteer } from "../../../../firebase/types";
import "../../../../styles/previews/sponsors/_volunteerpreview.scss";

interface VolunteerSectionPreviewProps {
  volunteers: Volunteer[];
}

const VolunteerSectionPreview: React.FC<VolunteerSectionPreviewProps> = ({
  volunteers,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalVolunteerName, setModalVolunteerName] = useState<string | null>(null);

  const openModal = (imageUrl: string, volunteerName: string) => {
    setModalImage(imageUrl);
    setModalVolunteerName(volunteerName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
    setModalVolunteerName(null);
  };

  return (
    <div className="volunteer-preview">
      <h2 className="title">Our Volunteers</h2>
      <div className="circle-grid">
        {volunteers.map((volunteer, index) => (
          <div
            key={index}
            className="circle-image-container"
            onClick={() =>
              volunteer.imageUrl && openModal(volunteer.imageUrl, volunteer.volunteerName)
            }
          >
            <div className="circle-image">
              {volunteer.imageUrl ? (
                <img src={volunteer.imageUrl} alt={`Volunteer ${index + 1}`} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <p className="volunteer-name">{volunteer.volunteerName || "No Name"}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="modal-volunteer-name">{modalVolunteerName}</h3>
            {modalImage && <img src={modalImage} alt="Volunteer in Modal" />}
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerSectionPreview;
