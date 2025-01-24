import React from "react";
import { AboutUsSection } from "../../../firebase/types";

interface AboutUsSectionPreviewProps {
  section: AboutUsSection;
}

const AboutUsSectionPreview: React.FC<AboutUsSectionPreviewProps> = ({ section }) => {
  return (
    <>
      {/* White background section under the navbar */}
      <div className="container-fluid bg-white">
        <div className="container mt-5">
          {/* Header */}
          <h1 style={{ textAlign: "left" }}>
            <strong>{section.englishTitle}</strong>
          </h1>
          {/* Sub Header */}
          {section.subEnglishTitle && (
            <h3 style={{ textAlign: "left" }}>{section.subEnglishTitle}</h3>
          )}
        </div>
      </div>

      {/* Grey background section with 2 columns */}
      <div className="container-fluid mt-5 bg-light py-5">
        <div className="container">
          <div className="row">
            {/* Image on the left */}
            <div className="col-md-6" onContextMenu={(e) => e.preventDefault()}>
              {section.imageUrl ? (
                <div className="image-preview-wrapper">
                  <img
                    src={section.imageUrl}
                    alt="About Us"
                    className="img-fluid rounded"
                    style={{ maxWidth: "90%", height: "auto", marginBottom: 10 }}
                  />
                  <button className="remove-btn">X</button>
                </div>
              ) : (
                <p>No image uploaded.</p>
              )}
            </div>

            <div className="col-md-6">
              <p style={{ whiteSpace: "pre-line" }}>{section.contentEnglish}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutUsSectionPreview;
