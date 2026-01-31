import { Mood, MoodError, MoodLevel } from "@/types/Mood";
import { auth, db } from "./firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export const addMood = async (
  mood: MoodLevel,
  note?: string
): Promise<Mood | MoodError> => {
  try {
    const user = auth.currentUser;

    if (!user) {
      return { code: "unauthorized", message: "User not logged in." };
    }

    const moodData: Omit<Mood, "id"> = {
      userId: user.uid,
      moodLevel: mood,   
      notes: note,       
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "moods"), moodData);

    return { id: docRef.id, ...moodData };
  } catch (error: any) {
    console.error("Add mood error:", error);
    return {
      code: error.code || "mood_add_failed",
      message: error.message || "Failed to save mood.",
    };
  }
};
