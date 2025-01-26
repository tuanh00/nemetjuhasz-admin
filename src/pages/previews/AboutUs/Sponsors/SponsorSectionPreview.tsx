import React from "react";
import { Sponsor } from "../../../../firebase/types";
import "../../../../styles/previews/sponsors/_sponsorpreview.scss";

interface SponsorSectionPreviewProps {
  sponsors: Sponsor[];
}

const SponsorSectionPreview: React.FC<SponsorSectionPreviewProps> = ({ sponsors }) => {
  const maxSponsorsPerRow = 4; // Limit to 4 sponsors per row

  const sponsorChunks = [];
  for (let i = 0; i < sponsors.length; i += maxSponsorsPerRow) {
    sponsorChunks.push(sponsors.slice(i, i + maxSponsorsPerRow));
  }

  return (
    <div className="sponsor-preview container-fluid bg-light py-5">
      <div className="container">
        <h2 className="sponsor-section-title">Our Sponsors</h2>
        {sponsorChunks.map((chunk, rowIndex) => (
          <div className="row justify-content-center" key={rowIndex}>
            {chunk.map((sponsor, index) => (
              <div className="col-md-3 text-center mb-4" key={index}>
                <a
                  href={sponsor.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sponsor-link"
                >
                  <img
                    src={sponsor.imageUrl}
                    alt={sponsor.linkTitle || `Sponsor ${index + 1}`}
                    className="sponsor-logo"
                  />
                </a>
                <a
                  href={sponsor.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sponsor-name"
                >
                  {sponsor.linkTitle}
                </a>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SponsorSectionPreview;
