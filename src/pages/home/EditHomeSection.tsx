// EditHomeSection.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import {
  HomeSection,
  HeroSection,
  FeaturesSection,
  StorySection,
  BreedSection,
  FosterSection,
  SuccessStorySection,
  TestimonialSection,
} from "../../firebase/types";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/Firebase";
import { getHomeSection } from "../../firebase/HomeService";
import HeroSectionEdit from "../sections/editHomeForms/HeroSection";
import FeaturesSectionEdit from "../sections/editHomeForms/FeaturesSection";
import StorySectionEdit from "../sections/editHomeForms/StorySection";
import FosterSectionEdit from "../sections/editHomeForms/FosterSection";
import BreedSectionEdit from "../sections/editHomeForms/BreedSection";
import SuccessSectionEdit from "../sections/editHomeForms/SuccessSection";
import TestimonialSectionEdit from "../sections/editHomeForms/TestimonialSection";

const EditHomeSection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [homeSection, setHomeSection] = useState<HomeSection | null>(null);

  useEffect(() => {
    const fetchHomeSection = async () => {
      if (id) {
        const section = await getHomeSection(id);
        setHomeSection(section);
      }
    };
    fetchHomeSection();
  }, [id]);

  const handleUploadImage = async (file: File, index?: number) => {
    try {
      const storageRef = ref(storage, `home_sections/${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      setHomeSection((prevSection) => {
        if (!prevSection) return null;

        if (
          prevSection.sectionType === "hero" ||
          prevSection.sectionType === "foster" ||
          prevSection.sectionType === "breed"
        ) {
          return { ...prevSection, imgUrl: downloadUrl };
        } else if (
          prevSection.sectionType === "successStory" &&
          typeof index === "number"
        ) {
          const successStorySection = prevSection as SuccessStorySection;
          const updatedImgUrls = [...(successStorySection.imgUrls || ["", ""])];
          updatedImgUrls[index] = downloadUrl;
          return { ...successStorySection, imgUrls: updatedImgUrls };
        } else if (
          prevSection.sectionType === "testimonial" &&
          typeof index === "number"
        ) {
          const testimonialSection = prevSection as TestimonialSection;
          const updatedTestimonials = [...testimonialSection.testimonials];
          updatedTestimonials[index] = {
            ...updatedTestimonials[index],
            imgUrl: downloadUrl,
          };
          return { ...testimonialSection, testimonials: updatedTestimonials };
        }

        return prevSection;
      });
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="edit-home-section-container">
        <h2>Edit Home Section</h2>

        {homeSection && homeSection.sectionType === "hero" && (
          <HeroSectionEdit
            sectionData={homeSection as HeroSection}
            onUpdate={setHomeSection}
            onUploadImage={handleUploadImage}
          />
        )}
        {homeSection && homeSection.sectionType === "features" && (
          <FeaturesSectionEdit
            sectionData={homeSection as FeaturesSection}
            onUpdate={setHomeSection}
          />
        )}
        {homeSection && homeSection.sectionType === "story" && (
          <StorySectionEdit
            sectionData={homeSection as StorySection}
            onUpdate={setHomeSection}
          />
        )}
        {homeSection && homeSection.sectionType === "foster" && (
          <FosterSectionEdit
            sectionData={homeSection as FosterSection}
            onUpdate={setHomeSection}
            onUploadImage={handleUploadImage}
          />
        )}
        {homeSection && homeSection.sectionType === "breed" && (
          <BreedSectionEdit
            sectionData={homeSection as BreedSection}
            onUpdate={setHomeSection}
            onUploadImage={handleUploadImage}
          />
        )}
        {homeSection && homeSection.sectionType === "successStory" && (
          <SuccessSectionEdit
            sectionData={homeSection as SuccessStorySection}
            onUpdate={setHomeSection}
            onUploadImage={(file, index) => handleUploadImage(file, index)}
          />
        )}
        {homeSection && homeSection.sectionType === "testimonial" && (
          <TestimonialSectionEdit
            sectionData={homeSection as TestimonialSection}
            onUpdate={setHomeSection}
            onUploadImage={(file, index) => handleUploadImage(file, index)}
          />
        )}
      </main>
    </div>
  );
};

export default EditHomeSection;
