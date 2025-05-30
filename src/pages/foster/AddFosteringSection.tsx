// src/pages/foster/AddFosteringSection.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { FosteringSection } from "../../firebase/types";
import { createFosteringSection } from "../../firebase/FosteringService";
import FosteringSectionPreview from "../previews/Fostering/FosteringSectionPreview";
import "../../styles/fostering/_addfosteringsection.scss";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getApp } from "firebase/app";

export default function AddFosteringSection() {
  const nav = useNavigate();
  const [sec, setSec] = useState<FosteringSection>({
    englishTitle: "",
    hungarianTitle: "",
    subtitleEnglish: "",
    subtitleHungarian: "",
    contentEnglish: "",
    contentHungarian: "",
    imgUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);

  const storage = getStorage(getApp());

  const handleField = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setSec((p) => ({ ...p, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setSec((p) => ({ ...p, imgUrl: "" }));
  };

  const handleRemoveImage = async () => {
    if (sec.imgUrl) {
      try {
        const path = decodeURIComponent(
          sec.imgUrl.split("/o/")[1].split("?")[0]
        );
        await deleteObject(ref(storage, path));
      } catch (err) {
        console.error("Failed to delete old image:", err);
      }
    }
    setFile(null);
    setPreviewUrl("");
    setSec((p) => ({ ...p, imgUrl: "" }));
  };

  const handleSave = async () => {
    let imageUrl = sec.imgUrl;
    if (file) {
      const fileRef = ref(storage, `fostering/${file.name}_${Date.now()}`);
      await uploadBytes(fileRef, file);
      imageUrl = await getDownloadURL(fileRef);
    }
    await createFosteringSection({ ...sec, imgUrl: imageUrl });
    nav("/fostering-sections");
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="add-fostering-section">
        <h2>Add Fostering Section</h2>

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

        <label>EN Content</label>
        <textarea
          name="contentEnglish"
          rows={4}
          value={sec.contentEnglish}
          onChange={handleField}
        />

        <label>HU Content</label>
        <textarea
          name="contentHungarian"
          rows={4}
          value={sec.contentHungarian}
          onChange={handleField}
        />

        <label>Image</label>
        <div className="image-upload">
          {!previewUrl ? (
            <input type="file" accept="image/*" onChange={handleFileChange} />
          ) : (
            <div className="image-preview">
              <img src={previewUrl} alt="Preview" />
              <button
                type="button"
                className="remove-btn"
                onClick={handleRemoveImage}
              >
                ×
              </button>
            </div>
          )}
        </div>

        <div className="preview-controls">
          <button
            className="btn preview-btn"
            onClick={() => setShowPreview((p) => !p)}
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>

        {showPreview && (
          <FosteringSectionPreview
            section={{ ...sec, imgUrl: previewUrl || sec.imgUrl }}
            lang="en"
          />
        )}

        <button className="btn save-btn" onClick={handleSave}>
          Save
        </button>
      </main>
    </div>
  );
}
