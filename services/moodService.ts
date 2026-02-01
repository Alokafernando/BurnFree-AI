import { Mood, MoodError, MoodLevel } from "@/types/Mood";
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
const MOODS_COLLECTION = "moods";

// --- CREATE ---
export const addMood = async (
  mood: MoodLevel,
  notes?: string
): Promise<Mood | MoodError> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { code: "unauthorized", message: "User not logged in." };
    }

    const moodData: Omit<Mood, "id"> = {
      userId: user.uid,
      moodLevel: mood,
      notes,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, MOODS_COLLECTION), moodData);

    return { id: docRef.id, ...moodData };
  } catch (error: any) {
    console.error("Add mood error:", error);
    return {
      code: error.code || "mood_add_failed",
      message: error.message || "Failed to save mood.",
    };
  }
};

