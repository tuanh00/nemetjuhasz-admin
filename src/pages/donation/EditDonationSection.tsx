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
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1) Load existing doc
  useEffect(() => {
    if (!id) return;
    getDonationSection(id).then((data) => {
      if (data) {
        setSection(data);
        // show existing image in preview
        if (data.sectionType === "donateSection" && data.donateSection?.imageUrl) {
          setPreviewUrl(data.donateSection.imageUrl);
        }
        if (data.sectionType === "donateItems" && data.donateItems?.imageUrl) {
          setPreviewUrl(data.donateItems.imageUrl);
        }
        if (data.sectionType === "becomeASponsor" && data.sponsor?.imageUrl) {
          setPreviewUrl(data.sponsor.imageUrl);
        }
      }
    });
  }, [id]);

  // 2) Image handlers
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };
  const handleRemoveImageClick = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 3) Form validation
  useEffect(() => {
    if (!section) return setIsFormValid(false);
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

  // 4) Render forms
  const renderForm = () => {
    if (!section) return null;
    if (section.sectionType === "donateSection") {
      return (
        <DonateForm
          donateSection={section.donateSection!}
          onUpdate={(ds) => setSection(s => s && ({ ...s, donateSection: ds }))}
        />
      );
    }
    if (section.sectionType === "donateItems") {
      return (
        <DonateItemsForm
          donateItems={section.donateItems!}
          onUpdate={(di) => setSection(s => s && ({ ...s, donateItems: di }))}
        />
      );
    }
    return (
      <SponsorDonationForm
        sponsor={section.sponsor!}
        onUpdate={(sp) => setSection(s => s && ({ ...s, sponsor: sp }))}
      />
    );
  };

  // 5) Preview
  const togglePreview = () => setIsPreviewVisible(v => !v);
  const renderPreview = () => {
    if (!section) return null;
    const copy = { ...section };
    if (previewUrl) {
      if (copy.sectionType === "donateSection") copy.donateSection!.imageUrl = previewUrl;
      if (copy.sectionType === "donateItems") copy.donateItems!.imageUrl = previewUrl;
      if (copy.sectionType === "becomeASponsor") copy.sponsor!.imageUrl = previewUrl;
    }
    switch (copy.sectionType) {
      case "donateSection":   return <DonatePreview donateSection={copy.donateSection!} />;
      case "donateItems":     return <DonateItemsPreview donateItems={copy.donateItems!} />;
      case "becomeASponsor":  return <SponsorDonationPreview sponsor={copy.sponsor!} />;
      default: return null;
    }
  };

  // 6) Submit update
  const handleSubmit = async () => {
    if (!section || !id) return;
    try {
      await updateDonationSection(id, section, imageFile || undefined);
      setMessage("✅ Updated successfully.");
      setTimeout(() => navigate("/donation-sections"), 1000);
    } catch {
      setMessage("❌ Update failed.");
    }
  };
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="add-donation-section-container">
        <h2>Edit Donation Section</h2>

        {renderForm()}

        {/* Image upload */}
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

        {/* Preview toggle */}
        <div className="preview-section mt-3">
          <button className="btn" onClick={togglePreview} disabled={!isFormValid}>
            {isPreviewVisible ? "Hide Preview" : "Show Preview"}
          </button>
          {isPreviewVisible && <div className="preview-container mt-2">{renderPreview()}</div>}
        </div>

        <button className="btn mt-4" onClick={handleSubmit} disabled={!isFormValid}>
          Save Changes
        </button>
        {message && <div className="message-box mt-2">{message}</div>}
      </main>
    </div>
  );
};

export default EditDonationSection;