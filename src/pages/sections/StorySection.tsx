// StorySection.tsx
import React, { useState } from 'react';
import { StorySection } from '../../firebase/types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/Firebase';

interface StorySectionEditProps {
  sectionData: StorySection;
  onUpdate: (updatedSection: StorySection) => void;
}

const StorySectionEdit: React.FC<StorySectionEditProps> = ({ sectionData, onUpdate }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...sectionData, [name]: value });
  };

  const handleSaveChanges = async () => {
    if (!sectionData.id) {
      setMessage('Section ID is not available.');
      setIsSuccess(false);
      return;
    }

    try {
      const docRef = doc(db, 'home_sections', sectionData.id);
      await updateDoc(docRef, {
        title: sectionData.title,
        content: sectionData.content,
        hungarianTitle: sectionData.hungarianTitle,
        hungarianContent: sectionData.hungarianContent,
        youtubeLink: sectionData.youtubeLink,
      });
      setMessage('Changes saved successfully.');
      setIsSuccess(true);
    } catch (error) {
      console.error('Error saving changes:', error);
      setMessage('Failed to save changes.');
      setIsSuccess(false);
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setMessage(null);
      setIsSuccess(null);
    }, 3000);
  };

  return (
    <div className="container">
      <h3>Story Section</h3>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          English Title
        </label>
        <input
          id="title"
          name="title"
          className="form-control"
          value={sectionData.title}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="content" className="form-label">
          English Content
        </label>
        <textarea
          id="content"
          name="content"
          className="form-control"
          value={sectionData.content}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="hungarianTitle" className="form-label">
          Hungarian Title
        </label>
        <input
          id="hungarianTitle"
          name="hungarianTitle"
          className="form-control"
          value={sectionData.hungarianTitle}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="hungarianContent" className="form-label">
          Hungarian Content
        </label>
        <textarea
          id="hungarianContent"
          name="hungarianContent"
          className="form-control"
          value={sectionData.hungarianContent}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="mb-3">
        <label htmlFor="youtubeLink" className="form-label">
          YouTube Link
        </label>
        <input
          id="youtubeLink"
          name="youtubeLink"
          className="form-control"
          value={sectionData.youtubeLink}
          onChange={handleChange}
        />
      </div>

      {message && (
        <p className={`message-box ${isSuccess ? 'success' : 'error'}`}>{message}</p>
      )}

      <button onClick={handleSaveChanges} className="btn save-btn">
        Save Changes
      </button>
    </div>
  );
};

export default StorySectionEdit;
