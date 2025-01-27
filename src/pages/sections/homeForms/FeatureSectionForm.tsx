// FeatureSectionForm.tsx
import React from "react";
import { FeaturesSection } from "../../../firebase/types";
import "../../../styles/previews/home/_featurepreview.scss";

interface FeaturesSectionFormProps {
  section: FeaturesSection;
  handleFeatureChange: (index: number, field: string, value: string) => void;
}

const FeaturesSectionForm: React.FC<FeaturesSectionFormProps> = ({ section, handleFeatureChange }) => (
  <>
    {section.features.map((feature, index) => (
      <div key={index} className="feature-item">
        {/* Feature Heading */}
        <h3>Feature {index + 1}</h3>

        {/* English Title Input */}
        <div className="input-box">
          <label>English Title</label>
          <input
            type="text"
            placeholder={`Feature ${index + 1} Title in English`}
            value={feature.titleEnglish}
            onChange={(e) => handleFeatureChange(index, "titleEnglish", e.target.value)}
            className="form-control"
            required
          />
        </div>

        {/* Hungarian Title Input */}
        <div className="input-box">
          <label>Hungarian Title</label>
          <input
            type="text"
            placeholder={`Feature ${index + 1} Title in Hungarian`}
            value={feature.titleHungarian}
            onChange={(e) => handleFeatureChange(index, "titleHungarian", e.target.value)}
            className="form-control"
            required
          />
        </div>

        {/* English Description Input */}
        <div className="input-box">
          <label>English Description</label>
          <textarea
            placeholder={`Feature ${index + 1} Description in English`}
            value={feature.descriptionEnglish}
            onChange={(e) => handleFeatureChange(index, "descriptionEnglish", e.target.value)}
            className="form-control"
            required
          ></textarea>
        </div>

        {/* Hungarian Description Input */}
        <div className="input-box">
          <label>Hungarian Description</label>
          <textarea
            placeholder={`Feature ${index + 1} Description in Hungarian`}
            value={feature.descriptionHungarian}
            onChange={(e) => handleFeatureChange(index, "descriptionHungarian", e.target.value)}
            className="form-control"
            required
          ></textarea>
        </div>
      </div>
    ))}
  </>
);

export default FeaturesSectionForm;
