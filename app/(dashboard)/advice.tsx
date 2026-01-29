import React from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { MaterialCommunityIcons } from "@expo/vector-icons"

export default function Advice() {
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
          Care Advice
        </Text>
        <Text className="text-slate-500 mt-2 font-medium">
          AI-powered guidance for burn recovery
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Advice Card */}
        <View className="mx-6 mt-6 bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200">
          <View className="items-center mb-6">
            <View className="w-20 h-20 rounded-full bg-teal-50 items-center justify-center">
              <MaterialCommunityIcons
                name="medical-bag"
                size={40}
                color="#0D9488"
              />
            </View>
          </View>

          <Text className="text-xl font-extrabold text-slate-900 text-center">
            Today’s Recommendation
          </Text>

          <Text className="text-slate-600 text-center mt-4 leading-6">
            Keep the affected area clean and dry. Apply prescribed ointment
            twice daily and avoid direct sun exposure.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            className="mt-8 h-14 rounded-2xl bg-teal-600 items-center justify-center shadow-lg shadow-teal-600/30"
          >
            <Text className="text-white font-bold text-base">
              Get New Advice
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tips Section */}
        <View className="mx-6 mt-8">
          <Text className="text-lg font-extrabold text-slate-900 mb-4">
            General Safety Tips
          </Text>

          {/* Tip Item */}
          <View className="bg-white/80 rounded-2xl p-5 mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons
                name="water-outline"
                size={22}
                color="#0F766E"
              />
              <Text className="ml-3 font-bold text-slate-800">
                Stay Hydrated
              </Text>
            </View>
            <Text className="text-slate-600 text-sm leading-5">
              Drinking enough water helps your skin heal faster and reduces
              inflammation.
            </Text>
          </View>

          {/* Tip Item */}
          <View className="bg-white/80 rounded-2xl p-5 mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons
                name="weather-sunny-alert"
                size={22}
                color="#B45309"
              />
              <Text className="ml-3 font-bold text-slate-800">
                Avoid Sun Exposure
              </Text>
            </View>
            <Text className="text-slate-600 text-sm leading-5">
              Fresh burns are sensitive to sunlight. Cover the area or stay in
              the shade.
            </Text>
          </View>

          {/* Tip Item */}
          <View className="bg-white/80 rounded-2xl p-5">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons
                name="alert-circle-outline"
                size={22}
                color="#DC2626"
              />
              <Text className="ml-3 font-bold text-slate-800">
                When to Seek Help
              </Text>
            </View>
            <Text className="text-slate-600 text-sm leading-5">
              If pain increases, swelling worsens, or infection signs appear,
              contact a medical professional immediately.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
