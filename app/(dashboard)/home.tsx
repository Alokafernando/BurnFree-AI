import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, db } from "@/services/firebase";
import { calculateBurnoutScore, BurnoutResult } from "@/services/burnoutService";
import { generateAIAdvice } from "@/services/aiAdviceService";
import { AIAdvice } from "@/types/aiAdvice";
import { LinearGradient } from "expo-linear-gradient";

export default function Dashboard({ navigation }: any) {
  const userId = auth.currentUser?.uid;
  const [loading, setLoading] = useState(true);
  const [burnout, setBurnout] = useState<BurnoutResult>({
    score: 0,
    level: "Low",
    color: "#0D9488", 
    description: "",
  });
  const [advice, setAdvice] = useState<AIAdvice[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [workCount, setWorkCount] = useState(0);

  const fetchData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const moodSnapshot = await getDocs(query(collection(db, "mood_logs"), where("userId", "==", userId)));
      const workSnapshot = await getDocs(query(collection(db, "work_logs"), where("userId", "==", userId)));
      const incomeSnapshot = await getDocs(query(collection(db, "income_logs"), where("userId", "==", userId)));

      const moods = moodSnapshot.docs.map(doc => doc.data());
      const incomes = incomeSnapshot.docs.map(doc => doc.data());
      
      const total = incomes.reduce((a, b:any) => a + b.amount, 0);
      setTotalIncome(total);
      setWorkCount(workSnapshot.docs.length);

      const avgMood = moods.length ? moods.reduce((a, b:any) => a + b.mood, 0) / moods.length : 5;
      const avgStress = moods.length ? moods.reduce((a, b:any) => a + b.stress, 0) / moods.length : 5;
      
      const burnoutResult = calculateBurnoutScore({ avgMood, avgStress, avgSleep: 7, avgWorkHours: 8 });
      setBurnout(burnoutResult);
      setAdvice(generateAIAdvice(burnoutResult, total, avgMood, 8));

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#0D9488" />
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      {/* BurnFree Green/Teal Gradient Base */}
      <LinearGradient colors={["#F0FDFA", "#FFFFFF", "#FFFFFF"]} className="absolute inset-0" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* HEADER - pt-20 to get down below the notch */}
        <View className="px-6 pt-20 pb-4">
          <Text className="text-teal-600 font-black uppercase tracking-[2px] text-[10px] mb-1">Overview</Text>
          <Text className="text-4xl font-black text-slate-900 tracking-tighter">Dashboard</Text>
        </View>

        {/* PRIMARY BURNOUT CARD (TEAL THEME) */}
        <View className="px-6 mb-6">
          <LinearGradient
            colors={["#FFFFFF", "#F0FDFA"]}
            className="p-8 rounded-[45px] border border-teal-50 shadow-2xl shadow-teal-900/10"
          >
            <View className="flex-row justify-between items-start mb-4">
              <View>
                <Text className="text-slate-400 font-bold text-xs uppercase tracking-widest">Burnout Score</Text>
                <Text className="text-6xl font-black text-slate-900 mt-1">{burnout.score}%</Text>
              </View>
              <View className="bg-teal-50 p-4 rounded-[25px]">
                <MaterialCommunityIcons name="fire" size={32} color="#0D9488" />
              </View>
            </View>
            
            <View className="flex-row items-center bg-white/80 self-start px-4 py-2 rounded-2xl border border-teal-100">
              <View className="w-2 h-2 rounded-full mr-2 bg-teal-500" />
              <Text className="text-teal-700 font-black text-[11px] uppercase tracking-wider">
                {burnout.level} RISK LEVEL
              </Text>
            </View>
          </LinearGradient>
        </View>

        {/* STATS ROW */}
        <View className="flex-row px-6 mb-8 justify-between">
          <SmallStatCard 
            icon="wallet-outline" 
            label="INCOME" 
            value={totalIncome > 5000 ? "Stable" : "Growth"} 
          />
          <SmallStatCard 
            icon="calendar-check-outline" 
            label="TOTAL LOGS" 
            value={workCount.toString()} 
          />
        </View>

        {/* AI ADVICE */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-black text-slate-900 mb-4 ml-2">Smart Advice</Text>
          {advice.slice(0, 2).map((item, index) => (
            <View key={index} className="bg-white p-5 rounded-[35px] border border-teal-50 shadow-sm mb-3 flex-row items-center">
              <View className="bg-teal-50 p-3 rounded-2xl mr-4">
                <MaterialCommunityIcons name="robot-outline" size={20} color="#0D9488" />
              </View>
              <View className="flex-1">
                <Text className="text-slate-900 font-bold text-base tracking-tight">{item.title}</Text>
                <Text className="text-slate-400 text-xs font-medium mt-1 leading-4" numberOfLines={2}>{item.message}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* QUICK ACTIONS */}
        <View className="px-6">
          <Text className="text-xl font-black text-slate-900 mb-4 ml-2">Actions</Text>
          <View className="flex-row justify-between">
            <QuickActionBtn icon="smile-beam" label="Mood" onPress={() => navigation.navigate("MoodLogger")} />
            <QuickActionBtn icon="briefcase" label="Work" onPress={() => navigation.navigate("WorkTracker")} />
            <QuickActionBtn icon="dollar-sign" label="Income" onPress={() => navigation.navigate("IncomeTracker")} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// --- components ---

const SmallStatCard = ({ icon, label, value }: any) => (
  <View className="bg-white w-[48%] p-6 rounded-[35px] border border-teal-50 shadow-sm">
    <View className="bg-teal-50 w-10 h-10 rounded-xl items-center justify-center mb-3">
      <MaterialCommunityIcons name={icon} size={20} color="#0D9488" />
    </View>
    <Text className="text-slate-400 font-black text-[10px] uppercase tracking-[1px]">{label}</Text>
    <Text className="text-xl font-black text-slate-900 tracking-tighter">{value}</Text>
  </View>
);

const QuickActionBtn = ({ icon, label, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    className="w-[30%] bg-white py-6 rounded-[35px] items-center border border-teal-50 shadow-sm"
  >
    <View className="bg-teal-600 p-3 rounded-2xl shadow-lg shadow-teal-900/20">
      <FontAwesome5 name={icon} size={18} color="white" />
    </View>
    <Text className="text-slate-900 font-black mt-3 text-[10px] uppercase tracking-wider">{label}</Text>
  </TouchableOpacity>
);