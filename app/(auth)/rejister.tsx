import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert, ScrollView, KeyboardAvoidingView, Platform, Image, StyleSheet, } from "react-native"
import { useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { registerUser } from "@/services/authService"
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

interface InputFieldProps {
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

interface ValidationErrors {
  name?: string
  email?: string
  password?: string
  confirm?: string
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
  info
}) => {
  const isFocused = focusedField === fieldName

  return (
    <View className="mb-5">
      <Text className={`text-sm font-bold mb-2 ${error ? 'text-red-500' : 'text-slate-700'}`}>
        {label}
      </Text>

      <View
        className={`border-b-2 flex-row items-center pb-2 ${error ? 'border-red-500' : (isFocused ? 'border-teal-500' : 'border-slate-200')
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
          className={`flex-1 text-base font-medium ${error ? 'text-red-500' : 'text-slate-900'}`}
          style={{ height: 40 }}
          autoCapitalize="none"
        />
        {isPassword && setShowPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color={error ? "#EF4444" : (isFocused ? "#0D9488" : "#94A3B8")}
            />
          </TouchableOpacity>
        )}
      </View>

      {(info || error) && (
        <View className="flex-row items-center mt-1.5">
          <MaterialIcons
            name={error ? "error-outline" : "info-outline"}
            size={14}
            color={error ? "#EF4444" : "#64748B"}
          />
          <Text className={`text-[11px] ml-1 font-medium ${error ? 'text-red-500' : 'text-slate-500'}`}>
            {error || info}
          </Text>
        </View>
      )}
    </View>
  )
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
      await registerUser(name, email, password, conPassword)
      Alert.alert(
        "Registration Successful 🎉",
        "Your account has been created successfully."
      )
      router.replace("/(auth)/login")
    } catch (e: any) {
      Alert.alert("Wait a second", e.message || "Something went wrong.")
    } finally {
      stopLoading()
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>
        <LinearGradient colors={['#F0FDFA', '#EFF6FF']} style={StyleSheet.absoluteFillObject} />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View className="px-6 pt-16 pb-10">

              <View className="items-center mb-8">
                <View className="w-16 h-16 bg-white rounded-3xl items-center justify-center shadow-sm border border-teal-100">
                  <FontAwesome5 name="fire-extinguisher" size={28} color="#0D9488" />
                </View>
                <Text className="text-3xl font-black text-slate-900 mt-4 tracking-tighter">
                  BurnFree <Text className="text-teal-600">AI</Text>
                </Text>
              </View>

              <View className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200 border border-white" style={{ elevation: 10 }}>

                <InputField
                  label="Full Name" placeholder="John Doe"
                  value={name} onChangeText={(t) => {
                    setName(t)
                    setErrors({ ...errors, name: undefined })
                  }}
                  fieldName="name" focusedField={focusedField} setFocusedField={setFocusedField}
                  error={errors.name}
                />

                <InputField
                  label="Email Address" placeholder="hello@example.com"
                  value={email} onChangeText={(t) => {
                    setEmail(t)
                    setErrors({ ...errors, email: undefined })
                  }}
                  fieldName="email" focusedField={focusedField} setFocusedField={setFocusedField}
                  error={errors.email}
                />

                <InputField
                  label="Password" placeholder="Create a password"
                  value={password} onChangeText={(t) => {
                    setPassword(t)
                    setErrors({ ...errors, password: undefined })
                  }}
                  fieldName="password" focusedField={focusedField} setFocusedField={setFocusedField}
                  isPassword={true} showPassword={showPassword} setShowPassword={setShowPassword}
                  info="Safety first: Min. 6 characters"
                  error={errors.password}
                />

                <InputField
                  label="Confirm Password" placeholder="Repeat password"
                  value={conPassword} onChangeText={(t) => {
                    setConPassword(t)
                    setErrors({ ...errors, confirm: undefined })
                  }}
                  fieldName="confirm" focusedField={focusedField} setFocusedField={setFocusedField}
                  isPassword={true} showPassword={showPassword} setShowPassword={setShowPassword}
                  error={errors.confirm}
                />

                <TouchableOpacity activeOpacity={0.8} onPress={handleRegister} disabled={isLoading} className="mt-4 mb-6">
                  <LinearGradient
                    colors={['#2DD4BF', '#0D9488']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                    style={{ borderRadius: 20, paddingVertical: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Text className="text-white text-lg font-bold mr-2">{isLoading ? "Creating Profile..." : "Get Started"}</Text>
                    {!isLoading && <Ionicons name="arrow-forward" size={20} color="white" />}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View className="flex-row items-center my-6">
                  <View className="flex-1 h-[1px] bg-slate-100" />
                  <Text className="mx-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                    Or join with
                  </Text>
                  <View className="flex-1 h-[1px] bg-slate-100" />
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    Alert.alert("Google Sign-In", "Connecting to Google...");
                  }}
                  className="py-4 rounded-2xl flex-row justify-center items-center border border-slate-100 bg-slate-50"
                >
                  <Image
                    source={require("@/assets/application/google.png")}
                    style={{ width: 55, height: 55 }}
                    resizeMode="contain"
                  />
                  <Text className="text-slate-700 font-bold text-base ml-3">
                    Continue with Google
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center items-center mt-4">
                  <Text className="text-slate-500 font-medium">Already have an account?</Text>
                  <TouchableOpacity onPress={() => router.back()}>
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