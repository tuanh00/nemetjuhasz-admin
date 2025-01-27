import React from "react";
import { FeaturesSection as FeaturesSectionType } from "../../../firebase/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "../../../styles/previews/home/_featurepreview.scss";

interface FeatureSectionPreviewProps {
  section: FeaturesSectionType;
}

const FeatureSectionPreview: React.FC<FeatureSectionPreviewProps> = ({
  section,
}) => {
  const features = section.features;

  // Check if any data has been entered for at least one feature
  const isDataEntered = features.some(
    (feature) => feature.titleEnglish || feature.descriptionEnglish
  );

  return (
    <div className="feature-preview-container container mt-5 mb-4">
      {isDataEntered ? (
        <div className="row">
          {features.map((feature, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="icon-container text-center mb-3">
                <div className="check-icon d-inline-flex align-items-center justify-content-center bg-warning rounded-circle">
                  <FontAwesomeIcon
                    icon={faCheck}
                    size="2x"
                    className="text-dark"
                  />
                </div>
              </div>
              <h5 className="feature-title text-center mb-3">
                <strong>{feature.titleEnglish}</strong>
              </h5>
              <p className="feature-description text-center">
                {feature.descriptionEnglish}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="empty-preview-message">Enter data to preview.</p>
      )}
    </div>
  );
};

export default FeatureSectionPreview;
