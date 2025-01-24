// pages/about/AboutUsSectionList.tsx

import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { AboutUsSection } from "../../firebase/types";
import { getAboutUsSections, deleteAboutUsSection } from "../../firebase/AboutUsService";
import { Link } from "react-router-dom";
import "../../styles/_aboutussectionlist.scss"; // Ensure this SCSS file exists

const AboutUsSectionList: React.FC = () => {
  const [sections, setSections] = useState<AboutUsSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = async () => {
    try {
      const data = await getAboutUsSections();
      setSections(data);
    } catch (err) {
      setError("Failed to fetch About Us sections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this About Us section?")) {
      try {
        await deleteAboutUsSection(id);
        setSections(sections.filter((section) => section.id !== id));
        alert("Section deleted successfully.");
      } catch (err) {
        alert("Failed to delete the section.");
      }
    }
  };

  if (loading) return (
    <div className="admin-container">
      <Sidebar />
      <main>Loading...</main>
    </div>
  );

  if (error) return (
    <div className="admin-container">
      <Sidebar />
      <main>{error}</main>
    </div>
  );

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="aboutus-section-list-container">
        <h2>About Us Sections</h2>
        <Link to="/add-aboutus-section" className="btn add-btn">Add New Section</Link>
        {sections.length === 0 ? (
          <p>No About Us sections found.</p>
        ) : (
          <table className="sections-table">
            <thead>
              <tr>
                <th>English Title</th>
                <th>Hungarian Title</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => (
                <tr key={section.id}>
                  <td>{section.englishTitle}</td>
                  <td>{section.hungarianTitle}</td>
                  <td>
                    {section.imageUrl ? (
                      <img src={section.imageUrl} alt="Section" className="section-image" />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>
                    <Link to={`/edit-aboutus-section/${section.id}`} className="edit-btn">Edit</Link>
                    <button onClick={() => handleDelete(section.id)} className="delete-btn">Delete</button>
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

export default AboutUsSectionList;
