import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { OurSponsorSection } from "../../firebase/types";
import {
  getOurSponsorSections,
  deleteOurSponsorSection,
} from "../../firebase/OurSponsorService";
import { Link } from "react-router-dom";
import "../../styles/aboutus/sponsors/_oursponsorsectionlist.scss";

const OurSponsorSectionList: React.FC = () => {
  const [sections, setSections] = useState<OurSponsorSection[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchSections = async () => {
      const fetchedSections = await getOurSponsorSections();
      setSections(fetchedSections);
    };
    fetchSections();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      try {
        await deleteOurSponsorSection(id);
        setSections(sections.filter((section) => section.id !== id));
        setMessage("Section deleted successfully.");
        setIsSuccess(true);
      } catch (error) {
        console.error("Error deleting section:", error);
        setMessage("Failed to delete section.");
        setIsSuccess(false);
      }
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="our-sponsor-section-list-container">
        <h2>Manage Sponsor Sections</h2>
        {message && (
          <p className={`message-box ${isSuccess ? "success" : "error"}`}>
            {message}
          </p>
        )}
        <table className="our-sponsor-section-table">
          <thead>
            <tr>
              <th>Section Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.id}>
                <td>{section.sectionType}</td>
                <td>
                  <Link to={`/edit-sponsor-section/${section.sectionType}/${section.id}`}>
                    <button className="edit-btn">Edit</button>
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(section.id!)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default OurSponsorSectionList;
