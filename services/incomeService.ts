import { Income, IncomeError, IncomeType } from "@/types/Income";
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


const INCOME_COLLECTION = "income";


export const addIncome = async (
  client: string,
  amount: number,
  type: IncomeType,
  date: string
): Promise<Income | IncomeError> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { code: "unauthorized", message: "User not logged in." };
    }

    const incomeData: Omit<Income, "id"> = {
      userId: user.uid,
      client,
      amount,
      type,
      date,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(
      collection(db, INCOME_COLLECTION),
      incomeData
    );

    return { id: docRef.id, ...incomeData };
  } catch (error: any) {
    console.error("Add income error:", error);
    return {
      code: error.code || "income_add_failed",
      message: error.message || "Failed to save income.",
    };
  }
};
