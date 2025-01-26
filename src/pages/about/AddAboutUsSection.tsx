import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation after submission
import Sidebar from "../../components/Sidebar";
import AboutUsSectionForm from "../sections/aboutUsForms/AboutUsSectionForm";
import AboutUsSectionPreview from "../previews/AboutUs/AboutUsSectionPreview"; // Import the Preview component
import { AboutUsSection } from "../../firebase/types";
import { addAboutUsSection } from "../../firebase/AboutUsService";
import "../../styles/aboutus/_addaboutussection.scss";

const AddAboutUsSection: React.FC = () => {
  const [aboutUs, setAboutUs] = useState<AboutUsSection>({
    englishTitle: "",
    hungarianTitle: "",
    subEnglishTitle: "",
    subHungarianTitle: "",
    imageUrl: "",
    contentEnglish: "",
    contentHungarian: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false); // State for showing preview

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate(); // For navigation after success

  // Validate form
  useEffect(() => {
    const hasEnglishTitle = aboutUs.englishTitle.trim() !== "";
    const hasHungarianTitle = aboutUs.hungarianTitle.trim() !== "";
    const hasEnglishContent = aboutUs.contentEnglish.trim() !== "";
    const hasHungarianContent = aboutUs.contentHungarian.trim() !== "";
    const hasImage = imageFile !== null;

    setIsFormValid(hasEnglishTitle && hasHungarianTitle && hasEnglishContent && hasHungarianContent && hasImage);
  }, [aboutUs, imageFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAboutUs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageFileChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      setAboutUs((prev) => ({
        ...prev,
        imageUrl: URL.createObjectURL(file), // Set the preview URL for the image
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addAboutUsSection(aboutUs, imageFile);

      // Redirect to `/aboutus-sections` after successful submission
      navigate("/aboutus-sections");
    } catch (error) {
      console.error("Failed to add About Us section:", error);
      alert("Failed to add the section. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePreviewVisibility = () => {
    setIsPreviewVisible((prev) => !prev); // Toggle preview visibility
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="add-aboutus-section-container">
        <h2>Add About Us Section</h2>
        <form onSubmit={handleSubmit}>
          <AboutUsSectionForm
            section={aboutUs}
            handleChange={handleChange}
            handleImageFileChange={handleImageFileChange}
            fileInputRef={fileInputRef}
          />
          <button
            type="submit"
            className="btn mt-3"
            disabled={loading || !isFormValid}
          >
            {loading ? "Adding..." : "Add Section"}
          </button>
        </form>

        {/* Preview Button and Section */}
        <div className="preview-section">
          <button
            type="button"
            className="btn mt-3"
            onClick={togglePreviewVisibility}
          >
            {isPreviewVisible ? "Hide Preview" : "Show Preview"}
          </button>

          {isPreviewVisible && (
            <div className="mt-3">
              <AboutUsSectionPreview section={aboutUs} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AddAboutUsSection;
