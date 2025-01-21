// AddHomeSection.tsx
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HeroSectionPreview from "./previews/HeroSectionPreview";
import FeatureSectionPreview from "./previews/FeatureSectionPreview";
import StorySectionPreview from "./previews/StorySectionPreview";
import FosterSectionPreview from "./previews/FosterSectionPreview";
import BreedSectionPreview from "./previews/BreedSectionPreview";
import SuccessSectionPreview from "./previews/SuccessSectionPreview";
import TestimonialSectionPreview from "./previews/TestimonialSectionPreview";
import HeroSectionForm from "./sections/sectionForms/HeroSectionForm";
import FeatureSectionForm from "./sections/sectionForms/FeatureSectionForm";
import StorySectionForm from "./sections/sectionForms/StorySectionForm";
import FosterSectionForm from "./sections/sectionForms/FosterSectionForm";
import BreedSectionForm from "./sections/sectionForms/BreedSectionForm";
import SuccessStorySectionForm from "./sections/sectionForms/SuccessStorySectionForm";
import TestimonialSectionForm from "./sections/sectionForms/TestimonialSectionForm";

import {
  HomeSection,
  HeroSection,
  FeaturesSection,
  StorySection,
  FosterSection,
  BreedSection,
  SuccessStorySection,
  TestimonialSection,
} from "../firebase/types";
import { addHomeSection } from "../firebase/HomeService";

const AddHomeSection: React.FC = () => {
  const [homeSection, setHomeSection] = useState<HomeSection | null>(null);
  const [imageFiles, setImageFiles] = useState<Array<File | undefined>>([undefined, undefined]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [isFormValid, setIsFormValid] = useState<boolean>(false); 

  // Validation 
  useEffect(() => {
    if(!homeSection) {
      setIsFormValid(false);
      return;
    }

    if (homeSection.sectionType === "hero") {
      const hero = homeSection as HeroSection;
      const hasTitle = hero.title.trim() !== "";
      const hasHungarianTitle = hero.hungarianTitle.trim() !== "";
      const hasImage = hero.imgUrl.trim() !== "";
      setIsFormValid(hasTitle && hasHungarianTitle && hasImage);
    }else {
      // For other sections, you can add similar validation or set to true if no specific validation is required
      setIsFormValid(true); // Adjust this as needed for other sections
    }
  }, [homeSection]);
  
  const handleSectionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    // Reset imageFiles and homeSection when section type changes
    setImageFiles([undefined, undefined]);
    setHomeSection(null);

    switch (value) {
      case "hero":
        setHomeSection({
          sectionType: "hero",
          title: "",
          hungarianTitle: "",
          imgUrl: "",
        } as HeroSection);
        break;
      case "features":
        setHomeSection({
          sectionType: "features",
          features: [
            {
              titleEnglish: "",
              titleHungarian: "",
              descriptionEnglish: "",
              descriptionHungarian: "",
            },
            {
              titleEnglish: "",
              titleHungarian: "",
              descriptionEnglish: "",
              descriptionHungarian: "",
            },
            {
              titleEnglish: "",
              titleHungarian: "",
              descriptionEnglish: "",
              descriptionHungarian: "",
            },
          ],
        } as FeaturesSection);
        break;
      case "story":
        setHomeSection({
          sectionType: "story",
          title: "",
          content: "",
          hungarianTitle: "",
          hungarianContent: "",
          youtubeLink: "",
        } as StorySection);
        break;
      case "foster":
        setHomeSection({
          sectionType: "foster",
          title: "",
          content: "",
          hungarianTitle: "",
          hungarianContent: "",
          imgUrl: "",
        } as FosterSection);
        break;
      case "breed":
        setHomeSection({
          sectionType: "breed",
          title: "",
          content: "",
          hungarianTitle: "",
          hungarianContent: "",
          imgUrl: "",
        } as BreedSection);
        break;
      case "successStory":
        setHomeSection({
          sectionType: "successStory",
          title: "",
          hungarianTitle: "",
          imgUrls: ["", ""],
          title1: "",
          title2: "",
          hungarianTitle1: "",
          hungarianTitle2: "",
        } as SuccessStorySection);
        break;
      case "testimonial":
        setHomeSection({
          sectionType: "testimonial",
          testimonials: [
            { imgUrl: "", contentEnglish: "", contentHungarian: "", author: "" },
            { imgUrl: "", contentEnglish: "", contentHungarian: "", author: "" },
            { imgUrl: "", contentEnglish: "", contentHungarian: "", author: "" },
          ],
        } as TestimonialSection);
        break;
      default:
        setHomeSection(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!homeSection) return;

    const { name, value } = e.target;

    setHomeSection((prev) => ({
      ...prev!,
      [name]: value,
    }));
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    if (homeSection && homeSection.sectionType === "features") {
      const updatedFeatures = [...homeSection.features];
      updatedFeatures[index] = { ...updatedFeatures[index], [field]: value };
      setHomeSection({ ...homeSection, features: updatedFeatures });
    }
  };

  const handleTestimonialChange = (index: number, field: string, value: string) => {
    if (homeSection && homeSection.sectionType === "testimonial") {
      const updatedTestimonials = [...homeSection.testimonials];
      updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
      setHomeSection({ ...homeSection, testimonials: updatedTestimonials });
    }
  };

  const handleTestimonialImageFileChange = (index: number, file: File | null) => {
    if (homeSection && homeSection.sectionType === "testimonial") {
      const updatedTestimonials = [...homeSection.testimonials];
      if (file) {
        updatedTestimonials[index].imgUrl = URL.createObjectURL(file); // Set imgUrl to preview URL
        setImageFiles((prevFiles) => {
          const updatedFiles = [...prevFiles];
          updatedFiles[index] = file;
          return updatedFiles;
        });
      } else {
        updatedTestimonials[index].imgUrl = "";
        setImageFiles((prevFiles) => {
          const updatedFiles = [...prevFiles];
          updatedFiles[index] = undefined; // Keep the index but set to undefined
          return updatedFiles;
        });
      }
      setHomeSection({ ...homeSection, testimonials: updatedTestimonials });
    }
  };

  const handleImageFileChange = (file: File | null) => {
    if (file) {
      setImageFiles([file]);
      if (
        homeSection &&
        (homeSection.sectionType === "hero" ||
          homeSection.sectionType === "foster" ||
          homeSection.sectionType === "breed")
      ) {
        setHomeSection((prevHomeSection) => {
          return {
            ...prevHomeSection!,
            imgUrl: URL.createObjectURL(file),
          } as typeof prevHomeSection;
        });
      }
    } else {
      setImageFiles([]);
      if (
        homeSection &&
        (homeSection.sectionType === "hero" ||
          homeSection.sectionType === "foster" ||
          homeSection.sectionType === "breed")
      ) {
        setHomeSection((prevHomeSection) => {
          return {
            ...prevHomeSection!,
            imgUrl: "",
          } as typeof prevHomeSection;
        });
      }
    }
  };

  const handleImageFilesChange = (files: Array<File | undefined>) => {
    setImageFiles(files);
    if (homeSection && homeSection.sectionType === "successStory") {
      const imgUrls = files.map((file) => (file ? URL.createObjectURL(file) : ""));
      setHomeSection((prevHomeSection) => {
        return {
          ...prevHomeSection!,
          imgUrls,
        } as typeof prevHomeSection;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeSection) return;

    setLoading(true);
    try {
      // Filter out undefined entries in imageFiles
      const validImageFiles = imageFiles.filter((file): file is File => file !== undefined);

      await addHomeSection(homeSection, validImageFiles);
      setMessage("Home section added successfully!");
      setIsSuccess(true);
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage("Failed to add home section.");
      setIsSuccess(false);
    } finally {
      setLoading(false);

      // Set timeout to clear message after 3 seconds
      setTimeout(() => {
        setMessage(null);
        setIsSuccess(null);
      }, 3000);
    }
  };

  const resetForm = () => {
    setHomeSection(null);
    setImageFiles([undefined, undefined]);
    setShowPreview(false);
    setIsFormValid(false);
  };

  const handlePreviewToggle = () => {
    setShowPreview((prev) => !prev);
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="add-home-section-container">
        <h2>Add New Home Section</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label>Section Type:</label>
            <select name="sectionType" onChange={handleSectionTypeChange} required>
              <option value="">Select Section Type</option>
              <option value="hero">Hero</option>
              <option value="features">Features</option>
              <option value="story">Story</option>
              <option value="foster">Foster</option>
              <option value="breed">Breed</option>
              <option value="successStory">Success Story</option>
              <option value="testimonial">Testimonial</option>
            </select>
          </div>

          {homeSection && homeSection.sectionType === "hero" && (
            <HeroSectionForm
              section={homeSection as HeroSection}
              handleChange={handleChange}
              handleImageFileChange={handleImageFileChange}
            />
          )}

          {homeSection && homeSection.sectionType === "features" && (
            <FeatureSectionForm
              section={homeSection as FeaturesSection}
              handleFeatureChange={handleFeatureChange}
            />
          )}

          {homeSection && homeSection.sectionType === "story" && (
            <StorySectionForm
              section={homeSection as StorySection}
              handleChange={handleChange}
            />
          )}

          {homeSection && homeSection.sectionType === "foster" && (
            <FosterSectionForm
              section={homeSection as FosterSection}
              handleChange={handleChange}
              handleImageFileChange={handleImageFileChange}
            />
          )}

          {homeSection && homeSection.sectionType === "breed" && (
            <BreedSectionForm
              section={homeSection as BreedSection}
              handleChange={handleChange}
              handleImageFileChange={handleImageFileChange}
            />
          )}

          {homeSection && homeSection.sectionType === "successStory" && (
            <SuccessStorySectionForm
              section={homeSection as SuccessStorySection}
              handleChange={(updatedSection) => setHomeSection(updatedSection)}
              handleImageFilesChange={handleImageFilesChange}
            />
          )}

          {homeSection && homeSection.sectionType === "testimonial" && (
            <TestimonialSectionForm
              section={homeSection as TestimonialSection}
              handleChange={handleTestimonialChange}
              handleImageFileChange={handleTestimonialImageFileChange}
            />
          )}

          <button type="submit" className="btn mt-3" disabled={loading || !isFormValid}>
            {loading ? "Adding..." : "Add Home Section"}
          </button>
        </form>
        <button type="button" className="btn mt-3" onClick={handlePreviewToggle}>
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>

        {/* Preview section */}
        {showPreview && homeSection && (
          <PreviewSection homeSection={homeSection} />
        )}
        {/* Display message box for success/failure */}
        {message && (
          <p className={`message-box ${isSuccess ? "success" : "error"}`}>
            {message}
          </p>
        )}
      </main>
    </div>
  );
};

export default AddHomeSection;

interface PreviewSectionProps {
  homeSection: HomeSection;
}

// The PreviewSection component displays previews based on section type
const PreviewSection: React.FC<PreviewSectionProps> = ({ homeSection }) => {
  return (
    <div className="preview-container">
      {/* Hero Section */}
      {homeSection.sectionType === "hero" && (
        <HeroSectionPreview section={homeSection as HeroSection} />
      )}

      {/* Features Section */}
      {homeSection.sectionType === "features" && (
        <FeatureSectionPreview section={homeSection as FeaturesSection} />
      )}

      {/* Story Section */}
      {homeSection.sectionType === "story" && (
        <StorySectionPreview section={homeSection as StorySection} />
      )}

      {/* Foster Section */}
      {homeSection.sectionType === "foster" && (
        <FosterSectionPreview section={homeSection as FosterSection} />
      )}

      {/* Breed Section */}
      {homeSection.sectionType === "breed" && (
        <BreedSectionPreview section={homeSection as BreedSection} />
      )}

      {/* Success Story Section */}
      {homeSection.sectionType === "successStory" && (
        <SuccessSectionPreview section={homeSection as SuccessStorySection} />
      )}

      {/* Testimonial Section */}
      {homeSection.sectionType === "testimonial" && (
        <TestimonialSectionPreview section={homeSection as TestimonialSection} />
      )}
    </div>
  );
};
