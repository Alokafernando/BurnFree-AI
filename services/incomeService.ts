import { Income, IncomeError, IncomeType } from "@/types/Income"
import { auth, db } from "./firebase"
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
} from "firebase/firestore"


const INCOME_COLLECTION = "income"

export const addIncome = async (
  client: string,
  amount: number,
  type: IncomeType,
  date: string
): Promise<Income | IncomeError> => {
  try {
    const user = auth.currentUser
    if (!user) {
      return { code: "unauthorized", message: "User not logged in." }
    }

    const incomeData: Omit<Income, "id"> = {
      userId: user.uid,
      client,
      amount,
      type,
      date,
      createdAt: Timestamp.now(),
    }

    const docRef = await addDoc(
      collection(db, INCOME_COLLECTION),
      incomeData
    )

    return { id: docRef.id, ...incomeData }
  } catch (error: any) {
    console.error("Add income error:", error)
    return {
      code: error.code || "income_add_failed",
      message: error.message || "Failed to save income.",
    }
  }
}


export const getIncomeForUser = async (): Promise<
  Income[] | IncomeError
> => {
  try {
    const user = auth.currentUser
    if (!user) {
      return { code: "unauthorized", message: "User not logged in." }
    }

    const q = query(
      collection(db, INCOME_COLLECTION),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    )

    const snapshot = await getDocs(q)

    return snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<Income, "id">),
    }))
  } catch (error: any) {
    console.error("Get income error:", error)
    return {
      code: error.code || "income_fetch_failed",
      message: error.message || "Failed to retrieve income.",
    }
  }
}


export const getIncomeById = async (
  id: string
): Promise<Income | null | IncomeError> => {
  try {
    const docRef = doc(db, INCOME_COLLECTION, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    return { id: docSnap.id, ...(docSnap.data() as Omit<Income, "id">) }
  } catch (error: any) {
    console.error("Get income by ID error:", error)
    return {
      code: error.code || "income_fetch_failed",
      message: error.message || "Failed to retrieve income.",
    }
  }
}


export const updateIncome = async (
  id: string,
  updates: Partial<Omit<Income, "id" | "userId" | "createdAt">>
): Promise<Income | IncomeError> => {
  try {
    const docRef = doc(db, INCOME_COLLECTION, id)

    await updateDoc(docRef, updates)

    const updatedSnap = await getDoc(docRef)
    return {
      id: updatedSnap.id,
      ...(updatedSnap.data() as Omit<Income, "id">),
    }
  } catch (error: any) {
    console.error("Update income error:", error)
    return {
      code: error.code || "income_update_failed",
      message: error.message || "Failed to update income.",
    }
  }
}


export const deleteIncome = async (
  id: string
): Promise<true | IncomeError> => {
  try {
    const docRef = doc(db, INCOME_COLLECTION, id)
    await deleteDoc(docRef)
    return true
  } catch (error: any) {
    console.error("Delete income error:", error)
    return {
      code: error.code || "income_delete_failed",
      message: error.message || "Failed to delete income.",
    }
  }
}
