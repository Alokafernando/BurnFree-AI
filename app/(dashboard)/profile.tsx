import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { auth } from "@/services/firebase"; // Import your auth to handle logout

export default function Profile() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <LinearGradient colors={["#F0FDFA", "#EFF6FF"]} className="absolute w-full h-full" />
      
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pt-16">
        {/* Header Area */}
        <View className="items-center mb-8">
          <View className="relative">
            <View className="w-32 h-32 rounded-[40px] bg-white shadow-xl shadow-slate-200 items-center justify-center border border-white">
              <MaterialCommunityIcons name="account" size={80} color="#0D9488" />
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-teal-600 w-10 h-10 rounded-2xl items-center justify-center border-4 border-slate-50">
              <MaterialCommunityIcons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-2xl font-black text-slate-900 mt-6">
            {user?.displayName || "User Name"}
          </Text>
          <Text className="text-slate-500 font-medium">{user?.email}</Text>
        </View>

        {/* Action List */}
        <View className="bg-white rounded-[40px] p-6 shadow-2xl shadow-slate-200 border border-white">
          <ProfileMenuItem icon="account-edit-outline" title="Edit Profile" />
          <ProfileMenuItem icon="shield-lock-outline" title="Security" />
          <ProfileMenuItem icon="bell-outline" title="Notifications" />
          <ProfileMenuItem icon="help-circle-outline" title="Help Center" />
          
          <View className="h-[1px] bg-slate-100 my-4 mx-4" />

          <TouchableOpacity 
            onPress={handleLogout}
            className="flex-row items-center p-4 rounded-2xl bg-red-50"
          >
            <MaterialCommunityIcons name="logout" size={24} color="#EF4444" />
            <Text className="ml-4 text-red-500 font-black text-base">Logout</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-center text-slate-300 mt-8 font-bold text-xs uppercase tracking-widest">
          App Version 1.0.0
        </Text>
      </ScrollView>
    </View>
  );
}

// Helper Component for Menu Items
const ProfileMenuItem = ({ icon, title }: { icon: any; title: string }) => (
  <TouchableOpacity className="flex-row items-center p-4 mb-2 rounded-2xl active:bg-slate-50">
    <View className="w-10 h-10 rounded-xl bg-teal-50 items-center justify-center">
      <MaterialCommunityIcons name={icon} size={22} color="#0D9488" />
    </View>
    <Text className="flex-1 ml-4 text-slate-700 font-bold text-base">{title}</Text>
    <MaterialCommunityIcons name="chevron-right" size={24} color="#cbd5e1" />
  </TouchableOpacity>
);