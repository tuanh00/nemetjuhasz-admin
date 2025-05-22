// src/firebase/VolunteerService.ts
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { getApp } from "firebase/app";
import { VolunteerSection } from "./types";

const db = getFirestore(getApp());
const colRef = collection(db, "volunteer_sections");

/**
 * Create a new VolunteerSection
 */
export async function createVolunteerSection(
  data: VolunteerSection
): Promise<void> {
  await addDoc(colRef, data);
}

/**
 * Fetch all VolunteerSections
 */
export async function getVolunteerSections(): Promise<VolunteerSection[]> {
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as VolunteerSection),
  }));
}

/**
 * Fetch one by its ID
 */
export async function getVolunteerSection(
  id: string
): Promise<VolunteerSection> {
  const ref = doc(db, "volunteer_sections", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("VolunteerSection not found");
  return { id: snap.id, ...(snap.data() as VolunteerSection) };
}

/**
 * Overwrite an existing VolunteerSection
 */
export async function updateVolunteerSection(
  id: string,
  data: VolunteerSection
): Promise<void> {
  const ref = doc(db, "volunteer_sections", id);
  await updateDoc(ref, data as any);
}

/**
 * Delete one
 */
export async function deleteVolunteerSection(id: string): Promise<void> {
  const ref = doc(db, "volunteer_sections", id);
  await deleteDoc(ref);
}
