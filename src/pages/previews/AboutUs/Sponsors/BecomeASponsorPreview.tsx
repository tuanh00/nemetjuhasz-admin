import React from "react";
import { BecomeASponsor } from "../../../../firebase/types";
//import "../../styles/previews/_becomeSponsorPreview.scss";

interface BecomeASponsorPreviewProps {
  data: BecomeASponsor;
}

const BecomeASponsorPreview: React.FC<BecomeASponsorPreviewProps> = ({ data }) => {
  return (
    <div className="become-sponsor-preview container-fluid bg-dark text-white py-5">
      <h2>{data.titleEnglish}</h2>
      <p>{data.contentEnglish}</p>
    </div>
  );
};

export default BecomeASponsorPreview;
