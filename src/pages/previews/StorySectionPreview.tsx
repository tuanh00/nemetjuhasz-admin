import React from "react";
import { StorySection as StorySectionType } from "../../firebase/types";
import "../../styles/previews/_storypreview.scss";

interface StorySectionPreviewProps {
  section: StorySectionType;
}

const StorySectionPreview: React.FC<StorySectionPreviewProps> = ({ section }) => {
  const title = section.hungarianTitle || section.title;
  const content = section.hungarianContent || section.content;

  // Check if any data has been entered
  const isDataEntered = title || content || section.youtubeLink;

  return (
    <div className="story-section-preview container-fluid mt-5 mb-5">
      {isDataEntered ? (
        <div className="row">
          <div className="col-md-6 mt-5 mb-5">
            <iframe
              width="100%"
              height="400"
              src={section.youtubeLink}
              title="Our Story Preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          <div className="col-md-4 d-flex flex-column justify-content-center">
            <h2 className="mb-4">
              <strong>{title}</strong>
            </h2>
            <p className="mb-4">{content}</p>
              <button className="button-style">About Us</button>
          </div>
        </div>
      ) : (
        <p className="empty-preview-message">Enter data to preview.</p>
      )}
    </div>
  );
};

export default StorySectionPreview;
