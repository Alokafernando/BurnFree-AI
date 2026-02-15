import React from "react"
import { View, ActivityIndicator, Modal } from "react-native"
import { useLoader } from "@/hooks/useLoader"

export const GlobalLoader = () => {
  const { isLoading } = useLoader()

  if (!isLoading) return null

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={isLoading}
      onRequestClose={() => {}} 
    >
      <View className="flex-1 justify-center items-center bg-black/40">
        <View className="bg-white p-8 rounded-3xl shadow-2xl items-center justify-center">
          <ActivityIndicator size="large" color="#1e40af" />
        </View>
      </View>
    </Modal>
  )
}