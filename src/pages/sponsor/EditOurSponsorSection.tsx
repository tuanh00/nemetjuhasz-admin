import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { OurSponsorSection } from "../../firebase/types";
import {
  getOurSponsorSection,
  updateOurSponsorSection,
} from "../../firebase/OurSponsorService";
import VolunteerSectionEdit from "../sections/sponsorForms/VolunteerSectionEdit";
import BecomeASponsorSectionEdit from "../sections/sponsorForms/BecomeASponsorSectionEdit";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/Firebase";

const EditOurSponsorSection: React.FC = () => {
  const { id, sectionType } = useParams<{ id: string; sectionType: string }>();
  const navigate = useNavigate();
  const [sponsorSection, setSponsorSection] = useState<OurSponsorSection | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchSponsorSection = async () => {
      if (id) {
        const section = await getOurSponsorSection(id);
        setSponsorSection(section);
      }
    };
    fetchSponsorSection();
  }, [id]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSaveChanges = async () => {
    if (!sponsorSection) return;

    try {
      await updateOurSponsorSection(id!, sponsorSection, []);
      setMessage("Changes saved successfully.");
      setIsSuccess(true);
      setTimeout(() => navigate("/our-sponsor-sections"), 3000);
    } catch (error) {
      console.error("Error saving changes:", error);
      setMessage("Failed to save changes.");
      setIsSuccess(false);
    }
  };

  const handleUploadImage = async (file: File, index: number) => {
    if (!sponsorSection) return;

    try {
      const storageRef = ref(storage, `${sectionType}/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      setSponsorSection((prev) => {
        if (!prev) return prev;

        // Type guard to ensure we only update the correct section type
        if (sectionType === "volunteers" && prev.volunteers) {
          const updatedVolunteers = [...prev.volunteers];
          updatedVolunteers[index].imageUrl = downloadUrl;
          return { ...prev, volunteers: updatedVolunteers };
        }

        if (sectionType === "becomeASponsor" && prev.becomeASponsor) {
          const updatedData = [...prev.becomeASponsor];
          updatedData[index].imageUrl = downloadUrl;
          return { ...prev, becomeASponsor: updatedData };
        }

        return prev; // Return the state unchanged if no matching section type
      });
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const renderSectionEditForm = () => {
    switch (sectionType) {
      case "volunteers":
        return (
          <VolunteerSectionEdit
            sectionData={sponsorSection?.volunteers || []}
            onUpdate={(updatedVolunteers) =>
              setSponsorSection((prev) =>
                prev ? { ...prev, volunteers: updatedVolunteers } : null
              )
            }
            onRemoveImage={(index) => {
              setSponsorSection((prev) => {
                if (!prev?.volunteers) return prev;
                const updatedVolunteers = [...prev.volunteers];
                updatedVolunteers[index].imageUrl = "";
                return { ...prev, volunteers: updatedVolunteers };
              });
            }}
            onUploadImage={handleUploadImage}
          />
        );
      case "becomeASponsor":
        return (
          <BecomeASponsorSectionEdit
            sectionData={sponsorSection?.becomeASponsor || []}
            onUpdate={(updatedData) =>
              setSponsorSection((prev) =>
                prev ? { ...prev, becomeASponsor: updatedData } : null
              )
            }
            onRemoveImage={(index) => {
              setSponsorSection((prev) => {
                if (!prev?.becomeASponsor) return prev;
                const updatedData = [...prev.becomeASponsor];
                updatedData[index].imageUrl = "";
                return { ...prev, becomeASponsor: updatedData };
              });
            }}
            onUploadImage={handleUploadImage}
          />
        );
      default:
        return <p>Unsupported section type</p>;
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="edit-sponsor-section-container">
        <h2>Edit {sectionType} Section</h2>
        {message && <p className={`message-box ${isSuccess ? "success" : "error"}`}>{message}</p>}
        {sponsorSection && renderSectionEditForm()}
        <button className="save-btn btn" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </main>
    </div>
  );
};

export default EditOurSponsorSection;
