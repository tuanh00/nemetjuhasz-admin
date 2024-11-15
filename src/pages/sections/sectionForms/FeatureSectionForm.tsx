// FeatureSectionForm.tsx
import React from "react";
import { FeaturesSection } from "../../../firebase/types";
import "../../../styles/previews/_featurepreview.scss";

interface FeaturesSectionFormProps {
  section: FeaturesSection;
  handleFeatureChange: (index: number, field: string, value: string) => void;
}

const FeaturesSectionForm: React.FC<FeaturesSectionFormProps> = ({ section, handleFeatureChange }) => (
  <>
    {Array.from({ length: 3 }, (_, index) => (
      <div key={index} className="feature-item">
        <div className="input-box">
          <label>{`Feature ${index + 1} Title (English):`}</label>
          <input
            type="text"
            placeholder={`Feature ${index + 1} Title in English`}
            value={section.features[index]?.titleEnglish || ""}
            onChange={(e) => handleFeatureChange(index, "titleEnglish", e.target.value)}
            className="form-control"
          />
        </div>
        <div className="input-box">
          <label>{`Feature ${index + 1} Title (Hungarian):`}</label>
          <input
            type="text"
            placeholder={`Feature ${index + 1} Title in Hungarian`}
            value={section.features[index]?.titleHungarian || ""}
            onChange={(e) => handleFeatureChange(index, "titleHungarian", e.target.value)}
            className="form-control"
          />
        </div>
        <div className="input-box">
          <label>{`Feature ${index + 1} Description (English):`}</label>
          <textarea
            placeholder={`Feature ${index + 1} Description in English`}
            value={section.features[index]?.descriptionEnglish || ""}
            onChange={(e) => handleFeatureChange(index, "descriptionEnglish", e.target.value)}
            className="form-control"
          ></textarea>
        </div>
        <div className="input-box">
          <label>{`Feature ${index + 1} Description (Hungarian):`}</label>
          <textarea
            placeholder={`Feature ${index + 1} Description in Hungarian`}
            value={section.features[index]?.descriptionHungarian || ""}
            onChange={(e) => handleFeatureChange(index, "descriptionHungarian", e.target.value)}
            className="form-control"
          ></textarea>
        </div>
      </div>
    ))}
  </>
);

export default FeaturesSectionForm;
