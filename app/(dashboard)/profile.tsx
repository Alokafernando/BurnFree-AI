import React from "react"
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"

export default function Profile() {
  const router = useRouter()

  return (
    <View className="flex-1">
      {/* Background */}
      <LinearGradient
        colors={["#F0FDFA", "#ECFEFF"]}
        className="absolute inset-0"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="px-6 pt-16 items-center">
          <View className="w-28 h-28 rounded-full bg-white shadow-lg shadow-slate-200 items-center justify-center">
            <MaterialCommunityIcons name="account" size={64} color="#0D9488" />
          </View>

          <Text className="text-2xl font-black text-slate-900 mt-4">
            Buddhika Fernando
          </Text>
          <Text className="text-slate-500 font-medium mt-1">
            user@burnfree.ai
          </Text>
        </View>

        {/* Info Card */}
        <View className="mx-6 mt-10 bg-white rounded-3xl p-6 shadow-xl shadow-slate-200">
          <ProfileRow icon="account-outline" label="Full Name" value="Buddhika Fernando" />
          <ProfileRow icon="email-outline" label="Email" value="user@burnfree.ai" />
          <ProfileRow icon="shield-account-outline" label="Role" value="USER" />
        </View>

        {/* Actions */}
        <View className="mx-6 mt-8 space-y-4">
          <ActionButton
            icon="lock-reset"
            title="Change Password"
            onPress={() => router.push("/(auth)/forgot-password")}
          />

          <ActionButton
            icon="cog-outline"
            title="Settings"
            onPress={() => {}}
          />

          <ActionButton
            icon="logout"
            title="Logout"
            danger
            onPress={() => {
              // call logoutUser()
              router.replace("/(auth)/login")
            }}
          />
        </View>
      </ScrollView>
    </View>
  )
}

/* -----------------------------------
   COMPONENTS
----------------------------------- */

const ProfileRow = ({
  icon,
  label,
  value,
}: {
  icon: any
  label: string
  value: string
}) => (
  <View className="flex-row items-center py-4 border-b border-slate-100 last:border-b-0">
    <MaterialCommunityIcons name={icon} size={22} color="#0D9488" />
    <View className="ml-4">
      <Text className="text-xs text-slate-400 font-bold uppercase tracking-wide">
        {label}
      </Text>
      <Text className="text-base text-slate-900 font-semibold mt-1">
        {value}
      </Text>
    </View>
  </View>
)

const ActionButton = ({
  icon,
  title,
  onPress,
  danger,
}: {
  icon: any
  title: string
  onPress: () => void
  danger?: boolean
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    className={`flex-row items-center justify-between px-6 py-4 rounded-2xl bg-white shadow-lg shadow-slate-200`}
  >
    <View className="flex-row items-center">
      <MaterialCommunityIcons
        name={icon}
        size={22}
        color={danger ? "#ef4444" : "#0D9488"}
      />
      <Text
        className={`ml-4 font-bold ${
          danger ? "text-red-500" : "text-slate-900"
        }`}
      >
        {title}
      </Text>
    </View>

    <MaterialCommunityIcons
      name="chevron-right"
      size={22}
      color="#94a3b8"
    />
  </TouchableOpacity>
)
