// import React, { useEffect } from "react";
// import { View } from "react-native";
// import { Slot } from "expo-router";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Provider, useDispatch } from "react-redux";
// import { onAuthStateChanged } from "firebase/auth";

import { useSafeAreaInsets } from "react-native-safe-area-context"

// // Import Redux store and actions
// import { store } from "@/store";
// import { auth } from "@/services/firebase";
// import { setUser } from "@/store/slices/authSlice";

// // Import your global UI components
// import { GlobalLoader } from "@/components/GlobalLoader";

// /**
//  * Inner component to handle logic that requires access to Redux hooks
//  */
// const RootLayoutContent = () => {
//   const insets = useSafeAreaInsets();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     // 1. Initialize the Firebase Auth Listener
//     const unsubscribe = onAuthStateChanged(auth, (usr) => {
//       if (usr) {
//         // 2. Dispatch plain object to Redux (No functions/complex methods)
//         dispatch(
//           setUser({
//             uid: usr.uid,
//             email: usr.email,
//             displayName: usr.displayName,
//           })
//         );
//       } else {
//         dispatch(setUser(null));
//       }
//     });

//     // Cleanup listener on unmount
//     return () => unsubscribe();
//   }, [dispatch]);

//   return (
//     <View style={{ marginTop: insets.top, flex: 1 }}>
//       {/* Current Screen (app/index.tsx, etc.) */}
//       <Slot />

//       {/* Global Loading Overlay */}
//       <GlobalLoader />
//     </View>
//   );
// };

// /**
//  * Root Layout Component
//  */
// const RootLayout = () => {
//   return (
//     <Provider store={store}>
//       <RootLayoutContent />
//     </Provider>
//   );
// };

// export default RootLayout;

const RootLayout = () => {
  const insets = useSafeAreaInsets()

  console.log(insets)

  return(
    
  )
}