// src/pages/volunteer/VolunteerSectionList.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { VolunteerSection } from "../../firebase/types";
import {
  getVolunteerSections,
  deleteVolunteerSection,
} from "../../firebase/VolunteerService";
import "../../styles/volunteer/_volunteersectionlist.scss";

export default function VolunteerSectionList() {
  const [sections, setSections] = useState<VolunteerSection[]>([]);
  useEffect(() => {
    getVolunteerSections().then(setSections);
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm("Are you sure you want to delete this section?")) {
      return;
    }
    await deleteVolunteerSection(id);
    setSections(s => s.filter(x => x.id !== id));
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="volunteer-section-list">
        <h2>Manage Volunteer Sections</h2>
        <Link to="/add-volunteer-section" className="add-btn">
          + Add New
        </Link>
        <table>
          <thead>
            <tr>
              <th>EN Title</th>
              <th>HU Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sections.map(sec => (
              <tr key={sec.id}>
                <td>{sec.englishTitle}</td>
                <td>{sec.hungarianTitle}</td>
                <td>
                  <Link to={`/edit-volunteer-section/${sec.id}`} className="edit-btn">
                    Edit
                  </Link>
                  <button className="delete-btn" onClick={() => handleDelete(sec.id)}>
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
}
