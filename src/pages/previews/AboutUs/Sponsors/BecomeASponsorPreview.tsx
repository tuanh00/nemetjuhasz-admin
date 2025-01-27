import React from "react";
import { BecomeASponsor } from "../../../../firebase/types";
import "../../../../styles/previews/sponsors/_becomeASponsorPreview.scss";

interface BecomeASponsorPreviewProps {
  section: BecomeASponsor;
}

const BecomeASponsorPreview: React.FC<BecomeASponsorPreviewProps> = ({
  section,
}) => {
  return (
    <div className="become-sponsor-preview">
      <div className="container-fluid bg-dark py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="image-wrapper">
                <img
                  src={section.imageUrl || "/placeholder.png"}
                  alt="Become a Sponsor"
                  className="img-fluid rounded"
                />
              </div>
            </div>
            <div className="col-md-6">
              <p>
                <h3>{section.titleEnglish}</h3>
                {section.contentEnglish}
              </p>
              <button
                className="btn custom-btn"
                onClick={() => (window.location.href = "/contact?lang=en")}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeASponsorPreview;
