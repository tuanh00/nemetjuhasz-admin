import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { OurSponsorSection } from "../../firebase/types";
import { getOurSponsorSections, deleteOurSponsorSection } from "../../firebase/OurSponsorService";

const OurSponsorSectionList: React.FC = () => {
  const [sections, setSections] = useState<OurSponsorSection[]>([]);

  useEffect(() => {
    const fetchSections = async () => {
      const data = await getOurSponsorSections();
      setSections(data);
    };
    fetchSections();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this section?")) {
      try {
        await deleteOurSponsorSection(id);
        setSections((prev) => prev.filter((section) => section.id !== id));
      } catch (error) {
        console.error("Error deleting section:", error);
      }
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="our-sponsor-section-list-container">
        <h2>Our Sponsor Sections</h2>
        <table>
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
                  <button onClick={() => handleDelete(section.id!)}>Delete</button>
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
