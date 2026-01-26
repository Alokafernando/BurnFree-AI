import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, setDoc } from "firebase/firestore"

export const registerUser = async (fullname: string, email: string, password: string, confirmPassword: string) => {

    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(userCredentials.user, { displayName: fullname })
        await setDoc(doc(db, "users", userCredentials.user.uid), {
            name: fullname,
            role: "USER",
            email,
            createAt: new Date()
        })
        return userCredentials.user
    } catch (error) {
        console.error("Error registering user:", error)
    }

}

export const login = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password)
}