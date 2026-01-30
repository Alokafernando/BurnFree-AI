'use client';

import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth } from "@/services/firebase";

export default function Profile() {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const user = auth.currentUser;

  return (
    <View className="flex-1 bg-white">
      <LinearGradient colors={["#F0FDFA", "#EFF6FF", "#FFFFFF"]} className="absolute inset-0" />

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ flexGrow: 1 }}
        className="flex-1"
      >
        {/* HEADER: Keeping it tight at the top */}
        <View className="px-6 pt-6 items-center pb-4">
          <View className="relative">
            <View className="w-24 h-24 rounded-[35px] bg-white shadow-xl shadow-teal-900/10 items-center justify-center border-2 border-white">
              <MaterialCommunityIcons name="account" size={50} color="#0D9488" />
            </View>
            <TouchableOpacity 
              activeOpacity={0.8}
              className="absolute bottom-0 right-0 bg-teal-600 p-2 rounded-xl border-2 border-white shadow-md"
            >
              <MaterialCommunityIcons name="pencil" size={12} color="white" />
            </TouchableOpacity>
          </View>

          {/* Increased Name Size */}
          <Text className="text-2xl font-black text-slate-900 mt-3">
            {user?.displayName || "aloka"}
          </Text>
          <Text className="text-slate-500 font-medium text-sm">
            {user?.email || "aloka@gmail.com"}
          </Text>
        </View>

        {/* STATS BAR */}
        <View className="flex-row justify-around py-3 mx-6 mb-4 bg-white/60 rounded-2xl border border-white">
           <StatItem value="12" label="TASKS" />
           <View className="w-px h-6 bg-slate-200" />
           <StatItem value="5" label="STREAK" />
           <View className="w-px h-6 bg-slate-200" />
           <StatItem value="Gold" label="RANK" />
        </View>

        {/* Action Sections */}
        <View className="px-6">
          {/* Account & Security */}
          <View>
            <Text className="text-slate-900 font-black text-lg mb-2 ml-1">Account & Security</Text>
            <View className="bg-white rounded-3xl p-1 shadow-sm border border-slate-50">
              <MenuButton icon="shield-lock-outline" title="Privacy & Security" color="#0D9488" />
              <MenuButton icon="key-outline" title="Change Password" color="#0D9488" />
            </View>
          </View>

          {/* PREFERENCES: mt-6 instead of mt-10 to save space */}
          <View className="mt-6">
            <Text className="text-slate-900 font-black text-lg mb-2 ml-1">Preferences</Text>
            <View className="bg-white rounded-3xl p-1 shadow-sm border border-slate-50">
              <MenuButton icon="bell-outline" title="Notifications" color="#0D9488" />
              <MenuButton icon="palette-outline" title="Appearance" color="#0D9488" />
            </View>
          </View>
        </View>

        {/* SMALL SPACER: Reduced min-height so Logout pulls up */}
        <View style={{ height: 20 }} />

        {/* LOGOUT: mb-28 should clear your tab bar perfectly */}
        <View className="px-6 mb-28">
          <TouchableOpacity
            onPress={() => {/* Logout logic */}}
            className="flex-row items-center justify-center py-4 bg-red-50 rounded-2xl border border-red-100 shadow-sm"
          >
            <MaterialCommunityIcons name="logout-variant" size={24} color="#ef4444" />
            <Text className="text-red-500 font-black text-xl ml-3">Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

// Sub-components with larger text
const StatItem = ({ value, label }: any) => (
  <View className="items-center">
    <Text className="text-teal-600 font-black text-xl">{value}</Text>
    <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{label}</Text>
  </View>
);

const MenuButton = ({ icon, title, color, onPress }: any) => (
  <TouchableOpacity onPress={onPress} className="flex-row items-center justify-between p-4">
    <View className="flex-row items-center">
      <View style={{ backgroundColor: `${color}15` }} className="w-12 h-12 rounded-xl items-center justify-center">
        <MaterialCommunityIcons name={icon} size={24} color={color} />
      </View>
      {/* Increased button text size */}
      <Text className="ml-4 text-slate-700 font-bold text-base">{title}</Text>
    </View>
    <MaterialCommunityIcons name="chevron-right" size={22} color="#cbd5e1" />
  </TouchableOpacity>
);