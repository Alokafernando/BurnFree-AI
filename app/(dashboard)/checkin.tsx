import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function CheckIn() {
  return (
    <View className="flex-1">
      {/* Background */}
      <LinearGradient
        colors={["#F0FDFA", "#EFF6FF"]}
        className="absolute inset-0"
      />

      {/* Header */}
      <View className="px-6 pt-16 pb-6">
        <Text className="text-3xl font-black text-slate-900">
          Daily Check-In
        </Text>
        <Text className="text-slate-500 mt-2 font-medium">
          Monitor your burn recovery & safety
        </Text>
      </View>

      {/* Main Card */}
      <View className="mx-6 mt-10 bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200 items-center">
        <View className="w-24 h-24 rounded-full bg-teal-50 items-center justify-center mb-6">
          <MaterialCommunityIcons
            name="clipboard-check-outline"
            size={48}
            color="#0D9488"
          />
        </View>

        <Text className="text-xl font-extrabold text-slate-900 text-center">
          How are you feeling today?
        </Text>

        <Text className="text-slate-500 text-center mt-3 leading-6">
          Perform a daily check-in to track your healing progress and receive
          AI-powered care suggestions.
        </Text>

        {/* Action Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          className="mt-8 w-full h-14 rounded-2xl bg-teal-600 items-center justify-center shadow-lg shadow-teal-600/30"
        >
          <Text className="text-white text-base font-bold">
            Start Check-In
          </Text>
        </TouchableOpacity>
      </View>

      {/* Info Section */}
      <View className="mx-6 mt-8 bg-white/70 rounded-2xl p-5">
        <View className="flex-row items-center mb-3">
          <MaterialCommunityIcons
            name="information-outline"
            size={22}
            color="#0F766E"
          />
          <Text className="ml-2 font-bold text-slate-800">
            Why check-in?
          </Text>
        </View>

        <Text className="text-slate-600 text-sm leading-5">
          • Track burn healing progress{"\n"}
          • Detect warning signs early{"\n"}
          • Receive personalized AI care advice
        </Text>
      </View>
    </View>
  )
}
