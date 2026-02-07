import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { auth, db } from "@/services/firebase";
import { calculateBurnoutScore, BurnoutResult } from "@/services/burnoutService";
import { generateAIAdvice } from "@/services/aiAdviceService";
import { AIAdvice } from "@/types/aiAdvice";
import { LinearGradient } from "expo-linear-gradient";

interface MoodEntry {
  mood: number;
  stress: number;
  sleep: number;
  date: string;
}

interface WorkEntry {
  hours: number;
  date: string;
}

interface IncomeEntry {
  amount: number;
  date: string;
}

export default function Dashboard({ navigation }: any) {
  const userId = auth.currentUser?.uid;

  const [loading, setLoading] = useState(true);
  const [burnout, setBurnout] = useState<BurnoutResult>({
    score: 0,
    level: "No Data",
    color: "#9CA3AF",
    description: "Add your first Mood or Work log to see your burnout score",
  });
  const [advice, setAdvice] = useState<AIAdvice[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [workCount, setWorkCount] = useState(0);

  const [moodLogs, setMoodLogs] = useState<MoodEntry[]>([]);
  const [workLogs, setWorkLogs] = useState<WorkEntry[]>([]);
  const [incomeLogs, setIncomeLogs] = useState<IncomeEntry[]>([]);

  useEffect(() => {
    if (!userId) return;

    const moodQuery = query(collection(db, "mood_logs"), where("userId", "==", userId));
    const workQuery = query(collection(db, "works"), where("userId", "==", userId));
    const incomeQuery = query(collection(db, "income"), where("userId", "==", userId));

    const unsubscribeMoods = onSnapshot(moodQuery, snapshot => {
      const moods = snapshot.docs.map(doc => doc.data() as MoodEntry);
      setMoodLogs(moods);
      setLoading(false);
    });

    const unsubscribeWorks = onSnapshot(workQuery, snapshot => {
      const works = snapshot.docs.map(doc => doc.data() as WorkEntry);
      setWorkLogs(works);
      setLoading(false);
    });

    const unsubscribeIncome = onSnapshot(incomeQuery, snapshot => {
      const incomes = snapshot.docs.map(doc => doc.data() as IncomeEntry);
      setIncomeLogs(incomes);
      setLoading(false);
    });

    return () => {
      unsubscribeMoods();
      unsubscribeWorks();
      unsubscribeIncome();
    };
  }, [userId]);

  // Recalculate burnout and AI advice whenever logs change
  useEffect(() => {
    if (moodLogs.length === 0 && workLogs.length === 0) {
      setBurnout({
        score: 0,
        level: "No Data",
        color: "#9CA3AF",
        description: "Add your first Mood or Work log to see your burnout score",
      });
      setAdvice([
        {
          id: "no_data",
          title: "Get Started",
          message: "Log your first Mood or Work session to receive AI advice.",
          type: "wellness",
          priority: "low",
          createdAt: new Date(),
        },
      ]);
      setTotalIncome(incomeLogs.reduce((a, b) => a + b.amount, 0));
      setWorkCount(workLogs.length);
      return;
    }

    const avgMood = moodLogs.length ? moodLogs.reduce((a, b) => a + b.mood, 0) / moodLogs.length : 5;
    const avgStress = moodLogs.length ? moodLogs.reduce((a, b) => a + b.stress, 0) / moodLogs.length : 5;
    const avgSleep = moodLogs.length ? moodLogs.reduce((a, b) => a + b.sleep, 0) / moodLogs.length : 7;
    const avgWorkHours = workLogs.length ? workLogs.reduce((a, b) => a + b.hours, 0) / workLogs.length : 8;
    const total = incomeLogs.reduce((a, b) => a + b.amount, 0);

    const burnoutResult = calculateBurnoutScore({ avgMood, avgStress, avgSleep, avgWorkHours });
    setBurnout(burnoutResult);
    setAdvice(generateAIAdvice(burnoutResult, total, avgMood, avgWorkHours));
    setTotalIncome(total);
    setWorkCount(workLogs.length);
  }, [moodLogs, workLogs, incomeLogs]);

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={["#F0FDFA", "#FFFFFF"]} className="absolute inset-0" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* HEADER */}
        <View className="px-6 pt-20 pb-4">
          <Text className="text-teal-600 font-black uppercase tracking-[2px] text-[10px] mb-1">Overview</Text>
          <Text className="text-4xl font-black text-slate-900 tracking-tighter">Dashboard</Text>
        </View>

        {/* BURNOUT CARD */}
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
                <MaterialCommunityIcons name="fire" size={32} color={burnout.color} />
              </View>
            </View>
            <View className="flex-row items-center bg-white/80 self-start px-4 py-2 rounded-2xl border border-teal-100">
              <View className="w-2 h-2 rounded-full mr-2 bg-teal-500" />
              <Text className="text-teal-700 font-black text-[11px] uppercase tracking-wider">
                {burnout.level} RISK LEVEL
              </Text>
            </View>
            <Text className="text-slate-400 mt-2 text-sm">{burnout.description}</Text>
          </LinearGradient>
        </View>

        {/* STATS ROW */}
        <View className="flex-row px-6 mb-8 justify-between">
          <SmallStatCard icon="wallet-outline" label="INCOME" value={totalIncome > 5000 ? "Stable" : "Growth"} />
          <SmallStatCard icon="calendar-check-outline" label="TOTAL LOGS" value={workCount.toString()} />
        </View>

        {/* AI ADVICE */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-black text-slate-900 mb-4 ml-2">Smart Advice</Text>
          {advice.map((item, index) => (
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

// --- Components ---
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