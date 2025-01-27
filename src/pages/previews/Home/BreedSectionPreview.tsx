// preview/BreedSectionPreview.tsx
import React from "react";
import { BreedSection as BreedSectionType } from "../../../firebase/types";
import { Link } from "react-router-dom";
import "../../../styles/previews/home/_breedpreview.scss";

interface BreedSectionPreviewProps {
  section: BreedSectionType;
}

const BreedSectionPreview: React.FC<BreedSectionPreviewProps> = ({
  section,
}) => {
  const hasData = section.title || section.content || section.imgUrl;

  return (
    <div>
      {hasData ? (
        <div className="breed-section-preview container-fluid bg-dark">
          <div className="row">
            <div
              className="col-md-5 mb-4 disable-right-click"
              onContextMenu={(e) => e.preventDefault()}
            >
              <img
                src={section.imgUrl}
                alt="Our Breed"
                style={{ width: "100%" }}
              />
            </div>
            <div className="col-md-5 mb-5 d-flex flex-column justify-content-center">
              <h2 className="mb-4">
                <strong>{section.title}</strong>
              </h2>
              <p className="mb-4">{section.content}</p>
              <Link to={`/about`}>
                <button className="button-style">Learn More</button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <p className="empty-preview-message">Enter data to preview.</p>
      )}
    </div>
  );
};

export default BreedSectionPreview;
