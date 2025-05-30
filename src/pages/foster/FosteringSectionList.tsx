import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { FosteringSection } from "../../firebase/types";
import {
  getFosteringSections,
  deleteFosteringSection,
} from "../../firebase/FosteringService";
import "../../styles/fostering/_fosteringsectionlist.scss";

export default function FosteringSectionList() {
  const [list, setList] = useState<FosteringSection[]>([]);

  useEffect(() => {
    getFosteringSections().then(setList);
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id || !window.confirm("Delete this section?")) return;
    await deleteFosteringSection(id);
    setList((l) => l.filter((s) => s.id !== id));
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="fostering-section-list">
        <h2>Manage Fostering Sections</h2>

        <Link to="/add-fostering-section" className="btn add-btn">
          + Add New
        </Link>

        {list.length === 0 ? (
          <p>No sections yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>EN Title</th>
                <th>HU Title</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((sec) => (
                <tr key={sec.id}>
                  <td>{sec.englishTitle}</td>
                  <td>{sec.hungarianTitle}</td>
                  <td>
                    <Link
                      to={`/edit-fostering-section/${sec.id}`}
                      className="edit-btn"
                    >
                      Edit
                    </Link>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(sec.id)}
                    >
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
}
