import React, { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native"
import { useRouter } from "expo-router"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const ForgotPassword = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value)

  const handleSendOTP = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setError("")
    setLoading(true)

    try {
      await sendOTP(email)

      setTimeout(() => {
        setLoading(false)
        Alert.alert("OTP Sent", "A verification code has been sent to your email.")
        router.push({
          pathname: "/(auth)/verify-otp",
          params: { email },
        })
      }, 1200)
    } catch (e) {
      setLoading(false)
      Alert.alert("Error", "Failed to send OTP. Try again.")
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1">
        {/* Background Gradient */}
        <LinearGradient
          colors={["#F0FDFA", "#EFF6FF"]}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="px-6 pt-24 pb-10">

              {/* Back */}
              <TouchableOpacity onPress={() => router.back()} className="mb-8">
                <MaterialCommunityIcons name="arrow-left" size={26} color="#0f172a" />
              </TouchableOpacity>

              {/* Branding */}
              <View className="items-center mb-10">
                <View className="w-20 h-20 rounded-full bg-teal-50 items-center justify-center mb-4">
                  <MaterialCommunityIcons
                    name="email-lock-outline"
                    size={40}
                    color="#0D9488"
                  />
                </View>

                <Text className="text-3xl font-black text-slate-900 tracking-tight">
                  Forgot Password
                </Text>

                <Text className="text-slate-500 mt-2 text-center font-medium">
                  Enter your registered email to receive an OTP
                </Text>
              </View>

              {/* Card */}
              <View className="bg-white rounded-[36px] p-8 shadow-xl border border-white">

                {/* Email */}
                <View className="mb-6">
                  <Text className="text-slate-700 font-bold mb-2">
                    Email Address
                  </Text>

                  <TextInput
                    value={email}
                    onChangeText={(t) => {
                      setEmail(t)
                      setError("")
                    }}
                    placeholder="hello@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`h-14 px-4 rounded-2xl bg-slate-50 border text-base ${
                      error ? "border-red-400" : "border-slate-200"
                    }`}
                  />

                  {error && (
                    <Text className="text-red-500 text-xs mt-2 font-medium">
                      {error}
                    </Text>
                  )}
                </View>

                {/* Send OTP Button */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleSendOTP}
                  disabled={loading}
                  className="h-14 rounded-2xl bg-teal-600 items-center justify-center shadow-md"
                >
                  <Text className="text-white font-extrabold text-base">
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </Text>
                </TouchableOpacity>

                {/* Footer */}
                <View className="items-center mt-8">
                  <Text className="text-slate-500 text-sm">
                    Remember your password?
                  </Text>
                  <TouchableOpacity onPress={() => router.replace("/login")}>
                    <Text className="text-teal-600 font-extrabold mt-1">
                      Back to Login
                    </Text>
                  </TouchableOpacity>
                </View>

              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default ForgotPassword
