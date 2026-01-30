import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
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
      <LinearGradient
        colors={["#F0FDFA", "#EFF6FF", "#FFFFFF"]}
        className="absolute inset-0"
      />

      <View className="flex-1 px-6 pt-10">
        {/* Header */}
        <View className="flex-row items-center mb-8">
          <TouchableOpacity onPress={() => router.replace("/(dashboard)/profile")} className="mr-3">
            <MaterialCommunityIcons name="arrow-left" size={26} color="#0D9488" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-slate-900">
            Change Password
          </Text>
        </View>

        {/* Current Password */}
        <View className="mb-4">
          <Text className="text-slate-600 font-semibold mb-1">
            Current Password
          </Text>
          <TextInput
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="Enter current password"
            secureTextEntry
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
          />
        </View>

        {/* New Password */}
        <View className="mb-4">
          <Text className="text-slate-600 font-semibold mb-1">
            New Password
          </Text>
          <TextInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            secureTextEntry
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
          />
        </View>

        {/* Confirm Password */}
        <View className="mb-8">
          <Text className="text-slate-600 font-semibold mb-1">
            Confirm Password
          </Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm new password"
            secureTextEntry
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
          />
        </View>

        {/* Submit */}
        <TouchableOpacity
          disabled={loading}
          onPress={handleChangePassword}
          className="bg-teal-600 py-4 rounded-2xl items-center shadow-md"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-black text-lg">
              Update Password
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
