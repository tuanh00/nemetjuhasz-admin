import React from "react";
import { HomeSection, HeroSection, FeaturesSection, StorySection, FosterSection, BreedSection, SuccessStorySection, TestimonialSection } from "../../../firebase/types";
import BreedSectionPreview from "../../previews/BreedSectionPreview";
import FeatureSectionPreview from "../../previews/FeatureSectionPreview";
import FosterSectionPreview from "../../previews/FosterSectionPreview";
import HeroSectionPreview from "../../previews/HeroSectionPreview";
import StorySectionPreview from "../../previews/StorySectionPreview";
import SuccessSectionPreview from "../../previews/SuccessSectionPreview";
import TestimonialSectionPreview from "../../previews/TestimonialSectionPreview";

interface PreviewSectionProps {
  homeSection: HomeSection;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ homeSection }) => {
  return (
    <div className="preview-container">
      {homeSection.sectionType === "hero" && (
        <HeroSectionPreview section={homeSection as HeroSection} />
      )}
      {homeSection.sectionType === "features" && (
        <FeatureSectionPreview section={homeSection as FeaturesSection} />
      )}
      {homeSection.sectionType === "story" && (
        <StorySectionPreview section={homeSection as StorySection} />
      )}
      {homeSection.sectionType === "foster" && (
        <FosterSectionPreview section={homeSection as FosterSection} />
      )}
      {homeSection.sectionType === "breed" && (
        <BreedSectionPreview section={homeSection as BreedSection} />
      )}
      {homeSection.sectionType === "successStory" && (
        <SuccessSectionPreview section={homeSection as SuccessStorySection} />
      )}
      {homeSection.sectionType === "testimonial" && (
        <TestimonialSectionPreview section={homeSection as TestimonialSection} />
      )}
    </div>
  );
};

export default PreviewSection;
