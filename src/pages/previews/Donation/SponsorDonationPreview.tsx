import React from "react";
import { SponsorDonation } from "@/firebase/types";
import "./SponsorDonationPreview.scss";

interface SponsorDonationPreviewProps {
  sponsor: SponsorDonation;
}

/**
 * Displays sponsor's English content preview in a styled dark container.
 * Shows image on the left and content on the right.
 */
const SponsorDonationPreview: React.FC<SponsorDonationPreviewProps> = ({ sponsor }) => {
  const { imageUrl, englishTitle, contentEnglish, englishButtonTitle, englishButtonLink } = sponsor;

  return (
    <div className="sponsor-donation-preview container-fluid bg-dark text-white py-5">
      <div className="container">
        <div className="row justify-content-center align-items-start">
          {/* Left column: image */}
          <div className="col-md-5 mb-4" onContextMenu={(e) => e.preventDefault()}>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Sponsor Preview"
                className="img-fluid rounded"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            ) : (
              <p className="text-muted">[No image uploaded]</p>
            )}
          </div>

          {/* Right column: text + optional button */}
          <div className="col-md-5 d-flex flex-column align-items-start">
            <h2 className="mb-3">{englishTitle}</h2>
            <p className="mb-4" style={{ whiteSpace: "pre-line" }}>
              {contentEnglish}
            </p>
            {englishButtonTitle && (
              <a
                href={englishButtonLink || "#"}
                className="btn btn-preview"
                target="_blank"
                rel="noopener noreferrer"
              >
                {englishButtonTitle}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDonationPreview;
