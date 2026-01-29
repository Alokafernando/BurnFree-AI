import { View, ActivityIndicator, Text } from "react-native"
import React from "react"
import { Redirect } from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import "../global.css"

const Index = () => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F0FDFA]">
        <ActivityIndicator size="large" color="#0D9488" />
        <Text className="mt-4 text-slate-500 font-medium">
          Starting BurnFree AI...
        </Text>
      </View>
    )
  }

  return user ? <Redirect href="/home" /> : <Redirect href="/login" />;
}

export default Index