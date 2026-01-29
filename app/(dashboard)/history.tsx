import React from "react"
import { View, Text, ScrollView } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function History() {
  return (
    <View className="flex-1">
      {/* Background */}
      <LinearGradient
        colors={["#F0FDFA", "#ECFEFF"]}
        className="absolute inset-0"
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-16 pb-6">
          <Text className="text-3xl font-black text-slate-900">
            Scan History
          </Text>
          <Text className="text-slate-500 mt-2 font-medium">
            Your past burn assessments
          </Text>
        </View>

        {/* Empty State */}
        <View className="mx-6 mt-20 bg-white rounded-3xl p-8 items-center shadow-xl shadow-slate-200">
          <View className="w-20 h-20 rounded-full bg-teal-50 items-center justify-center mb-4">
            <MaterialCommunityIcons
              name="history"
              size={40}
              color="#0D9488"
            />
          </View>

          <Text className="text-lg font-bold text-slate-900">
            No History Found
          </Text>
          <Text className="text-slate-500 text-center mt-2 leading-5">
            You haven’t performed any burn scans yet.
            Once you scan, your results will appear here.
          </Text>
        </View>

        {/* Example History Card (for future use) */}
        {/* 
        <View className="mx-6 mt-6 bg-white rounded-2xl p-5 shadow-lg shadow-slate-200">
          <Text className="text-slate-900 font-bold">Burn Scan</Text>
          <Text className="text-slate-500 text-sm mt-1">
            Second-degree burn detected
          </Text>
          <Text className="text-xs text-slate-400 mt-2">
            12 Jan 2026 • 10:45 AM
          </Text>
        </View>
        */}
      </ScrollView>
    </View>
  )
}
