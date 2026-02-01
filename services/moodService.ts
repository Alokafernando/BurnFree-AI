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

// --- READ ALL (user’s moods) ---
export const getMoodsForUser = async (): Promise<Mood[] | MoodError> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { code: "unauthorized", message: "User not logged in." };
    }

    const q = query(
      collection(db, MOODS_COLLECTION),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const entries = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Mood, "id">),
    }));

    return entries;
  } catch (error: any) {
    console.error("Get moods error:", error);
    return {
      code: error.code || "mood_fetch_failed",
      message: error.message || "Failed to retrieve moods.",
    };
  }
};

// --- READ single mood by ID ---
export const getMoodById = async (
  id: string
): Promise<Mood | null | MoodError> => {
  try {
    const docRef = doc(db, MOODS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return { id: docSnap.id, ...(docSnap.data() as Omit<Mood, "id">) };
  } catch (error: any) {
    console.error("Get mood by ID error:", error);
    return {
      code: error.code || "mood_fetch_failed",
      message: error.message || "Failed to retrieve mood by ID.",
    };
  }
};

