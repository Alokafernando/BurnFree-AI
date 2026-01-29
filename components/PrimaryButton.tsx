import React from "react"
import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

interface PrimaryButtonProps {
    onPress: () => void
    title: string
    isLoading?: boolean
    icon?: keyof typeof Ionicons.glyphMap
    disabled?: boolean
    colors?: [string, string, ...string[]]
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
    onPress,
    title,
    isLoading = false,
    icon,
    disabled = false,
    colors = ["#2DD4BF", "#0D9488"], // Default BurnFree Teal Gradient
}) => {
    const isButtonDisabled = disabled || isLoading

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            disabled={isButtonDisabled}
            className="mt-4 mb-6"
        >
            <LinearGradient
                colors={colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                    borderRadius: 20,
                    paddingVertical: 18,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    opacity: isButtonDisabled ? 0.6 : 1,
                }}
            >
                {isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                ) : (
                    <>
                        <Text className="text-white text-lg font-bold mr-2">{title}</Text>
                        {icon && <Ionicons name={icon} size={20} color="white" />}
                    </>
                )}
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default PrimaryButton