import React from "react";
import { SponsorDonation } from "../../../firebase/types";
import "../../../styles/previews/donate/_sponsordonationpreview.scss";

interface SponsorDonationPreviewProps {
  sponsor: SponsorDonation;
}

/**
 * Shows only the English fields in a dark container:
 *  - sponsor.englishTitle
 *  - sponsor.contentEnglish
 *  - sponsor.englishButtonTitle / sponsor.englishButtonLink
 *  - sponsor.imageUrl on the left
 */
const SponsorDonationPreview: React.FC<SponsorDonationPreviewProps> = ({
  sponsor,
}) => {
  return (
    <div className="sponsor-donation-preview container-fluid bg-dark text-white py-5">
      <div className="container">
        <div className="row justify-content-center align-items-start">
          {/* Left column = image */}
          <div
            className="col-md-5 mb-4"
            onContextMenu={(e) => e.preventDefault()}
          >
            {sponsor.imageUrl ? (
              <img
                src={sponsor.imageUrl}
                alt="Sponsor Preview"
                className="img-fluid rounded"
                style={{ maxWidth: "100%", height: "auto" }}
              />
            ) : (
              <p style={{ color: "#ccc" }}>[No image uploaded]</p>
            )}
          </div>

          {/* Right column = English text + button */}
          <div className="col-md-5 d-flex flex-column align-items-start">
            <h2 className="mb-3 text-white">{sponsor.englishTitle}</h2>
            <p className="mb-4" style={{ whiteSpace: "pre-line" }}>
              {sponsor.contentEnglish}
            </p>

            {/* If they provided a button title, show the button */}
            {sponsor.englishButtonTitle && (
              <a
                href={sponsor.englishButtonLink || "#"}
                className="btn btn-preview"
                target="_blank"
                rel="noopener noreferrer"
              >
                {sponsor.englishButtonTitle}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorDonationPreview;
