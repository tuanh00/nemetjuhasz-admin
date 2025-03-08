// src/pages/donation/DonationSectionList.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { DonationSection } from "../../firebase/types";
import {
  getDonationSections,
  deleteDonationSection,
} from "../../firebase/DonationService";
import { Link } from "react-router-dom";
import "../../styles/donation/_donationsectionlist.scss";

const DonationSectionList: React.FC = () => {
  const [sections, setSections] = useState<DonationSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1) Fetch donation sections from Firestore
  const fetchSections = async () => {
    try {
      const data = await getDonationSections();
      // Sort them by a custom order: donateSection -> donateItems -> becomeASponsor
      const customOrder = ["donateSection", "donateItems", "becomeASponsor"];
      const ordered = data.sort((a, b) => {
        const indexA = customOrder.indexOf(a.sectionType);
        const indexB = customOrder.indexOf(b.sectionType);
        return indexA - indexB; // smaller index => higher priority
      });
      setSections(ordered);
    } catch (err) {
      console.error("Failed to fetch donation sections:", err);
      setError("Failed to fetch donation sections.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  // 2) Handle delete
  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this donation section?")) {
      try {
        await deleteDonationSection(id);
        setSections((prev) => prev.filter((s) => s.id !== id));
        alert("Donation section deleted successfully.");
      } catch (err) {
        alert("Failed to delete the donation section.");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <Sidebar />
        <main>Loading donation sections...</main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <Sidebar />
        <main>{error}</main>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="donation-section-list-container">
        <h2>Donation Sections</h2>
        <Link to="/add-donation-section" className="btn add-btn">
          Add New Donation Section
        </Link>
        {sections.length === 0 ? (
          <p>No donation sections found.</p>
        ) : (
          <table className="sections-table">
            <thead>
              <tr>
                <th>Section Type</th>
                <th>English/Hungarian Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map((section) => {
                let enTitle = "";
                let huTitle = "";

                switch (section.sectionType) {
                  case "donateSection":
                    enTitle = section.donateSection?.englishTitle || "";
                    huTitle = section.donateSection?.hungarianTitle || "";
                    break;
                  case "donateItems":
                    enTitle = section.donateItems?.englishTitle || "";
                    huTitle = section.donateItems?.hungarianTitle || "";
                    break;
                  case "becomeASponsor":
                    enTitle = section.sponsor?.englishTitle || "";
                    huTitle = section.sponsor?.hungarianTitle || "";
                    break;
                  default:
                    break;
                }

                return (
                  <tr key={section.id}>
                    <td>{section.sectionType}</td>
                    <td>
                      {enTitle} / {huTitle}
                    </td>
                    <td>
                      <Link
                        to={`/edit-donation-section/${section.sectionType}/${section.id}`}
                        className="edit-btn"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(section.id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default DonationSectionList;
