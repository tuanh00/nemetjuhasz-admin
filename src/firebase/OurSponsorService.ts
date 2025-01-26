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
import { OurSponsorSection } from "./types";
import { getDownloadURL, ref, uploadBytes, deleteObject } from "firebase/storage";

// Reference to the 'our_sponsors' collection
const ourSponsorsCollection = collection(db, "our_sponsors");

/**
 * Add a new Our Sponsor section with images.
 * @param sponsorSection - The OurSponsorSection object containing section data.
 * @param imageFiles - The image files to upload (array).
 */
export const addOurSponsorSection = async (
  sponsorSection: OurSponsorSection,
  imageFiles: Array<File | null>
): Promise<void> => {
  try {
    const updatedSection = { ...sponsorSection };

    // Handle sponsors section with image uploads
    if (sponsorSection.sectionType === "sponsors" && sponsorSection.sponsors) {
      const sponsors = [...sponsorSection.sponsors];
      await Promise.all(
        sponsors.map(async (sponsor, index) => {
          const file = imageFiles[index];
          if (file) {
            // Upload the image to Firebase Storage
            const storageRef = ref(storage, `our_sponsors/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file); // Upload file
            const downloadUrl = await getDownloadURL(storageRef); // Get the download URL

            // Assign the Firebase Storage URL to the sponsor's imageUrl field
            sponsor.imageUrl = downloadUrl;
          }
        })
      );

      // Assign updated sponsors to the section
      updatedSection.sponsors = sponsors;
    }

    // Save the updated section to Firestore
    const docRef = await addDoc(ourSponsorsCollection, updatedSection);
    console.log("Our Sponsor Section added with ID:", docRef.id);
  } catch (e) {
    console.error("Error adding Our Sponsor section:", e);
    throw e;
  }
};

/**
 * Retrieve all Our Sponsor sections from Firestore.
 * @returns An array of OurSponsorSection objects.
 */
export const getOurSponsorSections = async (): Promise<OurSponsorSection[]> => {
  try {
    const querySnapshot = await getDocs(ourSponsorsCollection);
    const sections: OurSponsorSection[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as OurSponsorSection),
    }));
    return sections;
  } catch (e) {
    console.error("Error retrieving Our Sponsor sections:", e);
    return [];
  }
};

/**
 * Retrieve a specific Our Sponsor section by ID.
 * @param id - The document ID of the Our Sponsor section.
 * @returns The OurSponsorSection object or null if not found.
 */
export const getOurSponsorSection = async (
  id: string
): Promise<OurSponsorSection | null> => {
  try {
    const docRef = doc(db, "our_sponsors", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as OurSponsorSection) };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error retrieving Our Sponsor section:", e);
    throw e;
  }
};

/**
 * Update an existing Our Sponsor section with images.
 * @param id - The document ID of the Our Sponsor section to update.
 * @param sponsorSection - A partial OurSponsorSection object with updated data.
 * @param imageFiles - The new image files to upload (array).
 */
export const updateOurSponsorSection = async (
  id: string,
  sponsorSection: Partial<OurSponsorSection>,
  imageFiles: Array<File | null>
): Promise<void> => {
  try {
    const docRef = doc(db, "our_sponsors", id);
    const updatedSection = { ...sponsorSection };

    if (sponsorSection.sectionType === "sponsors" && sponsorSection.sponsors) {
      const sponsors = [...sponsorSection.sponsors];
      await Promise.all(
        sponsors.map(async (sponsor, index) => {
          const file = imageFiles[index];
          if (file) {
            const storageRef = ref(storage, `our_sponsors/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file); // Upload file to Firebase storage
            const downloadUrl = await getDownloadURL(storageRef); // Get the download URL
            sponsors[index].imageUrl = downloadUrl; // Set the download URL
          }
        })
      );
      updatedSection.sponsors = sponsors;
    }

    await updateDoc(docRef, updatedSection);
    console.log("Our Sponsor Section updated successfully with ID:", id);
  } catch (e) {
    console.error("Error updating Our Sponsor section:", e);
    throw e;
  }
};

/**
 * Delete an Our Sponsor section by its ID.
 * @param id - The document ID of the Our Sponsor section to delete.
 */
export const deleteOurSponsorSection = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "our_sponsors", id);
    const sponsorSection = await getOurSponsorSection(id);

    if (sponsorSection && sponsorSection.sectionType === "sponsors") {
      await Promise.all(
        sponsorSection.sponsors!.map(async (sponsor) => {
          if (sponsor.imageUrl) {
            const imagePath = extractStoragePathFromUrl(sponsor.imageUrl);
            if (imagePath) {
              const imageRef = ref(storage, imagePath);
              await deleteObject(imageRef);
            }
          }
        })
      );
    }

    await deleteDoc(docRef);
    console.log("Our Sponsor Section deleted with ID:", id);
  } catch (e) {
    console.error("Error deleting Our Sponsor section:", e);
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
    return decodedUrl.substring(startIndex, endIndex);
  } catch (error) {
    console.error("Error extracting storage path from URL:", error);
    return null;
  }
};
