import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    getDocs,
    addDoc,
    query,
    orderBy,
} from "firebase/firestore";
import {
    sendPasswordResetEmail,
    updatePassword,
    updateEmail,
    updateProfile,
} from "firebase/auth";
import { auth, db } from "./firebase";

import { User } from "../types/User";

interface UpdateUserOptions extends Partial<User> {
    newPassword?: string;
    newEmail?: string;
}

// ==============================
// USER DETAILS
// ==============================
export const getUserDetails = async (uid: string): Promise<User | null> => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) throw new Error("User not found");

    const data = docSnap.data();

    // Map Firestore data to User interface safely
    const user: User = {
      uid,
      name: data.name || "",
      email: data.email || "",
      photoURL: data.photoURL || undefined,
      role: data.role || undefined,
      createdAt: data.createdAt || undefined,
    };

    return user;
  } catch (error: any) {
    console.error("Error fetching user details:", error);
    return null;
  }
};


export const updateUserProfileImage = async (
  uid: string,
  photoURL: string
): Promise<boolean> => {
  try {
    const user = auth.currentUser;

    // Update Firebase Auth profile if the user is logged in
    if (user && user.uid === uid) {
      await updateProfile(user, { photoURL });
    }

    // Update Firestore user document
    const docRef = doc(db, "users", uid);
    await updateDoc(docRef, { photoURL });

    return true;
  } catch (error: any) {
    console.error("Error updating user profile image:", error);
    return false;
  }
};

export const updateUserProfile = async (
  uid: string,
  updates: { name?: string }
): Promise<boolean> => {
  try {
    const user = auth.currentUser;

    if (user && user.uid === uid && updates.name) {
      await updateProfile(user, { displayName: updates.name });
    }

    const docRef = doc(db, "users", uid);
    if (updates.name) {
      await updateDoc(docRef, { name: updates.name });
    }

    return true;
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return false;
  }
};
