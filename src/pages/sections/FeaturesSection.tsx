// FeatureSection.tsx
import React, { useState } from 'react';
import { FeaturesSection } from '../../firebase/types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/Firebase';

interface FeaturesSectionEditProps {
  sectionData: FeaturesSection;
  onUpdate: (updatedSection: FeaturesSection) => void;
}

const FeaturesSectionEdit: React.FC<FeaturesSectionEditProps> = ({ sectionData, onUpdate }) => {
  const [features, setFeatures] = useState(sectionData.features);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
    setFeatures(updatedFeatures);
    onUpdate({ ...sectionData, features: updatedFeatures });
  };

  const saveChanges = async () => {
    if (!sectionData.id) {
      setMessage('Section ID is not available.');
      setIsSuccess(false);
      return;
    }

    try {
      // Update the local state
      onUpdate({ ...sectionData, features });

      // Update Firestore with the updated features section
      const docRef = doc(db, 'home_sections', sectionData.id);
      await updateDoc(docRef, { features });
      setMessage('Changes saved successfully.');
      setIsSuccess(true);
    } catch (error) {
      console.error('Error updating features section:', error);
      setMessage('Failed to save changes.');
      setIsSuccess(false);
    }

    // Clear the message after 3 seconds
    setTimeout(() => {
      setMessage(null);
      setIsSuccess(null);
    }, 3000);
  };

  return (
    <div className="container">
      <h3>Features Section</h3>
      {features.map((feature, index) => (
        <div key={index} className="mb-3">
          <h4>Feature {index + 1}</h4>
          <label htmlFor={`titleEnglish-${index}`} className="form-label">
            English Title
          </label>
          <input
            id={`titleEnglish-${index}`}
            type="text"
            className="form-control mb-2"
            placeholder="Title in English"
            value={feature.titleEnglish}
            onChange={(e) => handleFeatureChange(index, 'titleEnglish', e.target.value)}
          />
          <label htmlFor={`titleHungarian-${index}`} className="form-label">
            Hungarian Title
          </label>
          <input
            id={`titleHungarian-${index}`}
            type="text"
            className="form-control mb-2"
            placeholder="Title in Hungarian"
            value={feature.titleHungarian}
            onChange={(e) => handleFeatureChange(index, 'titleHungarian', e.target.value)}
          />
          <label htmlFor={`descriptionEnglish-${index}`} className="form-label">
            English Description
          </label>
          <textarea
            id={`descriptionEnglish-${index}`}
            className="form-control mb-2"
            placeholder="Description in English"
            value={feature.descriptionEnglish}
            onChange={(e) => handleFeatureChange(index, 'descriptionEnglish', e.target.value)}
          />
          <label htmlFor={`descriptionHungarian-${index}`} className="form-label">
            Hungarian Description
          </label>
          <textarea
            id={`descriptionHungarian-${index}`}
            className="form-control mb-2"
            placeholder="Description in Hungarian"
            value={feature.descriptionHungarian}
            onChange={(e) => handleFeatureChange(index, 'descriptionHungarian', e.target.value)}
          />
        </div>
      ))}
      <button className="btn save-btn" onClick={saveChanges}>
        Save Changes
      </button>

      {message && (
        <p className={`message-box ${isSuccess ? 'success' : 'error'}`}>{message}</p>
      )}
    </div>
  );
};

export default FeaturesSectionEdit;
