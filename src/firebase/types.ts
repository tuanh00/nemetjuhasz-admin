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

// export interface HomeSection {
//   id?: string; 
//   sectionType: string;
//   title: string;
//   content: string;
//   imgUrls: string[];
//   youtubeLink?: string;
//   hungarianTitle?: string;
//   hungarianContent?: string;
//   createdAt?: FieldValue; 
//   updatedAt?: FieldValue;
// }

export interface HeroSection {
  id?: string;
  sectionType: "hero";
  title: string;
  content: string;
  hungarianTitle: string;
  hungarianContent: string;
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

