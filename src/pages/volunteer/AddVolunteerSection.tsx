// src/pages/volunteer/AddVolunteerSection.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { VolunteerSection } from "../../firebase/types";
import { createVolunteerSection } from "../../firebase/VolunteerService";
import VolunteerDescriptionPreview from "../previews/Volunteer/VolunteerDescriptionPreview";
import "../../styles/volunteer/_addvolunteersection.scss";

export default function AddVolunteerSection() {
  const nav = useNavigate();
  const [sec, setSec] = useState<VolunteerSection>({
    englishTitle: "",
    hungarianTitle: "",
    subtitleEnglish: "",
    subtitleHungarian: "",
    introEnglish: "",
    introHungarian: "",
    closingEnglish: "",
    closingHungarian: "",
    youtubeUrl: "",
    bulletPointsEnglish: [""],
    bulletLinksEnglish: [""],
    bulletPointsHungarian: [""],
    bulletLinksHungarian: [""],
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSec(prev => ({ ...prev, [name]: value }));
  };

  const handleAddBullet = (lang: "EN" | "HU") => {
    if (lang === "EN") {
      setSec(p => ({
        ...p,
        bulletPointsEnglish: [...p.bulletPointsEnglish, ""],
        bulletLinksEnglish: [...p.bulletLinksEnglish, ""],
      }));
    } else {
      setSec(p => ({
        ...p,
        bulletPointsHungarian: [...p.bulletPointsHungarian, ""],
        bulletLinksHungarian: [...p.bulletLinksHungarian, ""],
      }));
    }
  };

  const handleBulletChange = (
    idx: number,
    field: "point" | "link",
    lang: "EN" | "HU",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const val = e.target.value;
    if (lang === "EN") {
      const pts = [...sec.bulletPointsEnglish];
      const lks = [...sec.bulletLinksEnglish];
      field === "point" ? (pts[idx] = val) : (lks[idx] = val);
      setSec(p => ({ ...p, bulletPointsEnglish: pts, bulletLinksEnglish: lks }));
    } else {
      const pts = [...sec.bulletPointsHungarian];
      const lks = [...sec.bulletLinksHungarian];
      field === "point" ? (pts[idx] = val) : (lks[idx] = val);
      setSec(p => ({
        ...p,
        bulletPointsHungarian: pts,
        bulletLinksHungarian: lks,
      }));
    }
  };

  const handleRemoveBullet = (idx: number, lang: "EN" | "HU") => {
    if (lang === "EN") {
      setSec(p => ({
        ...p,
        bulletPointsEnglish: p.bulletPointsEnglish.filter((_, i) => i !== idx),
        bulletLinksEnglish: p.bulletLinksEnglish.filter((_, i) => i !== idx),
      }));
    } else {
      setSec(p => ({
        ...p,
        bulletPointsHungarian: p.bulletPointsHungarian.filter((_, i) => i !== idx),
        bulletLinksHungarian: p.bulletLinksHungarian.filter((_, i) => i !== idx),
      }));
    }
  };

  const handleSave = async () => {
    await createVolunteerSection(sec);
    nav("/volunteer-sections");
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="add-volunteer-section">
        <h2>Add Volunteer Section</h2>

        <label>EN Title</label>
        <input
          name="englishTitle"
          value={sec.englishTitle}
          onChange={handleField}
        />

        <label>HU Title</label>
        <input
          name="hungarianTitle"
          value={sec.hungarianTitle}
          onChange={handleField}
        />

        <label>EN Subtitle</label>
        <textarea
          name="subtitleEnglish"
          rows={2}
          value={sec.subtitleEnglish}
          onChange={handleField}
        />

        <label>HU Subtitle</label>
        <textarea
          name="subtitleHungarian"
          rows={2}
          value={sec.subtitleHungarian}
          onChange={handleField}
        />

        <label>Intro (EN)</label>
        <textarea
          name="introEnglish"
          rows={3}
          value={sec.introEnglish}
          onChange={handleField}
        />

        <label>Intro (HU)</label>
        <textarea
          name="introHungarian"
          rows={3}
          value={sec.introHungarian}
          onChange={handleField}
        />

        <label>Closing (EN)</label>
        <textarea
          name="closingEnglish"
          rows={3}
          value={sec.closingEnglish}
          onChange={handleField}
        />

        <label>Closing (HU)</label>
        <textarea
          name="closingHungarian"
          rows={3}
          value={sec.closingHungarian}
          onChange={handleField}
        />

        <label>YouTube URL</label>
        <input
          name="youtubeUrl"
          value={sec.youtubeUrl}
          onChange={handleField}
        />

        <h3>Bullets & Links (EN)</h3>
        {sec.bulletPointsEnglish.map((pt, i) => (
          <div className="bullet-row" key={`en-${i}`}>
            <input
              className="bullet-text"
              placeholder="Bullet text"
              value={pt}
              onChange={e => handleBulletChange(i, "point", "EN", e)}
            />
            <input
              className="bullet-link"
              placeholder="Optional link"
              value={sec.bulletLinksEnglish[i]}
              onChange={e => handleBulletChange(i, "link", "EN", e)}
            />
            <button
              className="remove-bullet"
              onClick={() => handleRemoveBullet(i, "EN")}
            >
              Remove
            </button>
          </div>
        ))}
        <button className="btn mb-3" onClick={() => handleAddBullet("EN")}>+ Add EN Bullet</button>

        <h3>Bullets & Links (HU)</h3>
        {sec.bulletPointsHungarian.map((pt, i) => (
          <div className="bullet-row" key={`hu-${i}`}>
            <input
              className="bullet-text"
              placeholder="Pont szöveg"
              value={pt}
              onChange={e => handleBulletChange(i, "point", "HU", e)}
            />
            <input
              className="bullet-link"
              placeholder="Opcionális link"
              value={sec.bulletLinksHungarian[i]}
              onChange={e => handleBulletChange(i, "link", "HU", e)}
            />
            <button
              className="remove-bullet"
              onClick={() => handleRemoveBullet(i, "HU")}
            >
              Töröl
            </button>
          </div>
        ))}
        <button className="btn mb-3" onClick={() => handleAddBullet("HU")}>+ Add HU Bullet</button>

        <button className="btn mb-3" onClick={() => setShowPreview(p => !p)}>
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>

        {showPreview && <VolunteerDescriptionPreview section={sec} />}

        <button className="btn" onClick={handleSave}>Save</button>
      </main>
    </div>
  );
}
