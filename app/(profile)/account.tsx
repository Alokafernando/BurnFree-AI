import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { auth } from "@/services/firebase";
 import { updateUserProfile } from "@/services/userService";

export default function AccountInformation() {
  const router = useRouter();
  const user = auth.currentUser;

  const [username, setUsername] = useState(""); // start empty
  const [loading, setLoading] = useState(false);

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username cannot be empty");
      return;
    }

    try {
      setLoading(true);
      const success = await updateUserProfile(user!.uid, { name: username });
      if (success) {
        Alert.alert("Success", "Username updated successfully");
      } else {
        Alert.alert("Error", "Failed to update username");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient colors={["#FFF7ED", "#FFFBF0"]} className="absolute inset-0" />

      <View className="flex-1 px-6 pt-12">
        {/* Header */}
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.replace("/(dashboard)/profile")} className="mr-3">
            <MaterialCommunityIcons name="arrow-left" size={26} color="#0D9488" />
          </TouchableOpacity>
          <Text className="text-2xl font-black text-slate-900">Account Information</Text>
        </View>

        {/* Profile Photo */}
        <View className="items-center mb-8">
          <View className="w-60 h-60 rounded-full bg-white shadow-xl items-center justify-center overflow-hidden">
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={{ width: 144, height: 144, borderRadius: 72 }}
                resizeMode="cover"
              />
            ) : (
              <MaterialCommunityIcons name="account" size={70} color="#0D9488" />
            )}
          </View>
        </View>

        {/* Username */}
        <View className="mb-4">
          <Text className="text-slate-600 font-semibold mb-1">Full Name</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder={user?.displayName || "Enter your username"}
            placeholderTextColor="#000000"
            className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800"
            style={{ width: "90%" }}
          />
        </View>

        {/* Email (read-only) */}
        <View className="mb-6">
          <Text className="text-slate-600 font-semibold mb-1">Email Address</Text>
          <View
            className="flex-row items-center bg-slate-100 border border-slate-200 rounded-xl px-4 py-3"
            style={{ width: "90%" }}
          >
            <Text className="text-slate-500 flex-1">{user?.email || ""}</Text>
            <MaterialCommunityIcons name="lock" size={20} color="#94A3B8" />
          </View>
        </View>

        {/* Save Changes Button */}
        <View className="items-center">
          <TouchableOpacity
            onPress={handleUpdateUsername}
            disabled={loading}
            className="py-4 rounded-2xl shadow-md"
            style={{
              backgroundColor: "#0D9488",
              width: 200,
              alignItems: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-black text-lg">Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
