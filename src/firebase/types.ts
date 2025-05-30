import { FieldValue } from "firebase/firestore"; // Import FieldValue

export interface Pet {
  id?: string;
  img_urls: string[];
  name: string;
  age: number;
  age_type: string;
  type: string;
  status: boolean;
  title: string;
  content: string;
  createdAt?: FieldValue; 
  hungarianContent: string;
  hungarianTitle: string;
}

export interface AdoptablePet {
  id?: string; 
  petId: string; 
  img_urls: string[]; 
  title: string; 
  content: string; 
}

// HOME SECTION TYPES
export interface HeroSection {
  id?: string;
  sectionType: "hero";
  title: string;
  hungarianTitle: string;
  imgUrl: string;
}

export interface FeaturesSection {
  id?: string;
  sectionType: "features";
  //features: Array<{ title: string; description: string }>;
  features: Array<{titleEnglish: string, titleHungarian: string, descriptionEnglish: string, descriptionHungarian: string}>;
}

export interface StorySection {
  id?: string;
  sectionType: "story";
  title: string;
  content: string;
  hungarianTitle: string;
  hungarianContent: string;
  youtubeLink: string;
}

export interface FosterSection {
  id?: string;
  sectionType: "foster";
  title: string;
  content: string;
  hungarianTitle: string;
  hungarianContent: string;
  imgUrl: string;
}

export interface BreedSection {
  id?: string;
  sectionType: "breed";
  title: string;
  content: string;
  hungarianTitle: string;
  hungarianContent: string;
  imgUrl: string;
}

export interface SuccessStorySection {
  id?: string;
  sectionType: "successStory";
  imgUrls: string[];
  title: string;
  hungarianTitle: string;
  title1: string; 
  title2: string;  
  hungarianTitle1: string;
  hungarianTitle2: string;
}

export interface TestimonialSection {
  id?: string;
  sectionType: "testimonial";
  testimonials: Array<{
    imgUrl: string;
    contentEnglish: string;
    contentHungarian: string;
    author: string;
  }>;
}

export type HomeSection = HeroSection | FeaturesSection | StorySection | FosterSection | BreedSection | SuccessStorySection | TestimonialSection;

// END OF HOME SECTION TYPES

// ABOUT US SECTION TYPES
export interface AboutUsSection {
  id?: string;
  englishTitle: string;
  hungarianTitle: string;
  subEnglishTitle?: string;
  subHungarianTitle?: string;
  imageUrl: string;
  contentEnglish: string;
  contentHungarian: string;
}

//END ABOUT US SECTION TYPES

//OUR SPONSOR SECTION TYPES
export interface Sponsor {
  imageUrl: string;
  linkTitle: string;
  link: string;
}

export interface Foster {
  imageUrl: string;
  fosterName: string;
}

export interface Volunteer {
  imageUrl: string;
  volunteerName: string;
}

export interface BecomeASponsor {
  titleEnglish: string;
  titleHungarian: string;
  contentEnglish: string;
  contentHungarian: string;
  imageUrl: string;
}

export interface OurSponsorSection {
  id?: string;
  sectionType: "sponsors" | "fosters" | "volunteers" | "becomeASponsor";
  sponsors?: Sponsor[];
  fosters?: Foster[];
  volunteers?: Volunteer[];
  becomeASponsor?: BecomeASponsor[];
}
//END OUR SPONSOR SECTION TYPES

//START ADOPTION SECTION TYPES
export interface AdoptionSection {
  id?: string;
  sectionType: "adoptionProcess" | "successStories" | "becomeAFoster";
  adoptionProcess?: AdoptionProcessSection;
  successStories?: SuccessStoriesSection;
  becomeAFoster?: BecomeAFosterSection;
}

export interface AdoptionProcessSection {
  title: string;
  hungarianTitle: string;
  subtitle: string;
  hungarianSubtitle: string;
  content: string;
  hungarianContent: string;
  imageUrl: string;
  englishButtonTitle: string;
  hungarianButtonTitle: string;
  buttonLink: string;
}

export interface SuccessStoriesSection {
  title: string;
  hungarianTitle: string;
  images: {
    englishImageTitle: string;
    hungarianImageTitle: string;
    firstImageUrl: string;  
    secondImageUrl: string; 
    link: string;
  }[];
}

export interface BecomeAFosterSection {
 englishTitle: string;
 hungarianTitle: string;
 englishContent: string;
 hungarianContent: string;
 englishButtonTitle: string;
 hungarianButtonTitle: string;
 buttonLink: string;
}
//END ADOPTION SECTION TYPES

//START DONATION SECTION TYPES
export interface DonationSection {
  id?: string;
  sectionType: "donateSection" | "donateItems" | "becomeASponsor";

  // For the "donateSection" type:
  donateSection?: DonateSection;
  
  // For "donateItems" type:
  donateItems?: DonateItems;
  
  // For "becomeASponsor" type:
  sponsor?: SponsorDonation;
}

// START DONATION SECTION TYPES
export interface DonationSection {
  id?: string;
  sectionType: "donateSection" | "donateItems" | "becomeASponsor";

  // For the "donate" type:
  donateSection?: DonateSection;
  
  // For "donateItems" type:
  donateItems?: DonateItems;
  
  // For "becomeASponsor" type:
  sponsor?: SponsorDonation;
}

/**
 * For the main donation info (sectionType = "donateSection")
 */
export interface DonateSection {
  // Title for EN and HU
  englishTitle: string;
  hungarianTitle: string;

  // Main body text
  englishContent: string;
  hungarianContent: string;

  // New fields for an intro paragraph and a closing paragraph in each language
  introEnglish: string;
  introHungarian: string;
  closingEnglish: string;
  closingHungarian: string;

  // Single optional image
  imageUrl?: string;

  // A bullet list for each language
  bulletPointsEnglish: string[];  
  bulletPointsHungarian: string[];

  // Matching optional links
  bulletLinksEnglish?: string[];
  bulletLinksHungarian?: string[];
}

// DonateItems and SponsorDonation remain unchanged except for normal usage:
export interface DonateItems {
  englishTitle: string;
  hungarianTitle: string;
  englishIntro: string;
  hungarianIntro: string;
  imageUrl?: string;

  // 1) Food items section
  foodSection: {
    englishSectionTitle: string;
    hungarianSectionTitle: string;
    englishBullets: string[];
    hungarianBullets: string[];
  };

  // 2) Accessories & toys section
  accessorySection: {
    englishSectionTitle: string;
    hungarianSectionTitle: string;
    englishBullets: string[];
    hungarianBullets: string[];
  };
}

export interface SponsorDonation {
  imageUrl?: string;
  englishTitle: string;
  hungarianTitle: string;
  contentEnglish: string;
  contentHungarian: string;
  englishButtonTitle?: string;
  hungarianButtonTitle?: string;
  englishButtonLink?: string;
  hungarianButtonLink?: string;
}
// END DONATION SECTION TYPES
//START VOLUNTEER SECTION TYPES
export interface VolunteerSection {
  id?: string;
  englishTitle: string;
  hungarianTitle: string;
  subtitleEnglish: string;
  subtitleHungarian: string;
  introEnglish: string;
  introHungarian: string;
  closingEnglish: string;
  closingHungarian: string;
  youtubeUrl: string;
  bulletPointsEnglish: string[];
  bulletLinksEnglish: string[];
  bulletPointsHungarian: string[];
  bulletLinksHungarian: string[];
}
//END VOLUNTEER SECTION TYPES
//START FOSTERING SECTION TYPES
export interface FosteringSection {
  id?: string;
  englishTitle: string;
  hungarianTitle: string;
  subtitleEnglish?: string;
  subtitleHungarian?: string;
  contentEnglish: string;
  contentHungarian: string;
  imgUrl: string;
}
//END FOSTERING SECTION TYPES