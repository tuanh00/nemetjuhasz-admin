import { db, storage } from "../firebase/Firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";
import { DonationSection } from "./types";

// We'll store all donation sections in a collection named "donation_sections"
const donationSectionsCollection = collection(db, "donation_sections");

/**
 * Add a new Donation section (donate | donateItems | becomeASponsor).
 * @param section  - The DonationSection object containing data.
 * @param imageFile - Optional single image if needed.
 */
export const addDonationSection = async (
  section: DonationSection,
  imageFile?: File
): Promise<void> => {
  try {
    const updatedSection = { ...section };

    // If there's an image file, handle each section type:
    if (imageFile) {
      const storageRef = ref(
        storage,
        `donation_sections/${Date.now()}_${imageFile.name}`
      );
      await uploadBytes(storageRef, imageFile);
      const downloadUrl = await getDownloadURL(storageRef);

      // 1) For 'donate'
      if (section.sectionType === "donateSection" && updatedSection.donateSection) {
        updatedSection.donateSection.imageUrl = downloadUrl;
      }
      // 2) For 'donateItems'
      if (section.sectionType === "donateItems" && updatedSection.donateItems) {
        updatedSection.donateItems.imageUrl = downloadUrl;
      }
      // 3) For 'becomeASponsor'
      if (
        section.sectionType === "becomeASponsor" &&
        updatedSection.sponsor
      ) {
        // add an imageUrl field if not already existing
        (updatedSection.sponsor as any).imageUrl = downloadUrl;
      }
    }

    // Add to Firestore
    await addDoc(donationSectionsCollection, updatedSection);
    console.log("Donation section added successfully.");
  } catch (error) {
    console.error("Error adding donation section:", error);
    throw error;
  }
};

/**
 * Retrieve all Donation sections from Firestore.
 */
export const getDonationSections = async (): Promise<DonationSection[]> => {
  try {
    const querySnapshot = await getDocs(donationSectionsCollection);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as DonationSection),
    }));
  } catch (error) {
    console.error("Error retrieving donation sections:", error);
    return [];
  }
};

/**
 * Retrieve a specific Donation section by ID.
 * @param id - The document ID.
 */
export const getDonationSection = async (
  id: string
): Promise<DonationSection | null> => {
  try {
    const docRef = doc(db, "donation_sections", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as DonationSection) };
    } else {
      console.log("No such donation section!");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving donation section:", error);
    throw error;
  }
};

/**
 * Update an existing Donation section with optional new image.
 * @param id         - The document ID of the DonationSection.
 * @param section    - Updated partial DonationSection data.
 * @param imageFile  - Optional new image file to upload.
 */
export const updateDonationSection = async (
  id: string,
  section: Partial<DonationSection>,
  imageFile?: File
): Promise<void> => {
  try {
    const docRef = doc(db, "donation_sections", id);
    const updatedSection = { ...section };

    // If we have a new image, handle upload for each type:
    if (imageFile) {
      const storageRef = ref(
        storage,
        `donation_sections/${Date.now()}_${imageFile.name}`
      );
      await uploadBytes(storageRef, imageFile);
      const downloadUrl = await getDownloadURL(storageRef);

      // For 'donate'
      if (
        section.sectionType === "donateSection" &&
        updatedSection.donateSection
      ) {
        updatedSection.donateSection.imageUrl = downloadUrl;
      }

      // For 'donateItems'
      if (
        section.sectionType === "donateItems" &&
        updatedSection.donateItems
      ) {
        updatedSection.donateItems.imageUrl = downloadUrl;
      }

      // For 'becomeASponsor'
      if (
        section.sectionType === "becomeASponsor" &&
        updatedSection.sponsor
      ) {
        (updatedSection.sponsor as any).imageUrl = downloadUrl;
      }
    }

    await updateDoc(docRef, updatedSection);
    console.log("Donation section updated successfully:", id);
  } catch (error) {
    console.error("Error updating donation section:", error);
    throw error;
  }
};

/**
 * Delete a Donation section by ID, optionally removing images from Storage.
 * @param id - The document ID to delete.
 */
export const deleteDonationSection = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "donation_sections", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const donationSection = docSnap.data() as DonationSection;

      // Example: if there's a .donateSection.imageUrl, parse & delete from Storage
      if (donationSection.donateSection?.imageUrl) {
        const imagePath = extractStoragePathFromUrl(
          donationSection.donateSection.imageUrl
        );
        if (imagePath) {
          const imageRef = ref(storage, imagePath);
          await deleteObject(imageRef);
        }
      }
      // Repeat for donateItems
      if (donationSection.donateItems?.imageUrl) {
        const path = extractStoragePathFromUrl(
          donationSection.donateItems.imageUrl
        );
        if (path) {
          await deleteObject(ref(storage, path));
        }
      }
      // And for becomeASponsor
      if ((donationSection as any).sponsor?.imageUrl) {
        const sponsorUrl = (donationSection as any).sponsor.imageUrl;
        const path = extractStoragePathFromUrl(sponsorUrl);
        if (path) {
          await deleteObject(ref(storage, path));
        }
      }
    }

    await deleteDoc(docRef);
    console.log("Donation section deleted with ID:", id);
  } catch (error) {
    console.error("Error deleting donation section:", error);
    throw error;
  }
};

/**
 * Helper function to parse the storage path from a Firebase download URL.
 */
const extractStoragePathFromUrl = (url: string): string | null => {
  try {
    const decodedUrl = decodeURIComponent(url);
    const startIndex = decodedUrl.indexOf("/o/") + 3;
    const endIndex = decodedUrl.indexOf("?", startIndex);
    return decodedUrl.substring(startIndex, endIndex);
  } catch (error) {
    console.error("Error extracting storage path from URL:", error);
    return null;
  }
};
