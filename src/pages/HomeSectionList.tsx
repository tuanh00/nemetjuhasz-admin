import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { HomeSection } from "../firebase/types";
import { getHomeSections, deleteHomeSection } from "../firebase/HomeService";
import { Link } from "react-router-dom";

const HomeSectionList: React.FC = () => {
  const [homeSections, setHomeSections] = useState<HomeSection[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchHomeSections = async () => {
      const sections = await getHomeSections();
      setHomeSections(sections);
    };
    fetchHomeSections();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this home section?")) {
      try {
        await deleteHomeSection(id);
        setHomeSections(homeSections.filter((section) => section.id !== id));
        setMessage("Home section deleted successfully.");
        setIsSuccess(true);
        setTimeout(() => setMessage(null), 3000);
      } catch (error) {
        console.error("Error deleting home section:", error);
        setMessage("Failed to delete home section.");
        setIsSuccess(false);
        setTimeout(() => setMessage(null), 3000);
      }
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="home-section-list-container">
        <h2>Manage Home Sections</h2>
        {message && (
          <p className={`message-box ${isSuccess ? "success" : "error"}`}>
            {message}
          </p>
        )}
        <table className="home-section-table">
          <thead>
            <tr>
              <th>Section Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {homeSections.map((section) => (
              <tr key={section.id}>
                <td>{section.sectionType}</td>
                <td>
                  <Link to={`/edit-home-section/${section.id}`}>
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

export default HomeSectionList;
