// src/pages/donation/AddDonationSection.tsx

import React, { useState, useEffect, useRef } from "react";
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
  const [section, setSection] = useState<DonationSection | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Track whether the form can be submitted
  const [isFormValid, setIsFormValid] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1) Handling section type choice
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSectionTypeChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selected = e.target.value as DonationSection["sectionType"];
    switch (selected) {
      case "donateSection":
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
          },
        });
        break;

      case "donateItems":
        setSection({
          sectionType: "donateItems",
          donateItems: {
            englishTitle: "",
            hungarianTitle: "",
            englishIntro: "",
            hungarianIntro: "",
            imageUrl: "", // Will be updated upon upload
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
          },
        });
        break;

      case "becomeASponsor":
        setSection({
          sectionType: "becomeASponsor",
          sponsor: {
            englishTitle: "",
            hungarianTitle: "",
            contentEnglish: "",
            contentHungarian: "",
          },
        });
        break;

      default:
        setSection(null);
        break;
    }

    // Reset any chosen image preview if switching types
    setPreviewUrl(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) Child form updates (for each type)
  // ─────────────────────────────────────────────────────────────────────────────
  const updateDonateSection = (updatedDonateSection: any) => {
    if (!section) return;
    setSection({ ...section, donateSection: updatedDonateSection });
  };

  const updateDonateItems = (updatedItems: any) => {
    if (!section) return;
    setSection({ ...section, donateItems: updatedItems });
  };

  const updateSponsor = (updatedSponsor: any) => {
    if (!section) return;
    setSection({ ...section, sponsor: updatedSponsor });
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) Rendering the form based on section type
  // ─────────────────────────────────────────────────────────────────────────────
  const renderForm = () => {
    if (!section) return null;
    switch (section.sectionType) {
      case "donateSection":
        return section.donateSection ? (
          <DonateForm donateSection={section.donateSection} onUpdate={updateDonateSection} />
        ) : null;

      case "donateItems":
        return section.donateItems ? (
          <DonateItemsForm
            donateItems={section.donateItems}
            onUpdate={updateDonateItems}
          />
        ) : null;

      case "becomeASponsor":
        return section.sponsor ? (
          <SponsorDonationForm
            sponsor={section.sponsor}
            onUpdate={updateSponsor}
          />
        ) : null;

      default:
        return null;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) Handling image file + local preview
  // ─────────────────────────────────────────────────────────────────────────────
  const handleImageFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Local blob for preview
    }
  };

  const handleRemoveImageClick = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 5) Simple form validation
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!section) {
      setIsFormValid(false);
      return;
    }

    let valid = false;
    switch (section.sectionType) {
      case "donateSection":
        if (
          section.donateSection &&
          section.donateSection.englishTitle.trim() &&
          section.donateSection.hungarianTitle.trim()
        ) {
          valid = true;
        }
        break;

      case "donateItems":
        if (
          section.donateItems &&
          section.donateItems.englishTitle.trim() &&
          section.donateItems.hungarianTitle.trim()
        ) {
          valid = true;
        }
        break;

      case "becomeASponsor":
        if (
          section.sponsor &&
          section.sponsor.englishTitle.trim() &&
          section.sponsor.hungarianTitle.trim()
        ) {
          valid = true;
        }
        break;
    }

    setIsFormValid(valid);
  }, [section]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6) Preview toggling + local override for image
  // ─────────────────────────────────────────────────────────────────────────────
  const togglePreview = () => setIsPreviewVisible((prev) => !prev);

  /**
   * Creates a shallow copy of `section`, overriding its `imageUrl` with our local
   * `previewUrl` if the user has chosen a new file. This ensures the final preview
   * shows the local blob image rather than a stale or non-existent URL.
   */
  const renderPreview = () => {
    if (!section) return null;

    // Make a shallow copy
    const copy = { ...section };

    // If user picked a file, override the original imageUrl with our local preview
    if (previewUrl) {
      if (copy.sectionType === "donateSection" && copy.donateSection) {
        copy.donateSection.imageUrl = previewUrl;
      } else if (copy.sectionType === "donateItems" && copy.donateItems) {
        copy.donateItems.imageUrl = previewUrl;
      } else if (copy.sectionType === "becomeASponsor" && copy.sponsor) {
        (copy.sponsor as any).imageUrl = previewUrl;
      }
    }

    switch (copy.sectionType) {
      case "donateSection":
        return copy.donateSection ? <DonatePreview donateSection={copy.donateSection} /> : null;

      case "donateItems":
        return copy.donateItems ? (
          <DonateItemsPreview donateItems={copy.donateItems} />
        ) : null;

      case "becomeASponsor":
        return copy.sponsor ? (
          <SponsorDonationPreview sponsor={copy.sponsor} />
        ) : null;

      default:
        return null;
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 7) Submission: calls addDonationSection(...) -> Firebase upload
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!section) {
      alert("Please select a section type and fill out the form.");
      return;
    }
    try {
      // The addDonationSection function will upload the file (if any) to Firebase,
      // then replace the local imageUrl with the final Firebase URL in the DB.
      await addDonationSection(section, imageFile || undefined);

      setMessage("Donation section added successfully!");

      // Reset everything
      setSection(null);
      setImageFile(null);
      setPreviewUrl(null);
      setIsPreviewVisible(false);
      if (fileInputRef.current) fileInputRef.current.value = "";

    } catch (error) {
      console.error("Error adding donation section:", error);
      setMessage("Failed to add donation section.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 8) Auto-hide feedback message after 3 seconds
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 9) RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="admin-container">
      <Sidebar />
      <main className="add-donation-section-container">
        <h2>Add Donation Section</h2>

        <select
          onChange={handleSectionTypeChange}
          value={section?.sectionType || ""}
        >
          <option value="">Select Section Type</option>
          <option value="donateSection">Donate (Main Info)</option>
          <option value="donateItems">Donate Items</option>
          <option value="becomeASponsor">Become A Sponsor</option>
        </select>

        {renderForm()}

        <div className="input-box" style={{ marginTop: "1rem" }}>
          <label>Upload Image (Optional)</label>
          {previewUrl ? (
            // Show the preview only if we do have a chosen file
            <div className="image-preview-grid">
              <div className="image-preview">
                <img src={previewUrl} alt="Local Preview" />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={handleRemoveImageClick}
                >
                  X
                </button>
              </div>
            </div>
          ) : (
            // Otherwise, show the file input
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
            />
          )}
        </div>

        {section && (
          <div className="preview-section">
            <button
              className="btn"
              onClick={togglePreview}
              disabled={!isFormValid}
            >
              {isPreviewVisible ? "Hide Preview" : "Show Preview"}
            </button>
            {isPreviewVisible && (
              <div className="preview-container">{renderPreview()}</div>
            )}
          </div>
        )}

        <button
          className="btn mt-3"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          Add Donation Section
        </button>

        {message && <p className="message-box">{message}</p>}
      </main>
    </div>
  );
};

export default AddDonationSection;
