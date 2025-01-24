// firebase/AboutUsService.ts
import { db, storage } from "./Firebase";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { AboutUsSection } from "./types";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";

// Reference to the 'about_us' collection
const aboutUsCollection = collection(db, "about_us");

/**
 * Add a new About Us section with an optional image.
 * @param aboutUs - The AboutUsSection object containing section data.
 * @param imageFile - The image file to upload (optional).
 */
export const addAboutUsSection = async (
  aboutUs: AboutUsSection,
  imageFile: File | null
): Promise<void> => {
  try {
    if (imageFile) {
      const storageRef = ref(storage, `about_us/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const imageUrl = await getDownloadURL(storageRef);
      aboutUs.imageUrl = imageUrl;
    }

    const docRef = await addDoc(aboutUsCollection, aboutUs);
    console.log("About Us section successfully added with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding About Us section:", e);
    throw e; // Re-throw the error for higher-level handling if needed
  }
};

/**
 * Retrieve all About Us sections from Firestore.
 * @returns An array of AboutUsSection objects.
 */
export const getAboutUsSections = async (): Promise<AboutUsSection[]> => {
  try {
    const querySnapshot = await getDocs(aboutUsCollection);
    const aboutUsSections: AboutUsSection[] = [];
    querySnapshot.forEach((doc) => {
      aboutUsSections.push({ id: doc.id, ...doc.data() } as AboutUsSection);
    });
    return aboutUsSections;
  } catch (e) {
    console.error("Error fetching About Us sections:", e);
    throw e;
  }
};

/**
 * Retrieve a single About Us section by its ID.
 * @param id - The document ID of the About Us section.
 * @returns The AboutUsSection object or null if not found.
 */
export const getAboutUsSection = async (id: string): Promise<AboutUsSection | null> => {
  try {
    const docRef = doc(db, "about_us", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as AboutUsSection;
    } else {
      console.log("No such About Us section!");
      return null;
    }
  } catch (e) {
    console.error("Error fetching About Us section:", e);
    throw e;
  }
};

/**
 * Update an existing About Us section with new data and an optional new image.
 * @param id - The document ID of the About Us section to update.
 * @param aboutUs - A partial AboutUsSection object containing updated fields.
 * @param newImageFile - The new image file to upload (optional).
 */
export const updateAboutUsSection = async (
  id: string,
  aboutUs: Partial<AboutUsSection>,
  newImageFile?: File | null
): Promise<void> => {
  try {
    const docRef = doc(db, "about_us", id);

    if (newImageFile) {
      // Upload the new image
      const storageRef = ref(storage, `about_us/${newImageFile.name}`);
      await uploadBytes(storageRef, newImageFile);
      const newImageUrl = await getDownloadURL(storageRef);
      aboutUs.imageUrl = newImageUrl;

      // Optionally, delete the old image if you have its path
      // Since you’re not storing the image path separately, it’s not straightforward.
      // One approach is to parse the old image URL to get the storage path.
      // However, this requires consistent URL formatting.
      // If not feasible, consider storing image paths in your types for easier management.
    }

    await updateDoc(docRef, aboutUs);
    console.log("About Us section successfully updated with ID:", id);
  } catch (e) {
    console.error("Error updating About Us section:", e);
    throw e;
  }
};

/**
 * Delete an About Us section by its ID.
 * @param id - The document ID of the About Us section to delete.
 */
export const deleteAboutUsSection = async (id: string): Promise<void> => {
  try {
    const aboutUs = await getAboutUsSection(id);
    if (aboutUs && aboutUs.imageUrl) {
      // Delete the image from Firebase Storage
      const imagePath = extractStoragePathFromUrl(aboutUs.imageUrl);
      if (imagePath) {
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
        console.log("Image successfully deleted from storage.");
      } else {
        console.warn("Could not extract image path from URL. Image not deleted.");
      }
    }

    // Delete the document from Firestore
    await deleteDoc(doc(db, "about_us", id));
    console.log("About Us section successfully deleted with ID:", id);
  } catch (e) {
    console.error("Error deleting About Us section:", e);
    throw e;
  }
};

/**
 * Extract the storage path from a Firebase Storage URL.
 * This function parses the URL to obtain the path needed for deleteObject.
 * @param url - The download URL of the image.
 * @returns The storage path or null if parsing fails.
 */
const extractStoragePathFromUrl = (url: string): string | null => {
  try {
    const decodedUrl = decodeURIComponent(url);
    const startIndex = decodedUrl.indexOf("/o/") + 3;
    const endIndex = decodedUrl.indexOf("?", startIndex);
    const path = decodedUrl.substring(startIndex, endIndex);
    return path;
  } catch (error) {
    console.error("Error extracting storage path from URL:", error);
    return null;
  }
};
