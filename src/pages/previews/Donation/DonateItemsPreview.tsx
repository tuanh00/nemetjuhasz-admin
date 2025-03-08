import React from "react";
import { DonateItems } from "../../../firebase/types";
import "../../../styles/previews/donate/_donateitemspreview.scss";

interface DonateItemsPreviewProps {
  donateItems: DonateItems;
}

const DonateItemsPreview: React.FC<DonateItemsPreviewProps> = ({ donateItems }) => {
  return (
    <div className="donate-items-preview bg-white container-fluid py-4">
      <div className="container">
        <div className="row">
          {/* LEFT COLUMN (Text) */}
          <div className="col-md-6 text-col" style={{ marginBottom: "1rem" }}>
            {/* English Title */}
            <h2 className="preview-title">{donateItems.englishTitle}</h2>

            {/* English Intro text */}
            <p className="preview-intro" style={{ whiteSpace: "pre-line" }}>
              {donateItems.englishIntro}
            </p>

            {/* Food items section title + bullet list */}
            <h4>Food items you may donate to us:</h4>
            <ul>
              {donateItems.foodSection.englishBullets.map((bullet, idx) => (
                <li key={`food-en-${idx}`}>{bullet}</li>
              ))}
            </ul>

            {/* Accessory section title + bullet list */}
            <h4>Dog accessories and toys:</h4>
            <ul>
              {donateItems.accessorySection.englishBullets.map((bullet, idx) => (
                <li key={`acc-en-${idx}`}>{bullet}</li>
              ))}
            </ul>
          </div>

          {/* RIGHT COLUMN (Image) */}
          <div className="col-md-6 image-col d-flex justify-content-center align-items-start">
            {donateItems.imageUrl ? (
              <img
                src={donateItems.imageUrl}
                alt="Donate Items Preview"
                className="img-fluid rounded"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            ) : (
              <p style={{ color: "#888" }}>[No image uploaded]</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonateItemsPreview;
