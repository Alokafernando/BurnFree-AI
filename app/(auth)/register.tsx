import React, { useState } from "react"
import { View, Text, TouchableWithoutFeedback, Keyboard, Alert, ScrollView, KeyboardAvoidingView, Platform, Image, StyleSheet, TouchableOpacity, } from "react-native"
import { useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { registerUser } from "@/services/authService"
import { FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

import InputField from "@/components/InputField"
import PrimaryButton from "@/components/PrimaryButton"

interface ValidationErrors {
  name?: string
  email?: string
  password?: string
  confirm?: string
}

const Register = () => {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setConPassword] = useState("")
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})

  const { startLoading, stopLoading, isLoading } = useLoader()

  const validateEmail = (input: string) => /\S+@\S+\.\S+/.test(input)

  const handleRegister = async () => {
    let currentErrors: ValidationErrors = {}

    if (!name.trim()) currentErrors.name = "We need your name!"
    if (!validateEmail(email)) currentErrors.email = "That doesn't look like a valid email."
    if (password.length < 6) currentErrors.password = "Keep it safe! Use at least 6 characters."
    if (password !== conPassword) currentErrors.confirm = "Passwords don't match yet."

    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors)
      return
    }

    setErrors({})
    startLoading()
    try {
      const user = await registerUser(name, email, password, conPassword)

      Alert.alert(
        `Welcome, ${name}! 🎉`,
        "Your account has been created successfully.",
        [
          { text: "OK", onPress: () => router.replace("/(auth)/login") },
        ]
      )
    } catch (e: any) {
      let message = "Something went wrong."

      if (e.code === "auth/email-already-in-use") {
        message = "This email is already registered. Try logging in instead!"
      } else if (e.code === "auth/invalid-email") {
        message = "The email address is invalid. Please check and try again."
      } else if (e.code === "password_mismatch") {
        message = "Passwords do not match. Please check again."
      } else if (e.message) {
        message = e.message
      }

      Alert.alert("Registration Error", message)
    } finally {
      stopLoading()
    }

  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <LinearGradient colors={["#F0FDFA", "#EFF6FF"]} style={StyleSheet.absoluteFillObject} />

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View className="px-6 pt-16 pb-10">

              {/* Branding Section */}
              <View className="items-center mb-10">
                <Text className="text-3xl font-black text-slate-900 tracking-tight text-center">
                  Join <Text className="text-teal-600">BurnFree-AI</Text>
                </Text>
                <Text className="text-slate-500 mt-2 font-medium text-center px-6 leading-6">
                  Create your account to start managing your AI-powered safety dashboard
                </Text>
              </View>


              {/* Main Form Container */}
              <View className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200 border border-white" style={{ elevation: 10 }}>

                <InputField
                  label="Full Name"
                  placeholder="John Doe"
                  value={name}
                  onChangeText={(t) => {
                    setName(t)
                    setErrors({ ...errors, name: undefined })
                  }}
                  fieldName="name"
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                  error={errors.name}
                />

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
                  placeholder="Create a password"
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
                  info="Safety first: Min. 6 characters"
                  error={errors.password}
                />

                <InputField
                  label="Confirm Password"
                  placeholder="Repeat password"
                  value={conPassword}
                  onChangeText={(t) => {
                    setConPassword(t)
                    setErrors({ ...errors, confirm: undefined })
                  }}
                  fieldName="confirm"
                  focusedField={focusedField}
                  setFocusedField={setFocusedField}
                  isPassword
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  error={errors.confirm}
                />

                <PrimaryButton
                  title={isLoading ? "Creating Profile..." : "Get Started"}
                  onPress={handleRegister}
                  isLoading={isLoading}
                  icon="arrow-forward"
                />

                {/* Decorative Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-[1px] bg-slate-100" />
                  <Text className="mx-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">Or join with</Text>
                  <View className="flex-1 h-[1px] bg-slate-100" />
                </View>

                {/* Social Login */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => Alert.alert("Google Sign-In", "Connecting to Google...")}
                  className="py-4 rounded-2xl flex-row justify-center items-center border border-slate-100 bg-slate-50"
                >
                  <Image
                    source={require("@/assets/application/google.png")}
                    style={{ width: 24, height: 24 }}
                    resizeMode="contain"
                  />
                  <Text className="text-slate-700 font-bold text-base ml-3">Continue with Google</Text>
                </TouchableOpacity>

                {/* Navigation Link */}
                <View className="flex-row justify-center items-center mt-6">
                  <Text className="text-slate-500 font-medium">Already have an account? </Text>
                  <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                    <Text className="text-teal-600 font-extrabold">Log In</Text>
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

export default Register