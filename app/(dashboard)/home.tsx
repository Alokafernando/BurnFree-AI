import React from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function Home() {
  return (
    <View className="flex-1">
      {/* Background Gradient */}
      <LinearGradient
        colors={["#F0FDFA", "#ECFEFF"]}
        className="absolute inset-0"
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-16 pb-8">
          <Text className="text-slate-900 text-3xl font-black tracking-tight">
            Welcome 👋
          </Text>
          <Text className="text-slate-500 mt-2 font-medium">
            BurnFree-AI Safety Dashboard
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="flex-row justify-between px-6 mb-6">
          <StatCard
            title="Scans"
            value="12"
            icon="camera-scan"
            color="bg-teal-500"
          />
          <StatCard
            title="Alerts"
            value="3"
            icon="alert-circle-outline"
            color="bg-rose-500"
          />
        </View>

        {/* Main Actions */}
        <View className="px-6 space-y-4">
          <ActionCard
            icon="camera"
            title="Scan Burn"
            subtitle="Analyze burn severity using AI"
            color="bg-teal-600"
          />

          <ActionCard
            icon="clipboard-text-outline"
            title="Care History"
            subtitle="View previous burn reports"
            color="bg-indigo-600"
          />

          <ActionCard
            icon="medical-bag"
            title="AI Advice"
            subtitle="Get treatment recommendations"
            color="bg-emerald-600"
          />
        </View>
      </ScrollView>
    </View>
  )
}

/* ---------------------------------------------------
   COMPONENTS
--------------------------------------------------- */

const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string
  value: string
  icon: any
  color: string
}) => (
  <View className="bg-white w-[48%] rounded-3xl p-5 shadow-lg shadow-slate-200">
    <View className={`w-12 h-12 rounded-full ${color} items-center justify-center mb-3`}>
      <MaterialCommunityIcons name={icon} size={22} color="#fff" />
    </View>
    <Text className="text-2xl font-extrabold text-slate-900">{value}</Text>
    <Text className="text-slate-500 font-medium text-sm">{title}</Text>
  </View>
)

const ActionCard = ({
  icon,
  title,
  subtitle,
  color,
}: {
  icon: any
  title: string
  subtitle: string
  color: string
}) => (
  <TouchableOpacity
    activeOpacity={0.85}
    className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200 flex-row items-center"
  >
    <View className={`w-14 h-14 rounded-2xl ${color} items-center justify-center mr-5`}>
      <MaterialCommunityIcons name={icon} size={26} color="#fff" />
    </View>

    <View className="flex-1">
      <Text className="text-lg font-extrabold text-slate-900">
        {title}
      </Text>
      <Text className="text-slate-500 mt-1 font-medium text-sm">
        {subtitle}
      </Text>
    </View>

    <MaterialCommunityIcons
      name="chevron-right"
      size={24}
      color="#94a3b8"
    />
  </TouchableOpacity>
)
