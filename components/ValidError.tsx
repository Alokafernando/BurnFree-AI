import React from "react"
import { View, Text } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

interface ValidErrorProps {
  message?: string
}

const ValidError: React.FC<ValidErrorProps> = ({ message }) => {
  if (!message) return null

  return (
    <View className="flex-row items-center mt-1.5 px-1">
      <MaterialIcons name="error-outline" size={14} color="#EF4444" />
      <Text className="text-[11px] ml-1.5 font-semibold text-red-500 tracking-tight">
        {message}
      </Text>
    </View>
  )
}

export default ValidError