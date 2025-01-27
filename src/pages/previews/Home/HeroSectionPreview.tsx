import React from "react";
import { HeroSection as HeroSectionType } from "../../../firebase/types";
import "../../../styles/previews/home/_heropreview.scss";

interface HeroSectionPreviewProps {
  section: HeroSectionType;
}

const HeroSectionPreview: React.FC<HeroSectionPreviewProps> = ({ section }) => {
  const title = section.title || "";
  const hasData = title || section.imgUrl;

  return (
    <div>
      {hasData ? (
        <div
          className="hero-section disable-right-click"
          style={{
            backgroundImage: `url(${section.imgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "750px",
            width: "100%",
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="text-container">
            {title.split("\n").map((line, index) => (
              <h1 key={index}>
                <strong>{line}</strong>
              </h1>
            ))}
            <button className="button-style mt-2">Adopt Now</button>
          </div>
        </div>
      ) : (
        <p className="empty-preview-message">Enter data to preview.</p>
      )}
    </div>
  );
};

export default HeroSectionPreview;
