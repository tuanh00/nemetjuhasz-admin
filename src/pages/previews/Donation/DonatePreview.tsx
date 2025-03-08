// src/pages/previews/Donation/DonatePreview.tsx
import React from "react";
import { DonateSection } from "../../../firebase/types";
import "../../../styles/previews/donate/_donatepreview.scss";

interface DonatePreviewProps {
  donateSection: DonateSection;
}

const DonatePreview: React.FC<DonatePreviewProps> = ({ donateSection }) => {
  return (
    <div className="donate-preview">
      {/* 
        A dark background container with text-white.
        We'll do a row with the image on the left
        and text on the right to emulate your second screenshot style.
      */}
      <div className="container-fluid py-4">
        <div className="container">
          {/* Title & content at the top */}
          <h1>{donateSection.englishTitle}</h1>
          <p className="intro-text" style={{ fontSize: "1.1rem" }}>
            {donateSection.englishContent}
          </p>

          {/* Row for the image on the left, the main body on the right */}
          <div className="row mt-4">
            {/* Left column => image */}
            <div
              className="col-md-4"
              style={{ textAlign: "center" }}
              onContextMenu={(e) => e.preventDefault()}
            >
              {donateSection.imageUrl ? (
                <img
                  src={donateSection.imageUrl}
                  alt="Donate Preview"
                  className="img-fluid rounded mb-3"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              ) : (
                <p style={{ color: "#ccc" }}>[No image uploaded]</p>
              )}
            </div>

            {/* Right column => intro + bullet points + closing */}
            <div className="col-md-8">
              {/* Intro text (English) */}
              {donateSection.introEnglish && (
                <p style={{ whiteSpace: "pre-line", marginBottom: "1rem" }}>
                  {donateSection.introEnglish}
                </p>
              )}

              {/* Numbered bullet points (English) */}
              <ol>
                {donateSection.bulletPointsEnglish.map((bullet, idx) => {
                  const link = donateSection.bulletLinksEnglish?.[idx];
                  return (
                    <li key={`en-bullet-${idx}`} style={{ 
                      marginBottom: "0.5rem",
                      whiteSpace: "pre-line",
                       }}
                    >
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#0d6efd", textDecoration: "underline" }}
                        >
                          {bullet}
                        </a>
                      ) : (
                        bullet
                      )}
                    </li>
                  );
                })}
              </ol>

              {/* Closing text (English) */}
              {donateSection.closingEnglish && (
                <p style={{ whiteSpace: "pre-line", marginTop: "1rem" }}>
                  {donateSection.closingEnglish}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonatePreview;
