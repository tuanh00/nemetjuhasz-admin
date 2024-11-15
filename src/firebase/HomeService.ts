// HomeService.ts
import { db, storage } from "../firebase/Firebase";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { HomeSection, TestimonialSection } from "./types";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";

const homeSectionsCollection = collection(db, "home_sections");

// Add a new home section with optional images
export const addHomeSection = async (homeSection: HomeSection, imageFiles: Array<File | undefined>) => {
  try {
    if (homeSection.sectionType === "testimonial") {
      const testimonials = [...homeSection.testimonials];

      await Promise.all(
        imageFiles.map(async (imageFile, index) => {
          if (imageFile) {
            const storageRef = ref(storage, `home_sections/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            const downloadUrl = await getDownloadURL(storageRef);

            if (testimonials[index]) {
              testimonials[index].imgUrl = downloadUrl;
            }
          }
        })
      );

      homeSection = {
        ...homeSection,
        testimonials,
      };
    } else if (
      homeSection.sectionType === "hero" ||
      homeSection.sectionType === "foster" ||
      homeSection.sectionType === "breed"
    ) {
      if (imageFiles[0]) {
        const storageRef = ref(storage, `home_sections/${imageFiles[0].name}`);
        await uploadBytes(storageRef, imageFiles[0]);
        const imgUrl = await getDownloadURL(storageRef);
        homeSection = { ...homeSection, imgUrl };
      }
    } else if (homeSection.sectionType === "successStory") {
      const imgUrls = await Promise.all(
        imageFiles.slice(0, 2).map(async (imageFile) => {
          if (imageFile) {
            const storageRef = ref(storage, `home_sections/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            return await getDownloadURL(storageRef);
          }
          return null;
        })
      );

      const validImgUrls = imgUrls.filter((url): url is string => url !== null);
      homeSection = { ...homeSection, imgUrls: validImgUrls };
    }

    const docRef = await addDoc(homeSectionsCollection, homeSection);
    console.log("Document written with ID: ", docRef.id);
    console.log("homeSectionWithImages before addDoc:", homeSection);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

// Retrieve all home sections from the collection
export const getHomeSections = async (): Promise<HomeSection[]> => {
  try {
    const querySnapshot = await getDocs(homeSectionsCollection);
    const homeSections: HomeSection[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as HomeSection),
    }));
    return homeSections;
  } catch (e) {
    console.error("Error getting home sections: ", e);
    return [];
  }
};

// Retrieve a specific home section by its ID
export const getHomeSection = async (id: string): Promise<HomeSection | null> => {
  try {
    const docRef = doc(db, "home_sections", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as unknown as HomeSection) };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting home section: ", e);
    return null;
  }
};

// Update an existing home section with new data and optional images
export const updateHomeSection = async (
  id: string,
  homeSection: Partial<HomeSection>,
  imageFiles: Array<File | undefined> = []
) => {
  try {
    const docRef = doc(db, "home_sections", id);

    let updatedFields: Partial<HomeSection> = { ...homeSection };

    // Handle image upload based on section type
    if (imageFiles.length > 0) {
      if (
        homeSection.sectionType === "hero" ||
        homeSection.sectionType === "foster" ||
        homeSection.sectionType === "breed"
      ) {
        const file = imageFiles[0];
        if (file) {
          const storageRef = ref(storage, `home_sections/${file.name}`);
          await uploadBytes(storageRef, file);
          const imgUrl = await getDownloadURL(storageRef);
          updatedFields = { ...updatedFields, imgUrl } as typeof updatedFields & { imgUrl: string };
        }
      } else if (homeSection.sectionType === "successStory") {
        const newImgUrls = await Promise.all(
          imageFiles.slice(0, 2).map(async (file) => {
            if (file) {
              const storageRef = ref(storage, `home_sections/${file.name}`);
              await uploadBytes(storageRef, file);
              return await getDownloadURL(storageRef);
            }
            return null;
          })
        );

        const validImgUrls = newImgUrls.filter((url): url is string => url !== null);
        updatedFields = { ...updatedFields, imgUrls: validImgUrls } as typeof updatedFields & {
          imgUrls: string[];
        };
      } else if (homeSection.sectionType === "testimonial") {
        const testimonialSection = homeSection as Partial<TestimonialSection>;
        const updatedTestimonials = [...(testimonialSection.testimonials || [])];

        await Promise.all(
          imageFiles.map(async (file, index) => {
            if (file && updatedTestimonials[index]) {
              const storageRef = ref(storage, `home_sections/${file.name}`);
              await uploadBytes(storageRef, file);
              const imgUrl = await getDownloadURL(storageRef);
              updatedTestimonials[index].imgUrl = imgUrl;
            }
          })
        );

        updatedFields = { ...updatedFields, testimonials: updatedTestimonials } as Partial<
          TestimonialSection
        >;
      }
    }

    // Update the document in Firestore
    await updateDoc(docRef, updatedFields);
    console.log("Document updated successfully with ID: ", docRef.id);
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

// Delete a specific home section by its ID
export const deleteHomeSection = async (id: string) => {
  try {
    const docRef = doc(db, "home_sections", id);
    await deleteDoc(docRef);
    console.log("Document deleted with ID: ", id);
  } catch (e) {
    console.error("Error deleting document: ", e);
  }
};

// Delete a specific image from a home section by image URL
export const deleteHomeSectionImage = async (imageUrl: string, sectionId: string) => {
  try {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log("Image deleted from storage");

    const docRef = doc(db, "home_sections", sectionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const homeSection = docSnap.data() as HomeSection;

      if (
        (homeSection.sectionType === "hero" ||
          homeSection.sectionType === "foster" ||
          homeSection.sectionType === "breed") &&
        "imgUrl" in homeSection
      ) {
        // Sections with single imgUrl
        await updateDoc(docRef, { imgUrl: "" });
      } else if (homeSection.sectionType === "successStory" && "imgUrls" in homeSection) {
        // SuccessStory section with imgUrls array
        const updatedImgUrls = homeSection.imgUrls.filter((url) => url !== imageUrl);
        await updateDoc(docRef, { imgUrls: updatedImgUrls });
      } else if (homeSection.sectionType === "testimonial" && "testimonials" in homeSection) {
        // Testimonial section
        const testimonials = homeSection.testimonials.map((testimonial: any) => {
          if (testimonial.imgUrl === imageUrl) {
            return { ...testimonial, imgUrl: "" };
          } else {
            return testimonial;
          }
        });
        await updateDoc(docRef, { testimonials });
      }
      console.log("Image URL removed from document");
    }
  } catch (e) {
    console.error("Error deleting image: ", e);
  }
};
