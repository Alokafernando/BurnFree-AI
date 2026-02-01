import { Work, WorkError } from "@/types/Work";
import { auth, db } from "./firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

// Collection name
const WORK_COLLECTION = "work_logs";

// --- CREATE ---
export const addWork = async (
  client: string,
  project: string,
  hours: number,
  date: string
): Promise<Work | WorkError> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { code: "unauthorized", message: "User not logged in." };
    }

    const workData: Omit<Work, "id"> = {
      userId: user.uid,
      client,
      project,
      hours,
      date,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, WORK_COLLECTION), workData);

    return { id: docRef.id, ...workData };
  } catch (error: any) {
    console.error("Add work error:", error);
    return {
      code: error.code || "work_add_failed",
      message: error.message || "Failed to save work entry.",
    };
  }
};

// --- READ ALL (user’s work logs) ---
export const getWorkForUser = async (): Promise<Work[] | WorkError> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { code: "unauthorized", message: "User not logged in." };
    }

    const q = query(
      collection(db, WORK_COLLECTION),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Work, "id">),
    }));
  } catch (error: any) {
    console.error("Get work error:", error);
    return {
      code: error.code || "work_fetch_failed",
      message: error.message || "Failed to retrieve work logs.",
    };
  }
};

// --- READ single work by ID ---
export const getWorkById = async (
  id: string
): Promise<Work | null | WorkError> => {
  try {
    const docRef = doc(db, WORK_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return { id: docSnap.id, ...(docSnap.data() as Omit<Work, "id">) };
  } catch (error: any) {
    console.error("Get work by ID error:", error);
    return {
      code: error.code || "work_fetch_failed",
      message: error.message || "Failed to retrieve work entry.",
    };
  }
};

// --- UPDATE ---
export const updateWork = async (
  id: string,
  updates: Partial<Omit<Work, "id" | "userId" | "createdAt">>
): Promise<Work | WorkError> => {
  try {
    const docRef = doc(db, WORK_COLLECTION, id);
    await updateDoc(docRef, updates);

    const updatedSnap = await getDoc(docRef);
    return { id: updatedSnap.id, ...(updatedSnap.data() as Omit<Work, "id">) };
  } catch (error: any) {
    console.error("Update work error:", error);
    return {
      code: error.code || "work_update_failed",
      message: error.message || "Failed to update work entry.",
    };
  }
};

// --- DELETE ---
export const deleteWork = async (id: string): Promise<true | WorkError> => {
  try {
    const docRef = doc(db, WORK_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error: any) {
    console.error("Delete work error:", error);
    return {
      code: error.code || "work_delete_failed",
      message: error.message || "Failed to delete work entry.",
    };
  }
};
