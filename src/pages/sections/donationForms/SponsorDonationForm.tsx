// src/pages/donation/forms/SponsorDonationForm.tsx
import React from "react";
import { SponsorDonation } from "../../../firebase/types";

interface SponsorDonationFormProps {
  sponsor: SponsorDonation;
  onUpdate: (updated: SponsorDonation) => void;
}

/**
 * A form for editing 'sponsor' objects in a DonationSection with sectionType="becomeASponsor"
 * - englishTitle/hungarianTitle
 * - contentEnglish/contentHungarian
 * - optional button titles + links
 */
const SponsorDonationForm: React.FC<SponsorDonationFormProps> = ({
  sponsor,
  onUpdate,
}) => {
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onUpdate({ ...sponsor, [name]: value });
  };

  return (
    <div>
      <div className="input-box">
        <label>English Title</label>
        <input
          type="text"
          name="englishTitle"
          value={sponsor.englishTitle}
          onChange={handleFieldChange}
        />
      </div>
      <div className="input-box">
        <label>Hungarian Title</label>
        <input
          type="text"
          name="hungarianTitle"
          value={sponsor.hungarianTitle}
          onChange={handleFieldChange}
        />
      </div>
      <div className="input-box">
        <label>English Content</label>
        <textarea
          name="contentEnglish"
          value={sponsor.contentEnglish}
          onChange={handleFieldChange}
        />
      </div>
      <div className="input-box">
        <label>Hungarian Content</label>
        <textarea
          name="contentHungarian"
          value={sponsor.contentHungarian}
          onChange={handleFieldChange}
        />
      </div>

      <div className="input-box">
        <label>English Button Title</label>
        <input
          type="text"
          name="englishButtonTitle"
          value={sponsor.englishButtonTitle || ""}
          onChange={handleFieldChange}
        />
      </div>
      <div className="input-box">
        <label>Hungarian Button Title</label>
        <input
          type="text"
          name="hungarianButtonTitle"
          value={sponsor.hungarianButtonTitle || ""}
          onChange={handleFieldChange}
        />
      </div>
      <div className="input-box">
        <label>English Button Link</label>
        <input
          type="text"
          name="englishButtonLink"
          value={sponsor.englishButtonLink || ""}
          onChange={handleFieldChange}
        />
      </div>
      <div className="input-box">
        <label>Hungarian Button Link</label>
        <input
          type="text"
          name="hungarianButtonLink"
          value={sponsor.hungarianButtonLink || ""}
          onChange={handleFieldChange}
        />
      </div>
    </div>
  );
};

export default SponsorDonationForm;
