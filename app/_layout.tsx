import React, { useEffect } from "react";
import { View } from "react-native";
import { Slot } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

import { store } from "@/store";
import { auth } from "@/services/firebase";
import { setUser } from "@/store/slices/authSlice";

import { GlobalLoader } from "@/components/GlobalLoader";

const RootLayoutContent = () => {
  const insets = useSafeAreaInsets();
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
    <View style={{ marginTop: insets.top, flex: 1 }}>
      <Slot />

      <GlobalLoader />
    </View>
  );
};


const RootLayout = () => {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
};

export default RootLayout;