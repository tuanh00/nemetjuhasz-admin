// src/pages/donation/EditDonationSection.tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { DonationSection } from "../../firebase/types";
import { getDonationSection, updateDonationSection } from "../../firebase/DonationService";

import DonateForm from "../sections/donationForms/DonateForm";
import DonateItemsForm from "../sections/donationForms/DonateItemsForm";
import SponsorDonationForm from "../sections/donationForms/SponsorDonationForm";

import DonatePreview from "../previews/Donation/DonatePreview";
import DonateItemsPreview from "../previews/Donation/DonateItemsPreview";
import SponsorDonationPreview from "../previews/Donation/SponsorDonationPreview";

import "../../styles/donation/_adddonationsection.scss"; // Reuse same style

const EditDonationSection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [section, setSection] = useState<DonationSection | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isFormValid, setIsFormValid] = useState(false);

  // 1) On mount, fetch the existing donation section by ID
  useEffect(() => {
    if (!id) return;
    getDonationSection(id).then((data) => {
      if (!data) {
        setMessage("Donation section not found.");
        return;
      }
      setSection(data);

      // If there's an existing image, we don't have a "blob" preview, 
      // but we can show the actual url if you want. 
      if (data.sectionType === "donateSection" && data.donateSection?.imageUrl) {
        setPreviewUrl(data.donateSection.imageUrl);
      }
      if (data.sectionType === "donateItems" && data.donateItems?.imageUrl) {
        setPreviewUrl(data.donateItems.imageUrl);
      }
      if (data.sectionType === "becomeASponsor" && data.sponsor?.imageUrl) {
        setPreviewUrl(data.sponsor.imageUrl);
      }
    });
  }, [id]);

  // 2) Update partial states
  const updateDonateSection = (updated: any) => {
    if (!section) return;
    setSection({ ...section, donateSection: updated });
  };
  const updateDonateItems = (updated: any) => {
    if (!section) return;
    setSection({ ...section, donateItems: updated });
  };
  const updateSponsor = (updated: any) => {
    if (!section) return;
    setSection({ ...section, sponsor: updated });
  };

  // 3) Render forms
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
          <SponsorDonationForm sponsor={section.sponsor} onUpdate={updateSponsor} />
        ) : null;
      default:
        return null;
    }
  };

  // 4) Image
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    // Potentially also remove the existing imageUrl from section:
    if (section) {
      if (section.sectionType === "donateSection" && section.donateSection) {
        section.donateSection.imageUrl = "";
      } else if (section.sectionType === "donateItems" && section.donateItems) {
        section.donateItems.imageUrl = "";
      } else if (section.sectionType === "becomeASponsor" && section.sponsor) {
        section.sponsor.imageUrl = "";
      }
      setSection({ ...section });
    }
  };

  // 5) Validate form
  useEffect(() => {
    if (!section) {
      setIsFormValid(false);
      return;
    }
    let valid = false;
    if (
      section.sectionType === "donateSection" &&
      section.donateSection?.englishTitle.trim() &&
      section.donateSection?.hungarianTitle.trim()
    ) {
      valid = true;
    }
    if (
      section.sectionType === "donateItems" &&
      section.donateItems?.englishTitle.trim() &&
      section.donateItems?.hungarianTitle.trim()
    ) {
      valid = true;
    }
    if (
      section.sectionType === "becomeASponsor" &&
      section.sponsor?.englishTitle.trim() &&
      section.sponsor?.hungarianTitle.trim()
    ) {
      valid = true;
    }
    setIsFormValid(valid);
  }, [section]);

  // 6) Preview
  const togglePreview = () => setIsPreviewVisible((prev) => !prev);

  const renderPreview = () => {
    if (!section) return null;
    switch (section.sectionType) {
      case "donateSection":
        return section.donateSection ? <DonatePreview donateSection={section.donateSection} /> : null;
      case "donateItems":
        return section.donateItems ? (
          <DonateItemsPreview donateItems={section.donateItems} />
        ) : null;
      case "becomeASponsor":
        return section.sponsor ? (
          <SponsorDonationPreview sponsor={section.sponsor} />
        ) : null;
      default:
        return null;
    }
  };

  // 7) Save changes
  const handleSaveChanges = async () => {
    if (!section || !id) {
      setMessage("No data found or invalid ID.");
      return;
    }
    try {
      await updateDonationSection(id, section, imageFile || undefined);
      setMessage("Changes saved successfully!");
      setTimeout(() => navigate("/manage-donation-sections"), 2000);
    } catch (error) {
      console.error("Error saving changes:", error);
      setMessage("Failed to save changes.");
    }
  };

  // Auto-hide message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="add-donation-section-container">
        <h2>Edit Donation Section</h2>
        {message && <p className="message-box">{message}</p>}

        {section ? (
          <>
            {renderForm()}

            <div className="input-box" style={{ marginTop: "1rem" }}>
              <label>Upload New Image (Optional)</label>
              {previewUrl ? (
                <div className="image-preview-grid">
                  <div className="image-preview">
                    <img src={previewUrl} alt="Local Preview" />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={handleRemoveImage}
                    >
                      X
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

            <button
              className="btn mt-3"
              onClick={handleSaveChanges}
              disabled={!isFormValid}
            >
              Save Changes
            </button>
          </>
        ) : (
          <p>Loading donation section...</p>
        )}
      </main>
    </div>
  );
};

export default EditDonationSection;
