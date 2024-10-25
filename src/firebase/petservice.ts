import { db, storage, serverTimestamp } from "../firebase/Firebase"; // Add serverTimestamp from Firebase
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  query,
  orderBy,
  startAfter,
  limit,
  DocumentSnapshot,
} from "firebase/firestore";
import { Pet } from "./types";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const petsCollection = collection(db, "pets");

export const addPet = async (pet: Pet, imageFile: File) => {
  try {
    const storageRef = ref(storage, `pets/${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);
    const imgUrl = await getDownloadURL(storageRef);

    // Add the createdAt field with serverTimestamp()
    const petWithImgUrls: Pet = { ...pet, img_urls: [imgUrl], createdAt: serverTimestamp() };
    
    const docRef = await addDoc(petsCollection, petWithImgUrls);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getPets = async (): Promise<Pet[]> => {
  try {
    const petsCollection = collection(db, "pets");
    
    // Applying orderBy to sort by 'createdAt' in descending order (latest first)
    const petsQuery = query(petsCollection, orderBy("createdAt", "desc"));
    
    const querySnapshot = await getDocs(petsQuery);
    const pets: Pet[] = [];
    querySnapshot.forEach((doc) => {
      pets.push({ id: doc.id, ...doc.data() } as Pet);
    });
    
    return pets;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

export const updatePet = async (id: string, updatedPet: Partial<Pet>) => {
  try {
    const petDoc = doc(db, "pets", id);
    await updateDoc(petDoc, updatedPet);
    console.log("Document updated");
  } catch (e) {
    console.error("Error updating document: ", e);
  }
};

export const deactivatePet = async (id: string) => {
  try {
    const petDoc = doc(db, "pets", id);
    await updateDoc(petDoc, { status: false });
    console.log("Pet status updated to false");
  } catch (e) {
    console.error("Error updating pet status: ", e);
  }
};

export const getPetsPaginated = async (
  pageSize: number,
  lastDoc: DocumentSnapshot | null = null,
  isNextPage: boolean
) => {
  let petsQuery;
  if (isNextPage && lastDoc) {
    petsQuery = query(
      collection(db, "pets"),
      orderBy("createdAt", "desc"), // Order by creation date in descending order
      startAfter(lastDoc),
      limit(pageSize)
    );
  } else {
    petsQuery = query(collection(db, "pets"), orderBy("createdAt", "desc"), limit(pageSize));
  }

  const snapshot = await getDocs(petsQuery);
  const petsList = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Pet[];
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return { petsList, lastDoc: lastVisible };
};

// export const updatePetWithImage = async (
//   id: string,
//   pet: Partial<Pet>,
//   image: File
// ) => {
//   const petRef = doc(db, "pets", id);

//   // Create a reference to the storage location for the image
//   const imageRef = ref(storage, `pets/${id}/${image.name}`);

//   // Upload the image
//   await uploadBytes(imageRef, image);

//   // Get the download URL of the uploaded image
//   const imgUrl = await getDownloadURL(imageRef);

//   // Update the pet document with the new image URL
//   await updateDoc(petRef, { ...pet, img_url: imgUrl });
// };

export const updatePetWithImage = async (
  id: string,
  pet: Partial<Pet>,
  image: File
) => {
  const petRef = doc(db, "pets", id);

  // Create a reference to the storage location for the image
  const imageRef = ref(storage, `pets/${id}/${image.name}`);

  // Upload the image
  await uploadBytes(imageRef, image);

  // Get the download URL of the uploaded image
  const imgUrl = await getDownloadURL(imageRef);

  // Retrieve the existing img_urls array
  const petDoc = await getDoc(petRef);
  const currentPetData = petDoc.data();
  const existingImgUrls = currentPetData?.img_urls || [];

  // Update the pet document with the new image URL (append to img_urls array)
  await updateDoc(petRef, { ...pet, img_urls: [...existingImgUrls, imgUrl] });
};


export const updatePetStatus = async (petId: string, status: boolean) => {
  const petRef = doc(db, "pets", petId); // Adjust the collection name if needed
  await updateDoc(petRef, { status });
};
