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
import { AdoptionSection } from "./types";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

const adoptionCollection = collection(db, "adoption");

/** Add new Adoption Section. */
export const addAdoptionSection = async (
  section: AdoptionSection,
  imageFile?: File | File[]
): Promise<void> => {
  try {
    // 1. adoptionProcess + single file
    if (
      section.sectionType === "adoptionProcess" &&
      imageFile &&
      !(imageFile instanceof Array)
    ) {
      const storageRef = ref(
        storage,
        `adoption/${Date.now()}_${imageFile.name}`
      );
      await uploadBytes(storageRef, imageFile);
      const downloadUrl = await getDownloadURL(storageRef);
      section.adoptionProcess!.imageUrl = downloadUrl;
    }
    // 2. successStories + two files
    else if (
      section.sectionType === "successStories" &&
      imageFile &&
      Array.isArray(imageFile)
    ) {
      // Loop through both file positions (even if one is missing) and update only if file exists.
      const files = imageFile;
      const downloadUrls: (string | null)[] = [null, null];
      for (let i = 0; i < 2; i++) {
        if (files[i]) {
          const storageRef = ref(
            storage,
            `adoption/${Date.now()}_${files[i]!.name}`
          );
          await uploadBytes(storageRef, files[i]!);
          downloadUrls[i] = await getDownloadURL(storageRef);
        }
      }
      section.successStories!.images = [
        {
          englishImageTitle:
            section.successStories!.images![0].englishImageTitle || "",
          hungarianImageTitle:
            section.successStories!.images![0].hungarianImageTitle || "",
          firstImageUrl:
            downloadUrls[0] !== null
              ? (downloadUrls[0] as string)
              : section.successStories!.images![0].firstImageUrl,
          secondImageUrl:
            downloadUrls[1] !== null
              ? (downloadUrls[1] as string)
              : section.successStories!.images![0].secondImageUrl,
          link: section.successStories!.images![0].link || "",
        },
      ];
    }
    await addDoc(adoptionCollection, section);
  } catch (error) {
    console.error("Error adding adoption section:", error);
  }
};

/** Retrieve all Adoption Sections. */
export const getAdoptionSections = async (): Promise<AdoptionSection[]> => {
  try {
    const querySnapshot = await getDocs(adoptionCollection);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as AdoptionSection),
    }));
  } catch (error) {
    console.error("Error retrieving adoption sections:", error);
    return [];
  }
};

/** Update existing Adoption Section (adoptionProcess or successStories).
 *  Accepts either a single File (for adoptionProcess) or an array (for successStories) that may contain undefined values for files not updated.
 */
export const updateAdoptionSection = async (
  id: string,
  updatedSection: Partial<AdoptionSection>,
  imageFile?: File | (File | undefined)[]
): Promise<void> => {
  try {
    const docRef = doc(db, "adoption", id);

    // 1. adoptionProcess + single file
    if (
      updatedSection.sectionType === "adoptionProcess" &&
      imageFile &&
      !(imageFile instanceof Array)
    ) {
      const storageRef = ref(
        storage,
        `adoption/${Date.now()}_${imageFile.name}`
      );
      await uploadBytes(storageRef, imageFile);
      const downloadUrl = await getDownloadURL(storageRef);
      if (!updatedSection.adoptionProcess) {
        updatedSection.adoptionProcess = {
          title: "",
          hungarianTitle: "",
          subtitle: "",
          hungarianSubtitle: "",
          content: "",
          hungarianContent: "",
          imageUrl: "",
          englishButtonTitle: "",
          hungarianButtonTitle: "",
          buttonLink: "",
        };
      }
      updatedSection.adoptionProcess.imageUrl = downloadUrl;
    }
    // 2. successStories + partial update for images
    else if (
      updatedSection.sectionType === "successStories" &&
      imageFile &&
      Array.isArray(imageFile)
    ) {
      const files = imageFile;
      const downloadUrls: (string | null)[] = [null, null];
      for (let i = 0; i < 2; i++) {
        if (files[i]) {
          const storageRef = ref(
            storage,
            `adoption/${Date.now()}_${files[i]!.name}`
          );
          await uploadBytes(storageRef, files[i]!);
          downloadUrls[i] = await getDownloadURL(storageRef);
        }
      }
      if (!updatedSection.successStories) {
        updatedSection.successStories = {
          title: "",
          hungarianTitle: "",
          images: [],
        };
      }
      if (!updatedSection.successStories.images) {
        updatedSection.successStories.images = [];
      }
      if (updatedSection.successStories.images.length === 0) {
        updatedSection.successStories.images.push({
          englishImageTitle: "",
          hungarianImageTitle: "",
          firstImageUrl: "",
          secondImageUrl: "",
          link: "",
        });
      }
      if (downloadUrls[0] !== null) {
        updatedSection.successStories.images[0].firstImageUrl =
          downloadUrls[0] as string;
      }
      if (downloadUrls[1] !== null) {
        updatedSection.successStories.images[0].secondImageUrl =
          downloadUrls[1] as string;
      }
    }

    await updateDoc(docRef, updatedSection);
  } catch (error) {
    console.error("Error updating adoption section:", error);
  }
};

/** Delete an Adoption Section by id. */
export const deleteAdoptionSection = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, "adoption", id);
    const sectionData = await getDoc(docRef);
    if (sectionData.exists()) {
      const data = sectionData.data();
      if (data.adoptionProcess?.imageUrl) {
        const imageRef = ref(storage, data.adoptionProcess.imageUrl);
        await deleteObject(imageRef);
      }
    }
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting adoption section:", error);
  }
};
