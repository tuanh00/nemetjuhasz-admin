// src/pages/donation/AddDonationSection.tsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { DonationSection } from "../../firebase/types";
import { addDonationSection } from "../../firebase/DonationService";

import DonateForm from "../sections/donationForms/DonateForm";
import DonateItemsForm from "../sections/donationForms/DonateItemsForm";
import SponsorDonationForm from "../sections/donationForms/SponsorDonationForm";

import DonatePreview from "../previews/Donation/DonatePreview";
import DonateItemsPreview from "../previews/Donation/DonateItemsPreview";
import SponsorDonationPreview from "../previews/Donation/SponsorDonationPreview";

import "../../styles/donation/_adddonationsection.scss";

const AddDonationSection: React.FC = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<DonationSection | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1) Handle dropdown change → initialize appropriate shape
  const handleSectionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value as DonationSection["sectionType"];
    setSection(null);
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (type === "donateSection") {
      setSection({
        sectionType: "donateSection",
        donateSection: {
          englishTitle: "",
          hungarianTitle: "",
          englishContent: "",
          hungarianContent: "",
          introEnglish: "",
          introHungarian: "",
          closingEnglish: "",
          closingHungarian: "",
          bulletPointsEnglish: [],
          bulletPointsHungarian: [],
          bulletLinksEnglish: [],
          bulletLinksHungarian: [],
          imageUrl: "",
        },
      });
    } else if (type === "donateItems") {
      setSection({
        sectionType: "donateItems",
        donateItems: {
          englishTitle: "",
          hungarianTitle: "",
          englishIntro: "",
          hungarianIntro: "",
          foodSection: {
            englishSectionTitle: "",
            hungarianSectionTitle: "",
            englishBullets: [],
            hungarianBullets: [],
          },
          accessorySection: {
            englishSectionTitle: "",
            hungarianSectionTitle: "",
            englishBullets: [],
            hungarianBullets: [],
          },
          imageUrl: "",
        },
      });
    } else if (type === "becomeASponsor") {
      setSection({
        sectionType: "becomeASponsor",
        sponsor: {
          englishTitle: "",
          hungarianTitle: "",
          contentEnglish: "",
          contentHungarian: "",
          englishButtonTitle: "",
          englishButtonLink: "",
          hungarianButtonTitle: "",
          hungarianButtonLink: "",
          imageUrl: "",
        },
      });
    }
  };

  // 2) Image selection & preview
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };
  const handleRemoveImageClick = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 3) Form-level validation (simple non-empty check)
  useEffect(() => {
    if (!section) {
      setIsFormValid(false);
      return;
    }
    let valid = true;
    switch (section.sectionType) {
      case "donateSection":
        valid = !!section.donateSection?.englishTitle;
        break;
      case "donateItems":
        valid = !!section.donateItems?.englishTitle;
        break;
      case "becomeASponsor":
        valid = !!section.sponsor?.englishTitle;
        break;
    }
    setIsFormValid(valid);
  }, [section]);

  // 4) Render the appropriate form component
  const renderForm = () => {
    if (!section) return null;
    switch (section.sectionType) {
      case "donateSection":
        return (
          <DonateForm
            donateSection={section.donateSection!}
            onUpdate={(ds) => setSection(s => s && ({ ...s, donateSection: ds }))}
          />
        );
      case "donateItems":
        return (
          <DonateItemsForm
            donateItems={section.donateItems!}
            onUpdate={(di) => setSection(s => s && ({ ...s, donateItems: di }))}
          />
        );
      case "becomeASponsor":
        return (
          <SponsorDonationForm
            sponsor={section.sponsor!}
            onUpdate={(sp) => setSection(s => s && ({ ...s, sponsor: sp }))}
          />
        );
      default:
        return null;
    }
  };

  // 5) Preview toggling & live preview override
  const togglePreview = () => setIsPreviewVisible(v => !v);
  const renderPreview = () => {
    if (!section) return null;
    // shallow copy + override URL to our blob
    const copy = { ...section };
    if (previewUrl) {
      if (copy.sectionType === "donateSection") {
        copy.donateSection!.imageUrl = previewUrl;
      }
      if (copy.sectionType === "donateItems") {
        copy.donateItems!.imageUrl = previewUrl;
      }
      if (copy.sectionType === "becomeASponsor") {
        copy.sponsor!.imageUrl = previewUrl;
      }
    }
    switch (copy.sectionType) {
      case "donateSection":   return <DonatePreview donateSection={copy.donateSection!} />;
      case "donateItems":     return <DonateItemsPreview donateItems={copy.donateItems!} />;
      case "becomeASponsor":  return <SponsorDonationPreview sponsor={copy.sponsor!} />;
      default: return null;
    }
  };

  // 6) Submit handler
  const handleSubmit = async () => {
    if (!section) return;
    try {
      await addDonationSection(section, imageFile || undefined);
      setMessage("✅ Donation section added.");
      // reset
      setSection(null);
      setImageFile(null);
      setPreviewUrl(null);
      setIsPreviewVisible(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      // redirect back to list
      setTimeout(() => navigate("/donation-sections"), 1000);
    } catch {
      setMessage("❌ Failed to add.");
    }
  };

  // auto-hide message
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="add-donation-section-container">
        <h2>Add Donation Section</h2>

        {/* Section type selector */}
        <select
          onChange={handleSectionTypeChange}
          value={section?.sectionType || ""}
        >
          <option value="">Select Section Type</option>
          <option value="donateSection">Donate (Main Info)</option>
          <option value="donateItems">Donate Items</option>
          <option value="becomeASponsor">Become A Sponsor</option>
        </select>

        {/* Dynamic form */}
        {renderForm()}

        {/* Image upload: only once a type is chosen */}
        {section && (
          <div className="input-box mt-3">
            <label>Upload Image (Optional)</label>
            {previewUrl ? (
              <div className="image-preview-grid">
                <div className="image-preview">
                  <img src={previewUrl} alt="Preview" />
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={handleRemoveImageClick}
                  >
                    ×
                  </button>
                </div>
              </div>
            ) : (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
              />
            )}
          </div>
        )}

        {/* Preview toggle */}
        {section && (
          <div className="preview-section mt-3">
            <button
              className="btn"
              onClick={togglePreview}
              disabled={!isFormValid}
            >
              {isPreviewVisible ? "Hide Preview" : "Show Preview"}
            </button>
            {isPreviewVisible && (
              <div className="preview-container mt-2">{renderPreview()}</div>
            )}
          </div>
        )}

        {/* Submit */}
        <button
          className="btn mt-4"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Add Donation Section
        </button>

        {message && <div className="message-box mt-2">{message}</div>}
      </main>
    </div>
);
};

export default AddDonationSection;