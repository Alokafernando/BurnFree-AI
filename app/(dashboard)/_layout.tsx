import React from "react"
import { Tabs } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { Platform, View, Text } from "react-native"

const TAB_CONFIG = [
  { name: "home", label: "Home", icon: "view-dashboard" },
  { name: "checkin", label: "Daily Check", icon: "calendar-check" },
  { name: "history", label: "Logs & Reports", icon: "chart-box" },
  { name: "advice", label: "AI Advice", icon: "creation" },
  { name: "profile", label: "User Settings", icon: "account-circle" },
]

const DashboardLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#99f6e4",
        tabBarStyle: {
          position: "absolute",
          bottom: Platform.OS === "ios" ? 15 : 10, // Lowered for thumb reach
          left: 10,
          right: 10,
          backgroundColor: "#0D9488",
          borderRadius: 45,
          height: 85,
          paddingTop: Platform.OS === "ios" ? 25 : 35, // Balanced icon drop
          elevation: 12,
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
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
              <TabItem
                icon={tab.icon as any}
                label={tab.label}
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  )
}

const TabItem = ({ icon, label, color, focused }: any) => (
  <View style={{ alignItems: "center", justifyContent: "center", width: 70 }}>
    <MaterialCommunityIcons
      name={focused ? icon : `${icon}-outline`}
      size={24}
      color={color}
    />
    <Text
      numberOfLines={2}
      style={{
        color,
        fontSize: 9,
        fontWeight: focused ? "800" : "600",
        textAlign: "center",
        marginTop: 2,
        lineHeight: 10,
        width: "100%",
      }}
    >
      {label}
    </Text>
    <View
      style={{
        height: 3,
        width: 3,
        borderRadius: 2,
        backgroundColor: focused ? "white" : "transparent",
        marginTop: 2,
      }}
    />
  </View>
)

export default DashboardLayout