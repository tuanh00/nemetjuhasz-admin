import React from "react";
import { Sponsor } from "../../../../firebase/types";
import "../../../../styles/previews/sponsors/_sponsorpreview.scss";

interface SponsorSectionPreviewProps {
  sponsors: Sponsor[];
}

const SponsorSectionPreview: React.FC<SponsorSectionPreviewProps> = ({
  sponsors,
}) => {
  return (
    <div className="sponsor-preview container-fluid bg-light py-5">
      <div className="container">
        <h2 className="sponsor-section-title">Our Sponsors</h2>
        <div className="row justify-content-center">
          {sponsors.map((sponsor, index) => (
            <div className="col-md-3 text-center mb-4" key={index}>
              <a
                href={sponsor.link}
                target="_blank"
                rel="noopener noreferrer"
                className="sponsor-link"
              >
                <img
                  src={sponsor.imageUrl || "/placeholder.png"}
                  alt={sponsor.linkTitle || `Sponsor ${index + 1}`}
                  className="sponsor-logo"
                />
              </a>
              <p className="sponsor-name">
                <a href={sponsor.link} target="_blank" rel="noopener noreferrer">{sponsor.linkTitle}</a>
              </p>
              {/* <p className="sponsor-name">{sponsor.linkTitle}</p> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SponsorSectionPreview;
