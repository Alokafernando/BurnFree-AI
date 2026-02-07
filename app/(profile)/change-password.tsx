import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { changePasswordWithCurrent } from "@/services/authService";

export default function ChangePassword() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await changePasswordWithCurrent(currentPassword, newPassword);

      Alert.alert("Success", "Password updated successfully", [
        { text: "OK", onPress: () => router.replace("/(dashboard)/profile") },
      ]);
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        Alert.alert("Error", "Current password is incorrect");
      } else if (error.code === "auth/requires-recent-login") {
        Alert.alert("Session Expired", "Please log in again and retry");
      } else {
        Alert.alert("Error", "Failed to update password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <LinearGradient 
        colors={["#CCFBF1", "#F0FDFA", "#FFFFFF"]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.4 }}
        className="absolute inset-0" 
      />

      <View className="flex-1 px-6 pt-20">
        {/* Header Section */}
        <View className="flex-row items-center justify-between mb-10">
          <TouchableOpacity 
            onPress={() => router.replace("/(dashboard)/profile")} 
            className="bg-white p-3 rounded-2xl shadow-sm border border-teal-50"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#0D9488" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-slate-900 flex-1 ml-4 tracking-tighter">Security</Text>
        </View>

        {/* Security Icon Header */}
        <View className="items-center mb-8">
          <View className="bg-white p-6 rounded-[35px] shadow-xl shadow-teal-900/10 border border-teal-50">
            <MaterialCommunityIcons name="shield-lock-outline" size={50} color="#0D9488" />
          </View>
          <Text className="text-slate-400 font-bold mt-4 text-center px-10">
            Ensure your new password is at least 6 characters long.
          </Text>
        </View>

        {/* Form Container */}
        <View className="bg-white/60 p-6 rounded-[40px] border border-white shadow-sm">
          
          {/* Current Password */}
          <View className="mb-4">
            <Text className="text-[#0D9488] font-black text-[10px] uppercase tracking-[2px] ml-1 mb-2">Current Password</Text>
            <View className="flex-row items-center bg-white border border-teal-50 rounded-2xl px-4 py-4 shadow-sm">
              <MaterialCommunityIcons name="lock-outline" size={20} color="#0D9488" className="mr-3" />
              <TextInput
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="••••••••"
                secureTextEntry
                placeholderTextColor="#94A3B8"
                className="flex-1 text-slate-800 font-bold text-base"
              />
            </View>
          </View>

          {/* New Password */}
          <View className="mb-4">
            <Text className="text-[#0D9488] font-black text-[10px] uppercase tracking-[2px] ml-1 mb-2">New Password</Text>
            <View className="flex-row items-center bg-white border border-teal-50 rounded-2xl px-4 py-4 shadow-sm">
              <MaterialCommunityIcons name="key-outline" size={20} color="#0D9488" className="mr-3" />
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="••••••••"
                secureTextEntry
                placeholderTextColor="#94A3B8"
                className="flex-1 text-slate-800 font-bold text-base"
              />
            </View>
          </View>

          {/* Confirm Password */}
          <View className="mb-8">
            <Text className="text-[#0D9488] font-black text-[10px] uppercase tracking-[2px] ml-1 mb-2">Confirm New Password</Text>
            <View className="flex-row items-center bg-white border border-teal-50 rounded-2xl px-4 py-4 shadow-sm">
              <MaterialCommunityIcons name="check-decagram-outline" size={20} color="#0D9488" className="mr-3" />
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="••••••••"
                secureTextEntry
                placeholderTextColor="#94A3B8"
                className="flex-1 text-slate-800 font-bold text-base"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleChangePassword}
            disabled={loading}
            activeOpacity={0.8}
            className="bg-[#0D9488] py-5 rounded-[25px] shadow-lg shadow-teal-900/30 flex-row justify-center items-center"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name="update" size={20} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white font-black text-lg tracking-tight">Update Password</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}