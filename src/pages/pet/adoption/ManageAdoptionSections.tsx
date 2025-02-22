import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { AdoptionSection } from "../../../firebase/types";
import { getAdoptionSections, deleteAdoptionSection } from "../../../firebase/AdoptionService";
import EditAdoptionSection from "./EditAdoptionSection";
import "../../../styles/adoption/_manageadoptionsections.scss";

const ManageAdoptionSections: React.FC = () => {
  const [sections, setSections] = useState<AdoptionSection[]>([]);
  const [editingSection, setEditingSection] = useState<AdoptionSection | null>(null);

  useEffect(() => {
    const fetchSections = async (): Promise<void> => {
      const data = await getAdoptionSections();
      setSections(data);
    };
    fetchSections();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this adoption section?");
    if (confirmDelete) {
      try {
        await deleteAdoptionSection(id);
        setSections((prev) => prev.filter((section) => section.id !== id));
      } catch (error) {
        console.error("Error deleting section:", error);
      }
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="manage-adoption-container">
        <h2>Manage Adoption Sections</h2>

        {editingSection ? (
          <EditAdoptionSection section={editingSection} onClose={() => setEditingSection(null)} />
        ) : (
          <table className="adoption-section-table">
            <thead>
              <tr>
                <th>Section Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.id}>
                  <td>
                    {section.sectionType === "adoptionProcess"
                      ? section.adoptionProcess?.title
                      : section.successStories?.title}
                  </td>
                  <td>
                    <button type="button" className="edit-btn" onClick={() => setEditingSection(section)}>
                      Edit
                    </button>
                    <button type="button" className="delete-btn" onClick={() => handleDelete(section.id!)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default ManageAdoptionSections;
