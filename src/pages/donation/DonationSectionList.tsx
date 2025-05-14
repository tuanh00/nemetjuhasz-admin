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
  const [loading, setLoading] = useState(true);

  // fetch & sort
  useEffect(() => {
    (async () => {
      const data = await getDonationSections();
      const order = ["donateSection", "donateItems", "becomeASponsor"];
      data.sort((a, b) => order.indexOf(a.sectionType) - order.indexOf(b.sectionType));
      setSections(data);
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (!window.confirm("Delete this section?")) return;
    await deleteDonationSection(id);
    setSections(s => s.filter(x => x.id !== id));
    alert("Deleted");
  };

  if (loading) {
    return (
      <div className="admin-container">
        <Sidebar />
        <main>Loading…</main>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="donation-section-list-container">
        <h2>Donation Sections</h2>
        <Link to="/add-donation-section" className="btn add-btn">
          + Add New
        </Link>

        {sections.length === 0 ? (
          <p>No sections yet.</p>
        ) : (
          <table className="sections-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>EN Title</th>
                <th>HU Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sections.map(sec => {
                const en =
                  sec.sectionType === "donateSection"
                    ? sec.donateSection?.englishTitle
                    : sec.sectionType === "donateItems"
                    ? sec.donateItems?.englishTitle
                    : sec.sponsor?.englishTitle;
                const hu =
                  sec.sectionType === "donateSection"
                    ? sec.donateSection?.hungarianTitle
                    : sec.sectionType === "donateItems"
                    ? sec.donateItems?.hungarianTitle
                    : sec.sponsor?.hungarianTitle;
                return (
                  <tr key={sec.id}>
                    <td>{sec.sectionType}</td>
                    <td>{en}</td>
                    <td>{hu}</td>
                    <td>
                      <Link
                        to={`/edit-donation-section/${sec.id}`}
                        className="edit-btn btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        className="delete-btn btn-sm"
                        onClick={() => handleDelete(sec.id)}
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