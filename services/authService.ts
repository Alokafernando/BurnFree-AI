import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, setDoc } from "firebase/firestore"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const registerUser = async (fullname: string, email: string, password: string, confirmPassword: string) => {

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(userCredentials.user, { displayName: fullname })
        await setDoc(doc(db, "users", userCredentials.user.uid), {
            name: fullname,
            role: "USER",
            email: email.toLowerCase(),
            createAt: new Date()
        })
        return userCredentials.user
    } catch (error) {
        console.error("Error registering user:", error)
    }

}

export const login = async (email: string, password: string) => {
  try{
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (error) {
    console.error("Error logging in:", error)
  }
  
}

export const logoutUser = async () => {
  try {
    await signOut(auth)
    await AsyncStorage.clear()
  } catch (error) {
    console.error("Logout failed:", error)
  }
}
