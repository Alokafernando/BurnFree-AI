import React from "react"
import { View, Text, TextInput, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import ValidationMessage from "./ValidationMessage"

export interface InputFieldProps {
    label: string
    placeholder: string
    value: string
    onChangeText: (text: string) => void
    fieldName: string
    focusedField: string | null
    setFocusedField: (name: string | null) => void
    isPassword?: boolean
    showPassword?: boolean
    setShowPassword?: (show: boolean) => void
    error?: string | null
    info?: string
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    fieldName,
    focusedField,
    setFocusedField,
    isPassword,
    showPassword,
    setShowPassword,
    error,
    info,
}) => {
    const isFocused = focusedField === fieldName

    return (
        <View className="mb-5">
            {/* Label - Turns red on error */}
            <Text className={`text-sm font-bold mb-2 ${error ? "text-red-500" : "text-slate-700"}`}>
                {label}
            </Text>

            {/* Input Container - Border color logic */}
            <View
                className={`border-b-2 flex-row items-center pb-2 ${
                    error ? "border-red-500" : isFocused ? "border-teal-500" : "border-slate-200"
                }`}
            >
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor="#94A3B8"
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setFocusedField(fieldName)}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry={isPassword && !showPassword}
                    className={`flex-1 text-base font-medium ${error ? "text-red-500" : "text-slate-900"}`}
                    style={{ height: 40 }}
                    autoCapitalize="none"
                />

                {isPassword && setShowPassword && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                            name={showPassword ? "eye-off" : "eye"}
                            size={20}
                            color={error ? "#EF4444" : isFocused ? "#0D9488" : "#94A3B8"}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Render Error if it exists, otherwise render Info if it exists */}
            {error ? (
                <ValidationMessage message={error} type="error" />
            ) : info ? (
                <ValidationMessage message={info} type="info" />
            ) : null}
        </View>
    )
}

export default InputField