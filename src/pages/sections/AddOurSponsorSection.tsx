import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import SponsorSectionForm from "./aboutUsForms/Sponsors/SponsorSectionForm";
import SponsorSectionPreview from "../previews/AboutUs/Sponsors/SponsorSectionPreview";
import FosterSectionForm from "./aboutUsForms/Sponsors/FosterSectionForm";
import VolunteerSectionForm from "./aboutUsForms/Sponsors/VolunteerSectionForm";
import BecomeASponsorSectionForm from "./aboutUsForms/Sponsors/BecomeASponsorSectionForm";
import { addOurSponsorSection } from "../../firebase/OurSponsorService";
import { OurSponsorSection } from "../../firebase/types";
import "../../styles/aboutus/sponsors/_addsponsorsection.scss";

const AddOurSponsorSection: React.FC = () => {
  const [section, setSection] = useState<OurSponsorSection | null>(null);
  const [imageFiles, setImageFiles] = useState<Array<File | null>>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(Array(4).fill("")); // For previewing images before upload
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false);

  const handleSectionTypeChange = (sectionType: string) => {
    switch (sectionType) {
      case "sponsors":
        setSection({
          sectionType: "sponsors",
          sponsors: Array(4).fill({ imageUrl: "", linkTitle: "", link: "" }), // Initialize 4 sponsor objects
        });
        setImageFiles(Array(4).fill(null)); // Reset image files
        setPreviewUrls(Array(4).fill("")); // Reset preview URLs
        break;
      case "fosters":
        setSection({ sectionType: "fosters", fosters: [{ imageUrls: [], fosterName: "" }] });
        break;
      case "volunteers":
        setSection({ sectionType: "volunteers", volunteers: [{ imageUrls: [], volunteerName: "" }] });
        break;
      case "becomeASponsor":
        setSection({
          sectionType: "becomeASponsor",
          becomeASponsor: {
            titleEnglish: "",
            titleHungarian: "",
            contentEnglish: "",
            contentHungarian: "",
          },
        });
        break;
      default:
        setSection(null);
        setImageFiles([]);
        setPreviewUrls(Array(4).fill(""));
    }
  };

  const handleImageFileChange = (file: File | null, index: number) => {
    const updatedImageFiles = [...imageFiles];
    updatedImageFiles[index] = file;
    setImageFiles(updatedImageFiles);

    if (file) {
      const previewUrl = URL.createObjectURL(file); // Generate a local preview URL
      const updatedPreviewUrls = [...previewUrls];
      updatedPreviewUrls[index] = previewUrl;
      setPreviewUrls(updatedPreviewUrls);
    } else {
      const updatedPreviewUrls = [...previewUrls];
      updatedPreviewUrls[index] = ""; // Clear preview if no file
      setPreviewUrls(updatedPreviewUrls);
    }
  };

  const handleSubmit = async () => {
    if (!section) {
      alert("Please select a section type and fill out the form.");
      return;
    }
    try {
      await addOurSponsorSection(section, imageFiles); // Pass imageFiles array
      alert("Section added successfully");
      setSection(null);
      setImageFiles(Array(4).fill(null)); // Reset after submission
      setPreviewUrls(Array(4).fill("")); // Reset previews after submission
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const togglePreviewVisibility = () => {
    setIsPreviewVisible((prev) => !prev);
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="add-our-sponsor-container">
        <h2>Add Our Sponsor Section</h2>
        <select
          onChange={(e) => handleSectionTypeChange(e.target.value)}
          value={section?.sectionType || ""}
        >
          <option value="">Select Section Type</option>
          <option value="sponsors">Sponsors</option>
          <option value="fosters">Fosters</option>
          <option value="volunteers">Volunteers</option>
          <option value="becomeASponsor">Become a Sponsor</option>
        </select>

        {section?.sectionType === "sponsors" && (
          <SponsorSectionForm
            sponsors={section.sponsors || []}
            onUpdate={(data) => setSection({ ...section, sponsors: data })}
            onImageFileChange={handleImageFileChange} // Pass file handler
          />
        )}
        {/* Other forms remain unchanged */}

        <button className="btn" onClick={handleSubmit}>
          Add Section
        </button>

        <div className="preview-section">
          <button
            type="button"
            className="btn mt-3 mb-3"
            onClick={togglePreviewVisibility}
          >
            {isPreviewVisible ? "Hide Preview" : "Show Preview"}
          </button>
          {isPreviewVisible && (
            <div className="preview-container">
              {section?.sectionType === "sponsors" && (
                <SponsorSectionPreview
                  sponsors={(section.sponsors || []).map((sponsor, index) => ({
                    ...sponsor,
                    imageUrl: previewUrls[index] || sponsor.imageUrl, // Use preview URL if available
                  }))}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddOurSponsorSection;
