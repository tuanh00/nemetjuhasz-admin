import React from "react";
import { Foster } from "../../../../firebase/types";
//import "../../styles/previews/_fosterPreview.scss";

interface FosterSectionPreviewProps {
  fosters: Foster[];
}

const FosterSectionPreview: React.FC<FosterSectionPreviewProps> = ({ fosters }) => {
  return (
    <div className="foster-preview container-fluid py-5">
      <h2>Fosters</h2>
      <div className="row justify-content-center">
        {fosters.map((foster, index) => (
          <div className="col-md-2 text-center mb-4" key={index}>
            <img src={foster.imageUrl} alt={foster.fosterName} className="foster-image" />
            <p>{foster.fosterName}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FosterSectionPreview;
