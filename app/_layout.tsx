import React, { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";

import { store } from "@/store";
import { auth } from "@/services/firebase";
import { setUser } from "@/store/slices/authSlice";
import { GlobalLoader } from "@/components/GlobalLoader";

const RootLayoutContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      if (usr) {
        dispatch(
          setUser({
            uid: usr.uid,
            email: usr.email,
            displayName: usr.displayName,
          })
        );
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      {/* This Slot will render (auth) or (dashboard) layouts */}
      <Slot />
      <GlobalLoader />
    </SafeAreaProvider>
  );
};

const RootLayout = () => (
  <Provider store={store}>
    <RootLayoutContent />
  </Provider>
);

export default RootLayout;
