import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  fetchSignInMethodsForEmail,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  User,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AuthError = {
  code: string;
  message: string;
};

export const registerUser = async (
  fullname: string,
  email: string,
  password: string,
  confirmPassword: string
): Promise<User> => {  // only returns User
  if (password !== confirmPassword) {
    throw { code: "password_mismatch", message: "Passwords do not match." };
  }

  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCredentials.user, { displayName: fullname });

    await setDoc(doc(db, "users", userCredentials.user.uid), {
      name: fullname,
      role: "USER",
      email: email.toLowerCase(),
      createdAt: new Date(),
    });

    return userCredentials.user; // success
  } catch (error: any) {
    console.error("Error registering user:", error);
    throw { code: error.code || "registration_failed", message: error.message || "Failed to register user." };
  }
};

export const loginUser = async (email: string, password: string): Promise<User | AuthError> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Error logging in:", error);
    return { code: error.code || "login_failed", message: error.message || "Invalid email or password." };
  }
};

export const logoutUser = async (): Promise<boolean> => {
  try {
    await signOut(auth);
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error("Logout failed:", error);
    return false;
  }
};


export const changePasswordWithCurrent = async (
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("No user logged in");

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    await reauthenticateWithCredential(user, credential);

    await updatePassword(user, newPassword);

    return true;
  } catch (error: any) {
    console.error("Change password error:", error);
    throw error;
  }
};



