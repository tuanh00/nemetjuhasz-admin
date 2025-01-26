import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteObject, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../firebase/Firebase";
import { getAboutUsSection } from "../../firebase/AboutUsService";
import { AboutUsSection } from "../../firebase/types";
import Sidebar from "../../components/Sidebar";
import "../../styles/aboutus/_editaboutussection.scss";

const EditAboutUsSection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [aboutUs, setAboutUs] = useState<AboutUsSection | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchSection = async () => {
      if (id) {
        try {
          const section = await getAboutUsSection(id);
          if (section) {
            setAboutUs(section);
            setPreview(section.imageUrl || null);
          } else {
            setMessage("Section not found.");
            setIsSuccess(false);
          }
        } catch (error) {
          console.error("Error fetching section:", error);
          setMessage("Failed to fetch section.");
          setIsSuccess(false);
        }
      }
    };
    fetchSection();
  }, [id]);

  // Automatically clear messages after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setIsSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Form validation
  useEffect(() => {
    if (aboutUs) {
      const hasRequiredFields =
        aboutUs.englishTitle.trim() &&
        aboutUs.hungarianTitle.trim() &&
        aboutUs.contentEnglish.trim() &&
        aboutUs.contentHungarian.trim() &&
        (preview || newImageFile);

      setIsFormValid(Boolean(hasRequiredFields));
    }
  }, [aboutUs, preview, newImageFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (aboutUs) {
      setAboutUs({ ...aboutUs, [name]: value });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreview(URL.createObjectURL(file));
      setNewImageFile(file);
    }
  };

  const handleRemoveImageClick = async () => {
    if (!aboutUs?.id || !aboutUs.imageUrl) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this image?");
    if (!confirmDelete) return;

    try {
      const imageRef = ref(storage, aboutUs.imageUrl);
      await deleteObject(imageRef);

      const docRef = doc(db, "about_us", aboutUs.id);
      await updateDoc(docRef, { imageUrl: "" });

      setPreview(null);
      setAboutUs({ ...aboutUs, imageUrl: "" });
      setMessage("Image deleted successfully.");
      setIsSuccess(true);
    } catch (error) {
      console.error("Error deleting image:", error);
      setMessage("Failed to delete image.");
      setIsSuccess(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!aboutUs || !id) {
      setMessage("Section data is incomplete.");
      setIsSuccess(false);
      return;
    }
  
    try {
      const docRef = doc(db, "about_us", id);
      const updatedData = { ...aboutUs };
  
      if (newImageFile) {
        // Upload new image to Firebase Storage
        const storageRef = ref(storage, `about_us/${newImageFile.name}`);
        const uploadResult = await uploadBytes(storageRef, newImageFile);
        const imageUrl = await getDownloadURL(uploadResult.ref);
  
        updatedData.imageUrl = imageUrl;
      }
  
      await updateDoc(docRef, updatedData);
  
      setMessage("Section updated successfully.");
      setIsSuccess(true);
      setTimeout(() => navigate("/aboutus-sections"), 2000);
    } catch (error) {
      console.error("Error saving changes:", error);
      setMessage("Failed to save changes.");
      setIsSuccess(false);
    }
  };
  

  if (!aboutUs) {
    return <p>Loading...</p>;
  }

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="edit-aboutus-section-container">
        <h2>Edit About Us Section</h2>
        <div className="form-container">
          <div className="input-box">
            <label>English Title</label>
            <input
              type="text"
              name="englishTitle"
              value={aboutUs.englishTitle}
              onChange={handleChange}
              required
            />
             </div>
            {/* English subtitle */}
            <div className="input-box">
            <label>Sub English Title</label>
            <input
              type="text"
              name="subEnglishTitle"
              value={aboutUs.subEnglishTitle}
              onChange={handleChange}
              required
            />
            </div>
          <div className="input-box">
            <label>Hungarian Title</label>
            <input
              type="text"
              name="hungarianTitle"
              value={aboutUs.hungarianTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <label>Sub Hungarian Title</label>
            <input
              type="text"
              name="subHungarianTitle"
              value={aboutUs.subHungarianTitle}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-box">
            <label>English Content</label>
            <textarea
              name="contentEnglish"
              value={aboutUs.contentEnglish}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="input-box">
            <label>Hungarian Content</label>
            <textarea
              name="contentHungarian"
              value={aboutUs.contentHungarian}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <div className="input-box">
            <label>Image</label>
            {/* handleRemoveImageClick */}
            {preview ? (
              <div className="image-preview-grid">
              <div className="image-preview">
                <img src={preview} alt="Preview" />
                <button type="button" className="remove-btn" onClick={handleRemoveImageClick}>
                  X
                </button>
              </div>
            </div>  
            ) : (
              <input type="file" accept="image/*" onChange={handleImageChange} />
            )}
          </div>
        </div>
        <button onClick={handleSaveChanges} className="btn save-btn" disabled={!isFormValid}>
          Save Changes
        </button>
        {message && <p className={`message-box ${isSuccess ? "success" : "error"}`}>{message}</p>}
      </main>
    </div>
  );
};

export default EditAboutUsSection;
