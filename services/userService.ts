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
import { Scan } from "../types/Scan";

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

// ==============================
// PASSWORD RESET
// ==============================
export const resetPassword = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (error: any) {
        console.error("Error sending password reset email:", error);
        return false;
    }
};

export const changePassword = async (newPassword: string) => {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user logged in");
        await updatePassword(user, newPassword);
        return true;
    } catch (error: any) {
        console.error("Error changing password:", error);
        return false;
    }
};

// ==============================
// SCAN HISTORY
// ==============================
export const addScan = async (uid: string, scan: Scan) => {
    try {
        const scansRef = collection(db, "users", uid, "scans");
        const docRef = await addDoc(scansRef, scan);
        return docRef.id;
    } catch (error: any) {
        console.error("Error adding scan:", error);
        return null;
    }
};

export const getScanHistory = async (uid: string): Promise<Scan[]> => {
    try {
        const scansRef = collection(db, "users", uid, "scans");
        const q = query(scansRef, orderBy("date", "desc"));
        const querySnap = await getDocs(q);
        const scans: Scan[] = [];
        querySnap.forEach((doc) => scans.push({ id: doc.id, ...(doc.data() as Scan) }));
        return scans;
    } catch (error: any) {
        console.error("Error fetching scan history:", error);
        return [];
    }
};
