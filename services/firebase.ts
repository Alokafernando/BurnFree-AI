// import { initializeApp } from "firebase/app"
// import { getFirestore } from "firebase/firestore"
// import AsyncStorage from "@react-native-async-storage/async-storage"
// // @ts-ignore
// import { initializeAuth, getReactNativePersistence } from "firebase/auth"

// const firebaseConfig = {
//   apiKey: "AIzaSyAHGDau31PzW1mvGxOsokiXxiqSpEFk_Z8",
//   authDomain: "burnfree-ai-88b29.firebaseapp.com",
//   projectId: "burnfree-ai-88b29",
//   storageBucket: "burnfree-ai-88b29.firebasestorage.app",
//   messagingSenderId: "37989712528",
//   appId: "1:37989712528:web:a5e8eae802e0d392de8e15"
// }

// const app = initializeApp(firebaseConfig)

// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// })

// export const db = getFirestore(app)


import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { initializeAuth, inMemoryPersistence } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAHGDau31PzW1mvGxOsokiXxiqSpEFk_Z8",
  authDomain: "burnfree-ai-88b29.firebaseapp.com",
  projectId: "burnfree-ai-88b29",
  storageBucket: "burnfree-ai-88b29.firebasestorage.app",
  messagingSenderId: "37989712528",
  appId: "1:37989712528:web:a5e8eae802e0d392de8e15",
}

const app = initializeApp(firebaseConfig)

export const auth = initializeAuth(app, {
  persistence: inMemoryPersistence,
})

export const db = getFirestore(app)

