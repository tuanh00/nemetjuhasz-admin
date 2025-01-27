import React, { useState } from "react";
import { Foster } from "../../../../firebase/types";
import "../../../../styles/previews/sponsors/_fosterpreview.scss";

interface FosterSectionPreviewProps {
  fosters: Foster[];
}

const FosterSectionPreview: React.FC<FosterSectionPreviewProps> = ({
  fosters,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [modalFosterName, setModalFosterName] = useState<string | null>(null);

  const openModal = (imageUrl: string, fosterName: string) => {
    setModalImage(imageUrl);
    setModalFosterName(fosterName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
    setModalFosterName(null);
  };

  return (
    <div className="foster-preview">
      <h2 className="title">Our Fosters</h2>
      <div className="circle-grid">
        {fosters.map((foster, index) => (
          <div
            key={index}
            className="circle-image-container"
            onClick={() =>
              foster.imageUrl && openModal(foster.imageUrl, foster.fosterName)
            }
          >
            <div className="circle-image">
              {foster.imageUrl ? (
                <img src={foster.imageUrl} alt={`Foster ${index + 1}`} />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <p className="foster-name">{foster.fosterName || "No Name"}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal content
          >
            <h3 className="modal-foster-name">{modalFosterName}</h3>
            {modalImage && <img src={modalImage} alt="Foster in Modal" />}
            <button className="close-btn" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FosterSectionPreview;
