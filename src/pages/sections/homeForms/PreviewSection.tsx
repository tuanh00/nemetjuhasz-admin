import React from "react";
import {
  HomeSection,
  HeroSection,
  FeaturesSection,
  StorySection,
  FosterSection,
  BreedSection,
  SuccessStorySection,
  TestimonialSection,
} from "../../../firebase/types";
import BreedSectionPreview from "../../previews/Home/BreedSectionPreview";
import FeatureSectionPreview from "../../previews/Home/FeatureSectionPreview";
import FosterSectionPreview from "../../previews/Home/FosterSectionPreview";
import HeroSectionPreview from "../../previews/Home/HeroSectionPreview";
import StorySectionPreview from "../../previews/Home/StorySectionPreview";
import SuccessSectionPreview from "../../previews/Home/SuccessSectionPreview";
import TestimonialSectionPreview from "../../previews/Home/TestimonialSectionPreview";

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
        <TestimonialSectionPreview
          section={homeSection as TestimonialSection}
        />
      )}
    </div>
  );
};

export default PreviewSection;
