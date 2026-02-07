// import React from "react";
// import { Tabs } from "expo-router";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { Platform, View, Text } from "react-native";

// const TAB_CONFIG = [
//   { name: "home", label: "Home", icon: "home" },
//   { name: "mood", label: "Mood", icon: "emoticon-happy" },
//   { name: "work", label: "Work", icon: "briefcase" },
//   { name: "income", label: "Income", icon: "cash" },
//   { name: "profile", label: "Profile", icon: "account-circle" },
// ];

// const DashboardLayout = () => {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarShowLabel: false,
//         tabBarActiveTintColor: "#fff",
//         tabBarInactiveTintColor: "#99f6e4",
//         tabBarStyle: {
//           position: "absolute",
//           bottom: Platform.OS === "ios" ? 15 : 10,
//           left: 15,
//           right: 15,
//           backgroundColor: "#0D9488",
//           borderRadius: 50,
//           height: 80,
//           paddingTop: Platform.OS === "ios" ? 20 : 25,
//           elevation: 12,
//           borderTopWidth: 0,
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 10 },
//           shadowOpacity: 0.25,
//           shadowRadius: 10,
//         },
//       }}
//     >
//       {TAB_CONFIG.map((tab) => (
//         <Tabs.Screen
//           key={tab.name}
//           name={tab.name}
//           options={{
//             tabBarIcon: ({ color, focused }) => (
//               <TabItem icon={tab.icon} label={tab.label} color={color} focused={focused} />
//             ),
//           }}
//         />
//       ))}
//     </Tabs>
//   );
// };

// const TabItem = ({ icon, label, color, focused }: any) => (
//   <View style={{ alignItems: "center", justifyContent: "center", width: 60 }}>
//     <MaterialCommunityIcons name={icon} size={26} color={color} />
//     <Text
//       numberOfLines={1}
//       style={{
//         color,
//         fontSize: 10,
//         fontWeight: focused ? "bold" : "600",
//         textAlign: "center",
//         marginTop: 2,
//       }}
//     >
//       {label}
//     </Text>
//     <View
//       style={{
//         height: 4,
//         width: 20,
//         borderRadius: 2,
//         backgroundColor: focused ? "#fff" : "transparent",
//         marginTop: 4,
//       }}
//     />
//   </View>
// );

// export default DashboardLayout;

import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Platform, View, Text } from "react-native";

const TAB_CONFIG = [
  { name: "home", label: "Home", icon: "home" },
  { name: "mood", label: "Mood", icon: "emoticon-happy" },
  { name: "work", label: "Work", icon: "briefcase" },
  { name: "income", label: "Income", icon: "cash" },
  { name: "profile", label: "Profile", icon: "account-circle" },
];

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#99f6e4",
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === "ios" ? 15 : 10,
          left: 15,
          right: 15,
          backgroundColor: "#0D9488",
          borderRadius: 50,
          height: 80,
          paddingTop: Platform.OS === "ios" ? 20 : 25,
          elevation: 12,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
        },
      }}
    >
      {TAB_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <TabItem icon={tab.icon} label={tab.label} color={color} focused={focused} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

// Single tab item component
const TabItem = ({ icon, label, color, focused }: { icon: string; label: string; color: string; focused: boolean }) => (
  <View style={{ alignItems: "center", justifyContent: "center", width: 60 }}>
    <MaterialCommunityIcons name={icon as any} size={26} color={color} />
    <Text
      numberOfLines={1}
      style={{
        color,
        fontSize: 10,
        fontWeight: focused ? "bold" : "600",
        textAlign: "center",
        marginTop: 2,
      }}
    >
      {label}
    </Text>
    <View
      style={{
        height: 4,
        width: 20,
        borderRadius: 2,
        backgroundColor: focused ? "#fff" : "transparent",
        marginTop: 4,
      }}
    />
  </View>
);

export default DashboardLayout;
