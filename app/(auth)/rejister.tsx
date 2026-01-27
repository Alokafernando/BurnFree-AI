import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useLoader } from "@/hooks/useLoader";
import { registerUser } from "@/services/authService";

const Register = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");

  // Use the Redux-connected loader hook
  const { startLoading, stopLoading, isLoading } = useLoader();

  const handleRegister = async () => {
    // 1. Validation
    if (!name || !email || !password || !conPassword) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }
    if (password !== conPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password should be at least 6 characters.");
      return;
    }

    if (isLoading) return;

    // 2. Execution
    startLoading();
    try {
      // Updated to include all 4 arguments required by your service
      await registerUser(name, email, password, conPassword); 
      
      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/(auth)/login") }
      ]);
    } catch (e: any) {
      console.error("Registration Error:", e);
      // Display the specific error from Firebase/Service
      Alert.alert("Registration Failed", e.message || "Something went wrong.");
    } finally {
      stopLoading();
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <View className="w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <Text className="text-3xl font-bold mb-6 text-center text-gray-900">
            Create Account
          </Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#9CA3AF"
            className="bg-gray-100 p-4 mb-4 rounded-2xl border border-gray-200"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            keyboardType="email-address"
            className="bg-gray-100 p-4 mb-4 rounded-2xl border border-gray-200"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="bg-gray-100 p-4 mb-4 rounded-2xl border border-gray-200"
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            className="bg-gray-100 p-4 mb-6 rounded-2xl border border-gray-200"
            value={conPassword}
            onChangeText={setConPassword}
          />

          <Pressable
            className={`py-4 rounded-2xl shadow-md ${isLoading ? 'bg-blue-400' : 'bg-blue-600'}`}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text className="text-white text-lg font-bold text-center">
              {isLoading ? "Creating Account..." : "Register"}
            </Text>
          </Pressable>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-blue-600 font-bold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Register;