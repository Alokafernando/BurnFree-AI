import { doc, getDoc, setDoc, updateDoc, collection, getDocs, addDoc, query, orderBy } from "firebase/firestore"
import { sendPasswordResetEmail, updatePassword } from "firebase/auth"
import { auth, db } from "./firebase"

import { User } from "../types/User"
import { Scan } from "../types/Scan"

// ==============================
// USER DETAILS
// ==============================
export const getUserDetails = async (uid: string): Promise<User | null> => {
  try {
    const docRef = doc(db, "users", uid)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error("User not found")
    }

    return { ...(docSnap.data() as User), uid }
  } catch (error: any) {
    console.error("Error fetching user details:", error)
    return null
  }
}


export const updateUserProfile = async (uid: string, updates: Partial<User>) => {
  try {
    const docRef = doc(db, "users", uid)
    await updateDoc(docRef, updates)
    return true
  } catch (error: any) {
    console.error("Error updating user profile:", error)
    return false
  }
}

// ==============================
// PASSWORD RESET
// ==============================
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email)
    return true
  } catch (error: any) {
    console.error("Error sending password reset email:", error)
    return false
  }
}

export const changePassword = async (newPassword: string) => {
  try {
    if (!auth.currentUser) throw new Error("No user logged in")
    await updatePassword(auth.currentUser, newPassword)
    return true
  } catch (error: any) {
    console.error("Error changing password:", error)
    return false
  }
}

// ==============================
// SCAN HISTORY (as Task)
// ==============================
export const addScan = async (uid: string, scan: Scan) => {
  try {
    const scansRef = collection(db, "users", uid, "scans")
    const docRef = await addDoc(scansRef, scan)
    return docRef.id
  } catch (error: any) {
    console.error("Error adding scan:", error)
    return null
  }
}

export const getScanHistory = async (uid: string): Promise<Scan[]> => {
  try {
    const scansRef = collection(db, "users", uid, "scans")
    const q = query(scansRef, orderBy("date", "desc"))
    const querySnap = await getDocs(q)
    const scans: Scan[] = []
    querySnap.forEach((doc) => scans.push({ id: doc.id, ...(doc.data() as Scan) }))
    return scans
  } catch (error: any) {
    console.error("Error fetching scan history:", error)
    return []
  }
}
