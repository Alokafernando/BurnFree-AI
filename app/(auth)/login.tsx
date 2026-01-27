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
import { login } from "@/services/authService";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { startLoading, stopLoading, isLoading } = useLoader();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Please enter both email and password.");
    }

    if (!emailRegex.test(email)) {
      return Alert.alert("Invalid Email", "Please enter a valid email address.");
    }

    if (isLoading) return;

    startLoading();
    try {
      await login(email, password);
      router.replace("../app/(dashboard)/home"); 
    } catch (e: any) {
      Alert.alert("Login Failed", e.message || "Invalid credentials.");
    } finally {
      stopLoading(); 
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <View className="w-full bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <Text className="text-4xl font-extrabold mb-2 text-center text-gray-900">
            Welcome
          </Text>
          <Text className="text-gray-500 text-center mb-8">
            Sign in to continue
          </Text>

          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            keyboardType="email-address"
            className="bg-gray-100 p-4 mb-4 rounded-2xl text-gray-900 border border-gray-200"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry // Hides characters
            className="bg-gray-100 p-4 mb-6 rounded-2xl text-gray-900 border border-gray-200"
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            className={`py-4 rounded-2xl shadow-md ${isLoading ? 'bg-blue-400' : 'bg-blue-600'}`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white text-lg font-bold text-center">
              {isLoading ? "Signing in..." : "Login"}
            </Text>
          </Pressable>

          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-600">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/rejister")}>
              <Text className="text-blue-600 font-bold">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;