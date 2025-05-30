// src/firebase/FosteringService.ts
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
import { FosteringSection } from "./types";

const db = getFirestore(getApp());
const colRef = collection(db, "foster_sections");

export async function createFosteringSection(
  data: FosteringSection
): Promise<void> {
  await addDoc(colRef, data);
}

export async function getFosteringSections(): Promise<FosteringSection[]> {
  const snap = await getDocs(colRef);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as FosteringSection) }));
}

export async function getFosteringSection(
  id: string
): Promise<FosteringSection> {
  const ref = doc(db, "foster_sections", id);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Section not found");
  return { id: snap.id, ...(snap.data() as FosteringSection) };
}

export async function updateFosteringSection(
  id: string,
  data: FosteringSection
): Promise<void> {
  const ref = doc(db, "foster_sections", id);
  await updateDoc(ref, data as any);
}

export async function deleteFosteringSection(id: string): Promise<void> {
  const ref = doc(db, "foster_sections", id);
  await deleteDoc(ref);
}
