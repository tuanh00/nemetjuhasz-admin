// SuccessSectionPreview.tsx
import React from "react";
import { SuccessStorySection as SuccessSectionType } from "../../../firebase/types";
import "../../../styles/previews/home/_successpreview.scss";

interface SuccessSectionPreviewProps {
  section: SuccessSectionType;
}

const SuccessSectionPreview: React.FC<SuccessSectionPreviewProps> = ({ section }) => {
  const mainTitle = section.title || "Our Success Stories";

  // Ensure imgUrls has two entries
  const imgUrls = section.imgUrls || ["", ""];

  // Map each container slot to the specific index in imgUrls
  const items = [
    {
      imageUrl: imgUrls[0],
      overlayText: section.title1 || "First Success Story",
    },
    {
      imageUrl: imgUrls[1],
      overlayText: section.title2 || "Second Success Story",
    },
  ];

  return (
    <div className="success-section-preview container-fluid mt-5 mb-5">
      <h2 className="section-title mb-5">
        <strong>{mainTitle}</strong>
      </h2>

      <div className="row justify-content-center">
        {items.map((item, index) => (
          <div
            className="col-md-5 col-sm-12 mb-4 image-container"
            key={index}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="img-wrapper">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.overlayText} className="success-image" />
              ) : (
                <div className="placeholder-message">{item.overlayText}</div>
              )}
              <div className="hover-overlay">
                <h2>{item.overlayText}</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessSectionPreview;
