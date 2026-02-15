import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, StatusBar } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useState } from "react"
import { useRouter } from "expo-router"
import { auth } from "@/services/firebase"
import { updateUserProfile } from "@/services/userService"

export default function AccountInformation() {
  const router = useRouter()
  const user = auth.currentUser

  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)

  const handleUpdateUsername = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "Username cannot be empty")
      return
    }

    try {
      setLoading(true)
      const success = await updateUserProfile(user!.uid, { name: username })
      if (success) {
        Alert.alert("Success", "Username updated successfully")
      } else {
        Alert.alert("Error", "Failed to update username")
      }
    } catch (err) {
      console.error(err)
      Alert.alert("Error", "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      {/* Background Gradient matching your Dashboard */}
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
          <Text className="text-2xl font-black text-slate-900 flex-1 ml-4 tracking-tighter">Profile Info</Text>
        </View>

        {/* Profile Photo - Modern "Squircle" Style */}
        <View className="items-center mb-10">
          <View className="w-40 h-40 rounded-[45px] bg-white shadow-xl shadow-teal-900/10 items-center justify-center border-4 border-white overflow-hidden">
            {user?.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            ) : (
              <MaterialCommunityIcons name="account" size={80} color="#0D9488" />
            )}
          </View>
        </View>

        {/* Form Container */}
        <View className="bg-white/60 p-6 rounded-[40px] border border-white shadow-sm">
          {/* Username Input */}
          <View className="mb-5">
            <Text className="text-[#0D9488] font-black text-[10px] uppercase tracking-[2px] ml-1 mb-2">Full Name</Text>
            <View className="flex-row items-center bg-white border border-teal-50 rounded-2xl px-4 py-4 shadow-sm">
              <MaterialCommunityIcons name="account-edit-outline" size={20} color="#0D9488" className="mr-3" />
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder={user?.displayName || "Enter your name"}
                placeholderTextColor="#94A3B8"
                className="flex-1 text-slate-800 font-bold text-base"
              />
            </View>
          </View>

          {/* Email (Read-Only) */}
          <View className="mb-8">
            <Text className="text-slate-400 font-black text-[10px] uppercase tracking-[2px] ml-1 mb-2">Email Address</Text>
            <View className="flex-row items-center bg-slate-50/50 border border-slate-100 rounded-2xl px-4 py-4">
              <MaterialCommunityIcons name="email-outline" size={20} color="#94A3B8" className="mr-3" />
              <Text className="text-slate-400 font-bold flex-1 text-base">{user?.email || ""}</Text>
              <MaterialCommunityIcons name="lock" size={16} color="#CBD5E1" />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleUpdateUsername}
            disabled={loading}
            activeOpacity={0.8}
            className="bg-[#0D9488] py-5 rounded-[25px] shadow-lg shadow-teal-900/30 flex-row justify-center items-center"
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name="check-circle-outline" size={20} color="white" style={{ marginRight: 8 }} />
                <Text className="text-white font-black text-lg tracking-tight">Save Changes</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <Text className="text-center text-slate-400 text-xs mt-6 font-medium">
          Only your name is editable. Contact support to change your email.
        </Text>
      </View>
    </View>
  )
}