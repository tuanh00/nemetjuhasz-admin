// StorySectionForm.tsx
import React from "react";
import { StorySection } from "../../../firebase/types";
import "../../../styles/previews/_storypreview.scss"; // Import the SCSS file

interface StorySectionFormProps {
  section: StorySection;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const StorySectionForm: React.FC<StorySectionFormProps> = ({ section, handleChange }) => (
  <div className="story-section-form">
    <div className="input-box">
      <label>English Title:</label>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={section.title}
        onChange={handleChange}
        className="form-control"
      />
    </div>
    <div className="input-box">
      <label>Hungarian Title:</label>
      <input
        type="text"
        name="hungarianTitle"
        placeholder="Hungarian Title"
        value={section.hungarianTitle}
        onChange={handleChange}
        className="form-control"
      />
    </div>
    <div className="input-box">
      <label>English Content:</label>
      <textarea
        name="content"
        placeholder="Content"
        value={section.content}
        onChange={handleChange}
        className="form-control"
      ></textarea>
    </div>
    <div className="input-box">
      <label>Hungarian Content:</label>
      <textarea
        name="hungarianContent"
        placeholder="Hungarian Content"
        value={section.hungarianContent}
        onChange={handleChange}
        className="form-control"
      ></textarea>
    </div>
    <div className="input-box">
      <label>YouTube Link (Max 1):</label>
      <input
        type="text"
        name="youtubeLink"
        placeholder="YouTube Link"
        value={section.youtubeLink}
        onChange={handleChange}
        className="form-control"
      />
    </div>
  </div>
);

export default StorySectionForm;
