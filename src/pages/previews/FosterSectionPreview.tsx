// preview/FosterSectionPreview.tsx
import React from "react";
import { FosterSection as FosterSectionType } from "../../firebase/types";
import { Link } from "react-router-dom";
import "../../styles/previews/_fosterpreview.scss";

interface FosterSectionPreviewProps {
  section: FosterSectionType;
}

const FosterSectionPreview: React.FC<FosterSectionPreviewProps> = ({ section }) => {
  const hasData = section.title || section.content || section.imgUrl;

  return (
    <div>
      {hasData ? (
        <div className="foster-section-preview container-fluid">
          <div className="row">
            <div className="col-md-5 mb-5 d-flex flex-column justify-content-center">
              <h2 className="mb-4">
                <strong>{section.title}</strong>
              </h2>
              <p className="mb-4">{section.content}</p>
              <Link to={`/fostering`}>
                <button className="button-style">Foster Now</button>
              </Link>
            </div>
            <div
              className="col-md-5 mb-4 disable-right-click"
              onContextMenu={(e) => e.preventDefault()}
            >
              <img
                src={section.imgUrl}
                alt="Become a Foster Home"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      ) : (
        <p className="empty-preview-message">Enter data to preview.</p>
      )}
    </div>
  );
};

export default FosterSectionPreview;
