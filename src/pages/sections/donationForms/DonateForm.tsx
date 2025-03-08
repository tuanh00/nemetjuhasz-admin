import React from "react";
import { DonateSection } from "../../../firebase/types";
import "../../../styles/donation/forms/_donationform.scss";

interface DonateFormProps {
  donateSection: DonateSection;
  onUpdate: (updated: DonateSection) => void;
}

const DonateForm: React.FC<DonateFormProps> = ({ donateSection, onUpdate }) => {
  // 1) Simple field changes
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    onUpdate({ ...donateSection, [name]: value });
  };

  // 2) Bullets & links
  const handleAddBullet = (lang: "EN" | "HU") => {
    if (lang === "EN") {
      onUpdate({
        ...donateSection,
        bulletPointsEnglish: [...donateSection.bulletPointsEnglish, ""],
        bulletLinksEnglish: [...(donateSection.bulletLinksEnglish || []), ""],
      });
    } else {
      onUpdate({
        ...donateSection,
        bulletPointsHungarian: [...donateSection.bulletPointsHungarian, ""],
        bulletLinksHungarian: [...(donateSection.bulletLinksHungarian || []), ""],
      });
    }
  };

  const handleBulletChange = (
    lang: "EN" | "HU",
    index: number,
    newValue: string
  ) => {
    if (lang === "EN") {
      const updatedBullets = [...donateSection.bulletPointsEnglish];
      updatedBullets[index] = newValue;
      onUpdate({ ...donateSection, bulletPointsEnglish: updatedBullets });
    } else {
      const updatedBullets = [...donateSection.bulletPointsHungarian];
      updatedBullets[index] = newValue;
      onUpdate({ ...donateSection, bulletPointsHungarian: updatedBullets });
    }
  };

  const handleLinkChange = (
    lang: "EN" | "HU",
    index: number,
    newValue: string
  ) => {
    if (lang === "EN") {
      const updatedLinks = [...(donateSection.bulletLinksEnglish || [])];
      updatedLinks[index] = newValue;
      onUpdate({ ...donateSection, bulletLinksEnglish: updatedLinks });
    } else {
      const updatedLinks = [...(donateSection.bulletLinksHungarian || [])];
      updatedLinks[index] = newValue;
      onUpdate({ ...donateSection, bulletLinksHungarian: updatedLinks });
    }
  };

  // 3) Removing bullets
  const handleRemoveBullet = (lang: "EN" | "HU", index: number) => {
    if (lang === "EN") {
      const updatedBullets = [...donateSection.bulletPointsEnglish];
      const updatedLinks = [...(donateSection.bulletLinksEnglish || [])];
      updatedBullets.splice(index, 1);
      updatedLinks.splice(index, 1);
      onUpdate({
        ...donateSection,
        bulletPointsEnglish: updatedBullets,
        bulletLinksEnglish: updatedLinks,
      });
    } else {
      const updatedBullets = [...donateSection.bulletPointsHungarian];
      const updatedLinks = [...(donateSection.bulletLinksHungarian || [])];
      updatedBullets.splice(index, 1);
      updatedLinks.splice(index, 1);
      onUpdate({
        ...donateSection,
        bulletPointsHungarian: updatedBullets,
        bulletLinksHungarian: updatedLinks,
      });
    }
  };

  return (
    <div>
      {/* Titles */}
      <div className="input-box">
        <label>English Title</label>
        <input
          type="text"
          name="englishTitle"
          value={donateSection.englishTitle}
          onChange={handleFieldChange}
        />
      </div>
      <div className="input-box">
        <label>Hungarian Title</label>
        <input
          type="text"
          name="hungarianTitle"
          value={donateSection.hungarianTitle}
          onChange={handleFieldChange}
        />
      </div>

      {/* Main content fields */}
      <div className="input-box">
        <label>English Content</label>
        <textarea
          name="englishContent"
          rows={3}
          value={donateSection.englishContent}
          onChange={handleFieldChange}
        />
      </div>
      <div className="input-box">
        <label>Hungarian Content</label>
        <textarea
          name="hungarianContent"
          rows={3}
          value={donateSection.hungarianContent}
          onChange={handleFieldChange}
        />
      </div>

      {/* New fields: intro & closing */}
      <div className="input-box">
        <label>Intro (English)</label>
        <textarea
          name="introEnglish"
          rows={3}
          value={donateSection.introEnglish}
          onChange={handleFieldChange}
        />
      </div>
      <div className="input-box">
        <label>Intro (Hungarian)</label>
        <textarea
          name="introHungarian"
          rows={3}
          value={donateSection.introHungarian}
          onChange={handleFieldChange}
        />
      </div>

      <div className="input-box">
        <label>Closing (English)</label>
        <textarea
          name="closingEnglish"
          rows={3}
          value={donateSection.closingEnglish}
          onChange={handleFieldChange}
        />
      </div>
      <div className="input-box">
        <label>Closing (Hungarian)</label>
        <textarea
          name="closingHungarian"
          rows={3}
          value={donateSection.closingHungarian}
          onChange={handleFieldChange}
        />
      </div>

      {/* Bullets & Links (English) */}
      <div className="input-box" style={{ marginTop: "1rem" }}>
        <label>English Bullets & Optional Links</label>
        {donateSection.bulletPointsEnglish.map((bp, idx) => (
          <div className="bullet-row" key={`bp-en-${idx}`}>
            <textarea
              className="bullet-text"
              rows={3}
              placeholder={`Bullet #${idx + 1}`}
              value={bp}
              onChange={(e) => handleBulletChange("EN", idx, e.target.value)}
            />
            <input
              type="text"
              className="bullet-link"
              placeholder="Link (optional)"
              value={donateSection.bulletLinksEnglish?.[idx] || ""}
              onChange={(e) => handleLinkChange("EN", idx, e.target.value)}
            />
            <button
              type="button"
              className="remove-bullet-btn"
              onClick={() => handleRemoveBullet("EN", idx)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddBullet("EN")}>
          + Add English Bullet
        </button>
      </div>

      {/* Bullets & Links (Hungarian) */}
      <div className="input-box" style={{ marginTop: "1rem" }}>
        <label>Hungarian Bullets & Optional Links</label>
        {donateSection.bulletPointsHungarian.map((bp, idx) => (
          <div className="bullet-row" key={`bp-hu-${idx}`}>
            <textarea
              className="bullet-text"
              rows={3}
              placeholder={`Bullet #${idx + 1}`}
              value={bp}
              onChange={(e) => handleBulletChange("HU", idx, e.target.value)}
            />
            <input
              type="text"
              className="bullet-link"
              placeholder="Link (optional)"
              value={donateSection.bulletLinksHungarian?.[idx] || ""}
              onChange={(e) => handleLinkChange("HU", idx, e.target.value)}
            />
            <button
              type="button"
              className="remove-bullet-btn"
              onClick={() => handleRemoveBullet("HU", idx)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddBullet("HU")}>
          + Add Hungarian Bullet
        </button>
      </div>
    </div>
  );
};

export default DonateForm;
