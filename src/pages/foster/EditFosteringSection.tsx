// src/pages/foster/EditFosteringSection.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { FosteringSection } from "../../firebase/types";
import {
  getFosteringSection,
  updateFosteringSection,
} from "../../firebase/FosteringService";
import "../../styles/fostering/_editfosteringsection.scss";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { getApp } from "firebase/app";

export default function EditFosteringSection() {
  const { id } = useParams<{ id: string }>();
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
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const storage = getStorage(getApp());

  useEffect(() => {
    if (id) {
      getFosteringSection(id).then((data) => {
        setSec(data);
        setPreviewUrl(data.imgUrl);
      });
    }
  }, [id]);

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
    try {
      let imageUrl = sec.imgUrl;
      if (file) {
        const fileRef = ref(storage, `fostering/${file.name}_${Date.now()}`);
        await uploadBytes(fileRef, file);
        imageUrl = await getDownloadURL(fileRef);
      }
      await updateFosteringSection(id!, { ...sec, imgUrl: imageUrl });
      setSuccessMsg("Section updated successfully!");
      setErrorMsg("");
      setTimeout(() => nav("/fostering-sections"), 1500);
    } catch (error) {
      console.error("Error updating section:", error);
      setErrorMsg("Failed to update section. Please try again.");
      setSuccessMsg("");
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="edit-fostering-section">
        <h2>Edit Fostering Section</h2>
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
        <button className="btn save-btn" onClick={handleSave}>
          Save Changes
        </button>
        {successMsg && <p className="success-message">{successMsg}</p>}
        {errorMsg && <p className="error-message">{errorMsg}</p>}{" "}
      </main>
    </div>
  );
}
