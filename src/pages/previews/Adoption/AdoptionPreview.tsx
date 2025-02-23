import React from "react";
import { AdoptionSection } from "../../../firebase/types";
import "../../../styles/previews/adopt/_adoptionpreview.scss";

interface AdoptionPreviewProps {
  section: AdoptionSection;
}

const AdoptionPreview: React.FC<AdoptionPreviewProps> = ({ section }) => {
  return (
    <>
      {/* Adoption Process Section Preview */}
      {section.sectionType === "adoptionProcess" && section.adoptionProcess && (
        <div className="adoption-preview-container adoption-process-preview">
          <div className="container-fluid bg-white">
            <div className="container mt-5">
              <h1 className="section-title">
                <strong>{section.adoptionProcess.title}</strong>
              </h1>
            </div>
          </div>
          <div className="container-fluid mt-5 bg-light py-5">
            <div className="container">
              <div className="row">
                <div className="col-md-6 image-container">
                  {section.adoptionProcess.imageUrl ? (
                    <div className="image-preview-wrapper">
                      <img
                        src={section.adoptionProcess.imageUrl}
                        alt="Adoption Process"
                        className="img-fluid rounded preview-image"
                      />
                    </div>
                  ) : (
                    <p>No image uploaded.</p>
                  )}
                </div>
                <div className="col-md-6">
                  <p className="preview-text">{section.adoptionProcess.content}</p>
                  <div className="button-wrapper">
                    <a href={section.adoptionProcess.buttonLink} target="_blank" rel="noopener noreferrer">
                      <button className="btn mt-3">{section.adoptionProcess.englishButtonTitle}</button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Stories Section Preview */}
      {section.sectionType === "successStories" && section.successStories && (
        <div className="adoption-preview-container success-stories-preview container-fluid mt-5 mb-5">
          <h3 className="mb-5 section-title">
            <strong>{section.successStories.title}</strong>
          </h3>
          {section.successStories.images.map((img, index) => (
            <div key={index} className="row justify-content-center mb-4">
              {/* First image */}
              <div className="col-md-5 image-container">
                <a href={img.link} target="_blank" rel="noopener noreferrer">
                  <div className="image-preview-wrapper">
                    <img
                      src={img.firstImageUrl}
                      alt="Success Story (English)"
                      className="img-fluid rounded preview-image"
                    />
                    <div className="hover-overlay">
                      <p>{img.englishImageTitle}</p>
                    </div>
                  </div>
                </a>
              </div>
              {/* Second image */}
              <div className="col-md-5 image-container">
                <a href={img.link} target="_blank" rel="noopener noreferrer">
                  <div className="image-preview-wrapper">
                    <img
                      src={img.secondImageUrl}
                      alt="Success Story (Hungarian)"
                      className="img-fluid rounded preview-image"
                    />
                    <div className="hover-overlay">
                      <p>{img.hungarianImageTitle}</p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Become a Foster Section Preview */}
      {section.sectionType === "becomeAFoster" && section.becomeAFoster && (
        <div className="adoption-preview-container become-afoster-preview container-fluid mt-5 mb-5">
          <div className="container">
            <h3 className="section-title">
              <strong>{section.becomeAFoster.englishTitle}</strong>
            </h3>
            <p>{section.becomeAFoster.englishContent}</p>
            <div className="button-wrapper">
              <a href={section.becomeAFoster.buttonLink} target="_blank" rel="noopener noreferrer">
                <button className="btn mt-3">{section.becomeAFoster.englishButtonTitle}</button>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdoptionPreview;
