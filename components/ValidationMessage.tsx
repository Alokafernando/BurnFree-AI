import React from "react"
import { View, Text } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"

interface ValidationMessageProps {
  message: string
  type: "error" | "info"
}

const ValidationMessage: React.FC<ValidationMessageProps> = ({ message, type }) => {
  const isError = type === "error"
  
  return (
    <View className="flex-row items-center mt-1.5 ml-1">
      <MaterialIcons
        name={isError ? "error-outline" : "info-outline"}
        size={14}
        color={isError ? "#EF4444" : "#64748B"}
      />
      <Text
        className={`text-[11px] ml-1 font-semibold ${
          isError ? "text-red-500" : "text-slate-500"
        }`}
      >
        {message}
      </Text>
    </View>
  )
}

export default ValidationMessage