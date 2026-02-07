import React, { useState } from "react"
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native"
import { useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { loginUser } from "@/services/authService"
import { FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

import InputField from "@/components/InputField"
import PrimaryButton from "@/components/PrimaryButton"

interface ValidationErrors {
  email?: string
  password?: string
}

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

  const { startLoading, stopLoading, isLoading } = useLoader()

  const validateEmail = (input: string) => /\S+@\S+\.\S+/.test(input)

  const handleLogin = async () => {
  let currentErrors: ValidationErrors = {}

  if (!validateEmail(email))
    currentErrors.email = "Please enter a valid email address."

  if (!password)
    currentErrors.password = "Password is required."

  if (Object.keys(currentErrors).length > 0) {
    setErrors(currentErrors)
    return
  }

  setErrors({})
  startLoading()

  try {
    const result = await loginUser(email, password)

    if ("code" in result) {
      Alert.alert("Login Failed", "Invalid email or password. Please try again.")
      return
    }

    router.replace("/(dashboard)/home")

  } catch (error) {
    Alert.alert("Login Failed", "Something went wrong.")
  } finally {
    stopLoading()
  }
}


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        {/* Same Gradient as Register for continuity */}
        <LinearGradient colors={["#F0FDFA", "#EFF6FF"]} style={StyleSheet.absoluteFillObject} />

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View className="px-6 pt-24 pb-10">

              {/* Branding Section */}
              <View className="items-center mb-10">
                <Text className="text-3xl font-black text-slate-900 mt-4 tracking-tighter">
                  Welcome to <Text className="text-teal-600">BurnFree-AI</Text>
                </Text>
                <Text className="text-slate-500 mt-2 font-medium text-center">
                  Log in to your AI-powered safety portal
                </Text>
              </View>

              {/* Login Card */}
              <View className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200 border border-white" style={{ elevation: 10 }}>

                <InputField
                  label="Email Address"
                  placeholder="hello@example.com"
                  value={email}
                  onChangeText={(t) => {
                    setEmail(t)
                    setErrors({ ...errors, email: undefined })
                  }}
                  fieldName="email"
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                  error={errors.email}
                />

                <InputField
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={(t) => {
                    setPassword(t)
                    setErrors({ ...errors, password: undefined })
                  }}
                  fieldName="password"
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                  isPassword
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  error={errors.password}
                />

                <TouchableOpacity
                  // onPress={() => router.push("/(auth)/forgot-password")}
                  className="self-end mb-6"
                >
                  <Text className="text-teal-600 font-bold text-sm">Forgot Password?</Text>
                </TouchableOpacity>

                <PrimaryButton
                  title={isLoading ? "Authenticating..." : "Login"}
                  onPress={handleLogin}
                  isLoading={isLoading}
                  icon="log-in-outline"
                />

                {/* Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-[1px] bg-slate-100" />
                  <Text className="mx-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Or sign in with</Text>
                  <View className="flex-1 h-[1px] bg-slate-100" />
                </View>

                {/* Google Sign-In */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => Alert.alert("Google Sign-In", "Connecting...")}
                  className="py-4 rounded-2xl flex-row justify-center items-center border border-slate-100 bg-slate-50"
                >
                  <Image
                    source={require("@/assets/application/google.png")}
                    style={{ width: 30, height: 30 }}
                    resizeMode="contain"
                  />
                  <Text className="text-slate-700 font-bold text-base ml-3">Continue with Google</Text>
                </TouchableOpacity>

                {/* Navigation Link */}
                <View className="flex-row justify-center items-center mt-8">
                  <Text className="text-slate-500 font-medium">Don’t have an account? </Text>
                  <TouchableOpacity onPress={() => router.push("/register")}>
                    <Text className="text-teal-600 font-extrabold">Create Account</Text>
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

export default Login