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

