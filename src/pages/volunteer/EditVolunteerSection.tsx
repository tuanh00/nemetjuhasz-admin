// src/pages/volunteer/EditVolunteerSection.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { VolunteerSection } from "../../firebase/types";
import {
  getVolunteerSection,
  updateVolunteerSection,
} from "../../firebase/VolunteerService";
import "../../styles/volunteer/_editvolunteersection.scss";

export default function EditVolunteerSection() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sec, setSec] = useState<VolunteerSection | null>(null);

  // 1) Load the existing section
  useEffect(() => {
    if (!id) return;
    getVolunteerSection(id).then((data) => setSec(data));
  }, [id]);

  // 2) Single source of truth: modify 'sec' directly
  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!sec) return;
    const { name, value } = e.target;
    setSec({ ...sec, [name]: value });
  };

  // 3) Bullet-array helpers
  const updateBullet = (
    lang: "EN" | "HU",
    field: "point" | "link",
    idx: number,
    value: string
  ) => {
    if (!sec) return;
    const pointsKey = lang === "EN" ? "bulletPointsEnglish" : "bulletPointsHungarian";
    const linksKey  = lang === "EN" ? "bulletLinksEnglish"  : "bulletLinksHungarian";
    const pts = [...(sec as any)[pointsKey]];
    const lks = [...(sec as any)[linksKey]];
    if (field === "point") pts[idx] = value;
    else                lks[idx] = value;
    setSec({
      ...sec,
      [pointsKey]: pts,
      [linksKey]:  lks,
    });
  };

  const removeBullet = (lang: "EN" | "HU", idx: number) => {
    if (!sec) return;
    const pointsKey = lang === "EN" ? "bulletPointsEnglish" : "bulletPointsHungarian";
    const linksKey  = lang === "EN" ? "bulletLinksEnglish"  : "bulletLinksHungarian";
    setSec({
      ...sec,
      [pointsKey]: (sec as any)[pointsKey].filter((_: any, i: number) => i !== idx),
      [linksKey]:  (sec as any)[linksKey].filter((_: any, i: number) => i !== idx),
    });
  };

  const addBullet = (lang: "EN" | "HU") => {
    if (!sec) return;
    const pointsKey = lang === "EN" ? "bulletPointsEnglish" : "bulletPointsHungarian";
    const linksKey  = lang === "EN" ? "bulletLinksEnglish"  : "bulletLinksHungarian";
    setSec({
      ...sec,
      [pointsKey]: [...(sec as any)[pointsKey], ""],
      [linksKey]:  [...(sec as any)[linksKey],  ""],
    });
  };

  // 4) Save & navigate
  const handleSave = async () => {
    if (!sec || !id) return;
    await updateVolunteerSection(id, sec);
    navigate("/volunteer-sections");  // <–– make sure this matches your Route path
  };

  if (!sec) return <p>Loading…</p>;

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="edit-volunteer-section">
        <h2>Edit Volunteer Section</h2>

        {/* Titles & subtitles */}
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
          value={(sec as any).subtitleEnglish}
          onChange={handleField}
        />

        <label>HU Subtitle</label>
        <textarea
          name="subtitleHungarian"
          rows={2}
          value={(sec as any).subtitleHungarian}
          onChange={handleField}
        />

        {/* Intro & closing */}
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

        {/* YouTube URL */}
        <label>YouTube URL</label>
        <input
          name="youtubeUrl"
          value={sec.youtubeUrl}
          onChange={handleField}
        />

        {/* EN Bullets */}
        <h3>Bullets & Links (EN)</h3>
        {sec.bulletPointsEnglish.map((point, i) => (
          <div className="bullet-row" key={`en-${i}`}>
            <input
              className="bullet-text"
              placeholder="Bullet text"
              value={point}
              onChange={(e) => updateBullet("EN", "point", i, e.target.value)}
            />
            <input
              className="bullet-link"
              placeholder="Optional link"
              value={sec.bulletLinksEnglish[i] || ""}
              onChange={(e) => updateBullet("EN", "link", i, e.target.value)}
            />
            <button
              type="button"
              className="remove-bullet"
              onClick={() => removeBullet("EN", i)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="btn add-bullet-btn" onClick={() => addBullet("EN")}>
          + Add EN Bullet
        </button>

        {/* HU Bullets */}
        <h3>Bullets & Links (HU)</h3>
        {sec.bulletPointsHungarian.map((point, i) => (
          <div className="bullet-row" key={`hu-${i}`}>
            <input
              className="bullet-text"
              placeholder="Pont szöveg"
              value={point}
              onChange={(e) => updateBullet("HU", "point", i, e.target.value)}
            />
            <input
              className="bullet-link"
              placeholder="Opciós link"
              value={sec.bulletLinksHungarian[i] || ""}
              onChange={(e) => updateBullet("HU", "link", i, e.target.value)}
            />
            <button
              type="button"
              className="remove-bullet"
              onClick={() => removeBullet("HU", i)}
            >
              Töröl
            </button>
          </div>
        ))}
        <button type="button" className="btn add-bullet-btn" onClick={() => addBullet("HU")}>
          + Add HU Bullet
        </button>

        {/* Save */}
        <button type="button" className="btn save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </main>
    </div>
  );
}
