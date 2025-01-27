import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import SponsorSectionForm from "./aboutUsForms/Sponsors/SponsorSectionForm";
import FosterSectionForm from "./aboutUsForms/Sponsors/FosterSectionForm";
import VolunteerSectionForm from "./aboutUsForms/Sponsors/VolunteerSectionForm";
import BecomeASponsorSectionForm from "./aboutUsForms/Sponsors/BecomeASponsorSectionForm"; // Import Become a Sponsor form
import SponsorSectionPreview from "../previews/AboutUs/Sponsors/SponsorSectionPreview";
import FosterSectionPreview from "../previews/AboutUs/Sponsors/FosterSectionPreview";
import VolunteerSectionPreview from "../previews/AboutUs/Sponsors/VolunteerSectionPreview";
import BecomeASponsorPreview from "../previews/AboutUs/Sponsors/BecomeASponsorPreview"; // Import Become a Sponsor preview
import { addOurSponsorSection } from "../../firebase/OurSponsorService";
import { OurSponsorSection } from "../../firebase/types";
import "../../styles/aboutus/sponsors/_addsponsorsection.scss";

const AddOurSponsorSection: React.FC = () => {
  const [section, setSection] = useState<OurSponsorSection | null>(null);
  const [imageFiles, setImageFiles] = useState<Array<File | null>>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const handleSectionTypeChange = (sectionType: string) => {
    switch (sectionType) {
      case "sponsors":
        setSection({
          sectionType: "sponsors",
          sponsors: Array(4).fill({ imageUrl: "", linkTitle: "", link: "" }),
        });
        setImageFiles(Array(4).fill(null));
        break;
      case "fosters":
        setSection({
          sectionType: "fosters",
          fosters: Array(5).fill({ imageUrl: "", fosterName: "" }),
        });
        setImageFiles(Array(5).fill(null));
        break;
      case "volunteers":
        setSection({
          sectionType: "volunteers",
          volunteers: Array(5).fill({ imageUrl: "", volunteerName: "" }),
        });
        setImageFiles(Array(5).fill(null));
        break;
      case "becomeASponsor": // New case for Become a Sponsor
        setSection({
          sectionType: "becomeASponsor",
          becomeASponsor: Array(1).fill({
            titleEnglish: "",
            titleHungarian: "",
            contentEnglish: "",
            contentHungarian: "",
            imageUrl: "",
          }),
        });
        setImageFiles([null]);
        break;
      default:
        setSection(null);
        setImageFiles([]);
    }
  };

  const handleImageFileChange = (file: File | null, index: number) => {
    const updatedFiles = [...imageFiles];
    updatedFiles[index] = file;
    setImageFiles(updatedFiles);

    if (section?.sectionType === "sponsors" && section.sponsors) {
      const updatedSponsors = [...section.sponsors];
      updatedSponsors[index] = {
        ...updatedSponsors[index],
        imageUrl: file ? URL.createObjectURL(file) : "",
      };
      setSection({ ...section, sponsors: updatedSponsors });
    }

    if (section?.sectionType === "fosters" && section.fosters) {
      const updatedFosters = [...section.fosters];
      updatedFosters[index] = {
        ...updatedFosters[index],
        imageUrl: file ? URL.createObjectURL(file) : "",
      };
      setSection({ ...section, fosters: updatedFosters });
    }

    if (section?.sectionType === "volunteers" && section.volunteers) {
      const updatedVolunteers = [...section.volunteers];
      updatedVolunteers[index] = {
        ...updatedVolunteers[index],
        imageUrl: file ? URL.createObjectURL(file) : "",
      };
      setSection({ ...section, volunteers: updatedVolunteers });
    }

    if (section?.sectionType === "becomeASponsor" && section.becomeASponsor) {
      const updatedBecomeASponsor = [...section.becomeASponsor];
      updatedBecomeASponsor[index] = {
        ...updatedBecomeASponsor[index],
        imageUrl: file ? URL.createObjectURL(file) : "",
      };
      setSection({ ...section, becomeASponsor: updatedBecomeASponsor });
    }
  };

  const handleSubmit = async () => {
    if (!section) {
      alert("Please select a section type and fill out the form.");
      return;
    }
    try {
      await addOurSponsorSection(section, imageFiles);
      alert("Section added successfully!");
      setSection(null);
      setImageFiles([]);
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  const togglePreviewVisibility = () => {
    setIsPreviewVisible((prev) => !prev);
  };

  const renderPreview = () => {
    if (!section) return null;

    switch (section.sectionType) {
      case "sponsors":
        return <SponsorSectionPreview sponsors={section.sponsors || []} />;
      case "fosters":
        return <FosterSectionPreview fosters={section.fosters || []} />;
      case "volunteers":
        return <VolunteerSectionPreview volunteers={section.volunteers || []} />;
        case "becomeASponsor": // Fix for Become a Sponsor
        return (
          section.becomeASponsor && section.becomeASponsor.length > 0 ? (
            <BecomeASponsorPreview section={section.becomeASponsor[0]} />
          ) : null
        );
      default:
        return null;
    }
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
          <option value="becomeASponsor">Become a Sponsor</option> {/* New option */}
        </select>

        {section?.sectionType === "sponsors" && (
          <SponsorSectionForm
            sponsors={section.sponsors || []}
            onUpdate={(data) => setSection({ ...section, sponsors: data })}
            onImageFileChange={handleImageFileChange}
          />
        )}

        {section?.sectionType === "fosters" && (
          <FosterSectionForm
            fosters={section.fosters || []}
            onUpdate={(data) => setSection({ ...section, fosters: data })}
            onImageFileChange={handleImageFileChange}
          />
        )}

        {section?.sectionType === "volunteers" && (
          <VolunteerSectionForm
            volunteers={section.volunteers || []}
            onUpdate={(data) => setSection({ ...section, volunteers: data })}
            onImageFileChange={handleImageFileChange}
          />
        )}

        {section?.sectionType === "becomeASponsor" && (
          <BecomeASponsorSectionForm
            becomeASponsor={section.becomeASponsor || []}
            onUpdate={(data) => setSection({ ...section, becomeASponsor: data })}
            onImageFileChange={(file, index) => handleImageFileChange(file, index)}
          />
        )}

        <button className="btn mt-3" onClick={handleSubmit}>
          Add Section
        </button>

        {section && (
          <div className="preview-section">
            <button
              type="button"
              className="btn mt-3 mb-3"
              onClick={togglePreviewVisibility}
            >
              {isPreviewVisible ? "Hide Preview" : "Show Preview"}
            </button>
            {isPreviewVisible && (
              <div className="preview-container">{renderPreview()}</div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AddOurSponsorSection;
